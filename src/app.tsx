import Footer from "./components/footer/Footer";
import Nav from "./components/Nav/Nav";
import AppRouter from "./components/router/AppRouter";
import Sonner from "./components/Sonner/Sonner";

export default function App() {
  return (
    <div className="relative bg-[#232222] flex flex-col h-screen font-custom text-[var(--foreground)] ">
      <AppRouter />
    </div>
  );
}
