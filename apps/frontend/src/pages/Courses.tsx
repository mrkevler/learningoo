import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useState } from "react";

const CoursesPage = () => {
  const { data: courses } = useQuery({
    queryKey: ["coursesSummary"],
    queryFn: () => api.get("/courses/summary").then((r) => r.data),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const grouped: Record<string, any[]> = {};
  if (courses) {
    courses.forEach((course: any) => {
      const cat = course.categoryName || "Uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(course);
    });
  }

  const [selected, setSelected] = useState<string>("All");

  return (
    <Layout>
      <div className="py-12 container mx-auto flex gap-8">
        {/* Sidebar */}
        <aside className="w-48 shrink-0 space-y-2">
          <button
            onClick={() => setSelected("All")}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 ${selected === "All" ? "bg-accent/20" : ""}`}
          >
            All Courses
          </button>
          {categories?.map((c: any) => (
            <button
              key={c._id}
              onClick={() => setSelected(c.name)}
              className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 ${selected === c.name ? "bg-accent/20" : ""}`}
            >
              {c.name}
            </button>
          ))}
        </aside>

        <div className="flex-1 space-y-10">
          {Object.keys(grouped).length === 0 && (
            <p className="text-center text-gray-500">No courses yet.</p>
          )}
          {Object.entries(grouped)
            .filter(([cat]) => selected === "All" || selected === cat)
            .map(([cat, courses]) => (
              <section key={cat} className="space-y-4">
                <h2 className="text-3xl font-bold text-brand">{cat}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((c: any) => (
                    <div
                      key={c._id}
                      className="course-card hover-lift flex flex-col h-full"
                    >
                      {/* cover image */}
                      <div className="-mt-6 -mx-6 aspect-video overflow-hidden rounded-t-2xl">
                        <img
                          src={c.coverImage || "/logo/learningoo-512.png"}
                          alt={c.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {/* content */}
                      <div className="flex-1 p-4 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white">
                            {c.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {c.lessonCount} lessons · €{c.price || 0}
                          </p>
                          <p className="text-sm text-gray-500">
                            by{" "}
                            {c.tutorId ? (
                              <a
                                href={`/author/${c.tutorId}`}
                                className="underline hover:text-brand-dark"
                              >
                                {c.tutorName || "Unknown"}
                              </a>
                            ) : (
                              c.tutorName || "Unknown"
                            )}
                          </p>
                        </div>
                        <a
                          href={`/courses/${c.slug}`}
                          className="mt-4 inline-block btn-ghost text-brand-dark hover-scale"
                        >
                          View Course →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </Layout>
  );
};
export default CoursesPage;
