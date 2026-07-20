import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Input, Textarea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AlertCircle, CheckCircle, Plus, Trash } from "lucide-react";

export const FreelancerSettings = () => {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Manage lists in-memory for this UI form before saving
  const [experience, setExperience] = useState(user.experience || []);
  const [education, setEducation] = useState(user.education || []);
  const [certificates, setCertificates] = useState(user.certificates || []);
  const [skills, setSkills] = useState(user.skills || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      title: user.title || "",
      bio: user.bio || "",
      hourlyRate: user.hourlyRate || 50,
      skillsString: user.skills ? user.skills.join(", ") : ""
    }
  });

  // Adding sub items helpers
  const [newExp, setNewExp] = useState({ role: "", company: "", duration: "", desc: "" });
  const [newEdu, setNewEdu] = useState({ degree: "", school: "", duration: "" });
  const [newCert, setNewCert] = useState({ name: "", issuer: "", year: "" });

  const addExperience = () => {
    if (!newExp.role || !newExp.company) return;
    setExperience(prev => [...prev, newExp]);
    setNewExp({ role: "", company: "", duration: "", desc: "" });
  };

  const addEducation = () => {
    if (!newEdu.degree || !newEdu.school) return;
    setEducation(prev => [...prev, newEdu]);
    setNewEdu({ degree: "", school: "", duration: "" });
  };

  const addCertificate = () => {
    if (!newCert.name || !newCert.issuer) return;
    setCertificates(prev => [...prev, newCert]);
    setNewCert({ name: "", issuer: "", year: "" });
  };

  const removeItem = (type, index) => {
    if (type === "experience") setExperience(prev => prev.filter((_, i) => i !== index));
    if (type === "education") setEducation(prev => prev.filter((_, i) => i !== index));
    if (type === "certificates") setCertificates(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSuccess("");
    setError("");

    const parsedSkills = data.skillsString
      ? data.skillsString.split(",").map(s => s.trim()).filter(s => s.length > 0)
      : [];

    try {
      await updateProfile({
        name: data.name,
        title: data.title,
        bio: data.bio,
        hourlyRate: Number(data.hourlyRate),
        skills: parsedSkills,
        experience,
        education,
        certificates
      });
      setSuccess("Profile settings updated successfully!");
    } catch (e) {
      setError(e.message || "Failed to update profile settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-990 dark:text-white">Profile & Resume Settings</h2>
        <p className="text-xs text-gray-400">Configure your portfolio, hourly rates, and qualifications details</p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-150 dark:border-gray-850 shadow-premium">
        {success && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-650 rounded-xl text-xs flex items-center gap-2.5 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-650 rounded-xl text-xs flex items-center gap-2.5 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border border-gray-250 dark:border-gray-800"
            />
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{user.name}</h4>
              <p className="text-xxs text-gray-400 font-semibold uppercase mt-0.5">Freelancer Developer Profile</p>
            </div>
          </div>

          {/* Primary details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              error={errors.name}
              {...register("name", { required: "Name is required" })}
            />
            <Input
              label="Professional Title"
              placeholder="e.g. Senior Full Stack Engineer"
              error={errors.title}
              {...register("title", { required: "Title is required" })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hourly Rate (USD / hr)"
              type="number"
              error={errors.hourlyRate}
              {...register("hourlyRate", { required: "Hourly rate is required" })}
            />
            <Input
              label="Skills (Comma separated list)"
              placeholder="React, CSS, JavaScript"
              {...register("skillsString")}
            />
          </div>

          <Textarea
            label="Biography"
            placeholder="Introduce yourself, summary of expertise, and services provided..."
            rows={4}
            {...register("bio")}
          />

          {/* Experience list */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Professional Experience</h4>
            
            {experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-2xl flex justify-between items-start gap-4">
                <div>
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">{exp.role}</h5>
                  <p className="text-xxs text-gray-450 font-medium">{exp.company} | {exp.duration}</p>
                  {exp.desc && <p className="text-xxs text-gray-500 mt-1">{exp.desc}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem("experience", idx)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Role (e.g. Frontend Engineer)"
                  value={newExp.role}
                  onChange={(e) => setNewExp(prev => ({ ...prev, role: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs outline-none"
                />
                <input
                  type="text"
                  placeholder="Company (e.g. FinTech)"
                  value={newExp.company}
                  onChange={(e) => setNewExp(prev => ({ ...prev, company: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Duration (e.g. 2022 - Present)"
                  value={newExp.duration}
                  onChange={(e) => setNewExp(prev => ({ ...prev, duration: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs outline-none"
                />
                <input
                  type="text"
                  placeholder="Short Description"
                  value={newExp.desc}
                  onChange={(e) => setNewExp(prev => ({ ...prev, desc: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-950 rounded-lg text-xxs outline-none"
                />
              </div>
              <Button type="button" size="sm" onClick={addExperience} className="flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Experience Item
              </Button>
            </div>
          </div>

          {/* Education list */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Education Details</h4>

            {education.map((edu, idx) => (
              <div key={idx} className="p-3.5 bg-gray-50 dark:bg-gray-955 border border-gray-100 dark:border-gray-850 rounded-2xl flex justify-between items-start gap-4">
                <div>
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">{edu.degree}</h5>
                  <p className="text-xxs text-gray-450 font-medium">{edu.school} | {edu.duration}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem("education", idx)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Degree (e.g. B.S. CS)"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu(prev => ({ ...prev, degree: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-800 dark:bg-gray-955 rounded-lg text-xxs outline-none col-span-1"
                />
                <input
                  type="text"
                  placeholder="School (e.g. Stanford)"
                  value={newEdu.school}
                  onChange={(e) => setNewEdu(prev => ({ ...prev, school: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-805 dark:bg-gray-955 rounded-lg text-xxs outline-none col-span-1"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={newEdu.duration}
                  onChange={(e) => setNewEdu(prev => ({ ...prev, duration: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-805 dark:bg-gray-955 rounded-lg text-xxs outline-none col-span-1"
                />
              </div>
              <Button type="button" size="sm" onClick={addEducation} className="flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Education Item
              </Button>
            </div>
          </div>

          {/* Certifications list */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Certificates & Licenses</h4>

            {certificates.map((cert, idx) => (
              <div key={idx} className="p-3.5 bg-gray-50 dark:bg-gray-955 border border-gray-100 dark:border-gray-850 rounded-2xl flex justify-between items-start gap-4">
                <div>
                  <h5 className="text-xs font-bold text-gray-905 dark:text-white">{cert.name}</h5>
                  <p className="text-xxs text-gray-450 font-medium">{cert.issuer} | {cert.year}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem("certificates", idx)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="p-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Certificate Name (e.g. AWS)"
                  value={newCert.name}
                  onChange={(e) => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-805 dark:bg-gray-955 rounded-lg text-xxs outline-none col-span-1"
                />
                <input
                  type="text"
                  placeholder="Issuer (e.g. Amazon)"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert(prev => ({ ...prev, issuer: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-805 dark:bg-gray-955 rounded-lg text-xxs outline-none col-span-1"
                />
                <input
                  type="text"
                  placeholder="Year Obtained"
                  value={newCert.year}
                  onChange={(e) => setNewCert(prev => ({ ...prev, year: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-805 dark:bg-gray-955 rounded-lg text-xxs outline-none col-span-1"
                />
              </div>
              <Button type="button" size="sm" onClick={addCertificate} className="flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Certificate
              </Button>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-150 dark:border-gray-800 flex justify-end">
            <Button type="submit" disabled={submitting} variant="accent">
              {submitting ? "Saving Resume..." : "Save Professional Resume"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
