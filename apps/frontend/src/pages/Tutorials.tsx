import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useState } from "react";

const TutorialsPage = () => {
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: () => api.get("/courses").then((r) => r.data),
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const grouped: Record<string, any[]> = {};
  if (courses) {
    courses.forEach((course: any) => {
      const cat =
        course.categoryId?.name ||
        course.category?.name ||
        course.category ||
        "Uncategorized";
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
            className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selected === "All" ? "bg-accent/20" : ""}`}
          >
            All Courses
          </button>
          {categories?.map((c: any) => (
            <button
              key={c._id}
              onClick={() => setSelected(c.name)}
              className={`block w-full text-left px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${selected === c.name ? "bg-accent/20" : ""}`}
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
                      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-brand-dark dark:text-brand">
                          {c.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {c.description}
                        </p>
                      </div>
                      <a
                        href={`/courses/${c.slug}`}
                        className="mt-4 inline-block text-accent hover:underline"
                      >
                        View Course →
                      </a>
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
export default TutorialsPage;
