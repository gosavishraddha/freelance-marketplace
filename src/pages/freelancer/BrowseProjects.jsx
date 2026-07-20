import React, { useState, useEffect } from "react";
import { projectService } from "../../services/projectService";
import { ProjectCard } from "../../components/cards/ProjectCard";
import { Input, Select } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Search, Filter, RefreshCw, X, DollarSign } from "lucide-react";

export const FreelancerBrowseProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    minBudget: "",
    maxBudget: "",
    skills: []
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const activeList = await projectService.getProjects({
        search: filters.search,
        category: filters.category,
        minBudget: filters.minBudget,
        maxBudget: filters.maxBudget,
        skills: filters.skills,
        status: "open"
      });
      setProjects(activeList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleBudgetChange = (field, val) => {
    setFilters(prev => ({ ...prev, [field]: val }));
  };

  const toggleSkillFilter = (skill) => {
    setFilters(prev => {
      const exists = prev.skills.includes(skill);
      const updated = exists 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "All",
      minBudget: "",
      maxBudget: "",
      skills: []
    });
  };

  const categories = [
    { label: "All Categories", value: "All" },
    { label: "Development", value: "Development" },
    { label: "Design & Mobile", value: "Design & Mobile" },
    { label: "Writing & Content", value: "Writing & Content" },
    { label: "Marketing", value: "Marketing" }
  ];

  const popularSkills = ["React", "Tailwind CSS", "Java", "Spring Boot", "Flutter", "Figma", "WebSockets", "JavaScript"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-950 dark:text-white">Active Freelance Projects</h2>
        <p className="text-xs text-gray-400">Search postings, inspect budgets, and place proposal bids</p>
      </div>

      {/* Search and Quick Filters bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search projects by title, description or details..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-205 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <div className="w-full md:w-56">
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Detail Filters panel */}
        <aside className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-premium space-y-5 h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-905 dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-accent" />
              Advanced Filters
            </span>
            <button
              onClick={clearFilters}
              className="text-[10px] text-accent font-bold hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Budget filter */}
          <div className="space-y-2">
            <span className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Budget Range (USD)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minBudget}
                onChange={(e) => handleBudgetChange("minBudget", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs focus:outline-none"
              />
              <span className="text-gray-400 text-xxs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxBudget}
                onChange={(e) => handleBudgetChange("maxBudget", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs focus:outline-none"
              />
            </div>
          </div>

          {/* Skills Checklist */}
          <div className="space-y-2.5">
            <span className="text-xxs font-bold text-gray-405 uppercase tracking-wider block">Skills Filter</span>
            <div className="flex flex-wrap gap-1">
              {popularSkills.map((skill) => {
                const isSelected = filters.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkillFilter(skill)}
                    className={`text-xxs px-2.5 py-1 rounded-full transition-all border ${
                      isSelected
                        ? "bg-accent text-white border-accent font-bold"
                        : "bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-850"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Side: Projects listings */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl space-y-3">
              <p className="text-sm text-gray-450">No open project listings match your query.</p>
              <Button size="sm" onClick={clearFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((proj) => (
                <ProjectCard key={proj.id} project={proj} showActions={true} role="freelancer" />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
