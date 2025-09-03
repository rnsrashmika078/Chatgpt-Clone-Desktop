import { motion } from "framer-motion";
import React, { useState } from "react";

const Login = () => {
  const [focus, setFocus] = useState<boolean>(false);
  return (
    <div className=" flex w-96  m-auto text-center flex-col h-screen justify-center items-center space-y-3">
      <h3 className="text-white text-2xl font-bold font-story">OzoneGPT</h3>
      <h1 className="text-white font-bold text-4xl">Log in or sign up</h1>
      <p className="text-[#b1b1b1] ">
        You'll get smarter responses and can upload files,images, and more.
      </p>
      <div className="relative">
        <input
          onFocus={() => setFocus((prev) => !prev)}
          className="text-white w-80 pl-8 p-4 rounded-full border focus:placeholder-transparent bg-[#232222]  mt-2 border-gray-500 placeholder:text-[#ffffff] focus:outline-none ring-0 focus:ring-1 focus:ring-blue-300 transition-all"
          placeholder="Email address"
        />
        <motion.p
          animate={{
            y: focus ? 2 : 26,
            opacity: focus ? 1 : 0, // hide when not focused
          }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
          className="z-0 select-none text-sm absolute text-white px-2 bg-[#232222]  w-fit top-0 left-6"
        >
          Email address
        </motion.p>
      </div>

      <button>Continue</button>
      <span>OR</span>
    </div>
  );
};

export default Login;
