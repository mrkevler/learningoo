import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
  transparent?: boolean;
}

const Layout = ({ children, transparent = false }: Props) => {
  const bgClass = transparent ? "" : "bg-white dark:bg-surface";
  return (
    <div className={`flex flex-col min-h-screen ${bgClass} text-foreground`}>
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
