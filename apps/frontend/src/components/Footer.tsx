import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-sm">
          <img
            src="/logo/learningoo-64.png"
            alt="Learningoo"
            className="h-6 w-6"
          />
          <span>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-brand">Learningoo</span>. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
