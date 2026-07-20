import React from "react";
import { Sparkles, ShieldCheck, Heart, Users, Target, ShieldAlert, Award } from "lucide-react";
import { motion } from "framer-motion";

export const About = () => {
  const values = [
    { title: "Secured Escrow", desc: "Every agreement is backed by our automated contract milestones, guaranteeing payment for freelancers and deliverables for clients.", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { title: "Vetted Engineering", desc: "We host specialized developer networks, ensuring clients hire engineers matching precise skill matrices from React to Spring Boot.", icon: Award, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { title: "Radical Transparency", desc: "Contract metrics, proposal durations, messaging rooms, and wallet transactions are tracked transparently in clean logs.", icon: Target, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { title: "Client Security First", desc: "System directors regulate marketplace interactions, audit payment protocols, and resolve active dispute threads promptly.", icon: ShieldAlert, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/20" }
  ];

  const milestones = [
    { year: "2024", title: "Marketplace Launch", desc: "GigSphere was introduced to connect freelance developers and tech clients securely." },
    { year: "2025", title: "Milestone Escrow Integration", desc: "Added secure automated bank clearing and client feedback ratings mechanisms." },
    { year: "2026", title: "Global Developer Growth", desc: "Surpassed 25,000+ active enterprise programmers across 125 countries." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary dark:text-primary-light font-bold rounded-full text-xxs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Our Mission
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          About <span className="text-primary">GigSphere</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-450 leading-relaxed">
          GigSphere is a next-generation freelance portal engineered specifically for software developers and technology-driven clients.
        </p>
      </div>

      {/* Grid: Description and image placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
            Bridging Elite Tech Talent and Forward-Thinking Enterprises
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Founded with the belief that hiring software engineers shouldn't be an operational gamble. We designed a web layout where developers can display full portfolios, complete with code examples, and clients can hire through verified escrow agreements.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            By building direct API pipelines for payments, chat modules, and activity logs, we allow remote development teams to align, coordinate work deliverables, and execute projects as if they were sitting in the same office.
          </p>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 bg-gradient-to-br from-primary/20 via-accent/10 to-gray-950/80 p-8 flex flex-col justify-between border border-gray-150 dark:border-gray-800">
          <div className="absolute inset-0 bg-gray-950/20 backdrop-blur-xxs" />
          <div className="relative z-10 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <span className="font-extrabold text-base tracking-tight text-white">GigSphere Core Matrix</span>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="block text-lg font-black text-white">25k+</span>
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Developers</span>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="block text-lg font-black text-white">99.8%</span>
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Success Rate</span>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <span className="block text-lg font-black text-white">125+</span>
              <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values grid */}
      <div className="space-y-6">
        <h3 className="text-center text-lg md:text-xl font-bold text-gray-950 dark:text-white">Our Core Pillars</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-4 hover:border-primary/25 transition-all">
                <div className={`p-3 rounded-xl w-fit ${val.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-gray-950 dark:text-white">{val.title}</h4>
                <p className="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <h3 className="text-center text-lg md:text-xl font-bold text-gray-955 dark:text-white">Our Journey</h3>
        
        <div className="space-y-8 relative">
          <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-850" />
          
          {milestones.map((mil, idx) => (
            <div key={idx} className="flex gap-6 relative items-start">
              <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-md border-4 border-white dark:border-gray-950 z-10">
                {idx + 1}
              </div>
              <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium flex-1 space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">{mil.title}</h4>
                  <span className="text-xs font-black text-primary">{mil.year}</span>
                </div>
                <p className="text-xxs text-gray-500 dark:text-gray-400 leading-normal">{mil.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
