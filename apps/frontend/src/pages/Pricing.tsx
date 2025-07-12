import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import Layout from "../components/Layout";
import { assignLicenseThunk } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const { data } = useQuery({
    queryKey: ["licenses"],
    queryFn: () => api.get("/licenses").then((r) => r.data),
  });
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="container-modern section-spacing grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {data?.map((lic: any) => (
          <div
            key={lic._id}
            className={`relative overflow-hidden rounded-2xl flex flex-col shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${user?.licenseId === lic._id ? "ring-4 ring-accent-pink" : ""}`}
          >
            {/* Ribbon */}
            {lic.slug === "startup" && (
              <span className="absolute top-4 right-[-50px] rotate-45 bg-accent-purple text-white text-xs py-1 px-16 shadow-lg">
                Popular
              </span>
            )}

            {/* Gradient header */}
            <div className="h-2 w-full bg-gradient-to-r from-accent-pink to-accent-purple" />

            <div className="p-6 flex-1 flex flex-col items-center space-y-4">
              <h3 className="text-xl font-bold uppercase tracking-wide text-brand">
                {lic.name}
              </h3>
              <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {lic.price === 0 ? "Free" : `€${lic.price}`}
              </p>
              <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-2 leading-relaxed text-justify flex-1">
                {(() => {
                  switch (lic.slug) {
                    case "free":
                      return [
                        "Launch your first course — no cost",
                        "1 course included",
                        "3 chapters per course",
                        "2 lessons per chapter",
                        "Basic analytics",
                        "Core course builder tools",
                        "Drag & drop editor",
                        "SEO-ready titles & slugs",
                        "Limited file uploads",
                        "Courses: 1",
                        "🎯 Perfect for getting started",
                      ];
                    case "startup":
                      return [
                        "Up to 5 courses",
                        "Unlimited chapters & lessons",
                        "Video embedding (YouTube, Vimeo)",
                        "Rich text, code snippets & quizzes",
                        "Lesson version history",
                        "Media galleries",
                        "Basic analytics",
                        "File attachments (PDFs, downloads, etc.)",
                        "Courses: 5",
                        "🚀 Ideal for growing educators",
                      ];
                    case "advanced":
                      return [
                        "10 courses",
                        "All Startup features",
                        "Assignments & student submissions",
                        "Drip content scheduling",
                        "Course bundles & multi-pricing options",
                        "Enhanced analytics",
                        "Gallery layouts, image editing, and more",
                        "Secure Stripe checkout",
                        "Courses: 10",
                        "📚 Expand your curriculum with advanced tools",
                      ];
                    case "professional":
                      return [
                        "Unlimited courses",
                        "Everything in Advanced",
                        "Priority support",
                        "Downgrade protection",
                        "Prorated billing",
                        "Full feature suite:",
                        "Advanced SEO",
                        "File type control",
                        "Code block themes",
                        "Complete customization",
                        "License management dashboard",
                        "Courses: ∞",
                        "🌐 Built for professional teams and enterprises",
                      ];
                    default:
                      return ["Flexible limits"];
                  }
                })().map((line: string, idx: number) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
              <p className="text-brand font-semibold text-lg">
                Courses: {lic.courseLimit ?? "∞"}
              </p>
              <button
                disabled={user?.licenseId === lic._id}
                onClick={async () => {
                  const res = await dispatch(assignLicenseThunk(lic.slug));
                  if (assignLicenseThunk.fulfilled.match(res)) {
                    alert("Plan updated!");
                    const newUser = res.payload as any;
                    if (!newUser.authorName) {
                      navigate("/setup-author");
                    } else {
                      navigate("/my-courses");
                    }
                  }
                }}
                className={`w-full py-2 rounded ${user?.licenseId === lic._id ? "bg-gray-600 text-white" : "bg-brand hover:bg-brand-dark text-white"}`}
              >
                {user?.licenseId === lic._id ? "Your plan" : "Choose"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};
export default PricingPage;
