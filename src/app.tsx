import Footer from "./components/footer/Footer";
import Nav from "./components/Nav/Nav";
import AppRouter from "./components/router/AppRouter";

export default function App() {
  return (
    <div className="bg-[#232222] flex flex-col h-screen font-custom text-[var(--foreground)]">
      <Nav />
      <AppRouter />
      <Footer />
    </div>
  );
}
