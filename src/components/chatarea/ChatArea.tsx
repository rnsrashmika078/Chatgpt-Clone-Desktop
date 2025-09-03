import { useChatClone } from "@/zustand/store";
import { useEffect } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyToClipboard from "../common/CopyToClipboard";

const ChatArea = () => {
  type Lang = "javascript" | "java" | "c++" | "c" | "jsx" | "python";
  const supportedLanguages: Lang[] = [
    "javascript",
    "java",
    "c++",
    "c",
    "python",
    "jsx",
  ];
  function detectLanguage(message: string): Lang | null {
    const lowerMsg = message.toLowerCase();
    for (const lang of supportedLanguages) {
      if (lowerMsg.includes(lang)) {
        return lang;
      }
    }
    return null;
  }
  const userMessages = useChatClone((store) => store.userMessages);
  const setHeight = useChatClone((store) => store.setHeight);
  const loading = useChatClone((store) => store.loading);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      if (height) setHeight(height);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopy = async (copiedText: string) => {
    try {
      if (document.hasFocus()) {
        await navigator.clipboard.writeText(copiedText);
      }
    } catch (error) {
      alert(error);
    }
  };
  console.log(userMessages);

  return (
    <div className="w-full px-10 h-[650px]">
      {userMessages?.map((msg) => (
        // @ts-ignore
        <div key={msg.id} className="w-full">
          <div
            className={`p-4 ${
              msg.from === "ai"
                ? "justify-start"
                : "w-full flex justify-end items-end"
            }`}
          >
            {msg.from === "user" ? (
              // 🟢 USER MESSAGE
              <div className="relative">
                <pre className="relative font-custom shadow-md bg-[#3e3e3e] rounded-xl px-2 py-2">
                  {msg.message.trim()}
                </pre>
                <CopyToClipboard handleCopy={handleCopy} text={msg.message} />
              </div>
            ) : msg.from === "ai" && msg.message.trim() === "loading" ? (
              // 🟡 LOADING DOT
              <div className="relative font-custom">
                <span className="bg-white flex-shrink-0 h-3 w-3 animate-pulse p-2 flex rounded-full"></span>
              </div>
            ) : (
              // 🔵 AI RESPONSE
              <div className="relative font-custom ">
                {msg.message.split("```")[1] && (
                  <>
                    <p className="relative font-custom px-2 py-2  w-full">
                      {msg.message.split("```")[0]}
                      {/* {msg.message.trim() !== "loading" && (
                        <CopyToClipboard
                          handleCopy={handleCopy}
                          text={msg.message}
                        />
                      )} */}
                    </p>
                    <SyntaxHighlighter
                      language={detectLanguage(msg.message)}
                      style={vscDarkPlus}
                    >
                      {msg.message.split("```")[1]}
                    </SyntaxHighlighter>
                    <CopyToClipboard
                      handleCopy={handleCopy}
                      text={msg.message}
                      right={0}
                    />

                    <p className="relative font-custom px-2 py-2  w-full">
                      {msg.message.split("```")[2]}
                      {/* {msg.message.trim() !== "loading" && (
                        <CopyToClipboard
                          handleCopy={handleCopy}
                          text={msg.message}
                        />
                      )} */}
                    </p>
                  </>
                )}
                {!msg.message.includes("```") && (
                  <p className="relative font-custom px-2 py-2  w-full">
                    {msg.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatArea;
