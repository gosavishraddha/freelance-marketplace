import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { projectService } from "../../services/projectService";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input, Textarea, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Plus, Trash2, Archive, Copy, Eye, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export const ClientProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "Development",
      subcategory: "Web Development",
      budget: "",
      deadline: "",
      skillsString: ""
    }
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await projectService.getClientProjects(user.id);
      setProjects(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user]);

  const onCreateProject = async (data) => {
    setActionError("");
    try {
      const skills = data.skillsString
        ? data.skillsString.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
        : [];
      
      await projectService.createProject(
        {
          title: data.title,
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          budget: data.budget,
          deadline: data.deadline,
          skills
        },
        user.id,
        user.name
      );
      
      reset();
      setIsCreateOpen(false);
      loadProjects();
    } catch (e) {
      setActionError(e.message || "Failed to create project");
    }
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project? This will delete associated bids.")) {
      try {
        await projectService.deleteProject(id);
        loadProjects();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onArchive = async (id) => {
    try {
      await projectService.archiveProject(id);
      loadProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const onDuplicate = async (id) => {
    try {
      await projectService.duplicateProject(id);
      loadProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open": return "blue";
      case "ongoing": return "orange";
      case "completed": return "green";
      case "archived": return "gray";
      default: return "gray";
    }
  };

  const categories = [
    { label: "Development", value: "Development" },
    { label: "Design & Mobile", value: "Design & Mobile" },
    { label: "Writing & Content", value: "Writing & Content" },
    { label: "Marketing", value: "Marketing" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-950 dark:text-white">Project Listing Desk</h2>
          <p className="text-xs text-gray-400">Post new requirements and manage your open project pipelines</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
          <p className="text-sm text-gray-500 mb-4">You haven't posted any projects yet.</p>
          <Button onClick={() => setIsCreateOpen(true)}>Create Project Post</Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Project Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Proposals</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                    <td className="px-6 py-4.5 max-w-sm">
                      <Link to={`/client/projects/${proj.id}`} className="font-bold text-gray-900 dark:text-white hover:text-primary transition-colors block mb-1">
                        {proj.title}
                      </Link>
                      <p className="text-xxs text-gray-400 line-clamp-1">{proj.description}</p>
                    </td>
                    <td className="px-6 py-4.5 font-medium text-gray-600 dark:text-gray-300">
                      {proj.category}
                    </td>
                    <td className="px-6 py-4.5 font-bold text-gray-950 dark:text-white">
                      ${proj.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4.5">
                      <Badge variant={getStatusColor(proj.status)}>
                        {proj.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4.5 font-bold text-gray-550 dark:text-gray-400">
                      {proj.bidsCount || 0} bids
                    </td>
                    <td className="px-6 py-4.5 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        to={`/client/projects/${proj.id}`}
                        className="inline-flex p-2 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDuplicate(proj.id)}
                        className="inline-flex p-2 text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {proj.status !== "archived" && (
                        <button
                          onClick={() => onArchive(proj.id)}
                          className="inline-flex p-2 text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(proj.id)}
                        className="inline-flex p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Project Requirement">
        {actionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            {actionError}
          </div>
        )}

        <form onSubmit={handleSubmit(onCreateProject)} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Redesign analytics page using React"
            error={errors.title}
            {...register("title", { required: "Project Title is required" })}
          />

          <Textarea
            label="Project Description"
            placeholder="Describe the scope of work, technical requirements, deliverables, and expectations..."
            error={errors.description}
            {...register("description", { required: "Description is required" })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories}
              error={errors.category}
              {...register("category", { required: "Category is required" })}
            />
            <Input
              label="Subcategory"
              placeholder="e.g. Web Development"
              error={errors.subcategory}
              {...register("subcategory")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Budget (USD)"
              type="number"
              placeholder="4500"
              error={errors.budget}
              {...register("budget", {
                required: "Budget is required",
                min: { value: 1, message: "Budget must be greater than 0" }
              })}
            />
            <Input
              label="Deadline Date"
              type="date"
              error={errors.deadline}
              {...register("deadline", { required: "Deadline is required" })}
            />
          </div>

          <Input
            label="Required Skills (Comma separated)"
            placeholder="React, Tailwind, Framer Motion, JavaScript"
            error={errors.skillsString}
            {...register("skillsString", { required: "Please specify skills" })}
          />

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Post Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
