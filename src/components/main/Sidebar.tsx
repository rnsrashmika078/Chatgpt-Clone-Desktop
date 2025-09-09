import { useEffect, useState } from "react";
import { GrCloudlinux, GrGallery } from "react-icons/gr";
import Profile from "@/assets/electron-logo.svg";
import { BiDockLeft, BiEdit, BiSearch } from "react-icons/bi";
import { useChatClone } from "@/zustand/store";
import { supabase } from "@/supabase/Supabase";
import { UpdateChat } from "@/types/type";
import { MdDelete } from "react-icons/md";

interface Props {
  toggleSidebar: () => void;
  isToggle: boolean;
}
const Sidebar = ({ toggleSidebar, isToggle }: Props) => {
  const authUser = useChatClone((store) => store.authUser);
  const activeChat = useChatClone((store) => store.activeChat);
  const setActiveChat = useChatClone((store) => store.setActiveChat);
  const updateChats = useChatClone((store) => store.updateChats);
  const deleteChat = useChatClone((store) => store.deleteChat);
  const setUserMessages = useChatClone((store) => store.setUserMessages);
  const chats = useChatClone((store) => store.chats);
  const setTrackId = useChatClone((store) => store.setTrackId);

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

  const handleDeleteChat = async (chatId: string) => {
    const { error } = await supabase
      .from("chats")
      .delete()
      .eq("chatId", chatId);

    if (error) {
      console.error("Delete failed:", error.message);
    } else {
      console.log("Chat deleted:", chatId);
      // update local state
      deleteChat(chatId);
    }
  };
  const handleDeleteChatMessages = async (chatId: string) => {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("chatId", chatId);

    if (error) {
      console.error("Delete failed:", error.message);
    } else {
      console.log("Chat deleted:", chatId);
      setUserMessages(null);
    }
  };

  const style = `px-2 text-sm custom-scrollbar bg-[#161515] flex flex-col justify-between z-[10000]  transition-all ${
    isToggle
      ? "w-[350px] fixed md:relative"
      : "w-[0] fixed md:relative md:w-[60px]"
  } h-full border-r border-[#3d3d3d] overflow-x-hidden`;

  return (
    <div
      className={`${style}`}
      // style={{
      //   width: isToggle ? "350px" : "60px",
      // }}
    >
      <div className=" flex-shrink-0 ">
        <div className="border-b shadow-md border-[#393939] sticky top-0 bg-[#161515] py-2">
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
              className="cursor-pointer transition-all flex justify-start items-center hover:bg-[#444444] rounded-md px-0.5"
              onClick={() => {
                if (item.name === "New chat") {
                  setTrackId(null);
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
                className={`w-36 truncate transition-all duration-300 overflow-hidden ${
                  isToggle ? "opacity-100 " : "opacity-0 w-0 ml-0"
                }`}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>

        <h1
          className={` px-2  ${
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
                toggleSidebar();
                setActiveChat(item);
              }}
              className={`text-xs flex justify-between my-1 ${
                activeChat?.chatId === item.chatId ? "bg-[#444444]" : ""
              } px-2 hover:bg-[#444444] rounded-md  cursor-pointer flex justify-start items-center gap-2 py-1`}
            >
              <p className="w-36 truncate">{item.title}</p>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(item.chatId);
                  handleDeleteChatMessages(item.chatId);
                }}
              >
                <MdDelete
                  color="white"
                  size={25}
                  className="rounded-full hover:bg-[#727272] p-1"
                />
              </span>
            </div>
          ))}
      </div>
      <div className="flex border-t border-[#393939]  flex-row gap-2  sticky bottom-0 ">
        <div className="flex gap-2 justify-center items-center hover:bg-[#444444] shadow-md px-2 py-2 ">
          <img
            src={Profile}
            className="flex flex-col w-6 h-6 flex-shrink-0"
          ></img>
          {isToggle && (
            <div className="">
              <p
                className={`w-5 lg:w-full truncate transition-all duration-300 overflow-hidden ${
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
