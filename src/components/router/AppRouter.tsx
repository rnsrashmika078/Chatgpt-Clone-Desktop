import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "../main/Main";
import Login from "../signs/Login";
import Nav from "../Nav/Nav";
import Footer from "../footer/Footer";

const AppRouter = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRouter;
