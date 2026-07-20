import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
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
  Star, 
  Users, 
  DollarSign, 
  Briefcase, 
  Award,
  ChevronLeft,
  ChevronRight,
  Shield,
  MessageSquare,
  Zap,
  TrendingDown,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Animated Counter that runs when component mounts
const AnimatedCounter = ({ targetValue, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetValue;
    if (start === end) return;

    const duration = 2000;
    const increment = Math.ceil(end / (duration / 30));
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        start = end;
      }
      setCount(start);
    }, 30);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Testimonials Carousel State
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // How It Works Tabs
  const [activeWorkflowTab, setActiveWorkflowTab] = useState("client");

  // Popular queries
  const popularSearches = ["React", "Spring Boot", "Flutter", "Figma", "Tailwind"];

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    navigate(`/browse-projects?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(searchCategory)}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  const categories = [
    { name: "Web Development", icon: Laptop, count: 142, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { name: "Mobile Development", icon: Smartphone, count: 89, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { name: "UI/UX Design", icon: Palette, count: 64, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
    { name: "Graphic Design", icon: Layers, count: 52, color: "text-pink-500 bg-pink-50 dark:bg-pink-950/20" },
    { name: "AI & Machine Learning", icon: Cpu, count: 76, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" },
    { name: "Data Science", icon: Database, count: 45, color: "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20" },
    { name: "Digital Marketing", icon: TrendingUp, count: 83, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { name: "Cloud Computing", icon: Cloud, count: 59, color: "text-sky-500 bg-sky-50 dark:bg-sky-950/20" },
  ];

  const featuredFreelancers = [
    {
      name: "Sarah Chen",
      title: "Senior Full Stack Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
      hourlyRate: 65,
      rating: 4.8,
      reviews: 24,
      completed: 36,
      availability: "Available Now"
    },
    {
      name: "Marcus Aurelius",
      title: "Java Spring Boot Specialist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
      hourlyRate: 80,
      rating: 5.0,
      reviews: 32,
      completed: 45,
      availability: "Part-time"
    },
    {
      name: "Emily Watson",
      title: "Lead UI/UX Figma Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      skills: ["Figma", "Design Systems", "Prototyping", "UI/UX"],
      hourlyRate: 55,
      rating: 4.9,
      reviews: 18,
      completed: 22,
      availability: "Available Now"
    }
  ];

  const featuredProjects = [
    {
      title: "Enterprise Dashboard Redesign in Tailwind",
      budget: 4500,
      duration: "21 Days",
      skills: ["React", "Tailwind CSS", "Framer Motion"],
      bids: 2,
      clientRating: 4.9,
      status: "open"
    },
    {
      title: "Java Spring Boot REST API for E-Commerce",
      budget: 6200,
      duration: "30 Days",
      skills: ["Java", "Spring Boot", "PostgreSQL"],
      bids: 1,
      clientRating: 4.9,
      status: "open"
    },
    {
      title: "Figma to Responsive Flutter Mobile Layouts",
      budget: 3200,
      duration: "15 Days",
      skills: ["Flutter", "Dart", "Figma"],
      bids: 3,
      clientRating: 5.0,
      status: "completed"
    }
  ];

  const platformStats = [
    { label: "Total Clients", target: 4200, prefix: "", suffix: "+" },
    { label: "Total Freelancers", target: 25000, prefix: "", suffix: "+" },
    { label: "Projects Posted", target: 12500, prefix: "", suffix: "" },
    { label: "Projects Completed", target: 11800, prefix: "", suffix: "" },
    { label: "Countries Served", target: 125, prefix: "", suffix: "" },
    { label: "Total Earnings", target: 18450000, prefix: "$", suffix: "" }
  ];

  const clientWorkflow = [
    { step: 1, title: "Register", desc: "Create your workspace client profile under secondary security checkpoints." },
    { step: 2, title: "Create Profile", desc: "Detail your company domain, development projects, and budget sizes." },
    { step: 3, title: "Post Project", desc: "Fill in project specifications, technical skill vectors, and deadline scopes." },
    { step: 4, title: "Receive Bids", desc: "Get bid proposals from screened programmers containing price and duration bids." },
    { step: 5, title: "Compare Freelancers", desc: "Inspect freelancer ratings, completed projects, portfolios, and coding stacks." },
    { step: 6, title: "Hire Freelancer", desc: "Accept proposals to fund the contract escrow and kick off project modules." },
    { step: 7, title: "Track Progress", desc: "Audit weekly activity timelines, exchange message rooms files, and inspect builds." },
    { step: 8, title: "Approve Work", desc: "Assess completed milestone deliverables and inspect code quality." },
    { step: 9, title: "Payment Complete", desc: "Release escrow funds to the freelancer's wallet balance securely." },
    { step: 10, title: "Rate Freelancer", desc: "Publish rating reviews to build verified talent directory profiles." }
  ];

  const freelancerWorkflow = [
    { step: 1, title: "Register", desc: "Join as a freelancer and select your core coding qualifications." },
    { step: 2, title: "Complete Profile", desc: "Link GitHub repositories, list education certifications, and set hourly rates." },
    { step: 3, title: "Browse Projects", desc: "Filter open project listings by skills, category, and budget brackets." },
    { step: 4, title: "Submit Proposal", desc: "Pitch your technical approach, define milestone delivery dates, and post bids." },
    { step: 5, title: "Get Hired", desc: "Secure the contract with funded escrow protection backing your project tasks." },
    { step: 6, title: "Complete Work", desc: "Deliver clean, documented code and files for client testing reviews." },
    { step: 7, title: "Receive Payment", desc: "Withdraw earnings from your secure wallet balance post release approvals." },
    { step: 8, title: "Build Reputation", desc: "Collect client 5-star ratings to qualify for premium project brackets." }
  ];

  const successStories = [
    {
      client: "Apex Tech Solutions",
      freelancer: "Sarah Chen",
      project: "Analytics Portal",
      budget: 4500,
      time: "18 Days",
      outcome: "Improved portal speed by 45%",
      testimonial: "Sarah delivered clean React code that matched our layout specifications exactly. The escrow milestones made the transaction simple and stress-free."
    },
    {
      client: "Innovate Finance",
      freelancer: "Marcus Aurelius",
      project: "Spring API gateway",
      budget: 8000,
      time: "25 Days",
      outcome: "Processed 10k transactions safely",
      testimonial: "Marcus's backend expertise was critical for our banking API integration. Highly recommended for Spring Boot development."
    }
  ];

  const testimonials = [
    {
      name: "David Sterling",
      designation: "CTO, CloudFront Labs",
      rating: 5,
      review: "GigSphere transformed how we hire remote developers. The milestone escrow framework provides unmatched transaction security, and the developer pool is extremely talented."
    },
    {
      name: "Sophia Martinez",
      designation: "Product Director, HypeStudio",
      rating: 5,
      review: "The visual quality of candidate portfolios, combined with clear activity tracking logs and direct chat channels, makes project execution seamless. Outstanding platform!"
    },
    {
      name: "Alex Rivera",
      designation: "Product Director, Apex Tech Solutions",
      rating: 5,
      review: "I've hired three developers on GigSphere for React and Spring Boot microservices. Every contract was completed on budget under milestone checkpoints. Zero friction."
    }
  ];

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section with Animated Backdrop Glows */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-gray-950 to-emerald-950 text-white pt-20 pb-24 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xxs font-bold text-emerald-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              Elite Freelance Developer Ecosystem
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
              Deploy Vetted Programmers. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary-light">Secure Escrow Protection.</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-lg leading-relaxed">
              Connect with developers specializing in React, Spring Boot, and cloud architectures. Manage deliverables through milestone agreements, and exchange secure code files.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/browse-freelancers"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all text-xs tracking-wider uppercase shadow-md shadow-primary/20"
              >
                Hire Freelancer
              </Link>
              <Link
                to="/browse-projects"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold rounded-xl transition-all text-xs tracking-wider uppercase"
              >
                Find Work
              </Link>
            </div>
          </div>

          {/* Hero Right Card Graphics */}
          <div className="relative h-80 lg:h-96 rounded-3xl bg-white/5 border border-white/10 p-6 md:p-8 flex flex-col justify-between backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="font-extrabold text-xs tracking-wider uppercase">Vetted Talent Index</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                99.8% Cleared
              </span>
            </div>

            <div className="space-y-4 my-6">
              {[
                { name: "React Frontend Engineer", count: "142 Active Jobs", value: 92 },
                { name: "Java Spring Boot Specialist", count: "89 Active Jobs", value: 87 },
                { name: "UI/UX Figma Architect", count: "64 Active Jobs", value: 95 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>{item.name}</span>
                    <span className="text-gray-400">{item.count}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.5, delay: idx * 0.2 }}
                      className="bg-primary h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xxs text-gray-400 font-bold">
              <span>Platform security: Vouch protection active</span>
              <Shield className="w-4 h-4 text-primary" />
            </div>
          </div>

        </div>
      </section>

      {/* Global Search Segment */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <form onSubmit={handleGlobalSearch} className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4 transition-colors">
          <div className="flex flex-col lg:flex-row gap-3">
            
            {/* Search query */}
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, freelancer profiles, coding languages..."
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-205 dark:border-gray-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-405" />
            </div>

            {/* Categories */}
            <div className="w-full lg:w-60">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white font-bold"
              >
                <option value="All">All Categories</option>
                <option value="Development">Development</option>
                <option value="Design & Mobile">Design & Mobile</option>
                <option value="Writing & Content">Writing & Content</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-wider shadow-md shadow-primary/20 shrink-0"
            >
              Search Listings
            </button>
          </div>

          {/* Popular searches tags */}
          <div className="flex flex-wrap items-center gap-2 text-xxs font-bold text-gray-400 uppercase tracking-wide">
            <span>Popular Searches:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  navigate(`/browse-projects?search=${encodeURIComponent(term)}`);
                }}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* Platform Statistics counter grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {platformStats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium text-center space-y-1">
              <span className="text-[9px] font-bold text-gray-405 uppercase tracking-wider block">{stat.label}</span>
              <span className="text-base font-black text-gray-950 dark:text-white block">
                <AnimatedCounter targetValue={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Browse Categories segment */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Browse Categories</h2>
            <p className="text-xs text-gray-400">Discover project listings grouped by development domains</p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-primary dark:text-primary-light hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/browse-projects?category=${encodeURIComponent(cat.name)}`)}
                className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-5 rounded-2xl shadow-premium flex items-center justify-between hover:border-primary/25 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-gray-400">{cat.count} listings</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Projects cards */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Featured Open Projects</h2>
            <p className="text-xs text-gray-400">Review specifications, deadlines, and place competitive bids</p>
          </div>
          <Link
            to="/browse-projects"
            className="text-xs font-bold text-primary dark:text-primary-light hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            Browse Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((proj, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium flex flex-col justify-between hover:border-primary/25 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
                    {proj.status}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold flex items-center gap-1">
                    Client rating: {proj.clientRating} <Star className="w-3 h-3 text-amber-500 fill-current" />
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                    {proj.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {proj.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[9px] bg-gray-50 dark:bg-gray-950 text-gray-500 border border-gray-100 dark:border-gray-800 px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
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

                <Link
                  to="/browse-projects"
                  className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xxs flex items-center gap-1 uppercase tracking-wider transition-all"
                >
                  Apply <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Freelancers cards */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Featured Engineers</h2>
            <p className="text-xs text-gray-400">Discover elite programmers with complete project portfolios</p>
          </div>
          <Link
            to="/browse-freelancers"
            className="text-xs font-bold text-primary dark:text-primary-light hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            Browse Freelancers <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredFreelancers.map((free, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium flex flex-col justify-between hover:border-primary/25 transition-all"
            >
              <div className="space-y-4">
                <div className="flex gap-3 items-center">
                  <img src={free.avatar} alt={free.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100 dark:border-gray-800" />
                  <div>
                    <h3 className="font-extrabold text-xs text-gray-900 dark:text-white leading-tight">{free.name}</h3>
                    <p className="text-[9.5px] text-primary dark:text-primary-light font-bold mt-0.5">{free.title}</p>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400 mt-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                      <span className="font-bold text-gray-850 dark:text-white">{free.rating}</span>
                      <span>({free.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {free.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[9px] bg-gray-50 dark:bg-gray-950 text-gray-500 border border-gray-100 dark:border-gray-800 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-gray-405 uppercase tracking-wider block">Hourly Rate</span>
                  <span className="text-xs font-black text-gray-900 dark:text-white flex items-center">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500 mr-0.5" />
                    {free.hourlyRate} / hr
                  </span>
                </div>

                <Link
                  to="/browse-freelancers"
                  className="px-3.5 py-1.5 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-xxs uppercase tracking-wider transition-all"
                >
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works segment (Client & Freelancer workflows side-by-side tabs) */}
      <section className="bg-gray-100 dark:bg-gray-900/60 py-16 px-6 border-y border-gray-200/50 dark:border-gray-900/60 transition-colors">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">How GigSphere Works</h2>
            <p className="text-xs text-gray-400 leading-normal">
              GigSphere regulates the recruitment flow using escrow protection, milestone definitions, and rating feedbacks.
            </p>

            <div className="inline-flex p-1.5 bg-white dark:bg-gray-950 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm gap-1.5">
              <button
                onClick={() => setActiveWorkflowTab("client")}
                className={`px-5 py-2 rounded-xl text-xxs font-bold uppercase tracking-wider transition-all ${
                  activeWorkflowTab === "client"
                    ? "bg-primary text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Client Workflow
              </button>
              <button
                onClick={() => setActiveWorkflowTab("freelancer")}
                className={`px-5 py-2 rounded-xl text-xxs font-bold uppercase tracking-wider transition-all ${
                  activeWorkflowTab === "freelancer"
                    ? "bg-primary text-white"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Freelancer Workflow
              </button>
            </div>
          </div>

          {/* Workflow Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {activeWorkflowTab === "client" ? (
              clientWorkflow.map((step) => (
                <div key={step.step} className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm space-y-3 relative overflow-hidden group">
                  <span className="absolute -top-3 -right-3 text-5xl font-black text-gray-100 dark:text-gray-900 group-hover:scale-110 transition-transform">
                    {step.step}
                  </span>
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md">Step {step.step}</span>
                    <h4 className="font-extrabold text-xs text-gray-950 dark:text-white pt-1">{step.title}</h4>
                    <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-normal">{step.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              freelancerWorkflow.map((step) => (
                <div key={step.step} className="bg-white dark:bg-gray-950 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-sm space-y-3 relative overflow-hidden group">
                  <span className="absolute -top-3 -right-3 text-5xl font-black text-gray-100 dark:text-gray-900 group-hover:scale-110 transition-transform">
                    {step.step}
                  </span>
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md">Step {step.step}</span>
                    <h4 className="font-extrabold text-xs text-gray-950 dark:text-white pt-1">{step.title}</h4>
                    <p className="text-[10.5px] text-gray-500 dark:text-gray-400 leading-normal">{step.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* Success Stories Case Studies */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Client Success Stories</h2>
          <p className="text-xs text-gray-450">See how enterprises scale engineering capacity using our contract milestones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {successStories.map((story, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-850 text-xxs font-bold text-gray-500 uppercase tracking-wider">
                <span>Client: <span className="text-gray-900 dark:text-white font-extrabold">{story.client}</span></span>
                <span>Programmer: <span className="text-primary font-extrabold">{story.freelancer}</span></span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-xl">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Budget</span>
                  <span className="text-xs font-extrabold text-emerald-500">${story.budget.toLocaleString()}</span>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-xl">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Duration</span>
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white">{story.time}</span>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-xl col-span-1">
                  <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Outcome</span>
                  <span className="text-[10px] font-bold text-primary leading-none block pt-0.5">{story.outcome}</span>
                </div>
              </div>

              <blockquote className="text-xxs text-gray-500 dark:text-gray-400 italic leading-relaxed pt-2">
                "{story.testimonial}"
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="bg-gray-100 dark:bg-gray-900/60 py-16 px-6 border-y border-gray-200/50 dark:border-gray-900/60 transition-colors">
        <div className="max-w-3xl mx-auto text-center space-y-6 relative">
          
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary dark:text-primary-light font-bold rounded-full text-xxs uppercase tracking-wider">
            Testimonials
          </span>

          <div className="min-h-36 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-center gap-1 text-amber-500">
                  {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 italic font-medium leading-relaxed max-w-2xl mx-auto">
                  "{testimonials[testimonialIndex].review}"
                </p>

                <div>
                  <h4 className="font-extrabold text-xs text-gray-950 dark:text-white leading-none">
                    {testimonials[testimonialIndex].name}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                    {testimonials[testimonialIndex].designation}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={prevTestimonial}
              className="p-2 border border-gray-250 dark:border-gray-800 rounded-xl hover:bg-white dark:hover:bg-gray-900 text-gray-500 hover:text-gray-950 transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 border border-gray-250 dark:border-gray-800 rounded-xl hover:bg-white dark:hover:bg-gray-900 text-gray-500 hover:text-gray-950 transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Newsletter signup form widget */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-emerald-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="max-w-2xl space-y-6 mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xxs font-bold text-emerald-400 uppercase tracking-widest">
              Newsletter
            </span>
            <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
              Get Tech Jobs & Hiring Strategies Directly in Your Inbox
            </h2>
            <p className="text-xxs text-gray-300 max-w-md mx-auto leading-relaxed">
              Subscribe to stay updated on engineering trends, Spring Boot best practices, React development guidelines, and GigSphere updates.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="developer-lead@company.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider shrink-0"
              >
                Subscribe
              </button>
            </form>

            {newsletterSuccess && (
              <p className="text-xxs text-emerald-400 font-bold flex items-center justify-center gap-1.5 animate-pulse pt-2">
                <CheckCircle className="w-4 h-4" /> Subscription successful! We've sent a mock confirmation email.
              </p>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
