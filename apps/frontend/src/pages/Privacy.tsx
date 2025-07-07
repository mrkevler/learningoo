import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6 px-4 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>
        <p>
          We respect your privacy. Your data submitted through our contact form
          is used solely to respond to your enquiry. We do not share your
          information with third parties. By submitting the form you consent to
          us storing your details for communication purposes.
        </p>
        <p>
          No marketing emails—ever. You can request deletion of your data at any
          time by contacting{" "}
          <a
            href="mailto:info@bartoszsergot.com"
            className="text-brand underline"
          >
            info@bartoszsergot.com
          </a>
          .
        </p>
        <p>
          For full legal terms, please refer to our forthcoming documentation.
        </p>
      </div>
      <Link
        to="/"
        className="btn-primary fixed top-40 right-12 hover-lift z-50"
      >
        Back to Home
      </Link>
    </Layout>
  );
};

export default PrivacyPage;
