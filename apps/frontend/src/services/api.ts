/// <reference types="vite/client" />
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000/api",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const assignLicense = (userId: string, slug: string) =>
  api.post("/licenses/assign", { userId, licenseSlug: slug });

export const fetchAdminUsers = () => api.get("/admin/users");
export const fetchAdminTransactions = () => api.get("/admin/transactions");
export const fetchAdminSummary = () => api.get("/admin/summary");
export const fetchAdminConfig = () => api.get("/admin/config");
export const updateAdminConfig = (data: {
  allowRegistration?: boolean;
  allowLogin?: boolean;
  defaultCredits?: number;
}) => api.put("/admin/config", data);
export const updateUserAdmin = (
  id: string,
  data: { balance?: number; isActive?: boolean; licenseSlug?: string }
) => api.put(`/admin/users/${id}`, data);
export const fetchAdminOverview = () => api.get("/admin/overview");
export const updateCategory = (
  id: string,
  data: { name?: string; slug?: string }
) => api.patch(`/categories/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
export const createCategory = (data: { name: string; slug: string }) =>
  api.post("/categories", data);
export const updateLicenseAdmin = (
  id: string,
  data: {
    price?: number;
    courseLimit?: number;
    chapterLimit?: number;
    lessonLimit?: number;
  }
) => api.patch(`/licenses/${id}`, data);
