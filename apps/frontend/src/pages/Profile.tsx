import Layout from "../components/Layout";
import { useAppSelector } from "../store";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

const ProfilePage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const { data: courses } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: () => api.get("/courses/enrolled").then((r) => r.data),
  });
  if (!user) return null;
  return (
    <Layout>
      <div className="max-w-lg mx-auto py-20 space-y-6">
        <div className="flex flex-col items-center gap-4 bg-gray-800 dark:bg-gray-700 p-6 rounded-lg">
          <div className="h-20 w-20 rounded-full bg-brand flex items-center justify-center text-3xl font-bold text-white">
            {user.name[0]}
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-400 capitalize">Role: {user.role}</p>
          {user.createdAt && (
            <p className="text-gray-400 text-sm">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
          {user.lastLoginAt && (
            <p className="text-gray-400 text-sm">
              Last login: {new Date(user.lastLoginAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg text-center space-y-2">
          <h3 className="text-xl font-bold text-brand">Current Plan</h3>
          <p className="text-gray-300">
            License ID: {user.licenseId ?? "Free"}
          </p>
          {user.role === "student" ? (
            <Link
              to="/pricing"
              className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark inline-block"
            >
              Become a Tutor
            </Link>
          ) : (
            <Link
              to="/pricing"
              className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark inline-block"
            >
              Change Plan
            </Link>
          )}
        </div>

        {courses && courses.length > 0 && (
          <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg space-y-3">
            <h3 className="text-xl font-bold text-accent text-center">
              Enrolled Courses
            </h3>
            <ul className="space-y-1 list-disc list-inside text-gray-300">
              {courses.map((c: any) => (
                <li key={c._id}>{c.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default ProfilePage;
