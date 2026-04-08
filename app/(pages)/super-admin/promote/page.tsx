"use client";

import React, { useEffect, useMemo, useState } from "react";

type UserRole = "VOLUNTEER" | "ADMIN" | "SUPER_ADMIN";

type PromotableUser = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isDeleted: boolean;
};

type PendingAction =
  | {
      kind: "role";
      userId: string;
      displayName: string;
      currentRole: UserRole;
      targetRole: UserRole;
    }
  | {
      kind: "delete";
      userId: string;
      displayName: string;
    }
  | {
      kind: "restore";
      userId: string;
      displayName: string;
    };

export default function PromotePage() {
  const [users, setUsers] = useState<PromotableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.trim().toLowerCase();
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesSearch =
        !query ||
        user.email.toLowerCase().includes(query) ||
        fullName.includes(query) ||
        user.role.toLowerCase().includes(query);

      return (
        matchesRole &&
        matchesSearch
      );
    });
  }, [users, search, roleFilter]);

  const roleLabel = (role: UserRole) => {
    if (role === "SUPER_ADMIN") return "Super Admin";
    if (role === "VOLUNTEER") return "Volunteer";
    return "Admin";
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/super-admin/promote", { method: "GET" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const requestRoleUpdate = (
    userId: string,
    targetRole: UserRole,
    currentRole: UserRole,
    displayName: string
  ) => {
    setPendingAction({
      kind: "role",
      userId,
      displayName,
      currentRole,
      targetRole,
    });
  };

  const requestDeleteUser = (userId: string, displayName: string) => {
    setPendingAction({
      kind: "delete",
      userId,
      displayName,
    });
  };

  const requestRestoreUser = (userId: string, displayName: string) => {
    setPendingAction({
      kind: "restore",
      userId,
      displayName,
    });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    setError(null);
    setMessage(null);

    try {
      if (pendingAction.kind === "role") {
        setPromotingId(pendingAction.userId);

        const response = await fetch("/api/super-admin/promote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: pendingAction.userId, targetRole: pendingAction.targetRole }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to update user role");
        }

        setMessage(data.message || "Role updated successfully");
        setUsers((current) =>
          current.map((user) =>
            user.id === pendingAction.userId ? { ...user, role: pendingAction.targetRole } : user
          )
        );
      } else if (pendingAction.kind === "delete") {
        setDeletingId(pendingAction.userId);

        const response = await fetch("/api/super-admin/promote", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: pendingAction.userId }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to delete user");
        }

        setMessage(data.message || "User account deleted successfully");
        setUsers((current) =>
          current.map((user) =>
            user.id === pendingAction.userId ? { ...user, isDeleted: true } : user
          )
        );
      } else {
        setDeletingId(pendingAction.userId);

        const response = await fetch("/api/super-admin/promote", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: pendingAction.userId }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to restore user");
        }

        setMessage(data.message || "User account restored successfully");
        setUsers((current) =>
          current.map((user) =>
            user.id === pendingAction.userId ? { ...user, isDeleted: false } : user
          )
        );
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply action");
    } finally {
      setPromotingId(null);
      setDeletingId(null);
      setPendingAction(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Super admin can promote and demote users between Volunteer, Admin, and Super Admin.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "ALL" | UserRole)}
            className="w-full md:w-52 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C7AB8]"
          >
            <option value="ALL">All roles</option>
            <option value="VOLUNTEER">Volunteer</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full md:w-80 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C7AB8]"
          />
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Current Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={5}>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={5}>
                    No promotable users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const displayName = `${user.firstName} ${user.lastName}`.trim() || "N/A";
                  return (
                    <tr key={user.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-900">{displayName}</td>
                      <td className="px-4 py-3 text-gray-700">{user.email}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{roleLabel(user.role)}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {user.isDeleted ? (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Deleted</span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="grid grid-cols-3 gap-2 justify-end">
                          {!user.isDeleted && user.role !== "VOLUNTEER" ? (
                            <button
                              onClick={() => requestRoleUpdate(user.id, "VOLUNTEER", user.role, displayName)}
                              disabled={promotingId === user.id || deletingId === user.id}
                              className="w-40 rounded-lg border border-gray-400 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 whitespace-nowrap"
                            >
                              {promotingId === user.id ? "Updating..." : "Make Volunteer"}
                            </button>
                          ) : (
                            <div className="w-40" />
                          )}

                          {!user.isDeleted && (user.role === "VOLUNTEER" || user.role === "SUPER_ADMIN") ? (
                            <button
                              onClick={() => requestRoleUpdate(user.id, "ADMIN", user.role, displayName)}
                              disabled={promotingId === user.id || deletingId === user.id}
                              className="w-40 rounded-lg border border-[#4C7AB8] px-3 py-2 text-xs font-semibold text-[#4C7AB8] hover:bg-[#4C7AB8]/10 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 whitespace-nowrap"
                            >
                              {promotingId === user.id ? "Updating..." : "Make Admin"}
                            </button>
                          ) : (
                            <button
                              onClick={() => requestRoleUpdate(user.id, "SUPER_ADMIN", user.role, displayName)}
                              disabled={promotingId === user.id || deletingId === user.id}
                              className="w-40 rounded-lg bg-[#4C7AB8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3c679e] disabled:cursor-not-allowed disabled:bg-gray-400 whitespace-nowrap"
                            >
                              {promotingId === user.id ? "Promoting..." : "Make Super Admin"}
                            </button>
                          )}

                          {user.isDeleted ? (
                            <button
                              onClick={() => requestRestoreUser(user.id, displayName)}
                              disabled={promotingId === user.id || deletingId === user.id}
                              className="w-40 rounded-lg border border-green-300 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 whitespace-nowrap"
                            >
                              {deletingId === user.id ? "Restoring..." : "Restore Account"}
                            </button>
                          ) : (
                            <button
                              onClick={() => requestDeleteUser(user.id, displayName)}
                              disabled={promotingId === user.id || deletingId === user.id}
                              className="w-40 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 whitespace-nowrap"
                            >
                              {deletingId === user.id ? "Deleting..." : "Delete Account"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h2>
            {pendingAction.kind === "role" ? (
              <p className="text-sm text-gray-700">
                Change role for <span className="font-semibold">{pendingAction.displayName}</span> from{" "}
                <span className="font-semibold">{roleLabel(pendingAction.currentRole)}</span> to{" "}
                <span className="font-semibold">{roleLabel(pendingAction.targetRole)}</span>?
              </p>
            ) : pendingAction.kind === "delete" ? (
              <p className="text-sm text-gray-700">
                Delete account for <span className="font-semibold">{pendingAction.displayName}</span>? This action cannot be undone.
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                Restore account for <span className="font-semibold">{pendingAction.displayName}</span>?
              </p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setPendingAction(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                  pendingAction.kind === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : pendingAction.kind === "restore"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-[#4C7AB8] hover:bg-[#3c679e]"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

