import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { projectService } from "../services/projectService";
import { Input, Select } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Search, Filter, DollarSign, Award, Briefcase, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const BrowseProjectsPublic = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize filters from search parameters
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "All",
    minBudget: "",
    maxBudget: "",
    skills: []
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await projectService.getProjects({
        search: filters.search,
        category: filters.category,
        minBudget: filters.minBudget,
        maxBudget: filters.maxBudget,
        skills: filters.skills,
        status: "open"
      });
      setProjects(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [filters]);

  // Sync state if search params change externally (e.g. from navbar clicks)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "All"
    }));
  }, [searchParams]);

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
    setSearchParams({});
  };

  const handleActionClick = (projId) => {
    if (!user) {
      navigate(`/login?redirect=/freelancer/projects/${projId}`);
    } else {
      navigate(`/${user.role}/projects/${projId}`);
    }
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
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
          Browse Remote <span className="text-primary">Projects</span>
        </h1>
        <p className="text-xs text-gray-400">Search current listings, filter by budget requirements, and place competitive bids</p>
      </div>

      {/* Search Input bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search projects by keywords, tools, or specs..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-205 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-405" />
        </div>
        <div className="w-full md:w-56">
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Filters */}
        <aside className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-5 h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-primary" />
              Advanced Filters
            </span>
            <button
              onClick={clearFilters}
              className="text-[10px] text-primary font-bold hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <span className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Budget Range (USD)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minBudget}
                onChange={(e) => handleBudgetChange("minBudget", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs focus:outline-none text-gray-900 dark:text-white"
              />
              <span className="text-gray-400 text-xxs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxBudget}
                onChange={(e) => handleBudgetChange("maxBudget", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs focus:outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Skills checklist */}
          <div className="space-y-2.5">
            <span className="text-xxs font-bold text-gray-405 uppercase tracking-wider block">Target Skills</span>
            <div className="flex flex-wrap gap-1">
              {popularSkills.map((skill) => {
                const isSelected = filters.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`text-xxs px-2.5 py-1 rounded-full transition-all border ${
                      isSelected
                        ? "bg-primary text-white border-primary font-bold"
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

        {/* Listings column */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl space-y-3">
              <p className="text-sm text-gray-450">No open project listings match your query parameters.</p>
              <Button size="sm" onClick={clearFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((proj) => (
                <motion.div
                  key={proj.id}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium flex flex-col justify-between hover:border-primary/25 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {proj.status}
                      </span>
                      <span className="text-xxs text-gray-400">{new Date(proj.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xxs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mt-1.5">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {proj.skills.map((skill, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-50 dark:bg-gray-950 text-gray-500 border border-gray-100 dark:border-gray-800 px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Budget</span>
                      <span className="text-xs font-black text-emerald-500 flex items-center">
                        <DollarSign className="w-3.5 h-3.5" />
                        {proj.budget.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleActionClick(proj.id)}
                      className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xxs flex items-center gap-1.5 uppercase tracking-wide transition-all shadow-sm shadow-primary/10"
                    >
                      Bid Details
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
