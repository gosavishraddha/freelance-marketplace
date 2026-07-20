import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { Badge } from "../../components/ui/Badge";
import { Search, Trash2, ShieldAlert } from "lucide-react";

export const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await authService.getAllUsers();
      setUsers(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to terminate user account "${name}"? This action is permanent.`)) {
      try {
        await authService.deleteUser(id);
        loadUsers();
      } catch (e) {
        alert(e.message || "Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">System Members Auditor</h2>
        <p className="text-xs text-gray-400">Search system member accounts, verify profile parameters, and terminate unauthorized profiles</p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-205 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-450" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="client">Clients Only</option>
          <option value="freelancer">Freelancers Only</option>
          <option value="admin">Administrators Only</option>
        </select>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-xs">No registered users matched the filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-955 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role System</th>
                  <th className="px-6 py-4">Wallet Balance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-850/20">
                    <td className="px-6 py-3.5 flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-xl object-cover border border-gray-100 dark:border-gray-800"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white leading-none mb-1">{u.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate max-w-[150px]">{u.title || "User"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 font-semibold">{u.email}</td>
                    <td className="px-6 py-3.5">
                      <Badge variant={u.role === "client" ? "blue" : u.role === "freelancer" ? "green" : "red"}>
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 font-extrabold text-gray-950 dark:text-white">
                      ${(u.walletBalance || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      {u.role !== "admin" ? (
                        <button
                          onClick={() => onDeleteUser(u.id, u.name)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Terminate Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold px-2">SYSTEM PROTECTED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
