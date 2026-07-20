import React, { useState } from "react";
import { 
  Users, 
  Gift, 
  Copy, 
  Check, 
  Send, 
  DollarSign, 
  Award, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export const Referral = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const referralCode = "SPHERE-GIG-789";
  const referralLink = `https://gigsphere.com/register?ref=${referralCode}`;

  const stats = [
    { label: "Total Referred", value: "24", icon: Users, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { label: "Active Freelancers", value: "14", icon: Award, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { label: "Commission Earned", value: "$1,840.00", icon: DollarSign, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { label: "Conversion Rate", value: "58.3%", icon: TrendingUp, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" }
  ];

  const tiers = [
    { name: "Bronze Spark", referrals: "1-5", commission: "5% share", active: true, benefit: "Standard payout speeds" },
    { name: "Silver Catalyst", referrals: "6-15", commission: "7.5% share", active: false, benefit: "Priority support, 24h payout" },
    { name: "Gold Accelerator", referrals: "16-50", commission: "10% share", active: false, benefit: "Direct slack channel access, early feature access" },
    { name: "Platinum Legend", referrals: "50+", commission: "12% share", active: false, benefit: "Zero platform fees on personal projects" }
  ];

  const history = [
    { id: "ref-1", name: "David Miller", role: "Freelancer", registered: "2026-06-15", status: "Active", earned: 320.00 },
    { id: "ref-2", name: "Innovate Inc.", role: "Client", registered: "2026-06-18", status: "Active", earned: 450.00 },
    { id: "ref-3", name: "Jane Smith", role: "Freelancer", registered: "2026-07-02", status: "Active", earned: 120.00 },
    { id: "ref-4", name: "Thomas Sterling", role: "Freelancer", registered: "2026-07-10", status: "Pending", earned: 0.00 },
    { id: "ref-5", name: "CodeSmith Agency", role: "Client", registered: "2026-07-14", status: "Active", earned: 950.00 },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      setInviteSuccess(true);
      setInviteEmail("");
      setTimeout(() => setInviteSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-emerald-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xxs font-bold text-emerald-400 uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5" />
            GigSphere Referral Program
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Invite Your Friends & Vouch for Top Engineers. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 to-primary-light">Earn Lifetime Rewards!</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
            Grow our tech ecosystem. Earn 10% of our platform commission on every project your referrals complete. Whether they hire or deliver work, you profit.
          </p>
        </div>
      </div>

      {/* Referral Link & Codes Action Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Referral URL sharing panels */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-6">
            <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Share Your Referral Credentials
            </h3>
            <p className="text-xs text-gray-500 leading-normal">
              Copy your unique link or referral code to share on Linkedin, Twitter, or send directly to colleagues and teams.
            </p>

            <div className="space-y-4">
              {/* Copy Link field */}
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Your Referral Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-0 text-gray-500 truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-5 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xs tracking-wider uppercase flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedLink ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Copy Code field */}
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-gray-400 uppercase tracking-wider block">Your Invite Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralCode}
                    className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-xs font-mono font-bold tracking-wider focus:outline-none focus:ring-0 text-primary uppercase"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="px-5 py-3 bg-gray-100 dark:bg-gray-850 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all text-xs tracking-wider uppercase flex items-center gap-1.5 shrink-0"
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedCode ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Email Invite Box */}
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-4">
            <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-500" />
              Invite Friends Directly
            </h3>
            <p className="text-xs text-gray-500 leading-normal">
              Enter their emails to shoot a direct automated invitation to join GigSphere.
            </p>

            <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="developer-friend@company.com"
                className="flex-1 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-wider shrink-0 flex items-center justify-center gap-2"
              >
                Send Invite
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {inviteSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 animate-pulse">
                <Check className="w-4 h-4" /> Invitation sent successfully!
              </p>
            )}
          </div>
        </div>

        {/* Rewards Tiers sidebar */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium space-y-5">
          <h3 className="text-base font-bold text-gray-950 dark:text-white flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
            <Award className="w-5 h-5 text-amber-500" />
            Referral Tiers
          </h3>

          <div className="space-y-4">
            {tiers.map((tier, idx) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl border relative overflow-hidden transition-all ${
                  tier.active 
                    ? "bg-primary-50/15 border-primary dark:bg-primary-950/15" 
                    : "border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-950/30"
                }`}
              >
                {tier.active && (
                  <span className="absolute top-2 right-3 text-[9px] bg-primary text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Current Tier
                  </span>
                )}
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white mb-0.5">{tier.name}</h4>
                <div className="flex items-center justify-between text-xxs font-bold text-gray-500 dark:text-gray-400 mt-2">
                  <span>Referred: {tier.referrals}</span>
                  <span className="text-primary dark:text-primary-light font-extrabold uppercase">{tier.commission}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed italic">
                  * Benefit: {tier.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Referral Statistics */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-950 dark:text-white">Your Referral Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{stat.label}</span>
                  <span className="text-lg font-black text-gray-900 dark:text-white mt-1 block">{stat.value}</span>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referral History Table */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-950 dark:text-white">Referral Conversion History</h3>
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-150 dark:border-gray-850 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-xxs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Referred Contact</th>
                  <th className="px-6 py-4">Account Type</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4">Activity Status</th>
                  <th className="px-6 py-4 text-right">Commission Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                {history.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">
                      {row.role}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {new Date(row.registered).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                        row.status === "Active" 
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450" 
                          : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-450"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-950 dark:text-white">
                      ${row.earned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
