import React from "react";
import { FileText, Calendar } from "lucide-react";

export const Terms = () => {
  const lastUpdated = "July 1, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: `By accessing or using GigSphere, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the platform.`
    },
    {
      title: "2. Eligibility",
      body: `You must be at least 18 years old and capable of forming a binding contract to use GigSphere as a Client or Freelancer. By registering, you represent that you meet these requirements.`
    },
    {
      title: "3. Accounts",
      body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.`
    },
    {
      title: "4. Client and Freelancer Obligations",
      body: `Clients agree to provide accurate project requirements and pay for completed work as agreed. Freelancers agree to deliver work in good faith, in line with the agreed scope, timeline, and quality standards.`
    },
    {
      title: "5. Payments and Escrow",
      body: `Funds placed in escrow are held until milestone approval or dispute resolution. GigSphere charges a service fee on transactions as disclosed at the time of payment. Fees are non-refundable except where required by law.`
    },
    {
      title: "6. Intellectual Property",
      body: `Unless otherwise agreed in writing between Client and Freelancer, ownership of work product transfers to the Client upon full payment. Freelancers retain the right to showcase non-confidential work in their portfolio.`
    },
    {
      title: "7. Prohibited Conduct",
      body: `Users may not circumvent the platform to avoid fees, submit fraudulent projects or bids, harass other users, or upload content that infringes on third-party rights or violates applicable law.`
    },
    {
      title: "8. Disputes",
      body: `In the event of a disagreement between Client and Freelancer, either party may open a dispute through the platform. GigSphere will review submitted evidence and make a binding determination on escrowed funds.`
    },
    {
      title: "9. Termination",
      body: `GigSphere reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to other users.`
    },
    {
      title: "10. Limitation of Liability",
      body: `GigSphere is not liable for the quality, legality, or safety of projects posted by Clients or work delivered by Freelancers. The platform is provided "as is" without warranties of any kind.`
    },
    {
      title: "11. Changes to These Terms",
      body: `We may update these Terms from time to time. Continued use of the platform after changes take effect constitutes acceptance of the revised Terms.`
    },
    {
      title: "12. Contact",
      body: `Questions about these Terms can be directed to our support team via the Contact page.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary dark:text-primary-light font-bold rounded-full text-xxs uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          Legal
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Terms of <span className="text-primary">Service</span>
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

