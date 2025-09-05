import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Main from "../main/Main";
import Login from "../signs/Login";
import Nav from "../Nav/Nav";
import Signin from "../signs/Signin";
import Sonner from "../Sonner/Sonner";
import WaitingConfirmation from "../signs/WaitingConfirmation";
import ConfirmSuccess from "../signs/ConfirmSuccess";

const AppRoutes = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <Sonner />
      {path !== "/" && <Nav />}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/confirmation" element={<WaitingConfirmation />} />
        <Route path="/confirmationSuccess" element={<ConfirmSuccess />} />
      </Routes>
    </>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default AppRouter;
