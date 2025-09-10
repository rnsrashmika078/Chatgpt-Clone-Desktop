import { supabase } from "@/supabase/Supabase";
import { useChatClone } from "@/zustand/store";
import { AuthUser } from "@/types/type";
import { useEffect, useState } from "react";
import Main from "../main/Main";
const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  return (
    <div className="overflow-hidden">
      {!isAuthenticated ? (
        <InitialSetup setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Main />
      )}
    </div>
  );
};

export default Home;
interface Prop {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const InitialSetup = ({ setIsAuthenticated }: Prop) => {
  type Names = {
    fname: string;
    lname: string;
  };
  const [step, setStep] = useState(1);
  const [names, setNames] = useState<Names>({ fname: "", lname: "" });
  const authUser = useChatClone((store) => store.authUser);
  const setAuthUser = useChatClone((store) => store.setAuthUser);
  const [id, setId] = useState<string>();

  const handleContinue = () => {
    if (!names) return;
    setStep(2);
  };

  const handleFinish = async () => {
    if (authUser) {
      await supabase.from("profile").upsert({
        id: authUser.id,
        fname: names.fname,
        lname: names.lname,
        finished: true,
      });
    }
  };
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        console.log(data);
        const user: AuthUser = {
          email: data?.user.email ?? "",
          fname: "",
          lname: "",
          id: data.user.id,
          token: "",
          authenticated: data?.user.aud,
        };
        setId(user.id);
        setAuthUser(user);
      }
    };
    getUser();
  }, []);
  useEffect(() => {
    if (id) {
      const fetchAuthuserProfile = async () => {
        const { data, error } = await supabase
          .from("profile")
          .select("finished,fname,lname")
          .eq("id", id)
          .eq("finished", true);

        if (error) {
          console.log("Fetch error:", error.message);
        } else if (data.length === 0) {
          console.log("No rows found");
        } else {
          const firstname = data[0].fname;
          const lastname = data[0].lname;
          const modifiedAuthUser = {
            ...authUser,
            fname: firstname,
            lname: lastname,
          } as AuthUser;
          if (modifiedAuthUser) {
            setAuthUser(modifiedAuthUser);
          }
          setIsAuthenticated(true);
        }
      };
      fetchAuthuserProfile();
    }
  }, [id]);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Enter your First name
            </h2>
            <input
              type="text"
              value={names.fname}
              onChange={(e) =>
                setNames({ fname: e.target.value, lname: names.lname })
              }
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-400"
            />
            <h2 className="text-xl font-semibold mb-4">Enter Last name</h2>
            <input
              type="text"
              value={names.lname}
              onChange={(e) =>
                setNames({ fname: names.fname, lname: e.target.value })
              }
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring focus:ring-blue-400"
            />
            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Hi {names.fname}! Ready to finish?
            </h2>
            <button
              onClick={handleFinish}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Finish
            </button>
          </>
        )}
      </div>
    </div>
  );
};
