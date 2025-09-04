import { useEffect, useState } from "react";
import { GiCloudRing } from "react-icons/gi";
import { GiCloudyFork } from "react-icons/gi";
import { GiDustCloud } from "react-icons/gi";
import { GrCloudlinux, GrGallery } from "react-icons/gr";
import Profile from "@/assets/electron-logo.svg";
import {
  BiDockLeft,
  BiEdit,
  BiImage,
  BiPlay,
  BiPlayCircle,
  BiSearch,
} from "react-icons/bi";
import { useChatClone } from "@/zustand/store";

type Dynamic = {
  id: number;
  icon: React.JSX.Element;
};
interface Props {
  toggleSidebar: () => void;
  isToggle: boolean;
}
const Sidebar = ({ toggleSidebar, isToggle }: Props) => {
  const authUser = useChatClone((store) => store.authUser);
  // dynamic icon
  //   const [dynamicIcon, setDynamicIcon] = useState<React.JSX.Element>();
  //   const iconArray: Dynamic[] = [
  //     { id: 1, icon: <GiCloudRing color="white" size={25} /> },
  //     { id: 2, icon: <GiCloudyFork color="white" size={25} /> },
  //     { id: 3, icon: <GiDustCloud color="white" size={25} /> },
  //   ];
  //   useEffect(() => {
  //     let i = 0;
  //     const interval = setInterval(() => {
  //       if (i > iconArray.length - 1) i = 0;
  //       setDynamicIcon(iconArray[i].icon);
  //       i++;
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }, []);

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

  const chats = [{ title: "Having dinner" }];
  return (
    <div className="transition-all text-sm absolute w-full h-full px-3 py-5 flex-shrink-0 justify-between flex flex-col">
      <div>
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
            className="transition-all flex justify-start items-center "
          >
            {item.icon && (
              <span className="flex-shrink-0 hover:bg-[#444444] p-2 rounded-md ">
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
        {isToggle && <h1 className="text-[#d2d2d2] mt-5">Chats</h1>}
        {isToggle &&
          chats.map((item, index) => (
            <div
              // @ts-expect-error: key not identified
              key={index}
              className="flex justify-start items-center gap-2 py-2"
            >
              {item.title}
            </div>
          ))}
      </div>
      <div className="flex flex-row gap-2 hover:bg-[#444444] p-1 rounded-md">
        <div className="flex gap-2 justify-center items-center">
          <img
            src={Profile}
            className="flex  flex-col w-8 h-8 flex-shrink-0"
          ></img>
          {isToggle && (
            <div>
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
