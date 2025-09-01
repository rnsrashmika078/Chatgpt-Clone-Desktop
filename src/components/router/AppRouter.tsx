import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "../Nav/Nav";
import Main from "../main/Main";

const AppRouter = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
