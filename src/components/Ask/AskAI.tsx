import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { MdRecordVoiceOver } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import ToolTip from "../common/ToolTip";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { useChatClone } from "@/zustand/store";
import { v4 as uuidv4 } from "uuid";
const AskAI = () => {
  type HoverItem = {
    name: string;
    isHover: boolean;
  };

  const [searchText, setSearchText] = useState<string>(""); // ✅ consistent type

  const [hoverItem, setHoverItem] = useState<HoverItem | null>(null);

  const setUserMessages = useChatClone((store) => store.setUserMessages);
  const userMessages = useChatClone((store) => store.userMessages);
  console.log("USER MESSAGES", userMessages);
  console.log("USER searchText", searchText);

  //debounce
  // const handleSearch = useDebounce(
  //   (value: string) => setSearchText(value),
  //   300
  // );

  const handleAskAi = (prompt: string) => {
    if (searchText) {
      setUserMessages({
        id: uuidv4(),
        time: new Date(),
        message: searchText,
        from: "user",
      });
    }
    setSearchText("");
    const modifiedPrompt = prompt + ". NOTE:keep msg short.5,less words.";
    if (modifiedPrompt) {
      const askFromAI = async () => {
        const reply = await window.chatgpt.ask(modifiedPrompt ?? "");
        // const reply = "TEST";
        if (reply) {
          setUserMessages({
            from: "ai",
            id: uuidv4(),
            message: reply,
            time: new Date(),
          });
        }
      };
      askFromAI();
    }
  };
  return (
    <div className="z-40 flex flex-col justify-center items-center w-full">
      {!(userMessages && userMessages.length > 0) && (
        <h1 className="text-3xl font-bold font-story">OzoneGPT</h1>
      )}

      <div className="relative p-5 w-full md:w-1/2">
        {userMessages && userMessages.length > 0}
        <input
          type="search"
          value={searchText}
          placeholder="Ask anything"
          onChange={(e) => setSearchText(e.target.value)}
          className="transition-all shadow-xl bg-[#313131] focus:outline-none ring-0 w-full p-4 pl-12 pr-16 rounded-full placeholder:text-[#b3b1b1] "
        />
        {/* use color */}

        {/* add photos */}
        <div>
          <span
            className="transition-all absolute top-1/2 left-8 -translate-y-1/2 cursor-pointer rounded-full hover:bg-[#444444]"
            onMouseOver={() => setHoverItem({ name: "add", isHover: true })}
            onMouseLeave={() => setHoverItem({ name: "add", isHover: false })}
          >
            <BsPlus color="white" size={30} />
          </span>
          {hoverItem?.name === "add" && hoverItem.isHover && (
            <span className="absolute bottom-2 left-0">
              <ToolTip tip={"Add photos and more"}>
                <span className="mx-1 bg-[#444444] px-1 rounded-sm">/</span>
              </ToolTip>
            </span>
          )}
        </div>
        {searchText ? (
          <span
            className="cursor-pointer transition-all absolute top-1/2 right-8 -translate-y-1/2 rounded-full p-2 bg-white"
            onClick={() => {
              handleAskAi(searchText.trim());
            }}
          >
            <FaArrowUp color="black" size={20} strokeWidth={0.5} />
          </span>
        ) : (
          // voice over
          <div>
            <span
              className="cursor-pointer transition-all absolute top-1/2 right-8 -translate-y-1/2 rounded-full p-2 bg-[#444444] hover:bg-[#3e3e3e] "
              onMouseOver={() => setHoverItem({ name: "voice", isHover: true })}
              onMouseLeave={() =>
                setHoverItem({ name: "voice", isHover: false })
              }
            >
              <MdRecordVoiceOver color="white" size={20} />
            </span>
            {hoverItem?.name === "voice" && hoverItem.isHover && (
              <span className="transition-all absolute bottom-2  right-0">
                <ToolTip tip={"User voice mode"} />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AskAI;
