import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAppSelector, useAppDispatch } from "../store";
import { setUser } from "../store/authSlice";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    _id: string;
    title: string;
    price: number;
    slug?: string;
  };
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: (body: { studentId: string }) =>
      api.post(`/courses/${course._id}/enroll`, body).then((r) => r.data),
    onSuccess: (data) => {
      const newUser = { ...(user as any), balance: data.balance };
      dispatch(setUser(newUser));
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["chapterAccess"] });
      queryClient.invalidateQueries({ queryKey: ["lessonAccess"] });
      queryClient.invalidateQueries({ queryKey: ["enrollStatus"] });
      onClose();
      alert(
        "Enrolled successfully! You now have access to all course content."
      );
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Enrollment failed");
    },
  });

  const handleEnroll = () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (
      window.confirm(
        `Do you want to enroll in "${course.title}" for $${course.price}?`
      )
    ) {
      enrollMutation.mutate({ studentId: user._id });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-brand mb-4">
            Enrollment Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enroll in this course to see its content
          </p>

          <div className="mb-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              {course.title}
            </h3>
            <div className="text-3xl font-bold text-brand">${course.price}</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              className="flex-1 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              {enrollMutation.isPending
                ? "Enrolling..."
                : `Enroll $${course.price}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
