import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../main/Main";
import Login from "../signs/Login";
import Nav from "../Nav/Nav";
import Footer from "../footer/Footer";
import Signin from "../signs/Signin";
import Sonner from "../Sonner/Sonner";

const AppRouter = () => {
  return (
    <div className=" custom-scrollbar">
      <Router>
        <Sonner />
        <Nav />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default AppRouter;
