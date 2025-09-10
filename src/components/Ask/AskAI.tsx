import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import { useChatClone } from "@/zustand/store";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabase/Supabase";
import { UserMessage } from "@/types/type";

interface ASKAI {
  toggleSidebar: (state?: boolean) => void;
}
const AskAI = ({ toggleSidebar }: ASKAI) => {
  // type HoverItem = {
  //   name: string;
  //   isHover: boolean;
  // };
  //states
  const [searchText, setSearchText] = useState<string>("");
  // const [hoverItem, setHoverItem] = useState<HoverItem | null>(null);
  const [chatTitle, setChatTitle] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //zustand - global states
  const setUserMessages = useChatClone((store) => store.setUserMessages);
  const setNotification = useChatClone((store) => store.setNotification);
  const setTrackId = useChatClone((store) => store.setTrackId);
  const trackId = useChatClone((store) => store.trackId);
  const setChat = useChatClone((store) => store.setChats);
  const authUser = useChatClone((store) => store.authUser);
  const setAllmessage = useChatClone((store) => store.setAllmessage);
  const setUpdateMessage = useChatClone((store) => store.setUpdateMessage);
  const userMessages = useChatClone((store) => store.userMessages);
  const activeChat = useChatClone((store) => store.activeChat);

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;

      const maxHeight = 200;

      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";

      textareaRef.current.style.overflowY =
        scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  const handleSaveChats = async (chatId: string, title: string) => {
    const chatData = { chatId, title };

    const { error } = await supabase.from("chats").insert([chatData]);

    if (error) {
      console.error("Insert failed:", error.message);
    } else {
      // console.log("Message saved:", data);
    }
  };
  const handleAskAi = (prompt: string) => {
    let id = trackId ?? uuidv4(); // to track the current chat
    let messageId = uuidv4(); /// to track the current message

    // if (!trackId) setTrackId(id);

    //this will show the user prompt in the ChatArea Section without AI response. AI response is on loading..!
    setUserMessages({
      chatId: trackId ?? id,
      messageId,
      user: prompt,
      ai: "loading",
    });

    setSearchText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const username = authUser?.fname ?? "User";
    console.log(username);

    const historyText =
      userMessages && userMessages.length > 0
        ? userMessages
            .map((msg) => `User: ${msg.user}\nAI: ${msg.ai}`)
            .join("\n\n")
        : "No previous messages.";

    const modifiedPrompt = `
        You are OzoneGPT, an AI assistant in a chat application.
        Your tasks:
        1. Always generate a *$$*short, unique, and descriptive title*$$* for the chat if this is the first message of the chat and wrap it in *$$* (example: *$$*Shopping Tips*$$*).
        2. And if this is the first message don't mentioned about that like saying 'seems like we just start.instead do like 'hi how can i help you today' like this.
        2. If this is the first message, start by addressing the user by their name ("${username}").
        3. Only mention the user's name later if it makes sense in context. Do not start every reply with the name.
        4. Provide your response to the latest user query.
        5. Keep the conversation consistent with the previous chat history.
        6. Use proper **formatting rules** when replying:
           - Use "#" headers for **main topics** (escape like \\# if VS Code warns).
           - Use "##" for **subtopics**.
           - Highlight **keywords** in bold (wrap with \`**\` like **this**).
           - Use bullet points "-" or numbered lists "1." where appropriate.
           - For code or commands, wrap in triple backticks (\`\`\`) with the language tag (e.g. \`\`\`js).
           - Use blockquote ">" when emphasizing notes or tips.
           - For links, use the Markdown format "[link](URL)" to add hyperlinks.
           - Keep responses clean, readable, and Markdown-friendly.
        Chat History so far:
        If from chat history '${prompt}' isn't the first message of the chat, then ignore instruction 1.
        ${historyText}
        Now, here is the new user message you must reply to:
        "${prompt}"
        `;

    if (modifiedPrompt) {
      const askFromAI = async () => {
        const reply = await window.chatgpt.ask(modifiedPrompt); // get the ai response from the api

        console.log("This is the reply ai gives", reply);
        // if errors show it in notifications
        if (reply.error) {
          setNotification(reply.message);
        }

        // if no rely generated then this function ends here
        if (!reply) return;

        const aiMessage = reply.message; // get the actual response from the response object
        const rawMessage = aiMessage.split("*$$*")[2] || aiMessage; // this is the message that removed title -> this doesn't include the title
        if (!trackId && !activeChat?.chatId) {
          {
            /*This condition use to check whether the current chat or not 
            case : True
                -> New Chat
                -> First message of the chat
                -> Generate the title to the chat     */
          }

          const title = aiMessage.split("*$$*")[1] || "Chat"; // ai will generate title inside the astrix marks so grab that title
          setChatTitle(title); // set chat title -> this state use for check the current chat has title so that until the next render cycle this stays as 'not new chat in next message'
          const chatData = { chatId: id, title: title };
          setChat(chatData);
          await handleSaveChats(id, title);
          setUpdateMessage(messageId, rawMessage);

          const message = {
            id: uuidv4(),
            title: title,
            chatId: id,
            user: prompt,
            ai: rawMessage,
          };

          const { data, error } = await supabase
            .from("messages")
            .insert([message]);

          if (error) {
            console.error("Insert failed:", error.message);
          } else {
            console.log("Message saved:", data);
          }
          setTrackId(id);
          return;
        }
        setUpdateMessage(messageId, rawMessage);
        const message = {
          id: uuidv4(),
          title: chatTitle ?? activeChat?.title,
          chatId: activeChat?.chatId ?? id,
          user: prompt,
          ai: rawMessage,
        };
        const { error } = await supabase
          .from("messages")
          .insert([message])
          .select();

        if (error) {
          console.error("Insert failed:", error.message);
        } else {
        }
      };
      askFromAI();
    }
  };

  useEffect(() => {
    if (activeChat?.chatId) {
      const fetchMessagesByChatId = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("chatId", activeChat.chatId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Fetch error:", error.message);
        } else {
          const messages = data as UserMessage[];
          setAllmessage(messages);
        }
      };
      fetchMessagesByChatId();
    }
  }, [activeChat?.chatId]);

  return (
    <div className="w-1/2 mb-5 absolute left-1/2 bottom-0 -translate-x-1/2 ">
      {/* // <div className=" mb-5 bottom-0 left-0 right-0 z-40 flex flex-col items-center w-full  pb-4"> */}
      {!(userMessages && userMessages.length > 0) && (
        <h1 className="flex justify-center items-center text-3xl font-bold font-story mb-4">
          OzoneGPT
        </h1>
      )}
      <div className="relative flex items-end w-full  bg-[#313131] rounded-2xl shadow-xl">
        {/* Add Button */}
        <div className="absolute bottom-2 left-2 flex items-center">
          <span
            className="cursor-pointer rounded-full p-1 hover:bg-[#444444] transition-all"
            // onMouseOver={() => setHoverItem({ name: "add", isHover: true })}
            // onMouseLeave={() => setHoverItem({ name: "add", isHover: false })}
          >
            <BsPlus color="white" size={28} />
          </span>
          {/* {hoverItem?.name === "add" && hoverItem.isHover && (
            <span className="relative top-0 left-0">
              <ToolTip tip={"Add photos and more"} />
            </span>
          )} */}
        </div>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={searchText}
          rows={1}
          onClick={() => toggleSidebar(false)}
          placeholder="Send a message..."
          onChange={(e) => handleSearch(e.target.value)}
          className="resize-none custom-scrollbar bg-transparent w-full text-white placeholder:text-[#b3b1b1] px-10 py-3 pr-12 rounded-2xl focus:outline-none"
        />
        {/* Send / Voice */}
        {searchText ? (
          <span
            className="absolute bottom-2 right-2 cursor-pointer p-2 rounded-full bg-white hover:bg-gray-200 transition-all"
            onClick={() => handleAskAi(searchText.trim())}
          >
            <FaArrowUp color="black" size={18} strokeWidth={0.5} />
          </span>
        ) : (
          <div
            className="absolute bottom-2 right-2 cursor-pointer p-2 rounded-full hover:bg-[#444444] transition-all"
            // onMouseOver={() => setHoverItem({ name: "voice", isHover: true })}
            // onMouseLeave={() => setHoverItem({ name: "voice", isHover: false })}
          >
            <MdRecordVoiceOver color="white" size={20} />
            {/* {hoverItem?.name === "voice" && hoverItem.isHover && (
              <span className=" relative top-0 right-12">
                <ToolTip tip={"Use voice mode"} />
              </span>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;
