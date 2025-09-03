import { useChatClone } from "@/zustand/store";
import AskAI from "../ask/AskAI";
import { motion } from "framer-motion";
import ChatArea from "../chatarea/ChatArea";
import { useEffect, useState } from "react";
import { AuthUser } from "@/types/type";
const Main = () => {
  const userMessages = useChatClone((store) => store.userMessages);
  const height = useChatClone((store) => store.height);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  // use color

  useEffect(() => {
    const getUser = async () => {
      const authUser = await window.auth.getAuthUser();
      setAuthUser(authUser);
    };
    getUser();
  }, []);
  return (
    <div
      className={`text-white transition-all duration-600 w-full flex  custom-scrollbar overflow-hidden `}
      style={{ height: `${height - 185}px` }}
    >
      <div className="flex  w-full ">
        <h1>{authUser && authUser.name}</h1>
        <div className="flex flex-[0] md:flex-[1] w-full "></div>
        <div className=" flex md:flex-[3] flex-col w-full justify-start items-center">
          <ChatArea />
          <motion.div
            className="relative w-full h-full"
            animate={{
              y: userMessages && userMessages.length > 0 ? "0%" : "-60%",
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <AskAI />
          </motion.div>
        </div>

        <div className="flex flex-[0] md:flex-[1]  w-full "></div>
      </div>
    </div>
  );
};

export default Main;
