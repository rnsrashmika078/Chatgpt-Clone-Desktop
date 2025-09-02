import { useChatClone } from "@/zustand/store";
const ChatArea = () => {
  const userMessages = useChatClone((store) => store.userMessages);
  return (
    <div className="w-full px-10">
      {userMessages?.map((msg) => (
        <div {...{ key: msg.id }} className="w-full">
          <div
            className={`p-2 ${
              msg.from === "ai"
                ? "justify-start "
                : " w-full flex justify-end items-end"
            }`}
          >
            <p
              className={`font-custom ${
                msg.from === "ai"
                  ? "bg-transparent"
                  : "bg-[#3e3e3e] rounded-xl px-2 py-2"
              }`}
            >
              {msg.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatArea;
{
  /* <p
{...{ key: msg.id }}
className={`flex ${
  msg.from === "ai"
    ? "justify-start "
    : "justify-end bg-[#444444] rounded-full  items-end"
}  px-2 py-1 font-inter text-sm`}
>
{" "}
{msg.message}
</p> */
}
