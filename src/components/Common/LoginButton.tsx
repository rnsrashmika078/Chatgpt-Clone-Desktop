import { useNavigate } from "react-router-dom";

interface Prop {
  handleClick?: () => void;
}
const LoginButton = ({ handleClick }: Prop) => {
  const navigate = useNavigate();
  return (
    <button
      className="text-xs bg-white rounded-2xl px-3 py-1.5 font-semibold"
      onClick={() => {
        {
          handleClick && handleClick();
          navigate("/login");
        }
      }}
    >
      Log in
    </button>
  );
};

export default LoginButton;
