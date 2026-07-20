import React, { useState } from "react";
import { Outlet, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { Breadcrumbs } from "../components/ui/Breadcrumbs";
import {
  Sparkles,
  LayoutDashboard,
  Search,
  FileSpreadsheet,
  Wallet,
  MessageSquare,
  Settings,
  Bell,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const FreelancerLayout = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Route protection
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "freelancer") {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/freelancer/dashboard", icon: LayoutDashboard },
    { label: "Browse Projects", path: "/freelancer/browse", icon: Search },
    { label: "Contracts", path: "/freelancer/contracts", icon: FileSpreadsheet },
    { label: "Wallet & Payments", path: "/freelancer/wallet", icon: Wallet },
    { label: "Messages", path: "/freelancer/chat", icon: MessageSquare },
    { label: "Profile & Settings", path: "/freelancer/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex transition-colors duration-200">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-150 dark:border-gray-850 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-150 dark:border-gray-850 flex items-center justify-between">
          <Link to="/freelancer/dashboard" className="flex items-center gap-2">
            <div className="bg-accent p-2 rounded-xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-950 dark:text-white">
              Gig<span className="text-accent">Sphere</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-150 dark:border-gray-850">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Sidebar for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.15 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 p-6 flex flex-col h-full z-50 border-r border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-150 dark:border-gray-800">
                <Link to="/freelancer/dashboard" className="flex items-center gap-2">
                  <div className="bg-accent p-2 rounded-xl text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold text-gray-950 dark:text-white">GigSphere</span>
                </Link>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-accent text-white"
                          : "text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 mt-auto"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main content body container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-30 border-b border-gray-150 dark:border-gray-850 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-gray-900 dark:text-white md:block hidden">
              Freelancer Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-xl transition-all"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-xl relative transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-premium z-20 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-850 dark:text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-primary font-bold hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-gray-450 dark:text-gray-500 text-center py-6">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                setIsNotifOpen(false);
                              }}
                              className={`px-4 py-3 border-b border-gray-50 dark:border-gray-850 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-850 cursor-pointer transition-colors ${
                                !n.read ? "bg-primary-50/20 dark:bg-primary-950/10" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-505 dark:text-gray-400 leading-tight">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-850 rounded-xl transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover border border-gray-150 dark:border-gray-805"
                />
                <div className="hidden sm:block text-left pr-2">
                  <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-medium">Professional Freelancer</p>
                </div>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-52 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-850 rounded-2xl shadow-premium z-20 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.email}</p>
                      </div>

                      <Link
                        to="/freelancer/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-850"
                      >
                        <User className="w-4 h-4" />
                        My Profile
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

          </div>
        </header>

        {/* Viewport content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

    </div>
  );
};
