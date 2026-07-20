import React from "react";
import { Link } from "react-router-dom";
import { 
  Laptop, 
  Smartphone, 
  Palette, 
  Layers, 
  Cpu, 
  Database, 
  TrendingUp, 
  Cloud, 
  ShieldCheck, 
  GitBranch, 
  Video, 
  Edit3,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export const CategoriesPage = () => {
  const categories = [
    { name: "Web Development", icon: Laptop, projects: 142, sub: ["React.js", "Vue.js", "HTML5", "Vite", "Node.js"], color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { name: "Mobile Development", icon: Smartphone, projects: 89, sub: ["Flutter", "React Native", "Swift", "Kotlin", "Dart"], color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { name: "UI/UX Design", icon: Palette, projects: 64, sub: ["Figma", "Adobe XD", "Wireframing", "Prototyping"], color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
    { name: "Graphic Design", icon: Layers, projects: 52, sub: ["Photoshop", "Illustrator", "Branding", "Vector Art"], color: "text-pink-500 bg-pink-50 dark:bg-pink-950/20" },
    { name: "AI & Machine Learning", icon: Cpu, projects: 76, sub: ["PyTorch", "TensorFlow", "LLM APIs", "Model Training"], color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
    { name: "Data Science", icon: Database, projects: 45, sub: ["Python", "Pandas", "SQL", "Tableau", "R Studio"], color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20" },
    { name: "Digital Marketing", icon: TrendingUp, projects: 83, sub: ["SEO Strategy", "Google Ads", "Content Analytics"], color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { name: "Cloud Computing", icon: Cloud, projects: 59, sub: ["AWS Cloud", "Google Cloud", "Azure", "Serverless"], color: "text-sky-500 bg-sky-50 dark:bg-sky-950/20" },
    { name: "Cyber Security", icon: ShieldCheck, projects: 31, sub: ["Penetration Testing", "Security Auditing", "OAuth2"], color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20" },
    { name: "DevOps", icon: GitBranch, projects: 48, sub: ["Docker", "Kubernetes", "CI/CD Actions", "Terraform"], color: "text-teal-500 bg-teal-50 dark:bg-teal-950/20" },
    { name: "Video Editing", icon: Video, projects: 37, sub: ["After Effects", "Premiere Pro", "Color Grading"], color: "text-red-500 bg-red-50 dark:bg-red-950/20" },
    { name: "Content Writing", icon: Edit3, projects: 94, sub: ["SEO Copywriting", "Technical Writing", "Blog Strategy"], color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary dark:text-primary-light font-bold rounded-full text-xxs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Marketplace Domains
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Browse Project <span className="text-primary">Categories</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-455 leading-relaxed">
          Find contract projects matching your specialized skillset or hire programmers matching your technical specifications.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 rounded-2xl shadow-premium flex flex-col justify-between hover:border-primary/25 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold rounded-full">
                    {cat.projects} jobs
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {cat.sub.map((s, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-[9px] bg-gray-50 dark:bg-gray-950 text-gray-500 border border-gray-100 dark:border-gray-800 px-2 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to={`/browse-projects?category=${encodeURIComponent(cat.name)}`}
                className="text-xxs font-bold text-primary dark:text-primary-light flex items-center gap-1 group-hover:underline self-start uppercase tracking-wider"
              >
                Browse Projects
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
