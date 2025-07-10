import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  fetchAdminConfig,
  updateAdminConfig,
  updateUserAdmin,
  fetchAdminOverview,
  createCategory,
  updateCategory as updateCatApi,
  deleteCategory as deleteCatApi,
  updateLicenseAdmin,
} from "../services/api";
import Layout from "../components/Layout";
import MatrixRainingCode from "../components/MatrixRainingCode";
import { useAppDispatch, useAppSelector } from "../store";
import { setTheme } from "../store/uiSlice";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance?: number;
  isActive?: boolean;
  licenseId?: { _id: string; slug: string } | null;
}

interface Transaction {
  _id: string;
  userId: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [config, setConfig] = useState<{
    allowRegistration: boolean;
    allowLogin: boolean;
    defaultCredits: number;
  }>({ allowLogin: true, allowRegistration: true, defaultCredits: 100 });
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>(null);
  const [newCat, setNewCat] = useState({ name: "", slug: "" });
  const [licensesData, setLicensesData] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTheme("dark"));
  }, [dispatch]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uRes, tRes, cRes, catRes, oRes, licRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/transactions"),
          fetchAdminConfig(),
          api.get("/categories"),
          fetchAdminOverview(),
          api.get("/licenses"),
        ]);
        setUsers(uRes.data);
        setTxs(tRes.data);
        setConfig(cRes.data);
        setCategoriesData(catRes.data);
        setOverview(oRes.data);
        setLicensesData(licRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const handleSaveConfig = async () => {
    try {
      await updateAdminConfig(config);
      alert("Config saved");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserChange = async (id: string, field: string, value: any) => {
    try {
      await updateUserAdmin(id, { [field]: value });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, [field]: value } : u))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleCatUpdate = async (id: string, field: string, value: string) => {
    await updateCatApi(id, { [field]: value });
    setCategoriesData((prev) =>
      prev.map((c) => (c._id === id ? { ...c, [field]: value } : c))
    );
  };
  const handleCatDelete = async (id: string) => {
    await deleteCatApi(id);
    setCategoriesData((prev) => prev.filter((c) => c._id !== id));
  };
  const handleCatAdd = async (name: string, slug: string) => {
    const res = await createCategory({ name, slug });
    setCategoriesData((prev) => [...prev, res.data]);
  };

  const handleNewCatSubmit = () => {
    if (newCat.name && newCat.slug) {
      handleCatAdd(newCat.name, newCat.slug);
      setNewCat({ name: "", slug: "" });
    }
  };

  const handleLicenseUpdate = async (id: string, field: string, value: any) => {
    await updateLicenseAdmin(id, { [field]: value });
    setLicensesData((prev) =>
      prev.map((l) => (l._id === id ? { ...l, [field]: value } : l))
    );
  };

  const userMap = Object.fromEntries(users.map((u) => [u._id, u.name]));

  return (
    <Layout transparent>
      <MatrixRainingCode />
      <div className="fixed inset-0 bg-white dark:bg-surface z-[-2]" />
      <section className="relative z-10 space-y-8 text-gray-900 dark:text-gray-200">
        <h1 className="text-2xl font-bold mb-4 text-green-400">
          Admin Dashboard
        </h1>
        {/* System Settings */}
        <section className="p-4 border border-green-500 rounded-md">
          <h2 className="text-xl font-bold mb-2">System Settings</h2>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.allowRegistration}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    allowRegistration: e.target.checked,
                  })
                }
              />
              <span>Allow Registration</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.allowLogin}
                onChange={(e) =>
                  setConfig({ ...config, allowLogin: e.target.checked })
                }
              />
              <span>Allow Login</span>
            </label>
            <label className="flex items-center gap-2">
              Default Credits:
              <input
                type="number"
                value={config.defaultCredits}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    defaultCredits: Number(e.target.value),
                  })
                }
                className="w-24 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
              />
            </label>
            <button
              onClick={handleSaveConfig}
              className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </section>

        {/* System Overview */}
        {overview && (
          <section className="p-4 border border-green-500 rounded-md space-y-6">
            <h2 className="text-xl font-bold">System Overview</h2>
            {/* Cards grid */}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 text-sm">
              {/* Users card */}
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-green-600 p-4 rounded shadow">
                <h3 className="font-semibold text-green-400 mb-1">
                  Users Overview
                </h3>
                <p>Total users: {overview.totalUsers}</p>
                <p>Tutors: {overview.tutors}</p>
                <p>Students: {overview.students}</p>
              </div>

              {/* Courses card */}
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-green-600 p-4 rounded shadow">
                <h3 className="font-semibold text-green-400 mb-1">
                  Courses Overview
                </h3>
                <p>Categories: {overview.categories}</p>
                <p>Courses: {overview.courses}</p>
              </div>

              {/* Licenses card */}
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-green-600 p-4 rounded shadow">
                <h3 className="font-semibold text-green-400 mb-1">
                  Licenses Overview
                </h3>
                {(["free", "startup", "advanced", "pro"] as const).map(
                  (key) => (
                    <p key={key} className="capitalize">
                      {key}: {overview.licenses[key] || 0}
                    </p>
                  )
                )}
              </div>

              {/* Revenue card */}
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-green-600 p-4 rounded shadow">
                <h3 className="font-semibold text-green-400 mb-1">Revenue</h3>
                <p>Total: ${overview.revenueTotal}</p>
                <p>Licenses: ${overview.revenueLicenses}</p>
                <p>Courses: ${overview.revenueCourses}</p>
              </div>
            </div>

            {/* Top earner */}
            {overview.topEarner && (
              <p className="mt-4">
                Top earner: ${overview.topEarner.amount} –{" "}
                <a
                  href={`/author/${overview.topEarner.user?._id}`}
                  className="font-bold text-green-400 underline"
                >
                  {overview.topEarner.user?.name}
                </a>
              </p>
            )}
          </section>
        )}

        {/* Users table */}
        <section className="overflow-x-auto p-4 border border-green-500 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Balance</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">License</th>
                <th className="px-4 py-2">New Password</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-2">
                    <a
                      href={`/author/${u._id}`}
                      className="text-green-400 underline"
                    >
                      {u.name}
                    </a>
                  </td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={u.balance ?? 0}
                      className="w-24 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                      onChange={(e) =>
                        handleUserChange(
                          u._id,
                          "balance",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={u.isActive ? "active" : "inactive"}
                      onChange={(e) =>
                        handleUserChange(
                          u._id,
                          "isActive",
                          e.target.value === "active"
                        )
                      }
                      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={
                        u.role === "student"
                          ? "student"
                          : u.licenseId?.slug || "free"
                      }
                      onChange={(e) =>
                        handleUserChange(u._id, "licenseSlug", e.target.value)
                      }
                      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                    >
                      <option value="student">student</option>
                      <option value="free">free</option>
                      <option value="startup">startup</option>
                      <option value="advanced">advanced</option>
                      <option value="pro">professional</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="password"
                      placeholder="new pwd"
                      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                      onBlur={(e) => {
                        if (e.target.value) {
                          handleUserChange(
                            u._id,
                            "newPassword",
                            e.target.value
                          );
                          e.target.value = "";
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Transactions table */}
        <section className="overflow-x-auto p-4 border border-green-500 rounded-md">
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-2">
                    <a
                      href={`/author/${t.userId}`}
                      className="underline text-green-400"
                    >
                      {userMap[t.userId] || "N/A"}
                    </a>
                  </td>
                  <td className="px-4 py-2">{t.userId}</td>
                  <td className="px-4 py-2">{t.type}</td>
                  <td className="px-4 py-2">{t.category}</td>
                  <td className="px-4 py-2">${t.amount}</td>
                  <td className="px-4 py-2">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="p-4 border border-green-500 rounded-md mt-6">
          <h3 className="text-lg font-semibold mb-2">License Packages</h3>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-2">Name</th>
                <th className="px-2">Price</th>
                <th className="px-2">Course Limit</th>
                <th className="px-2">Chapter Limit</th>
                <th className="px-2">Lesson Limit</th>
              </tr>
            </thead>
            <tbody>
              {licensesData.map((lic) => (
                <tr key={lic._id} className="border-b border-gray-700">
                  <td className="px-2 py-1 capitalize">{lic.name}</td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={lic.price}
                      onChange={(e) =>
                        handleLicenseUpdate(
                          lic._id,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-24 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={lic.courseLimit || ""}
                      onChange={(e) =>
                        handleLicenseUpdate(
                          lic._id,
                          "courseLimit",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="w-24 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={lic.chapterLimit || ""}
                      onChange={(e) =>
                        handleLicenseUpdate(
                          lic._id,
                          "chapterLimit",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="w-24 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      value={lic.lessonLimit || ""}
                      onChange={(e) =>
                        handleLicenseUpdate(
                          lic._id,
                          "lessonLimit",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="w-24 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Categories manager */}
        <section className="p-4 border border-green-500 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Categories</h3>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Slug</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categoriesData.map((cat) => (
                <tr key={cat._id} className="border-b border-gray-700">
                  <td className="px-2 py-1">
                    <input
                      value={cat.name}
                      onChange={(e) =>
                        handleCatUpdate(cat._id, "name", e.target.value)
                      }
                      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      value={cat.slug}
                      onChange={(e) =>
                        handleCatUpdate(cat._id, "slug", e.target.value)
                      }
                      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => handleCatDelete(cat._id)}
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <input
                    value={newCat.name}
                    onChange={(e) =>
                      setNewCat({ ...newCat, name: e.target.value })
                    }
                    placeholder="New name"
                    className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                  />
                </td>
                <td>
                  <input
                    value={newCat.slug}
                    onChange={(e) =>
                      setNewCat({ ...newCat, slug: e.target.value })
                    }
                    placeholder="new-slug"
                    className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-green-600 p-1"
                  />
                </td>
                <td>
                  <button
                    onClick={handleNewCatSubmit}
                    className="text-green-400"
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
