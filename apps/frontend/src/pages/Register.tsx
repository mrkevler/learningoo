import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch } from "../store";
import { registerThunk } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

const schema = z
  .object({
    name: z.string().min(2, "Name too short"),
    email: z.string().email(),
    password: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = async (data: FormData) => {
    const res = await dispatch(registerThunk(data));
    if (registerThunk.fulfilled.match(res)) navigate("/profile");
  };
  return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 p-8 rounded-lg w-full max-w-md space-y-4"
        >
          <h2 className="text-3xl font-bold text-center text-brand mb-4">
            Create Account
          </h2>
          <div>
            <label className="block text-white mb-1">Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded"
          >
            Create Account
          </button>
          <p className="text-center text-gray-400 text-sm mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-brand">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};
export default RegisterPage;
