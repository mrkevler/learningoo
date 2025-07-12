import { useEffect, useState } from "react";
import { api } from "../services/api";
import Toast from "./Toast";

interface CaptchaData {
  question: string;
  token: string;
}

const ContactForm = () => {
  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    prefix: "+1",
    phone: "",
    message: "",
    answer: "",
    gdpr: false,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type?: "success" | "error";
  } | null>(null);

  const refreshCaptcha = async () => {
    const { data } = await api.get("/captcha");
    setCaptcha(data);
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!form.gdpr) {
      setToast({ msg: "Please agree to privacy policy", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/contact", {
        ...form,
        token: captcha?.token,
        website: "", // honeypot empty
      });
      if (res.data.ok) {
        setToast({ msg: "Message sent!", type: "success" });
        setForm({ ...form, message: "", answer: "" });
        refreshCaptcha();
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "Failed to send";
      if (err.response?.data?.wait) {
        setToast({
          msg: `Please wait ${Math.ceil(err.response.data.wait / 1000)}s`,
          type: "error",
        });
      } else {
        setToast({ msg, type: "error" });
      }
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-20 px-6 sm:px-12 lg:px-20">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <h2 className="text-3xl  dark:text-white font-extrabold text-center mb-10">
        Have a question? <span className="text-brand">Contact us</span>
      </h2>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto grid gap-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Name*"
            className="w-full p-3 rounded-lg  dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email*"
            className="w-full p-3 rounded-lg  dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
        <div className="grid sm:grid-cols-[100px_1fr] gap-6">
          <input
            name="prefix"
            value={form.prefix}
            onChange={handleChange}
            placeholder="+1"
            className="w-full p-3 rounded-lg  dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-3 rounded-lg  dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Message*"
          className="w-full p-3 rounded-lg  dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        />
        {/* Captcha */}
        {captcha && (
          <div className="flex items-center gap-4">
            <span className="font-medium whitespace-nowrap dark:text-white">
              Solve: {captcha.question}
            </span>
            <input
              name="answer"
              value={form.answer}
              onChange={handleChange}
              required
              placeholder="Answer"
              className="p-3 rounded-lg dark:text-white border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
        )}
        {/* GDPR */}
        <label className="flex items-center  dark:text-white gap-2 text-sm">
          <input
            type="checkbox"
            name="gdpr"
            checked={form.gdpr}
            onChange={handleChange}
            className="form-checkbox text-brand focus:ring-brand h-4 w-4"
            style={{ accentColor: "#ff0099" }}
          />
          I agree to the&nbsp;
          <a href="/privacy" className="text-accent-purple underline">
            privacy policy
          </a>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary hover-lift disabled:opacity-60 w-full sm:w-auto mx-auto"
        >
          {loading ? "Sending…" : "Send message"}
        </button>
      </form>
      {/* Honeypot */}
      <input
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
};

export default ContactForm;
