// Debugging
console.log("API Base URL:", import.meta.env.VITE_API_BASE);
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { api } from "../services/api";
import { useAppSelector, useAppDispatch } from "../store";
import { setUser } from "../store/authSlice";

const CourseDetailPage = () => {
  const { slug } = useParams();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    enabled: !!slug,
    queryFn: () => api.get(`/courses/slug/${slug}`).then((r) => r.data),
  });

  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: (body: { studentId: string }) =>
      api.post(`/courses/${course._id}/enroll`, body).then((r) => r.data),
    onSuccess: (data) => {
      const newUser = { ...(user as any), balance: data.balance };
      dispatch(setUser(newUser));
      queryClient.invalidateQueries({ queryKey: ["course", slug] });
      alert("Enrolled successfully! Balance updated.");
    },
  });

  const { data: enrollmentStatus } = useQuery({
    enabled: !!course && !!user,
    queryKey: ["enrollStatus", course?._id, user?._id],
    queryFn: () =>
      api
        .get(`/enrollments`, {
          params: { studentId: user?._id, courseId: course?._id },
        })
        .then((r) => r.data),
  });

  if (isLoading || !course) return <Layout>Loading...</Layout>;

  const isOwner = user && user._id === (course.tutorId?._id || course.tutorId);
  const isEnrolled = enrollmentStatus && enrollmentStatus.length > 0;
  const hasAccess = isOwner || isEnrolled;

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-brand">{course.title}</h1>
          {!isOwner && !enrollmentStatus?.length && (
            <button
              className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
              onClick={() => {
                if (
                  window.confirm(
                    `Do you want to buy course ${course.title} for $${course.price}?`
                  )
                ) {
                  if (!user) {
                    window.location.href = "/login";
                    return;
                  }
                  enrollMutation.mutate({ studentId: user._id });
                }
              }}
            >
              Enroll · ${course.price}
            </button>
          )}
          {isOwner && (
            <a
              href={`/my-courses/${course._id}/edit`}
              className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark"
            >
              Edit Course
            </a>
          )}
        </div>
        <img
          src={course.coverImage}
          alt="cover"
          className="w-full max-h-96 object-cover rounded mb-10"
        />

        <p className="whitespace-pre-line text-gray-900 dark:text-white mb-10">
          {course.description}
        </p>

        {/* Photos */}
        {course.photos && course.photos.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {course.photos.map((p: string, idx: number) => (
              <img
                key={idx}
                src={p}
                className="rounded cursor-pointer"
                onClick={() => window.open(p, "_blank")}
              />
            ))}
          </div>
        )}

        {/* Chapters */}
        <section
          className={
            course.photos && course.photos.length > 0 ? "mt-12" : "mt-16"
          }
        >
          <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">
            Chapters
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {course.chapters?.map((ch: any) => {
              if (hasAccess) {
                return (
                  <Link
                    key={ch._id}
                    to={`/chapters/${ch._id}`}
                    className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden hover-scale"
                  >
                    <img
                      src={ch.coverImage || `https://cataas.com/cat?${ch._id}`}
                      alt="chap"
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-3 text-center text-gray-900 dark:text-white">
                      {ch.title}
                    </div>
                  </Link>
                );
              } else {
                return (
                  <div
                    key={ch._id}
                    className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden opacity-60 cursor-not-allowed"
                  >
                    <img
                      src={ch.coverImage || `https://cataas.com/cat?${ch._id}`}
                      alt="chap"
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-3 text-center text-gray-900 dark:text-white relative">
                      {ch.title}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs">
                        🔒 Enrollment Required
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CourseDetailPage;
