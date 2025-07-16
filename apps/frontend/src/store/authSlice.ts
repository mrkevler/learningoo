import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, assignLicense } from "../services/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  licenseId?: string;
  createdAt?: string;
  lastLoginAt?: string;
  authorName?: string;
  bio?: string;
  categories?: string[];
  balance?: number;
  profileImage?: string;
  profileThumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
}
interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "error";
  error?: string;
}

const savedToken = localStorage.getItem("token");
const savedUserStr = localStorage.getItem("user");
const initialState: AuthState = {
  user: savedUserStr ? (JSON.parse(savedUserStr) as User) : null,
  token: savedToken,
  status: "idle",
  error: undefined,
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data as { token: string; user: User };
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({
    name,
    email,
    password,
    role,
  }: {
    name: string;
    email: string;
    password: string;
    role: "student" | "tutor";
  }) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return res.data as { token: string; user: User };
  }
);

export const assignLicenseThunk = createAsyncThunk(
  "auth/assignLicense",
  async (slug: string, { getState }) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?._id as string;
    const res = await assignLicense(userId, slug);
    return res.data.user as User;
  }
);

export const updateAuthorThunk = createAsyncThunk(
  "auth/updateAuthor",
  async (
    {
      authorName,
      bio,
      categories,
    }: { authorName: string; bio?: string; categories?: string[] },
    { getState }
  ) => {
    const state = getState() as { auth: AuthState };
    const userId = state.auth.user?._id as string;
    const res = await api.put(`/users/${userId}`, {
      authorName,
      bio,
      categories,
    });
    return res.data as User;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setUser(state, action) {
      state.user = action.payload;
      if (action.payload)
        localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = "idle";
      state.error = undefined;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error.message;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = "idle";
      state.error = undefined;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error.message;
    });
    builder.addCase(assignLicenseThunk.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(updateAuthorThunk.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
