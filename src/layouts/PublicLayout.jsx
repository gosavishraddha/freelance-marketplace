import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  Send,
  CheckCircle,
  HelpCircle,
  LogOut,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PublicLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Browse Projects", path: "/browse-projects" },
    { label: "Browse Freelancers", path: "/browse-freelancers" },
    { label: "Categories", path: "/categories" },
    { label: "About", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Referral", path: "/referral" },
    { label: "Contact", path: "/contact" }
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
      
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/75 dark:bg-gray-950/75 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-xl text-white shadow-md shadow-primary/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-950 dark:text-white">
              Gig<span className="text-primary">Sphere</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "text-primary dark:text-primary-light"
                      : "text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-xl transition-all"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-xl transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-gray-250 dark:border-gray-800"
                />
                <span className="hidden sm:block text-xs font-bold text-gray-850 dark:text-white pr-1">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-52 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-premium z-20 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user.name}</p>
                        <p className="text-[10px] text-gray-450 mt-1 uppercase tracking-wider">{user.role} workspace</p>
                      </div>

                      <Link
                        to={`/${user.role}/dashboard`}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-850"
                      >
                        <User className="w-4 h-4 text-primary" />
                        Go to Dashboard
                      </Link>

                      <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-bold text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light transition-all uppercase tracking-wider"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider shadow-md shadow-primary/20"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-500 dark:text-gray-450 hover:bg-gray-105 dark:hover:bg-gray-850 rounded-xl lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 p-6 z-50 flex flex-col justify-between border-l border-gray-100 dark:border-gray-800 shadow-2xl lg:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-850 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-extrabold text-gray-950 dark:text-white">GigSphere</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-450"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-3">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          isActive
                            ? "bg-primary-50 text-primary dark:bg-primary-950/20 dark:text-primary-light"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-850">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-950 rounded-2xl mb-4">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xxs text-gray-450">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to={`/${user.role}/dashboard`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center block px-4 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-center block px-4 py-3 bg-red-50 text-red-500 dark:bg-red-950/15 rounded-xl font-bold text-xs uppercase"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center block px-4 py-3 bg-gray-55 dark:bg-gray-850 text-gray-800 dark:text-gray-200 rounded-xl font-bold text-xs uppercase"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center block px-4 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Public Pages Viewport */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200/50 dark:border-gray-900/60 pt-16 pb-8 px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Panel */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-xl text-white shadow-md w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Gig<span className="text-primary">Sphere</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              GigSphere is a next-generation freelance project marketplace. Connecting global enterprise developers with forward-thinking businesses using secure escrow payment controls, microservices, and robust feedback systems.
            </p>
            <div className="flex items-center gap-3">
              {[
                { svg: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, url: "https://linkedin.com" },
                { svg: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>, url: "https://facebook.com" },
                { svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, url: "https://instagram.com" },
                { svg: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, url: "https://twitter.com" },
                { svg: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>, url: "https://github.com" },
                { svg: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163c-.272-1.024-1.078-1.83-2.102-2.102C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.396.561c-1.024.272-1.83 1.078-2.102 2.102C0 8.04 0 12 0 12s0 3.96.502 5.837c.272 1.024 1.078 1.83 2.102 2.102C4.482 20.5 12 20.5 12 20.5s7.518 0 9.396-.561c1.024-.272 1.83-1.078 2.102-2.102C24 15.96 24 12 24 12s0-3.96-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, url: "https://youtube.com" }
              ].map((social, index) => {
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-gray-150 dark:border-gray-800 rounded-xl text-gray-400 hover:text-primary dark:hover:text-primary-light hover:border-primary/45 transition-colors"
                  >
                    {social.svg}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Services</h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Link to="/browse-projects" className="hover:text-primary">Browse Projects</Link>
              <Link to="/browse-freelancers" className="hover:text-primary">Find Talent</Link>
              <Link to="/categories" className="hover:text-primary">Project Categories</Link>
              <Link to="/referral" className="hover:text-primary">Referral Program</Link>
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Categories</h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Link to="/categories" className="hover:text-primary">Web Development</Link>
              <Link to="/categories" className="hover:text-primary">Mobile Apps</Link>
              <Link to="/categories" className="hover:text-primary">UI/UX Graphic Design</Link>
              <Link to="/categories" className="hover:text-primary">AI & ML Modeling</Link>
            </div>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Help Center</h4>
            <div className="flex flex-col gap-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <Link to="/contact" className="hover:text-primary">Get Support</Link>
              <Link to="/about" className="hover:text-primary">Company Info</Link>
              <Link to="/blog" className="hover:text-primary">Resources & Guides</Link>
              <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-150 dark:border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-450 dark:text-gray-500 uppercase tracking-widest font-semibold">
            © {new Date().getFullYear()} GigSphere Inc. — All Rights Reserved. Secure Escrow Protected.
          </p>
          <div className="flex gap-4 text-xxs font-bold uppercase tracking-wider text-gray-450">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};
