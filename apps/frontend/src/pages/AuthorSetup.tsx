import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "../store";
import { updateAuthorThunk } from "../store/authSlice";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

const schema = z.object({
  authorName: z.string().min(2, "Too short"),
  bio: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

const AuthorSetupPage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (user) {
      if (user.authorName) setValue("authorName", user.authorName);
      if (user.bio) setValue("bio", user.bio);
      if (Array.isArray(user.categories))
        setValue(
          "categories",
          user.categories.map((c: any) => c.toString())
        );
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    const res = await dispatch(updateAuthorThunk(data));
    if (updateAuthorThunk.fulfilled.match(res)) {
      navigate("/my-courses");
    }
  };

  const selected = watch("categories") || [];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-6 text-brand">
          Tutor Profile
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-gray-800 p-8 rounded-lg"
        >
          <div>
            <label className="block text-white mb-1">Author Nickname</label>
            <input
              type="text"
              {...register("authorName")}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
            {errors.authorName && (
              <p className="text-red-500 text-sm">
                {errors.authorName.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Bio</label>
            <textarea
              {...register("bio")}
              className="w-full p-2 rounded bg-gray-700 text-white h-32"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories?.map((cat: any) => (
                <label key={cat._id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={cat._id}
                    checked={selected.includes(cat._id)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (e.target.checked) {
                        setValue("categories", [...selected, val]);
                      } else {
                        setValue(
                          "categories",
                          selected.filter((id: string) => id !== val)
                        );
                      }
                    }}
                    className="form-checkbox text-brand focus:ring-brand h-4 w-4"
                    style={{ accentColor: "#ff0099" }}
                  />
                  <span className="text-white text-sm">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </Layout>
  );
};
export default AuthorSetupPage;
