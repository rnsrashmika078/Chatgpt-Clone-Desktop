import { useNavigate } from "react-router-dom";
interface Prop {
  handleClick?: () => void;
}
const SignButton = ({ handleClick }: Prop) => {
  const navigate = useNavigate();
  return (
    <button
      className="text-white text-xs bg-transparent border border-gray-500 rounded-2xl px-3 py-1.5  font-semibold"
      onClick={() => {
        handleClick &&  handleClick();
        navigate("/signin");
      }}
    >
      Sign up for free
    </button>
  );
};

export default SignButton;
