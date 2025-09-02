import { useChatClone } from "@/zustand/store";
import AskAI from "../ask/AskAI";
import { motion } from "framer-motion";
import ChatArea from "../chatarea/ChatArea";
const Main = () => {
  const userMessages = useChatClone((store) => store.userMessages);
  // use color

  return (
    <div className=" text-white transition-all duration-600 w-full flex  h-screen overflow-hidden">
      <div className="flex  w-full ">
        <div className="flex flex-[0] md:flex-[1] w-full "></div>
        <div className=" flex md:flex-[3] flex-col w-full justify-start items-center">
          {/* {userMessages?.map((msg) => (
            <div {...{ key: msg.id }}>{msg.message}</div>
          ))} */}

          <ChatArea />

          <motion.div
            className="fixed w-full h-full"
            animate={{
              y: userMessages && userMessages.length > 0 ? "77%" : "30%",
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
