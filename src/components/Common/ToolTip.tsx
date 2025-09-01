import React, { Children } from "react";
interface Props {
  tip: string;
  children?: React.ReactNode;
}
const ToolTip = ({ tip, children }: Props) => {
  return (
    <div className="text-xs font-custom bg-black p-1 rounded-xl px-3">
      {tip}
      {children}
    </div>
  );
};

export default ToolTip;
