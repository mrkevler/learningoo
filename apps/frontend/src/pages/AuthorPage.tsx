import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { api } from "../services/api";

const AuthorPage = () => {
  const { id } = useParams();

  const { data: author, isLoading } = useQuery({
    enabled: !!id,
    queryKey: ["author", id],
    queryFn: () => api.get(`/users/${id}`).then((r) => r.data),
  });

  const { data: courses } = useQuery({
    enabled: !!author,
    queryKey: ["authorCourses", id],
    queryFn: () => api.get("/courses").then((r) => r.data),
  });

  if (isLoading || !author) return <Layout>Loading...</Layout>;

  const authorCourses = courses?.filter((c: any) => c.tutorId === author._id);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 space-y-8 px-4">
        <div className="flex items-center gap-6 bg-gray-800 dark:bg-gray-700 p-6 rounded-lg">
          <div className="h-24 w-24 rounded-full bg-accent-pink flex items-center justify-center text-4xl font-bold text-white">
            {author.name[0]}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-brand">
              {author.authorName || author.name}
            </h1>
            {author.bio && <p className="text-gray-300">{author.bio}</p>}
            <p className="text-gray-500 text-sm">
              Member since {new Date(author.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Courses */}
        {authorCourses && authorCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-accent">Courses</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {authorCourses.map((c: any) => (
                <Link
                  key={c._id}
                  to={`/courses/${c.slug}`}
                  className="bg-gray-800 rounded-lg overflow-hidden hover-scale block"
                >
                  <img
                    src={c.coverImage || "/logo/learningoo-512.png"}
                    alt="course"
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-3 text-center font-semibold">{c.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default AuthorPage;
