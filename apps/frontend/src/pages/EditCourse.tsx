import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from "../components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAppSelector } from "../store";
import { useNavigate, useParams } from "react-router-dom";
import { ImageUpload } from "../components/ImageUpload";

const schema = z.object({
  title: z.string().min(3, "Too short"),
  coverImage: z.string().url({ message: "Missing field" }),
  categoryId: z.string({ required_error: "Select category" }),
  description: z.string().min(40),
  photos: z.array(z.string()).min(1, "Missing field"),
  welcomeEmailBody: z.string().min(10, "Enter body"),
  price: z.number().min(0),
  chapters: z
    .array(
      z.object({
        title: z.string().min(2),
        coverImage: z.string().url({ message: "Missing field" }),
        _id: z.string().optional(),
      })
    )
    .min(0),
});

type FormData = z.infer<typeof schema>;

const EditCoursePage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    enabled: !!id,
    queryFn: () => api.get(`/courses/${id}`).then((r) => r.data),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      coverImage: "",
      photos: [],
      welcomeEmailBody: "",
      price: 0,
      chapters: [
        {
          title: "",
          coverImage: "",
        },
      ],
    },
  });

  // Populate form when course data loads
  useEffect(() => {
    if (course) {
      reset({
        title: course.title || "",
        coverImage: course.coverImage || "",
        categoryId: course.categoryId || "",
        description: course.description || "",
        photos: course.photos || [],
        welcomeEmailBody: course.welcomeEmailBody || "",
        price: course.price || 0,
        chapters:
          course.chapters?.length > 0
            ? course.chapters.map((ch: any) => ({
                title: ch.title || "",
                coverImage: ch.coverImage || "",
                _id: ch._id,
              }))
            : [{ title: "", coverImage: "" }],
      });
    }
  }, [course, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "chapters",
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.put(`/courses/${id}`, data).then((r) => r.data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["course", id] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate(`/courses/${updated.slug || course.slug}`);
    },
  });

  const user = useAppSelector((s) => s.auth.user);
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      slug: slugify(data.title),
      welcomeEmailSubject: `Welcome {userName} on the course: ${data.title}`,
      price: data.price,
    } as any;
    mutation.mutate(payload);
  };

  // Scroll to first error on submit fail
  const {
    trigger,
    formState: { errors: formErrors, submitCount },
  } = useForm<FormData>();

  useEffect(() => {
    if (submitCount > 0 && Object.keys(formErrors).length > 0) {
      const firstKey = Object.keys(formErrors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`) as HTMLElement;
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [formErrors, submitCount]);

  const handleFormKey = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) {
        if (target.value.trim() !== "") {
          e.preventDefault();
          const form = target.form;
          if (form) {
            const elements = Array.from(
              form.querySelectorAll<HTMLElement>(
                "input, textarea, select, button"
              )
            ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex >= 0);
            const idx = elements.indexOf(target);
            if (idx >= 0 && idx + 1 < elements.length) {
              elements[idx + 1].focus();
            }
          }
        }
      }
    }
  };

  if (isLoading) return <Layout>Loading...</Layout>;
  if (!course) return <Layout>Course not found</Layout>;

  const existingChaptersCount = course.chapters?.length || 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-brand mb-6">Edit Course</h1>
        <form
          onKeyDown={handleFormKey}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block mb-1 text-gray-800 dark:text-gray-100">
              Course Title
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-brand"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Cover image placeholder */}
          <div>
            <label className="block mb-1 text-gray-800 dark:text-gray-100">
              Cover Image
            </label>
            <input
              type="text"
              {...register("coverImage")}
              className={`w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-brand ${errors.coverImage ? "border border-red-500" : ""}`}
            />
            {errors.coverImage && (
              <p className="text-red-500 text-sm">
                {errors.coverImage.message}
              </p>
            )}
            <ImageUpload
              type="course-cover"
              currentImage={watch("coverImage")}
              onUploadSuccess={(urls) => setValue("coverImage", urls[0])}
              onUploadError={(error) => console.error("Upload error:", error)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-gray-800 dark:text-gray-100">
              Category
            </label>
            <select
              {...register("categoryId")}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-brand"
            >
              <option value="">Select...</option>
              {categories?.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-gray-800 dark:text-gray-100">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-brand"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-800 dark:text-gray-100">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white h-32 focus:ring-2 focus:ring-brand"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Photos list */}
          <div>
            <label className="block mb-1 text-gray-800 dark:text-gray-100">
              Course Content Photos
            </label>
            <ImageUpload
              type="course-photos"
              multiple={true}
              maxFiles={5}
              onUploadSuccess={(urls) => {
                const current = getValues("photos") || [];
                setValue("photos", [...current, ...urls]);
              }}
              onUploadError={(error) =>
                console.error("Photo upload error:", error)
              }
            />
            <div className="grid grid-cols-3 gap-2">
              {watch("photos")?.map((p, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={p}
                    alt="photo"
                    className="h-24 object-cover rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const current = getValues("photos") || [];
                      setValue(
                        "photos",
                        current.filter((_, i) => i !== idx)
                      );
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {errors.photos && (
              <p className="text-red-500 text-sm">{errors.photos.message}</p>
            )}
          </div>

          {/* Welcome Message */}
          <div>
            <p className="font-semibold mb-1 text-gray-800 dark:text-gray-100">
              Welcome message title:
            </p>
            <p className="mb-3 italic text-brand-dark">
              {`Welcome {userName} on the course: ${getValues("title") || "<course title>"}`}
            </p>
            <label className="block mb-1 text-gray-800 dark:text-gray-100">
              Welcome Message Body
            </label>
            <textarea
              rows={4}
              {...register("welcomeEmailBody")}
              className={`w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-brand ${errors.welcomeEmailBody ? "border border-red-500" : ""}`}
            />
            {errors.welcomeEmailBody && (
              <p className="text-red-500 text-sm">
                {errors.welcomeEmailBody.message}
              </p>
            )}
          </div>

          {/* Chapters */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand">Chapters</h2>
              <button
                type="button"
                onClick={() =>
                  append({
                    title: "",
                    coverImage: "",
                  })
                }
                className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-600"
              >
                + Add Chapter {fields.length + 1}
              </button>
            </div>

            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Chapter {idx + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded border border-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    Remove
                  </button>
                </div>

                {/* Chapter Title */}
                <div className="mb-6">
                  <label className="block mb-1 text-gray-800 dark:text-gray-100">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    placeholder="Chapter Title"
                    {...register(`chapters.${idx}.title` as const)}
                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-brand"
                  />
                  {errors.chapters?.[idx]?.title && (
                    <p className="text-red-500 text-sm mt-1">Required</p>
                  )}
                </div>

                {/* Chapter Cover Image */}
                <div>
                  <label className="block mb-1 text-gray-800 dark:text-gray-100">
                    Chapter Cover Image
                  </label>
                  <input
                    type="text"
                    {...register(`chapters.${idx}.coverImage` as const)}
                    className={`w-full p-2 rounded bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-brand ${errors.chapters?.[idx]?.coverImage ? "border border-red-500" : ""}`}
                  />
                  {errors.chapters?.[idx]?.coverImage && (
                    <p className="text-red-500 text-sm mt-1">
                      Valid URL required
                    </p>
                  )}

                  {watch(`chapters.${idx}.coverImage`) ? (
                    // Show uploaded image with delete button
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mt-2 flex justify-center">
                      <div className="relative inline-block">
                        <img
                          src={watch(`chapters.${idx}.coverImage`)}
                          alt={`Chapter ${idx + 1} Cover`}
                          className="h-24 w-24 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setValue(`chapters.${idx}.coverImage`, "")
                          }
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Show upload area
                    <ImageUpload
                      type="chapter-cover"
                      currentImage={undefined}
                      onUploadSuccess={(urls) =>
                        setValue(`chapters.${idx}.coverImage`, urls[0])
                      }
                      onUploadError={(error) =>
                        console.error("Chapter cover upload error:", error)
                      }
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            tabIndex={-1}
            className="bg-brand text-white px-6 py-2 rounded"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Course"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditCoursePage;
