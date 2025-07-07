// import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 mt-12">
      <div className="container-modern text-center space-y-4 text-sm">
        <div className="flex items-center justify-center gap-2">
          <img
            src="/logo/learningoo-64.png"
            alt="Learningoo logo"
            width={24}
            height={24}
            className="rounded hover-scale"
          />
          <span>
            © {new Date().getFullYear()} <strong>Learningoo</strong>. All
            rights reserved. Crafted with{" "}
            <span aria-label="love" role="img">
              ♥
            </span>{" "}
            by {""}
            <a
              href="https://github.com/mrkevler"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-accent-purple dark:hover:text-accent-purple"
            >
              mrKevler
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
