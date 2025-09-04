import { useChatClone } from "@/zustand/store";
import AskAI from "../ask/AskAI";
import { motion } from "framer-motion";
import ChatArea from "../chatarea/ChatArea";
import { useEffect, useState } from "react";
import { AuthUser } from "@/types/type";
import Sidebar from "./Sidebar";
import { BiDockRight } from "react-icons/bi";
import Nav from "../Nav/Nav";
const MainTest = () => {
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

  const [isToggle, setIsToggle] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsToggle((prev) => !prev);
  };
  return (
    <div
      className={`text-white transition-all duration-600 w-full flex h-full custom-scrollbar overflow-hidden `}
      // style={{ height: `${height - 185}px` }}
    >
      <div
        className="transition-all flex  bg-red-500 "
        style={{
          width: isToggle ? "15%" : "2%", // sidebar opens/closes
        }}
        onClick={() => toggleSidebar()}
      >
        <BiDockRight />
      </div>
      <div className="transition-all flex flex-[4] bg-blue-500 w-full">
        <div className="flex bg-green-500 h-[50px] w-full justify-between">
          <Nav />
        </div>
      </div>
    </div>
  );
};

export default MainTest;
