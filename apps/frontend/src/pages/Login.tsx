import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "../store";
import { loginThunk } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const authState = useAppSelector((s) => s.auth);
  const onSubmit = async (data: FormData) => {
    const res = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(res)) navigate("/profile");
  };
  return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 p-8 rounded-lg w-full max-w-md space-y-4"
        >
          <h2 className="text-3xl font-bold text-center text-brand mb-4">
            Sign In
          </h2>
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
          {authState.status === "error" && (
            <p className="text-red-500 text-sm">{authState.error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-brand hover:bg-brand-dark text-white py-2 rounded"
          >
            Sign In
          </button>
          <button
            type="button"
            className="w-full bg-gray-700 text-white py-2 rounded mt-2"
            disabled
          >
            Login with Google (coming soon)
          </button>
          <p className="text-center text-gray-400 text-sm mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand">
              Register
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};
export default LoginPage;
