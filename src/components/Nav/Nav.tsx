import { BsQuestionCircle } from "react-icons/bs";
import { Outlet, Link } from "react-router-dom";

export default function Nav() {
  return (
    <div>
      {/* use color */}
      <nav className="flex justify-between bg-[#232222]  p-5">
        {/* <Link to="/">Home</Link> | <Link to="/about">About</Link> */}
        <div className="opacity-0 flex gap-2  justify-center items-center">
          {/* use color */}
          <button className="text-xs bg-white rounded-2xl p-2">Log in</button>
          <button className="text-xs bg-white rounded-2xl p-2">
            Sign up for free
          </button>
        </div>
        <div className="flex gap-2 justify-center items-center">
          {/* use color */}
          <button className="text-xs bg-white rounded-2xl px-3 py-1.5 font-semibold">
            Log in
          </button>
          <button className="text-white text-xs bg-transparent border border-gray-500 rounded-2xl px-3 py-1.5  font-semibold">
            Sign up for free
          </button>
          <BsQuestionCircle color="white" strokeWidth={0.5} />
        </div>
      </nav>
    </div>
  );
}
