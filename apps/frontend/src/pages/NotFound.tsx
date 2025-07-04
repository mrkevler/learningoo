import { Link } from "react-router-dom";
import Layout from "../components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <img src="/logo/logo-32.png" alt="Logo" className="h-16 w-16 mb-4" />
        <h2 className="text-4xl font-bold mb-2">404 – Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Oops! The page you are looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg"
        >
          Go Home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
