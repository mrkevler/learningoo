import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Layout>
      <div className="py-12 container mx-auto flex gap-8">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden md:block w-48 shrink-0 space-y-2">
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

        <div className="flex-1 space-y-6 md:space-y-10">
          {/* Mobile Category Filter - Only visible on mobile */}
          <div className="md:hidden">
            {/* Mobile Rollover Menu */}
            <div className="relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {selected === "All" ? "All Courses" : selected}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelected("All");
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white ${selected === "All" ? "bg-accent/20 text-brand" : ""}`}
                  >
                    All Courses
                  </button>
                  {categories?.map((c: any) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        setSelected(c.name);
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white ${selected === c.name ? "bg-accent/20 text-brand" : ""}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {Object.keys(grouped).length === 0 && (
            <p className="text-center text-gray-500">No courses yet.</p>
          )}
          {Object.entries(grouped)
            .filter(([cat]) => selected === "All" || selected === cat)
            .map(([cat, courses]) => (
              <section key={cat} className="space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-brand">
                  {cat}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {courses.map((c: any) => (
                    <div
                      key={c._id}
                      className="course-card hover-lift flex flex-col h-full"
                    >
                      {/* cover image - now clickable */}
                      <a
                        href={`/courses/${c.slug}`}
                        className="-mt-6 -mx-6 aspect-video overflow-hidden rounded-t-2xl block hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={c.coverImage || "/logo/learningoo-512.png"}
                          alt={c.title}
                          className="h-full w-full object-cover"
                        />
                      </a>
                      {/* content */}
                      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                        {/* Course Info */}
                        <div className="space-y-3 md:space-y-4">
                          {/* Title - now clickable */}
                          <a
                            href={`/courses/${c.slug}`}
                            className="block hover:text-brand-dark transition-colors"
                          >
                            <h3 className="text-lg md:text-xl font-semibold line-clamp-2 text-gray-900 dark:text-white leading-tight">
                              {c.title}
                            </h3>
                          </a>

                          {/* Course Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            {/* Lesson count - now clickable */}
                            <a
                              href={`/courses/${c.slug}`}
                              className="flex items-center gap-1 hover:text-brand-dark transition-colors cursor-pointer"
                            >
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              {c.lessonCount} lessons
                            </a>
                            <span className="font-medium text-brand">
                              €{c.price || 0}
                            </span>
                          </div>

                          {/* Author Info */}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="w-6 h-6 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {c.tutorName
                                ? c.tutorName.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <span>
                              by{" "}
                              {c.tutorId ? (
                                <a
                                  href={`/author/${c.tutorId}`}
                                  className="underline hover:text-brand-dark font-medium"
                                >
                                  {c.tutorName || "Unknown"}
                                </a>
                              ) : (
                                <span className="font-medium">
                                  {c.tutorName || "Unknown"}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 md:mt-6 space-y-2">
                          {/* Buy Button */}
                          <button className="w-full btn-primary text-center">
                            Buy Now - €{c.price || 0}
                          </button>

                          {/* View Course Link */}
                          <a
                            href={`/courses/${c.slug}`}
                            className="block text-center text-sm text-gray-600 dark:text-gray-400 hover:text-brand-dark transition-colors"
                          >
                            Learn more about this course →
                          </a>
                        </div>
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
