import React, { useState } from "react";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Filter, 
  ChevronRight,
  Sparkles,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState(null);

  const categories = ["All", "Engineering", "Hiring", "Technology", "Career", "Business"];

  const articles = [
    {
      id: "blog-1",
      title: "Hiring the Right Freelancer: A Comprehensive Guide",
      category: "Hiring",
      author: "Emily Johnson",
      authorTitle: "Talent Acquisition Director",
      date: "2026-07-10",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500",
      summary: "Learn how to source top developer talent, evaluate technical assessment projects, write effective requirements specifications, and build long-term contract relationships.",
      content: `Sourcing the right developer requires a strategic methodology. On platforms like GigSphere, clients who provide highly detailed project scopes receive bids that are significantly more accurate and competitive.

To hire successfully:
1. Define Technical Boundaries: Avoid vague listings. Specify precisely whether you need database tuning, UI layout adjustments, or API integration.
2. Review Past Source Code: Inspect their linked portfolio, GitHub repositories, and ratings. Look for clean variable names, documentation comments, and project organization.
3. Start with a Paid Micro-Milestone: If the project is large, fund a small $200-500 test phase (e.g. build one API endpoint or one Figma screen) to assess speed, communication, and code quality.
4. Utilize Escrow Controls: Keep milestones clear and payments secure. This ensures the freelancer knows funds are backed, and the client retains approval power.`
    },
    {
      id: "blog-2",
      title: "React Development Trends: What's Next in 2026?",
      category: "Engineering",
      author: "Sarah Chen",
      authorTitle: "Senior Frontend Engineer",
      date: "2026-07-12",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
      summary: "Inspecting the React ecosystem in 2026, server components adoption, streaming rendering architectures, custom hooks, and Tailwind CSS component systems.",
      content: `React continues to dictate frontend development paradigms in 2026. The shift from client-side single-page apps (SPAs) to hybrid server-rendered architectures is now the standard for major enterprise portals.

Key trends to master:
1. Server Components (RSC): Moving the heavy lifters back to the server decreases bundle sizes significantly, resulting in lightning-fast initial page loads.
2. Streaming and Suspense: Serve page skeletons instantly and stream in heavy database content or interactive maps as they resolve.
3. Tailwind CSS & UI Libraries: Modern frameworks rely on utility styling or headless libraries (like Radix UI and Framer Motion) to deliver fluid, highly customized design systems.
4. Advanced State Architecture: Using context API for global flags (like Theme and Auth) while leveraging react-hook-form for component inputs prevents unnecessary layout refits and keeps UI interactions smooth.`
    },
    {
      id: "blog-3",
      title: "AI in Freelancing: Adapting to the Intelligence Era",
      category: "Technology",
      author: "Alan Wright",
      authorTitle: "AI Integration Lead",
      date: "2026-07-15",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500",
      summary: "How artificial intelligence is reshaping freelance software consulting. Learn to leverage LLM code assistants and automate workflows to ship products faster.",
      content: `Artificial intelligence is not replacing developers; it is empowering those who know how to wield it. In freelance development, speed and accuracy are crucial for earning repeat clients.

How to incorporate AI:
1. Rapid Prototyping: Use code assistants to generate boilerplate code, database schemas, and unit test suites, reducing setup time by up to 50%.
2. Explaining Complex Code bases: When hired to fix a legacy Spring Boot or React app, use code assistants to map relationships and locate potential bottlenecks.
3. Interactive Pair Programming: Bounce system design proposals off models to discover edge cases, security threats, or scaling issues.
4. Refactoring and Optimization: Ask models to review your code for styling inconsistencies, type safety, and memory leaks before pushing your final deliverables.`
    },
    {
      id: "blog-4",
      title: "Portfolio Building: Showcasing Your Developer Brand",
      category: "Career",
      author: "Marcus Aurelius",
      authorTitle: "Enterprise Systems Architect",
      date: "2026-07-16",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500",
      summary: "Step-by-step instructions on designing a high-conversion engineer portfolio, structuring project case studies, and linking live, interactive demonstrations.",
      content: `Your portfolio is your professional handshake. Standard resume bullet points are forgettable; interactive, deployed systems are undeniable.

How to design a high-conversion portfolio:
1. Lead with Live Demos: Always provide links to working, interactive web applications. Clients rarely read code files; they play with working interfaces.
2. Write Case Studies: For each portfolio item, detail the Client Challenge, your Technical Solution, and the measurable Business Outcome (e.g. 'Reduced load times by 40% using Next.js').
3. Focus on Deep Architecture: Display diagrams showing your backend microservices, database schemas, or API gateways. This shows you can design systems, not just components.
4. Keep it Premium: Use curated typography, modern glassmorphic overlays, and subtle hover animations to make your portfolio look and feel state-of-the-art.`
    },
    {
      id: "blog-5",
      title: "Winning More Projects: The Art of Freelance Bidding",
      category: "Business",
      author: "Sarah Chen",
      authorTitle: "Freelance Consultant",
      date: "2026-07-18",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500",
      summary: "Optimize your pitch proposal. Discover how to detail your technical qualifications, set milestone boundaries, specify escrow payments, and address client problems.",
      content: `Freelance bidding is a sales funnel, and the proposal is the hook. Copy-pasted generic proposals are immediately archived by clients.

To write winning bids:
1. Address the Specs Instantly: In your first two lines, reference the client's specific problem (e.g. 'I noticed you need to build a Spring Boot backend for an e-commerce cart. I recently designed an active cart system handling 1,500 daily requests...').
2. Explain the How: Outline your step-by-step implementation plan. This builds trust and demonstrates your professional approach.
3. Define Milestones: Break your bid into logical segments with separate deliveries and payments. This reassures clients that they pay only for proven progress.
4. Highlight Relevant Credentials: Link to the 1-2 portfolio pieces that are closest to the client's requested stack. Quality of selection beats quantity of links every time.`
    },
    {
      id: "blog-6",
      title: "Spring Boot Best Practices: Building Resilient APIs",
      category: "Engineering",
      author: "Marcus Aurelius",
      authorTitle: "Java Backend Engineer",
      date: "2026-07-19",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
      summary: "Tips for launching production Spring Boot applications: database pooling controls, JWT authorization configurations, REST API response structures, and unit tests.",
      content: `Building a Spring Boot application is simple, but configuring it for production requires meticulous optimization. Enterprise applications require security, speed, and strict logging.

Production Spring Boot best practices:
1. Database Connection Pooling: Always configure HikariCP connections in your application properties to prevent pool starvation under heavy API requests.
2. Strict JWT Flow: Store keys securely, implement token expiry controls, and validate scopes carefully inside your Spring Security filters.
3. Standardized Error Handling: Use @ControllerAdvice to intercept exceptions globally and return standard, clean JSON error responses rather than exposing stack traces.
4. Comprehensive Testing: Utilize @SpringBootTest and @MockBean to build solid integration test suites that cover database updates and security checkpoints.`
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10 relative">
      
      {/* Blog Hub Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary dark:text-primary-light font-bold rounded-full text-xxs uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Guides & Insights
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          The GigSphere <span className="text-primary">Blog</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-450 leading-relaxed">
          Stay informed on hiring workflows, enterprise engineering practices, portfolio curation, and modern tech stack trends.
        </p>
      </div>

      {/* Search and Category Filters panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-155 dark:border-gray-850 shadow-premium">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Categories checklist */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xxs px-3 py-1.5 rounded-lg border transition-all font-bold ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:hover:bg-gray-850"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl">
          <p className="text-sm text-gray-500">No blog posts found matching your current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <motion.div
              key={article.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl overflow-hidden shadow-premium flex flex-col justify-between group transition-all"
            >
              <div>
                {/* Cover Image */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-primary rounded-lg shadow-sm uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-gray-450 dark:text-gray-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-950 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Author & Read More */}
              <div className="p-5 border-t border-gray-100 dark:border-gray-850/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-[10px]">
                    {article.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-900 dark:text-white leading-none">{article.author}</p>
                    <p className="text-[8px] text-gray-400 font-semibold">{article.authorTitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveArticle(article)}
                  className="text-xs text-primary dark:text-primary-light font-extrabold flex items-center gap-1 hover:underline shrink-0"
                >
                  Read More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Interactive Article Drawer/Reader modal */}
      <AnimatePresence>
        {activeArticle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-y-4 md:inset-y-12 right-0 md:right-4 max-w-2xl w-full bg-white dark:bg-gray-900 rounded-2xl md:rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Image Header with close */}
              <div className="h-64 relative shrink-0">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white hover:bg-black/80 rounded-xl transition-all border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="px-2 py-0.5 bg-primary text-white font-bold rounded-lg text-[9px] uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                    {activeArticle.title}
                  </h2>
                </div>
              </div>

              {/* Author & reading stats */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-150 dark:border-gray-850 flex items-center justify-between gap-4 text-xs font-bold text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-[11px]">
                    {activeArticle.author.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white leading-none text-xxs">{activeArticle.author}</p>
                    <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{activeArticle.authorTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px]">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeArticle.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}</span>
                </div>
              </div>

              {/* Markdown Content scroll */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-gray-650 dark:text-gray-300">
                {activeArticle.content.split("\n\n").map((para, idx) => (
                  <p key={idx} className="whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="p-4 border-t border-gray-150 dark:border-gray-850 flex justify-end gap-3 shrink-0">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xxs font-bold uppercase tracking-wider text-gray-500"
                >
                  Close Reader
                </button>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    window.scrollTo(0, 0);
                  }}
                  className="px-4 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xxs uppercase tracking-wider"
                >
                  Share Article
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
