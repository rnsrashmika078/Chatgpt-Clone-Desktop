"use client";
import React, { useEffect, useState } from "react";
import { CiSquareRemove } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";


const Sonner = () => {
  const dispatch = useDispatch<ReduxDispatch>();
  const [show, setShow] = useState(true);
  const newMessage = useSelector(
    (store: ReduxtState) => store.notify.simpleMessage
  );
  useEffect(() => {
    if (!newMessage) return;
    setShow(true);
    const timer = setTimeout(() => setShow(false), 3000);

    return () => {
      dispatch(setSimpleNotification(null));
      clearTimeout(timer);
    };
  }, [newMessage]);

  const handleVisibility = (visible: boolean) => {
    dispatch(setSimpleNotification(null));
    setShow(visible);
  };

  return (
    <div>
      <AnimatePresence>
        {newMessage?.message && newMessage.message.length > 0 && show && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 50, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-96 fixed top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-[var(--input-border)] p-3 rounded-xl bg-[var(--sonner-background)] z-[9999]"
          >
            <>
              <div className="flex justify-between">
                <div>
                  <h1>{newMessage.message.split(".")[0]}</h1>
                  <span className="text-[var(--secondary-color)] ">
                    {newMessage.message.split(".")[1]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <button>
                    <CiSquareRemove
                      size={40}
                      color="red"
                      onClick={() => handleVisibility(false)}
                      className="hover:cursor-pointer"
                    />
                  </button>
                </div>
              </div>
            </>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sonner;
