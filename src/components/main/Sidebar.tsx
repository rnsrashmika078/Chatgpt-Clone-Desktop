import { useEffect, useState } from "react";
import { GrCloudlinux, GrGallery } from "react-icons/gr";
import Profile from "@/assets/electron-logo.svg";
import {
  BiDockLeft,
  BiEdit,

  BiSearch,
} from "react-icons/bi";
import { useChatClone } from "@/zustand/store";
import { supabase } from "@/supabase/Supabase";
import { UpdateChat } from "@/types/type";


interface Props {
  toggleSidebar: () => void;
  isToggle: boolean;
}
const Sidebar = ({ toggleSidebar, isToggle }: Props) => {
  const authUser = useChatClone((store) => store.authUser);
  const activeChat = useChatClone((store) => store.activeChat);
  const setActiveChat = useChatClone((store) => store.setActiveChat);
  const updateChats = useChatClone((store) => store.updateChats);
  const setUserMessages = useChatClone((store) => store.setUserMessages);
  const chats = useChatClone((store) => store.chats);

  const ItemList = [
    {
      name: "New chat",
      icon: <BiEdit color="white" size={20} />,
    },
    {
      name: "Search chat",
      icon: <BiSearch color="white" size={20} />,
    },
    {
      name: "Library",
      icon: <GrGallery color="white" size={20} />,
    },
    // {
    //   name: "Sora",
    //   icon: <BiPlayCircle color="white" size={20} />,
    // },
  ];

  const [hover, setHover] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("chatId,title");

      const chats = data as UpdateChat[];
      updateChats(chats);

      if (error) {
        console.error("Fetch error:", error.message);
      } else {
        updateChats(chats);
      }
    };
    fetchAllChats();
  }, []);

  console.log("active chat", activeChat?.chatId);
  return (
    <div
      className="text-sm custom-scrollbar bg-[#161515] flex flex-col justify-between z-[9999]  transition-all  w-full h-full border-r border-[#3d3d3d] overflow-x-hidden"
      style={{
        width: isToggle ? "350px" : "60px",
      }}
    >
      <div className=" flex-shrink-0 ">
        <div className="border-b shadow-md border-[#393939] sticky top-0 bg-[#161515] px-2 py-2">
          {isToggle ? (
            <div className="transition-all flex w-full justify-between mb-5 ">
              <GrCloudlinux
                color="white"
                size={40}
                className={"hover:bg-[#5a5a5a] rounded-xl p-2"}
              />
              <BiDockLeft
                color="white"
                size={40}
                className={"hover:bg-[#5a5a5a] rounded-xl p-2"}
                onClick={() => toggleSidebar()}
              />
            </div>
          ) : (
            <div
              className="transition-all flex w-full  mb-5 "
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {hover ? (
                <BiDockLeft
                  color="white"
                  size={40}
                  className={"hover:bg-[#5a5a5a] rounded-xl p-2"}
                  onClick={() => toggleSidebar()}
                />
              ) : (
                <GrCloudlinux
                  color="white"
                  size={40}
                  className={"hover:bg-[#5a5a5a] rounded-xl p-2"}
                />
              )}
            </div>
          )}

          {ItemList.map((item, index) => (
            <div
              // @ts-expect-error: key not identified
              key={index}
              className=" cursor-pointer transition-all flex justify-start items-center hover:bg-[#444444] rounded-md  "
              onClick={() => {
                if (item.name === "New chat") {
                  console.log("NEWCHAT");
                  setActiveChat(null);
                  setUserMessages(null);
                }
              }}
            >
              {item.icon && (
                <span className="flex-shrink-0  p-2 rounded-md ">
                  {item.icon}
                </span>
              )}
              {/* {isToggle && } */}
              <p
                className={`transition-all duration-300 overflow-hidden ${
                  isToggle ? "opacity-100 " : "opacity-0 w-0 ml-0"
                }`}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>

        <h1
          className={` px-5  ${
            isToggle ? "opacity-100 " : "opacity-0 w-0 ml-0"
          } text-[#6c6c6c] mt-5`}
        >
          Chats
        </h1>

        {isToggle &&
          chats &&
          chats.map((item, index) => (
            <div
              // @ts-expect-error: key not identified
              key={index}
              onClick={() => {
                setActiveChat(item);
              }}
              className={`${
                activeChat?.chatId === item.chatId ? "bg-[#444444]" : ""
              } px-5 hover:bg-[#444444] rounded-md  cursor-pointer flex justify-start items-center gap-2 py-2`}
            >
              {item.title}
              {/* {item.chatId} */}
            </div>
          ))}
      </div>
      <div className="flex border-t border-[#393939]  flex-row gap-2  sticky bottom-0 ">
        <div className="flex gap-2 justify-center items-center hover:bg-[#444444] shadow-md px-4 py-2 ">
          <img
            src={Profile}
            className="flex flex-col w-6 h-6 flex-shrink-0"
          ></img>
          {isToggle && (
            <div className="">
              <p
                className={`transition-all duration-300 overflow-hidden ${
                  isToggle ? "opacity-100 " : "opacity-0 w-0 ml-0"
                }`}
              >
                {authUser && authUser.email}
              </p>
              <p>Free</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
