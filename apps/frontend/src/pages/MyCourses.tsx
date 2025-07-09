import Layout from "../components/Layout";
import { useAppSelector } from "../store";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const placeholder =
  "https://cataas.com/cat/says/No%20Image?size=70&color=white&json=true";

// Helper to determine if user is tutor
const isTutor = (role?: string) => role === "tutor";

const MyCoursesPage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  if (!user) return null;

  // Fetch all courses – reused for both roles
  const { data: allCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => api.get("/courses").then((r) => r.data),
  });

  // For students we need enrollments
  const { data: enrollments } = useQuery({
    enabled: !isTutor(user.role),
    queryKey: ["myEnrollments"],
    queryFn: () => api.get("/enrollments").then((r) => r.data),
  });

  let myCourses: any[] = [];
  if (allCourses) {
    if (isTutor(user.role)) {
      myCourses = allCourses.filter((c: any) => c.tutorId === user._id);
    } else if (enrollments) {
      const myIds = enrollments
        .filter((e: any) => {
          const sid =
            typeof e.studentId === "object"
              ? e.studentId.toString()
              : String(e.studentId);
          return sid === user._id;
        })
        .map((e: any) =>
          typeof e.courseId === "object"
            ? e.courseId.toString()
            : String(e.courseId)
        );
      myCourses = allCourses.filter((c: any) => myIds.includes(c._id));
    }
  }

  // Determine empty state text/button
  const emptyStateTutor = (
    <p className="text-gray-500">You don't have any courses yet.</p>
  );
  const emptyStateStudent = (
    <div className="space-y-4 text-center">
      <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
      <Link
        to="/courses"
        className="inline-block bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
      >
        Find Courses
      </Link>
    </div>
  );

  return (
    <Layout>
      <div className="py-10 container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Courses</h1>
          {isTutor(user.role) && (
            <button
              onClick={() => navigate("/my-courses/new")}
              className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
            >
              + Create Course
            </button>
          )}
        </div>

        {myCourses.length === 0 ? (
          isTutor(user.role) ? (
            emptyStateTutor
          ) : (
            emptyStateStudent
          )
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((c: any) => (
              <Link
                to={`/courses/${c.slug}`}
                key={c._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover-scale block"
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
export default MyCoursesPage;
