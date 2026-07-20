import React, { useState, useEffect } from "react";
import { db } from "../mock/db";
import { Search, Filter, DollarSign, Star, Award, MapPin, ArrowRight, Sparkles, X, Heart, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const BrowseFreelancersPublic = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProfile, setActiveProfile] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    skills: [],
    minRate: "",
    maxRate: ""
  });

  const loadFreelancers = () => {
    setLoading(true);
    try {
      const allUsers = db.getUsers();
      let list = allUsers.filter(u => u.role === "freelancer");

      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(f => 
          f.name.toLowerCase().includes(q) || 
          f.title.toLowerCase().includes(q) || 
          (f.bio && f.bio.toLowerCase().includes(q))
        );
      }

      if (filters.minRate) {
        list = list.filter(f => f.hourlyRate >= Number(filters.minRate));
      }

      if (filters.maxRate) {
        list = list.filter(f => f.hourlyRate <= Number(filters.maxRate));
      }

      if (filters.skills.length > 0) {
        list = list.filter(f => 
          filters.skills.some(skill => f.skills.includes(skill))
        );
      }

      setFreelancers(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFreelancers();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleRateChange = (field, val) => {
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
      skills: [],
      minRate: "",
      maxRate: ""
    });
  };

  const handleInvite = (freelancerName) => {
    if (!user) {
      navigate("/login?redirect=/browse-freelancers");
    } else if (user.role === "client") {
      alert(`Invitation sent to ${freelancerName}! You can manage active interview chats in your messages inbox.`);
      navigate("/client/chat");
    } else {
      alert("Only Client accounts can invite freelancers to bid on project listings.");
    }
  };

  const popularSkills = ["React", "JavaScript", "Tailwind CSS", "TypeScript", "Node.js", "Java", "Spring Boot", "PostgreSQL", "Docker"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 relative">
      
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
          Explore Professional <span className="text-primary">Talent</span>
        </h1>
        <p className="text-xs text-gray-450">Browse certified engineer portfolios, check hourly rates, review skill vectors, and interview candidates</p>
      </div>

      {/* Search Input bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search freelancers by names, positions, bio credentials..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-205 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-405" />
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

          {/* Hourly Rate */}
          <div className="space-y-2">
            <span className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Hourly Rate ($ / Hr)</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minRate}
                onChange={(e) => handleRateChange("minRate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs focus:outline-none text-gray-900 dark:text-white"
              />
              <span className="text-gray-400 text-xxs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxRate}
                onChange={(e) => handleRateChange("maxRate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs focus:outline-none text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Skills checklist */}
          <div className="space-y-2.5">
            <span className="text-xxs font-bold text-gray-405 uppercase tracking-wider block">Programmer Skills</span>
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
              <div className="h-56 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-56 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
          ) : freelancers.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl space-y-3">
              <p className="text-sm text-gray-455">No certified freelancers match your active filter specifications.</p>
              <button onClick={clearFilters} className="text-xs text-primary font-bold hover:underline">
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {freelancers.map((free) => (
                <motion.div
                  key={free.id}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium flex flex-col justify-between hover:border-primary/25 transition-all"
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex gap-3">
                      <img 
                        src={free.avatar} 
                        alt={free.name} 
                        className="w-12 h-12 rounded-xl object-cover border border-gray-150 dark:border-gray-800"
                      />
                      <div>
                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-tight">
                          {free.name}
                        </h3>
                        <p className="text-[10px] text-primary dark:text-primary-light font-bold mt-0.5">{free.title}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                          <Star className="w-3 h-3 text-amber-500 fill-current" />
                          <span className="font-bold text-gray-700 dark:text-gray-200">{free.rating}</span>
                          <span>({free.reviewsCount || 0} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xxs text-gray-550 dark:text-gray-400 line-clamp-3 leading-relaxed">
                      {free.bio}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {free.skills.slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="text-[9px] bg-gray-50 dark:bg-gray-950 text-gray-550 border border-gray-100 dark:border-gray-800 px-2 py-0.5 rounded font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Hourly Rate</span>
                      <span className="text-xs font-black text-gray-900 dark:text-white flex items-center">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500 mr-0.5" />
                        {free.hourlyRate} / hr
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveProfile(free)}
                        className="px-3 py-1.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-xxs uppercase tracking-wider"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => handleInvite(free.name)}
                        className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xxs uppercase tracking-wider shadow-sm shadow-primary/10"
                      >
                        Hire/Invite
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>

      </div>

      {/* Profile Detail Drawer/Modal */}
      <AnimatePresence>
        {activeProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProfile(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-y-4 md:inset-y-12 right-0 md:right-4 max-w-xl w-full bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Profile header with banner style */}
              <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-950 to-emerald-950 text-white shrink-0 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                
                <button
                  onClick={() => setActiveProfile(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 text-white hover:bg-black/60 rounded-xl transition-all border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex gap-4 items-center">
                  <img
                    src={activeProfile.avatar}
                    alt={activeProfile.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                  />
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight">{activeProfile.name}</h2>
                    <p className="text-xxs text-primary-light font-bold uppercase tracking-wider">{activeProfile.title}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-300 mt-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="font-bold">{activeProfile.rating}</span>
                      <span>({activeProfile.reviewsCount || 0} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-gray-655 dark:text-gray-300">
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" /> Professional Bio
                  </h4>
                  <p className="leading-relaxed whitespace-pre-line text-xxs text-gray-500 dark:text-gray-400">
                    {activeProfile.bio}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary" /> Hourly Rate & Rate Matrix
                  </h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-850 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block">Base Rate</span>
                      <span className="font-bold text-gray-905 dark:text-white text-xs">${activeProfile.hourlyRate} / hour</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block">Wallet Status</span>
                      <span className="font-semibold text-emerald-500 text-xxs">Escrow Audited</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" /> Key Qualifications & Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProfile.skills.map((skill, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-primary-50/15 border border-primary/20 text-primary dark:text-primary-light rounded-xl font-bold text-xxs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {activeProfile.portfolio && activeProfile.portfolio.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px]">
                      Featured Projects Portfolio
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeProfile.portfolio.map((port) => (
                        <div key={port.id} className="border border-gray-100 dark:border-gray-850 rounded-xl overflow-hidden bg-gray-50/30 dark:bg-gray-950/20">
                          <img src={port.image} alt={port.title} className="h-28 w-full object-cover" />
                          <div className="p-3 space-y-1">
                            <h5 className="font-bold text-xxs text-gray-955 dark:text-white line-clamp-1">{port.title}</h5>
                            <p className="text-[9px] text-gray-400 line-clamp-2 leading-relaxed">{port.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-150 dark:border-gray-850 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setActiveProfile(null)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xxs font-bold uppercase tracking-wider text-gray-500"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => {
                    const name = activeProfile.name;
                    setActiveProfile(null);
                    handleInvite(name);
                  }}
                  className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xxs uppercase tracking-wider"
                >
                  Hire {activeProfile.name.split(" ")[0]}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
