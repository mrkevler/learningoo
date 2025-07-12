import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { useAppSelector } from "../store";

const ChapterDetailPage = () => {
  const { id } = useParams();
  const user = useAppSelector((s) => s.auth.user);

  const { data: chapter, isLoading } = useQuery({
    queryKey: ["chapter", id],
    enabled: !!id,
    queryFn: () => api.get(`/chapters/${id}`).then((r) => r.data),
  });

  if (isLoading || !chapter) return <Layout>Loading...</Layout>;

  const isOwner =
    user &&
    user._id === (chapter.courseId?.tutorId?._id || chapter.courseId?.tutorId);

  return (
    <Layout>
      <div className="container mx-auto py-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-brand">{chapter.title}</h1>
          {isOwner && (
            <Link
              to={`/chapters/${chapter._id}/lessons/new`}
              className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
            >
              + Create Lesson
            </Link>
          )}
        </div>

        {/* Cover image */}
        {chapter.coverImage && (
          <img
            src={chapter.coverImage}
            alt="cover"
            className="w-full max-h-96 object-cover rounded mb-10"
          />
        )}

        {/* Description */}
        {chapter.description && (
          <p className="whitespace-pre-line text-gray-900 dark:text-white mb-12">
            {chapter.description}
          </p>
        )}

        {/* Lessons list */}
        <section
          className={
            chapter.description
              ? "mt-12"
              : chapter.coverImage
                ? "mt-10"
                : "mt-8"
          }
        >
          <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">
            Lessons
          </h2>
          {chapter.lessons && chapter.lessons.length > 0 ? (
            <div className="space-y-6">
              {chapter.lessons.map((ls: any, idx: number) => (
                <Link
                  key={ls._id}
                  to={`/lessons/${ls._id}`}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center gap-3 hover-scale"
                >
                  <span className="text-brand font-semibold">{idx + 1}.</span>
                  <span className="text-gray-900 dark:text-white">
                    {ls.title}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No lessons yet.</p>
          )}
        </section>

        {/* Navigate back to course */}
        {chapter.courseId && (
          <div className="mt-20 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              to={`/courses/${chapter.courseId.slug}`}
              className="text-brand underline hover:text-brand-dark"
            >
              ← Back to Course
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChapterDetailPage;
