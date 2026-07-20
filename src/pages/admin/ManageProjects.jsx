import React, { useState, useEffect } from "react";
import { projectService } from "../../services/projectService";
import { Badge } from "../../components/ui/Badge";
import { Search, Trash2 } from "lucide-react";

export const AdminManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await projectService.getProjects();
      setProjects(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const onDeleteProject = async (id, title) => {
    if (window.confirm(`Are you sure you want to moderate and remove project "${title}"? All bids will be cleared.`)) {
      try {
        await projectService.deleteProject(id);
        loadProjects();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "blue";
      case "ongoing": return "orange";
      case "completed": return "green";
      case "archived": return "gray";
      default: return "gray";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Posted Job Audits</h2>
        <p className="text-xs text-gray-400">Review project listings, audit budget parameters, and moderate content</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or descriptions..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-205 dark:border-gray-850 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/25 focus:border-rose-500"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open Listings</option>
          <option value="ongoing">Ongoing Work</option>
          <option value="completed">Completed Projects</option>
          <option value="archived">Archived Jobs</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-xs">No project submissions match your query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-955 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Job Details</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Allocated Budget</th>
                  <th className="px-6 py-4 text-right">Moderations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-55/30 dark:hover:bg-gray-850/20">
                    <td className="px-6 py-4 max-w-sm">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{p.title}</h4>
                      <p className="text-xxs text-gray-400 line-clamp-1">{p.description}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                      {p.clientName}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusColor(p.status)}>
                        {p.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-white">
                      ${p.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onDeleteProject(p.id, p.title)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Moderate and Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
