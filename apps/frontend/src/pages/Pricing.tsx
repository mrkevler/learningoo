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
      <div className="py-20 container mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map((lic: any) => (
          <div
            key={lic._id}
            className={`relative overflow-hidden rounded-lg p-6 text-center space-y-4 shadow-lg bg-gray-50 dark:bg-gray-800 ${user?.licenseId === lic._id ? "ring-4 ring-accent" : ""}`}
          >
            <h3 className="text-2xl font-extrabold text-brand tracking-wide uppercase">
              {lic.name}
            </h3>
            <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
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
        ))}
      </div>
    </Layout>
  );
};
export default PricingPage;
