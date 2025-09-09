import { useChatClone } from "@/zustand/store";
import AskAI from "../ask/AskAI";
import { motion } from "framer-motion";
import ChatArea from "../chatarea/ChatArea";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Nav from "../Nav/Nav";
import Footer from "../footer/Footer";
import { supabase } from "@/supabase/Supabase";
import { AuthUser } from "@/types/type";

const Main = () => {
  const setAuthUser = useChatClone((store) => store.setAuthUser);
  const authUser = useChatClone((store) => store.authUser);
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

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const user: AuthUser = {
          email: data?.user.email ?? "",
          name: "",
          id: Math.random(),
          token: "",
          authenticated: data?.user.aud,
        };
        setAuthUser(user);
      }
    };
    getUser();
  }, []);

  const [isToggle, setIsToggle] = useState<boolean>(true);
  const toggleSidebar = () => {
    setIsToggle((prev) => !prev);
  };

  return (
    <div
      className={` text-white transition-all  duration-600 w-full flex h-full overflow-hidden`}
      // style={{ height: `${height}px` }}
    >
      <div className="flex w-full h-full ">
        {authUser?.authenticated && (
        
          <Sidebar toggleSidebar={toggleSidebar} isToggle={isToggle} />
        )}
        <div className=" flex  flex-col w-full justify-start items-center h-full">
          <div className=" flex flex-col w-full justify-start items-center h-[60px] ">
            <Nav toggleSidebar={toggleSidebar} isToggle={isToggle} />
          </div>
          <div
            className="flex z-[9999] flex-col w-full justify-start items-center custom-scrollbar overflow-x-hidden h-full"
            // style={{ height: height - 200 }}
          >
            <ChatArea />
            {/* <motion.div
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
            </motion.div> */}
          </div>
          <motion.div className="w-full mt-14 z-[10001]">
            <AskAI />
          </motion.div>
          {/* <div className=" flex flex-col w-full justify-start items-center ">
            <Footer />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Main;
