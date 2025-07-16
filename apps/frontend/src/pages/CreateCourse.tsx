import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Layout from "../components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAppSelector } from "../store";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "../components/ImageUpload";

const schema = z.object({
  title: z.string().min(3, "Too short"),
  coverImage: z.string().url({ message: "Missing field" }),
  categoryId: z.string({ required_error: "Select category" }),
  description: z.string().min(10),
  photos: z.array(z.string()).min(1, "Missing field"),
  welcomeEmailBody: z.string().min(10, "Enter body"),
  price: z.number().min(0),
  chapters: z
    .array(
      z.object({
        title: z.string().min(2),
        coverImage: z.string().url({ message: "Missing field" }),
      })
    )
    .min(1),
});

type FormData = z.infer<typeof schema>;

const CreateCoursePage = () => {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "chapters",
  });

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      api.post("/courses", data).then((r) => r.data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate(`/courses/${created.slug}`);
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
      tutorId: user?._id,
      slug: slugify(data.title),
      welcomeEmailSubject: `Welcome {userName} on the course: ${data.title}`,
      price: data.price,
    } as any;
    mutation.mutate(payload);
  };

  // Scroll to first error on submit failure
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

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-brand mb-6">Create Course</h1>
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

          {/* Cover image upload */}
          <div>
            <label className="block mb-1 text-gray-800 dark:text-gray-100">
              Cover Image
            </label>
            <ImageUpload
              type="course-cover"
              currentImage={watch("coverImage")}
              onUploadSuccess={(urls) => setValue("coverImage", urls[0])}
              onUploadError={(error) => console.error("Upload error:", error)}
            />
            {errors.coverImage && (
              <p className="text-red-500 text-sm">
                {errors.coverImage.message}
              </p>
            )}
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

          {/* Course photos upload */}
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
            <div className="grid grid-cols-3 gap-2 mt-4">
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
              {/* add domain name to the beginning of the relative path and change logic to send emails in production ;) */}
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
          <div className="space-y-4">
            <label className="block font-semibold text-gray-800 dark:text-gray-100">
              Chapters
            </label>
            {fields.map((field, idx) => (
              <div
                key={field.id}
                className="border p-4 rounded bg-gray-100 dark:bg-gray-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    Chapter {idx + 1}
                  </h3>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Chapter Title"
                  {...register(`chapters.${idx}.title` as const)}
                  className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white mb-2 focus:ring-2 focus:ring-brand"
                />
                <div className="mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Chapter Cover Image
                  </p>
                  <ImageUpload
                    type="chapter-cover"
                    currentImage={watch(`chapters.${idx}.coverImage`)}
                    onUploadSuccess={(urls) =>
                      setValue(`chapters.${idx}.coverImage`, urls[0])
                    }
                    onUploadError={(error) =>
                      console.error("Chapter cover upload error:", error)
                    }
                  />
                </div>
                {errors.chapters?.[idx]?.coverImage && (
                  <p className="text-red-500 text-xs">Missing field</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({
                  title: "",
                  coverImage: "",
                })
              }
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              + Add another chapter
            </button>
          </div>

          <button
            type="submit"
            tabIndex={-1}
            className="bg-brand text-white px-6 py-2 rounded"
          >
            Create Course
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateCoursePage;
