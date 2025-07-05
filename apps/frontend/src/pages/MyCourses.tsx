import Layout from "../components/Layout";
import { useAppSelector } from "../store";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const placeholder =
  "https://cataas.com/cat/says/No%20Image?size=70&color=white&json=true";

const MyCoursesPage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  if (!user) return null;
  if (user.role !== "tutor") {
    return (
      <Layout>
        <div className="py-20 text-center">
          <p className="text-gray-500">
            You need to be a tutor to create courses.
          </p>
          <Link to="/pricing" className="text-brand underline">
            Upgrade plan
          </Link>
        </div>
      </Layout>
    );
  }

  const { data } = useQuery({
    queryKey: ["myCourses"],
    queryFn: () => api.get("/courses").then((r) => r.data),
  });

  const myCourses = data?.filter((c: any) => c.tutorId === user._id) || [];

  return (
    <Layout>
      <div className="py-10 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Courses</h1>
          <button
            onClick={() => navigate("/my-courses/new")}
            className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
          >
            + Create Course
          </button>
        </div>

        {myCourses.length === 0 ? (
          <p className="text-gray-500">You don't have any courses yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((c: any) => (
              <div
                key={c._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <img
                  src={c.coverImage || `https://cataas.com/cat?${c._id}`}
                  alt="cover"
                  className="h-40 w-full object-cover rounded-t-lg"
                />
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{c.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {c.description}
                  </p>
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default MyCoursesPage;
