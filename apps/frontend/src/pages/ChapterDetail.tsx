import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { api, checkChapterAccess } from "../services/api";
import { useAppSelector } from "../store";
import EnrollmentModal from "../components/EnrollmentModal";

const ChapterDetailPage = () => {
  const { id } = useParams();
  const user = useAppSelector((s) => s.auth.user);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  const {
    data: chapter,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chapter", id],
    enabled: !!id,
    queryFn: () => api.get(`/chapters/${id}`).then((r) => r.data),
  });

  // Check access to this chapter
  const { data: accessData } = useQuery({
    queryKey: ["chapterAccess", id],
    enabled: !!id && !!user,
    queryFn: () => checkChapterAccess(id!).then((r) => r.data),
  });

  if (isLoading) return <Layout>Loading...</Layout>;

  // Handle access denied
  if (error && (error as any).response?.status === 403) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-brand mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to enroll in this course to access this chapter.
            </p>
            {chapter?.courseId && (
              <Link
                to={`/courses/${chapter.courseId.slug || chapter.courseId._id}`}
                className="bg-brand text-white px-6 py-3 rounded-lg hover:bg-brand-dark transition-colors"
              >
                View Course Details
              </Link>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  if (!chapter) return <Layout>Chapter not found.</Layout>;

  const isOwner =
    accessData?.isOwner ||
    (user &&
      user._id ===
        (chapter.courseId?.tutorId?._id || chapter.courseId?.tutorId));
  const isAdmin = user?.role === "admin";
  const hasAccess = accessData?.hasAccess || isOwner || isAdmin;

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
              {chapter.lessons.map((ls: any, idx: number) => {
                if (hasAccess) {
                  return (
                    <Link
                      key={ls._id}
                      to={`/lessons/${ls._id}`}
                      className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center gap-3 hover-scale"
                    >
                      <span className="text-brand font-semibold">
                        {idx + 1}.
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {ls.title}
                      </span>
                    </Link>
                  );
                } else {
                  return (
                    <div
                      key={ls._id}
                      onClick={() => setShowEnrollmentModal(true)}
                      className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded flex items-center gap-3 cursor-pointer relative"
                    >
                      <span className="text-brand font-semibold">
                        {idx + 1}.
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {ls.title}
                      </span>
                      <span className="ml-auto text-xl">🔒</span>
                    </div>
                  );
                }
              })}
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

      {/* Enrollment Modal */}
      {chapter?.courseId && (
        <EnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          course={{
            _id: chapter.courseId._id || chapter.courseId,
            title: chapter.courseId.title || chapter.title,
            price: chapter.courseId.price || 0,
            slug: chapter.courseId.slug,
          }}
        />
      )}
    </Layout>
  );
};

export default ChapterDetailPage;
