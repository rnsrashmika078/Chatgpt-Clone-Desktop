import { useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import ToolTip from "../common/ToolTip";
import { useChatClone } from "@/zustand/store";
import { v4 as uuidv4 } from "uuid";

const AskAI = () => {
  type HoverItem = {
    name: string;
    isHover: boolean;
  };

  const [searchText, setSearchText] = useState<string>("");
  const [hoverItem, setHoverItem] = useState<HoverItem | null>(null);

  const setUserMessages = useChatClone((store) => store.setUserMessages);
  const setLoading = useChatClone((store) => store.setLoading);
  const setUpdateMessage = useChatClone((store) => store.setUpdateMessage);
  const userMessages = useChatClone((store) => store.userMessages);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset
      const scrollHeight = textareaRef.current.scrollHeight;

      const maxHeight = 200;

      textareaRef.current.style.height =
        Math.min(scrollHeight, maxHeight) + "px";

      textareaRef.current.style.overflowY =
        scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  const handleAskAi = (prompt: string) => {
    const id = uuidv4();

    if (searchText.trim()) {
      setUserMessages({
        id: uuidv4(),
        time: new Date(),
        message: searchText,
        from: "user",
        loading: true,
      });
    }
    setUserMessages({
      id,
      from: "ai",
      message: "loading",
    });
    setSearchText("");
    const modifiedPrompt =
      prompt +
      ". NOTE:keep msg in less words.make sure to give currectly format the text.add new lines when needed";
    if (modifiedPrompt) {
      const askFromAI = async () => {
        const reply = await window.chatgpt.ask(modifiedPrompt ?? "");
        if (reply) {
          // alert(JSON.stringify(reply));
          // @ts-ignore
          setUpdateMessage(id, reply.message);
        }
      };
      askFromAI();
    }
  };
  const error = "https://ai.google.dev/gemini-api/docs/rate-limits";
  return (
    <div className="fixed mb-5 bottom-0 left-0 right-0 z-40 flex flex-col items-center w-full  pb-4">
      {!(userMessages && userMessages.length > 0) && (
        <h1 className="text-3xl font-bold font-story mb-4">OzoneGPT</h1>
      )}

      <div className="relative flex items-end w-11/12 sm:w-10/12 md:w-1/2 bg-[#313131] rounded-2xl shadow-xl">
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

        {userMessages &&
          userMessages[userMessages.length - 1]?.message.includes(error) && (
            <div className="absolute -top-32 text-center bg-[#2d2d2d] rounded-2xl p-5">
              {userMessages[userMessages.length - 1]?.message}
            </div>
          )}
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={searchText}
          rows={1}
          disabled={
            userMessages &&
            userMessages[userMessages.length - 1]?.message.includes(error)
              ? true
              : false
          }
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
