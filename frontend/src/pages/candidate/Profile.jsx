import { useState, useRef } from "react";
import {
  Camera,
  Pencil,
  Check,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    skills: user?.skills || [],
  });

  const inputRef = useRef(null);


  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/user/profile", {
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills,
        phone: formData.phone,
        location: formData.location,
      });

      updateUser(res.data.user);
      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();

      const newSkill = e.target.value.trim();

      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));

      e.target.value = "";
    }
  };


  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleFile = (selected) => {
    if (!selected) return;
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(selected.type)) {
      alert("Please upload a PDF or DOCX file.");
      return;
    }
    setResumeFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleResumeSubmit = async () => {
    if (!resumeFile) return;

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await api.post("/resume/upload", formData);

      updateUser({
        resume: res.data.result.resume,
      });

      setResumeFile();

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Resume upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-navy text-paper">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-['Space_Grotesk'] text-2xl font-semibold md:text-3xl">
          Your profile
        </h1>

        <p className="mt-2 text-sm text-[#7A81A0]">
          This is what recruiters (or candidates) see when they view your account.
        </p>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/3 p-8 backdrop-blur">
          {/* Avatar + role */}
          <div className="flex items-center gap-5">
            <div className="group relative h-20 w-20 shrink-0">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-amber to-mint font-['Space_Grotesk'] text-2xl font-semibold text-navy">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0)
                )}
              </div>

              <button
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-navy bg-panel text-paper transition-transform duration-200 hover:scale-110"
                aria-label="Change avatar"
              >
                <Camera size={13} />
              </button>
            </div>

            <div>
              <p className="font-['Space_Grotesk'] text-lg font-medium">
                {user.name}
              </p>

              <span className="mt-1 inline-block rounded-full bg-mint/10 px-2.5 py-0.5 text-xs font-medium capitalize text-mint">
                {user.role}
              </span>
            </div>
          </div>

          {/* Editable fields */}
          <div className="mt-8 space-y-5 border-t border-white/10 pt-8">
            <div>
              <label className="text-xs uppercase tracking-wide text-[#7A81A0]">
                Full name
              </label>

              <input
                type="text"
                name="name"
                value={editing ? formData.name : user.name || ""}
                onChange={handleChange}
                disabled={!editing}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors disabled:opacity-60 enabled:focus:border-amber enabled:focus:ring-1 enabled:focus:ring-amber"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[#7A81A0]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={user.email || ""}
                disabled
                className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors disabled:opacity-60"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-wide text-[#7A81A0]">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={editing ? formData.phone : user.phone || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors disabled:opacity-60 enabled:focus:border-amber enabled:focus:ring-1 enabled:focus:ring-amber"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-[#7A81A0]">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="Meerut, India"
                  value={editing ? formData.location : user.location || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors disabled:opacity-60 enabled:focus:border-amber enabled:focus:ring-1 enabled:focus:ring-amber"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[#7A81A0]">
                Bio
              </label>

              <textarea
                name="bio"
                value={editing ? formData.bio : user.bio || ""}
                onChange={handleChange}
                rows={3}
                placeholder="A short line about yourself"
                disabled={!editing}
                className="mt-1.5 w-full resize-none rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors disabled:opacity-60 enabled:focus:border-amber enabled:focus:ring-1 enabled:focus:ring-amber"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[#7A81A0]">
                Skills
              </label>

              <div className="mt-1.5 flex flex-wrap gap-2 rounded-md border border-white/10 bg-white/5 p-3">
                {(editing ? formData.skills : user.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-xs text-paper"
                  >
                    {skill}

                    {editing && (
                      <button
                        className="text-[#7A81A0] hover:text-paper"
                        type="button"
                        onClick={() => removeSkill(skill)}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}

                {editing && (
                  <input
                    type="text"
                    placeholder="Add a skill..."
                    name="skill"
                    onKeyDown={addSkill}
                    disabled={!editing}
                    className="min-w-25 flex-1 bg-transparent text-xs text-paper outline-none placeholder:text-[#7A81A0]"
                  />
                )}
              </div>

              <p className="mt-1.5 text-xs text-[#7A81A0]">
                Skills are also picked up automatically from your resume.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-3 border-t border-white/10 pt-6">
            {editing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-md bg-amber px-5 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:scale-[1.03]"
              >
                <Check size={15} /> Save changes
              </button>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-md border border-white/15 px-5 py-2.5 text-sm font-medium text-paper transition-all duration-200 hover:border-white/30 hover:bg-white/5"
              >
                <Pencil size={14} /> Edit profile
              </button>
            )}
          </div>
        </div>

        {/* Resume section */}
        {user.role === "candidate" && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/3 p-8 backdrop-blur">
            <h2 className="font-['Space_Grotesk'] text-lg font-medium">
              Resume
            </h2>

            <p className="mt-1 text-sm text-[#7A81A0]">
              PDF or DOCX, up to 5MB. Powers your match scores and AI
              recommendations.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
              className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${dragging
                ? "border-amber bg-amber/5"
                : "border-white/15 hover:border-white/30 hover:bg-white/2"
                }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              <UploadCloud
                size={26}
                className={`transition-colors duration-200 ${dragging ? "text-amber" : "text-[#7A81A0]"
                  }`}
              />

              <p className="mt-3 text-sm font-medium">
                Drag & drop, or click to browse
              </p>
            </div>

            {resumeFile && (
              <>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-white/3 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-mint" />

                    <div>
                      <p className="text-sm font-medium">{resumeFile.name}</p>
                      <p className="text-xs text-[#7A81A0]">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeFile(null);
                    }}
                    className="text-[#7A81A0] transition-colors hover:text-paper"
                    aria-label="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>

                <button
                  onClick={handleResumeSubmit}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-amber py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(232,163,61,0.35)]"
                >
                  <CheckCircle2 size={16} />
                  Upload resume
                </button>
              </>
            )}

            {user?.resume?.url && (
              <div className="mt-5 flex items-center justify-between rounded-lg border border-white/10 bg-white/3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-mint" />

                  <div>
                    <p className="text-sm font-medium">Resume uploaded</p>
                    <p className="text-xs text-[#7A81A0]">
                      Your latest resume is ready to view
                    </p>
                  </div>
                </div>

                <a
                  href={user.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-paper transition-colors hover:border-amber hover:text-amber"
                >
                  View Resume
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}     