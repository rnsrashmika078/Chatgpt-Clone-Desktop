import { useChatClone } from "@/zustand/store";
import { useEffect, useState } from "react";
// @ts-expect-error:import path error
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-expect-error:import path error
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
  const activeChat = useChatClone((store) => store.activeChat);
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

  return (
    <div className="w-full px-10 h-full overflow-x-hidden">
      {userMessages &&
        userMessages?.map((msg, index) => (
          // @ts-ignore
          <div key={index} className="w-full">
            <div className={`p-4 w-full flex justify-end items-end`}>
              {/* // 🟢 USER MESSAGE */}
              <div className="relative">
                <pre className="relative font-custom shadow-md bg-[#3e3e3e] rounded-xl px-2 py-2">
                  {msg.user}
                </pre>
                <CopyToClipboard handleCopy={handleCopy} text={msg.user} />
              </div>
            </div>
            <div className="justify-start ">
              {msg.ai === "loading" ? (
                // 🟡 LOADING DOT
                <div className="relative font-custom">
                  <span className="bg-white flex-shrink-0 h-3 w-3 animate-pulse p-2 flex rounded-full"></span>
                </div>
              ) : (
                // 🔵 AI RESPONSE
                <div className="relative font-custom ">
                  {msg.ai && msg.ai.split("```")[1] && (
                    <>
                      <p className="relative font-custom px-2 py-2  w-full">
                        {msg.ai && msg.ai.split("```")[0]}
                        {/* {msg.ai !== "loading" && (
                          <CopyToClipboard
                        className="flex"
                            handleCopy={handleCopy}
                            text={msg.ai}
                          />
                        )} */}
                      </p>
                      <SyntaxHighlighter
                        language={detectLanguage(msg.ai)}
                        style={vscDarkPlus}
                      >
                        {msg.ai && msg.ai.split("```")[1]}
                      </SyntaxHighlighter>
                      <CopyToClipboard
                        handleCopy={handleCopy}
                        text={msg.ai}
                        right={0}
                      />

                      <p className="relative font-custom px-2 py-2  w-full">
                        {msg.ai && msg.ai.split("```")[2]}
                        {/* {msg.ai !== "loading" && (
                          <CopyToClipboard
                            handleCopy={handleCopy}
                            text={msg.ai}
                          />
                        )} */}
                      </p>
                    </>
                  )}
                  {!msg.ai?.includes("```") && (
                    <p className="relative font-custom px-2 py-2  w-full">
                      {msg.ai}
                      {msg.ai !== "loading" && (
                        <CopyToClipboard
                          handleCopy={handleCopy}
                          className="ml-2"
                          text={msg.ai}
                        />
                      )}
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
