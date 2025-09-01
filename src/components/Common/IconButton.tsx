import { useState } from "react";

type IconButtonProps = {
  icon: React.ReactNode;
  tooltip: string;
  position?: "left" | "right";
};

const IconButton = ({ icon, tooltip, position = "left" }: IconButtonProps) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="cursor-pointer">{icon}</span>
      {hover && (
        <div
          className={`absolute bottom-0 ${
            position === "left" ? "left-0" : "right-0"
          } bg-[#444444] text-white text-xs px-2 py-1 rounded`}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};
export default IconButton;
