import { useChatClone } from "@/zustand/store";
import AskAI from "../ask/AskAI";
import { motion } from "framer-motion";
import ChatArea from "../chatarea/ChatArea";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Nav from "../nav/Nav";

const Main = () => {
  const authUser = useChatClone((store) => store.authUser);
  const setNotification = useChatClone((store) => store.setNotification);
  const height = useChatClone((store) => store.height);

  // use color
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  useEffect(() => {
    if (isMobile) {
      setIsToggle(false);
    }
  }, [isMobile]);

  const [isToggle, setIsToggle] = useState<boolean>(true);
  const toggleSidebar = (state?: boolean) => {
    if (state !== undefined) setIsToggle(state);
    else setIsToggle((prev) => !prev);
  };

  const initializeLLM = async () => {
    try {
      const result = await window.electronAPI.initializeLLM();
      setNotification(result.toString());
    } catch (err) {
      // setNotification(err instanceof Error ? err.message : "");
    }
  };
  useEffect(() => {
    initializeLLM();
  }, []);

  return (
    <div
      className={` text-white transition-all  duration-600 w-full flex h-full overflow-hidden`}
      // style={{ height: `${height}px` }}
    >
      <div className="flex w-full h-full ">
        <div>
          {authUser?.authenticated && (
            <Sidebar toggleSidebar={toggleSidebar} isToggle={isToggle} />
          )}
        </div>

        <div className=" flex  flex-col w-full justify-start items-center h-full">
          <div className=" flex flex-col w-full justify-start items-center h-[60px] ">
            <Nav toggleSidebar={toggleSidebar} isToggle={isToggle} />
          </div>
          <div
            className="flex z-20 flex-col w-full justify-start items-center custom-scrollbar overflow-x-hidden "
            style={{ height: height - 50 }}
          >
            <ChatArea />

            <motion.div className="relative w-full mt-14 z-50">
              <AskAI toggleSidebar={toggleSidebar} />
            </motion.div>
          </div>

          {/* <div className=" flex flex-col w-full justify-start items-center ">
            <Footer />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Main;
{
  /* <motion.div
              className="fixed w-full"
              animate={{
                y:
                  userMessages && userMessages.length > 0
                    ? `${height < 610 ? "70%" : "100%"}`
                    : `${height < 610 ? "78%" : "-20%"}`,
              }}
              transition={{ duration:  userMessages && userMessages.length > 2 ?  0: 0.6, ease: "easeInOut" }}
            >
              <AskAI />
            </motion.div> */
}
