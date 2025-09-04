import { useChatClone } from "@/zustand/store";
import AskAI from "../ask/AskAI";
import { motion } from "framer-motion";
import ChatArea from "../chatarea/ChatArea";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Nav from "../Nav/Nav";
import Footer from "../footer/Footer";
const Main = () => {
  const userMessages = useChatClone((store) => store.userMessages);
  const setAuthUser = useChatClone((store) => store.setAuthUser);
  const authUser = useChatClone((store) => store.authUser);

  // use color

  useEffect(() => {
    const getUser = async () => {
      const authUser = await window.auth.getAuthUser();
      setAuthUser(authUser);
    };
    getUser();
  }, []);

  const [isToggle, setIsToggle] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsToggle((prev) => !prev);
  };
  return (
    <div
      className={` text-white transition-all h-screen duration-600 w-full flex  custom-scrollbar overflow-hidden `}
      // style={{ height: `${height - 185}px` }}
    >
      <div className="flex w-full h-full ">
        <div
          className="z-[9999] relative transition-all flex h-full w-full flex-shrink-0 border-r border-[#3d3d3d]"
          style={{
            width: isToggle ? "18%" : "4%", // sidebar opens/closes
          }}
          // onClick={() => toggleSidebar()}
        >
          <Sidebar toggleSidebar={toggleSidebar} isToggle={isToggle} />
        </div>
        <div className=" flex  flex-col w-full justify-start items-center ">
          <div className=" flex flex-col w-full justify-start items-center ">
            <Nav />
          </div>
          <div className=" flex flex-col w-full md:w-8/12 justify-start items-center ">
            <ChatArea />
            <motion.div
              className="relative w-full h-full"
              animate={{
                y: userMessages && userMessages.length > 0 ? "75%" : "-20%",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <AskAI />
            </motion.div>
          </div>
          <div className=" flex flex-col w-full justify-start items-center ">
            <Footer />
          </div>
        </div>

        {/* <div className="flex flex-[0] md:flex-[1]  w-full "></div> */}
      </div>
    </div>
  );
};

export default Main;
