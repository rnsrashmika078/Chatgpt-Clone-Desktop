import { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import ToolTip from "../common/ToolTip";
import { useChatClone } from "@/zustand/store";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabase/Supabase";
import { UserMessage } from "@/types/type";

const AskAI = () => {
  type HoverItem = {
    name: string;
    isHover: boolean;
  };

  const [searchText, setSearchText] = useState<string>("");
  const [hoverItem, setHoverItem] = useState<HoverItem | null>(null);

  const setUserMessages = useChatClone((store) => store.setUserMessages);
  const setNotification = useChatClone((store) => store.setNotification);
  const setChat = useChatClone((store) => store.setChats);
  const setLoading = useChatClone((store) => store.setLoading);
  const setAllmessage = useChatClone((store) => store.setAllmessage);
  const setUpdateMessage = useChatClone((store) => store.setUpdateMessage);
  const userMessages = useChatClone((store) => store.userMessages);
  const activeChat = useChatClone((store) => store.activeChat);
  const [chatTitle, setChatTitle] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    const { data, error } = await supabase
      .from("chats") // ✅ use your actual table name
      .insert([chatData]);
    // .select(); // optional: returns inserted row

    if (error) {
      console.error("Insert failed:", error.message);
    } else {
      // console.log("Message saved:", data);
    }
  };
  const errorcode = "https://ai.google.dev/gemini-api/docs/rate-limits";
  const [quoataOver, setQuoataOver] = useState<string>();
  const [trackId, setTrackId] = useState<string | null>(null);
  const handleAskAi = (prompt: string) => {
    let id = trackId ?? uuidv4();

    if (!trackId) setTrackId(id);

    setUserMessages({
      chatId: trackId ?? id,
      // messageId: aiMessageId,
      user: prompt,
      ai: "loading",
    });
    setSearchText("");
    const modifiedPrompt = `${prompt} | NOTE:give Title and wrap in ** ( title only - unique ) and then Reply in less words. title also short `;

    if (modifiedPrompt) {
      const askFromAI = async () => {
        const reply = await window.chatgpt.ask(modifiedPrompt);
        if (reply.error) {
          setNotification(reply.message);
        }

        if (!reply) return;

        if (reply && reply.message.includes(errorcode)) {
          setQuoataOver(reply.message);

          console.log(reply.message);
          return;
        }
        const aiMessage = reply.message;
        const rawMessage = aiMessage.split("**")[2] || "";

        if (!trackId && !activeChat?.chatId) {
          const rawTitle = aiMessage.split("**")[1] || "Chat";
          setChatTitle(rawTitle);
          const chatData = { chatId: id, title: rawTitle };
          setChat(chatData);
          await handleSaveChats(id, rawTitle);
          setUpdateMessage(id, rawMessage);

          const message = {
            id: uuidv4(),
            title: rawTitle,
            chatId: id,
            user: prompt,
            ai: rawMessage,
          };

          const { data, error } = await supabase
            .from("messages") // ✅ use your actual table name
            .insert([message]);
          // .select(); // optional: returns inserted row

          if (error) {
            console.error("Insert failed:", error.message);
          } else {
            console.log("Message saved:", data);
          }
          return;
        }
        setUpdateMessage(id, rawMessage);
        const message = {
          id: uuidv4(),
          title: chatTitle ?? activeChat?.title,
          chatId:  activeChat?.chatId  ?? id,
          user: prompt,
          ai: rawMessage,
        };

        const { data, error } = await supabase
          .from("messages") // ✅ use your actual table name
          .insert([message])
          .select(); // optional: returns inserted row

        if (error) {
          console.error("Insert failed:", error.message);
        } else {
          // console.log("Message saved:", data);
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
          .eq("chatId", activeChat.chatId);

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
    <div className=" mb-5 bottom-0 left-0 right-0 z-40 flex flex-col items-center w-full  pb-4">
      {!(userMessages && userMessages.length > 0) && (
        <h1 className="text-3xl font-bold font-story mb-4">OzoneGPT</h1>
      )}

      <div className="relative flex items-end w-8/12 bg-[#313131] rounded-2xl shadow-xl">
        {/* Add Button */}
        <div className="absolute bottom-2 left-2 flex items-center">
          <span
            className="cursor-pointer rounded-full p-1 hover:bg-[#444444] transition-all"
            onMouseOver={() => setHoverItem({ name: "add", isHover: true })}
            onMouseLeave={() => setHoverItem({ name: "add", isHover: false })}
          >
            <BsPlus color="white" size={28} />
          </span>
          {hoverItem?.name === "add" && hoverItem.isHover && (
            <span className="absolute top-10  left-0">
              <ToolTip tip={"Add photos and more"} />
            </span>
          )}
        </div>

        {quoataOver && (
          <div className="absolute -top-32 text-center bg-[#2d2d2d] rounded-2xl p-5">
            {quoataOver}
          </div>
        )}
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={searchText}
          rows={1}
          // disabled={
          //   userMessages &&
          //   userMessages[userMessages.length - 1]?.message.includes(error)
          //     ? true
          //     : false
          // }
          // contentEditable
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
          <span
            className=" absolute bottom-2 right-2 cursor-pointer p-2 rounded-full hover:bg-[#444444] transition-all"
            onMouseOver={() => setHoverItem({ name: "voice", isHover: true })}
            onMouseLeave={() => setHoverItem({ name: "voice", isHover: false })}
          >
            <MdRecordVoiceOver color="white" size={20} />
            {hoverItem?.name === "voice" && hoverItem.isHover && (
              <span className="absolute top-10 right-0">
                <ToolTip tip={"Use voice mode"} />
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default AskAI;
