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
              <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1 flex-1">
                {(() => {
                  switch (lic.slug) {
                    case "free":
                      return [
                        "Launch your first course – no cost",
                        "1 course total",
                        "3 chapters • 2 lessons each",
                      ];
                    case "startup":
                      return [
                        "Grow to 5 courses",
                        "Unlimited chapters & lessons",
                        "Embed videos, rich text & quizzes",
                      ];
                    case "advanced":
                      return [
                        "10 courses for expanding creators",
                        "Unlimited content + assignments",
                        "Drip scheduling & course bundles",
                      ];
                    case "professional":
                      return [
                        "Unlimited courses, students & earnings",
                        "Priority support, analytics & API",
                        "Custom domains + advanced features",
                      ];
                    default:
                      return ["Flexible limits"];
                  }
                })().map((line: string, idx: number) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
              <p className="text-gray-400">Courses: {lic.courseLimit ?? "∞"}</p>
              <button
                disabled={user?.licenseId === lic._id}
                onClick={async () => {
                  const res = await dispatch(assignLicenseThunk(lic.slug));
                  if (assignLicenseThunk.fulfilled.match(res)) {
                    alert("Plan updated!");
                    navigate("/my-courses");
                  }
                }}
                className={`w-full py-2 rounded ${user?.licenseId === lic._id ? "bg-gray-600" : "bg-brand hover:bg-brand-dark"}`}
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
