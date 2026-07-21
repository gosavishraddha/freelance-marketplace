import React from "react";
import { Shield, Calendar } from "lucide-react";

export const Privacy = () => {
  const lastUpdated = "July 1, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      body: `We collect information you provide directly, such as your name, email, payment details, and profile information when you register as a Client or Freelancer. We also collect usage data, including pages visited, actions taken, and device/browser information.`
    },
    {
      title: "2. How We Use Your Information",
      body: `We use collected information to operate and improve GigSphere, process payments and escrow transactions, facilitate communication between Clients and Freelancers, prevent fraud, and send important account or transaction notifications.`
    },
    {
      title: "3. Sharing of Information",
      body: `We do not sell your personal information. We may share data with payment processors to complete transactions, with other users as necessary to fulfill a contract (e.g. a Client seeing a Freelancer's profile), and with law enforcement when legally required.`
    },
    {
      title: "4. Cookies and Tracking",
      body: `GigSphere uses cookies and similar technologies to keep you logged in, remember preferences, and understand how the platform is used. You can control cookies through your browser settings.`
    },
    {
      title: "5. Data Security",
      body: `We use industry-standard safeguards, including encryption in transit and access controls, to protect your information. No system is completely secure, and we encourage users to use strong, unique passwords.`
    },
    {
      title: "6. Data Retention",
      body: `We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements.`
    },
    {
      title: "7. Your Rights",
      body: `Depending on your location, you may have the right to access, correct, export, or delete your personal information. You can manage most of this directly from your account settings or by contacting support.`
    },
    {
      title: "8. Third-Party Services",
      body: `GigSphere may link to or integrate with third-party services (such as payment gateways). These third parties have their own privacy practices, and we encourage you to review their policies.`
    },
    {
      title: "9. Children's Privacy",
      body: `GigSphere is not intended for individuals under 18. We do not knowingly collect personal information from minors.`
    },
    {
      title: "10. International Users",
      body: `If you access GigSphere from outside our primary operating region, your information may be transferred to and processed in other countries with different data protection laws.`
    },
    {
      title: "11. Changes to This Policy",
      body: `We may update this Privacy Policy periodically. Material changes will be communicated via the platform or email, and continued use after changes take effect constitutes acceptance.`
    },
    {
      title: "12. Contact Us",
      body: `Questions or requests regarding this Privacy Policy can be directed to our support team via the Contact page.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary dark:text-primary-light font-bold rounded-full text-xxs uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          Legal
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Privacy <span className="text-primary">Policy</span>
        </h1>
        <p className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-450">
          <Calendar className="w-3.5 h-3.5" />
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-2xl shadow-premium p-6 md:p-10 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-sm font-bold text-gray-950 dark:text-white">
              {section.title}
            </h2>
            <p className="text-xxs text-gray-500 dark:text-gray-400 leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};