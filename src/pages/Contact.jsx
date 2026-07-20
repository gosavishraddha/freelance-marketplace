import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Check, Sparkles, MessageSquare, ShieldCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";

export const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleInput = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const cards = [
    { title: "General Support", desc: "For dashboard questions, verification help, and project assistance.", icon: Mail, detail: "support@gigsphere.com" },
    { title: "Direct Helpline", desc: "Dedicated enterprise client lines and urgent assistance requests.", icon: Phone, detail: "+1 (800) 555-0199" },
    { title: "Corporate HQ", desc: "GigSphere Inc. headquarters located in California's tech corridor.", icon: MapPin, detail: "100 Innovation Way, San Jose, CA" }
  ];

  const faqs = [
    { q: "How does GigSphere protect milestone payments?", a: "GigSphere utilizes an automated Escrow framework. Once a client hires a freelancer, the project budget is secured in our escrow. Funds are only released when the freelancer submits the work and the client clicks 'Approve Deliverables'." },
    { q: "What are the platform fees?", a: "We charge a minor flat fee of 5% on completed contracts from freelancers. Clients do not pay any project posting fees." },
    { q: "Can I transition from freelancer to client?", a: "Yes! Your user credentials support role toggle configurations. You can configure multiple workspaces under profile setups." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary dark:text-primary-light font-bold rounded-full text-xxs uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          Get In Touch
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Contact Our <span className="text-primary">Support Desk</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-450 leading-relaxed">
          Need database integration help, contract dispute audits, or custom payment solutions? Contact our system directors.
        </p>
      </div>

      {/* Grid: Form and info panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact info cards */}
        <div className="space-y-6">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">{c.title}</h4>
                <p className="text-[10px] text-gray-400 leading-normal">{c.desc}</p>
                <span className="block text-xs font-bold text-primary font-mono">{c.detail}</span>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-155 dark:border-gray-850 shadow-premium space-y-6">
          <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Send a Secured Ticket
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInput}
                  placeholder="Alex Rivera"
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-205 dark:border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInput}
                  placeholder="alex@company.com"
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-205 dark:border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Subject</label>
              <input
                type="text"
                required
                name="subject"
                value={formData.subject}
                onChange={handleInput}
                placeholder="Enterprise account verification"
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-205 dark:border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Message Body</label>
              <textarea
                required
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleInput}
                placeholder="Describe your issue or custom enterprise requirement..."
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-205 dark:border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-primary/20"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {submitted && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/35 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
              <Check className="w-5 h-5 shrink-0" />
              Your support ticket has been received. Our administrators will respond via email shortly.
            </div>
          )}
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <h3 className="text-center text-lg md:text-xl font-bold text-gray-950 dark:text-white">Contact Desk FAQ</h3>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-2">
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">{faq.q}</h4>
              <p className="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
