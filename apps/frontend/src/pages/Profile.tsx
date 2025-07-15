import Layout from "../components/Layout";
import { useAppSelector } from "../store";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import React from "react";

const ProfilePage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const { data: courses } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: () => api.get("/courses/enrolled").then((r) => r.data),
  });

  // course map for titles
  const { data: allCourses } = useQuery({
    queryKey: ["coursesMap"],
    queryFn: () => api.get("/courses").then((r) => r.data),
  });
  const courseTitleById = React.useMemo(() => {
    const map: Record<string, string> = {};
    allCourses?.forEach((c: any) => {
      map[c._id] = c.title;
    });
    return map;
  }, [allCourses]);

  // Fetch licenses list to map id-name
  const { data: licenses } = useQuery({
    queryKey: ["licenses"],
    queryFn: () => api.get("/licenses").then((r) => r.data),
  });

  const licenseName = React.useMemo(() => {
    if (!user?.licenseId) return "Free";
    const lic = licenses?.find((l: any) => l._id === user.licenseId);
    return lic?.name || "Unknown";
  }, [licenses, user?.licenseId]);

  const { data: transactions } = useQuery({
    enabled: !!user,
    queryKey: ["transactions"],
    queryFn: () =>
      api
        .get("/transactions", { params: { userId: user?._id } })
        .then((r) => r.data),
  });

  // Map counterpart user id to display name
  const { data: users } = useQuery({
    queryKey: ["usersMap"],
    queryFn: () => api.get("/users").then((r) => r.data),
  });

  const userNameById = React.useMemo(() => {
    const map: Record<string, string> = {};
    users?.forEach((u: any) => {
      map[u._id] = u.authorName || u.name;
    });
    return map;
  }, [users]);

  if (!user) return null;
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-20 space-y-10 px-4">
        <div className="flex flex-col items-center gap-4 bg-gray-800 dark:bg-gray-700 p-6 rounded-lg">
          <div className="h-20 w-20 rounded-full bg-brand flex items-center justify-center text-3xl font-bold text-white">
            {user.name[0]}
          </div>
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-gray-400 capitalize">Role: {user.role}</p>
          <p className="text-gray-400">
            Balance: ${user.balance?.toFixed?.(2) || 0}
          </p>
          {user.createdAt && (
            <p className="text-gray-400 text-sm">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
          {user.lastLoginAt && (
            <p className="text-gray-400 text-sm">
              Last login: {new Date(user.lastLoginAt).toLocaleString()}
            </p>
          )}
        </div>

        <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg text-center space-y-2">
          <h3 className="text-xl font-bold text-brand">Current Plan</h3>
          <p className="text-gray-300">{licenseName}</p>
          {user.role === "student" ? (
            <Link
              to="/pricing"
              className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark inline-block"
            >
              Become a Tutor
            </Link>
          ) : (
            <Link
              to="/pricing"
              className="bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-dark inline-block"
            >
              Change Plan
            </Link>
          )}
          {user.role === "tutor" && (
            <Link to="/setup-author" className="ml-4 underline text-brand">
              Edit Tutor Profile
            </Link>
          )}
        </div>

        {courses && courses.length > 0 && (
          <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg space-y-3">
            <h3 className="text-xl font-bold text-accent text-center">
              Enrolled Courses
            </h3>
            <ul className="space-y-1 list-disc list-inside text-gray-300">
              {courses.map((c: any) => (
                <li key={c._id}>{c.title}</li>
              ))}
            </ul>
          </div>
        )}
        {transactions && transactions.length > 0 && (
          <div className="bg-gray-800 dark:bg-gray-700 p-6 rounded-lg space-y-3 overflow-x-auto">
            <h3 className="text-xl font-bold text-accent text-center">
              Recent Transactions
            </h3>
            <table className="w-full text-left text-sm text-gray-300 min-w-[600px]">
              <thead>
                <tr>
                  <th className="py-2">Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Buyer/Seller</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx: any) => (
                  <tr key={tx._id}>
                    <td className="py-1">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {tx.category === "course" && tx.relatedId ? (
                        <Link
                          to={`/courses/${tx.relatedId}`}
                          className="underline text-brand"
                        >
                          {courseTitleById[tx.relatedId] || "Course"}
                        </Link>
                      ) : (
                        tx.description
                      )}
                    </td>
                    <td
                      className={
                        tx.type === "debit" ? "text-red-400" : "text-green-400"
                      }
                    >
                      {tx.type === "debit" ? "-" : "+"}${tx.amount}
                    </td>
                    <td>
                      {tx.counterpartId ? (
                        <Link
                          to={`/author/${tx.counterpartId}`}
                          className="underline text-accent-purple"
                        >
                          {userNameById[tx.counterpartId] || tx.counterpartId}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default ProfilePage;
