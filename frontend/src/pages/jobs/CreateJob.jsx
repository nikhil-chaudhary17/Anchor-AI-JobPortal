import {
    BriefcaseBusiness,
    MapPin,
    Clock3,
    IndianRupee,
    Sparkles,
    X,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { useState, useEffect } from "react";
import api from '../../services/api'
import { useNavigate, useParams } from "react-router-dom";

export default function CreateJob() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        jobType: "full-time",
        location: "",
        experience: "Fresher",
        salaryMin: "",
        salaryMax: "",
        skills: [],
        deadline: "",
    });

    const [skillInput, setSkillInput] = useState("");
    const [companyId, setCompanyId] = useState(null);
    const [loadingCompany, setLoadingCompany] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    useEffect(() => {

    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addSkill = (e) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        const skill = skillInput.trim();

        if (!skill) return;

        if (formData.skills.includes(skill)) {
            setSkillInput("");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, skill],
        }));

        setSkillInput("");
    };

    const removeSkill = (skillToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter(
                (skill) => skill !== skillToRemove
            ),
        }));
    };


    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get("/company/my-company");

                const company = res.data.company;

                if (company) {
                    setCompanyId(company._id);
                }

            } catch (error) {
                console.error("Failed to fetch company:", error);
            } finally {
                setLoadingCompany(false);
            }
        };

        fetchCompany();

    }, [])

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                const job = res.data.job;

                setFormData({
                    title: job.title || "",
                    description: job.description || "",
                    jobType: job.jobType || "full-time",
                    location: job.location || "",
                    experience: job.experience || "Fresher",
                    salaryMin: job.salaryMin || "",
                    salaryMax: job.salaryMax || "",
                    skills: job.skillsRequired || [],
                    deadline: job.deadline
                        ? job.deadline.split("T")[0]
                        : "",
                });

                setCompanyId(job.company?._id || job.company);
            } catch (error) {
                console.error("Failed to fetch job:", error);

                alert(
                    error.response?.data?.message ||
                    "Failed to load job."
                );
            }
        };

        fetchJob();
    }, [id]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!companyId) {
            alert("Please create your company profile first.");
            return;
        }



        try {
            setSaving(true);


            const payload = {
                title: formData.title,
                description: formData.description,
                company: companyId,
                jobType: formData.jobType,
                location: formData.location,
                experience: formData.experience,
                salaryMin: Number(formData.salaryMin),
                salaryMax: Number(formData.salaryMax),
                skillsRequired: formData.skills,
                deadline: formData.deadline,
            };

            let res;

            if (isEdit) {


                res = await api.put(`/jobs/${id}`, payload);
                alert("Job updated successfully!");

                navigate(`/recruiter/jobs/${id}`);



            } else {
                res = await api.post("/jobs/create", payload);

                console.log("Job created:", res.data);

                alert("Job posted successfully!");

                navigate("/recruiter/my-jobs");

                setFormData({
                    title: "",
                    description: "",
                    jobType: "full-time",
                    location: "",
                    experience: "Fresher",
                    salaryMin: "",
                    salaryMax: "",
                    skills: [],
                    deadline: "",
                });
            }
        } catch (error) {
            console.error(
                isEdit
                    ? "Failed to update job:"
                    : "Failed to create job:",
                error
            );

            alert(
                error.response?.data?.message ||
                (isEdit
                    ? "Failed to update job. Please try again."
                    : "Failed to post job. Please try again.")
            );
        } finally {
            setSaving(false);
        }
    };



    const handleGenerateDescription = async () => {
        if (!formData.title) {
            alert("Please enter a job title first.");
            return;
        }

        if (formData.skills.length < 2) {
            alert("Please add at least three skills.");
            return;
        }


        try {
            const res = await api.post("/ai/generate-job-description", {
                title: formData.title,
                keyPoints: formData.skills.join(", "),
                location: formData.location,
                jobType: formData.jobType
            });

            const description = res.data.result.description;

            setFormData((prev) => ({
                ...prev,
                description: description
            }));

        } catch (error) {
            console.error("Failed to generate description: ", error);

            alert(
                error.response?.data?.message ||
                "Failed to generate job description."
            );

        }

    };

    return (
        <div className="min-h-screen bg-[#0B0B16] text-[#F5F3FF]">
            <Navbar />

            <main className="mx-auto max-w-4xl px-6 py-12">

                {/* Header */}
                <div>
                    <p className="text-sm text-[#A78BFA]">
                        Recruiter
                    </p>

                    <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-semibold md:text-4xl">
                        {isEdit ? "Edit Job" : "Post a new job"}
                    </h1>

                    <p className="mt-2 text-sm text-[#8B8CA7]">
                        {isEdit
                            ? "Update your job posting and keep the details up to date."
                            : "Create a job posting and find the right candidates for your team."}
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-10 rounded-2xl border border-white/10 bg-[#121222] p-6 md:p-8"
                >

                    {/* Basic Information */}
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8B5CF6]/10">
                                <BriefcaseBusiness
                                    size={18}
                                    className="text-[#A78BFA]"
                                />
                            </div>

                            <div>
                                <h2 className="font-['Space_Grotesk'] text-lg font-semibold">
                                    Job information
                                </h2>

                                <p className="text-xs text-[#8B8CA7]">
                                    Tell candidates about the role.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">

                            {/* Job Title */}
                            <div>
                                <label className="text-xs uppercase tracking-wide text-[#8B8CA7]">
                                    Job title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Frontend Developer"
                                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm text-[#F5F3FF] outline-none transition-colors placeholder:text-[#5F6178] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                                />
                            </div>

                            {/* Job Type + Experience */}
                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#8B8CA7]">
                                        <Clock3 size={12} />
                                        Job type
                                    </label>

                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm text-[#F5F3FF] outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="internship">Internship</option>
                                        <option value="contract">Contract</option>
                                        <option value="freelance">Freelance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs uppercase tracking-wide text-[#8B8CA7]">
                                        Experience
                                    </label>

                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm text-[#F5F3FF] outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                                    >
                                        <option>Fresher</option>
                                        <option>0–1 years</option>
                                        <option>1–2 years</option>
                                        <option>2–4 years</option>
                                        <option>4–6 years</option>
                                        <option>6+ years</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#8B8CA7]">
                                    <MapPin size={12} />
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Bengaluru, India or Remote"
                                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm text-[#F5F3FF] outline-none placeholder:text-[#5F6178] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                                />
                            </div>

                            {/* Salary */}
                            <div>
                                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#8B8CA7]">
                                    <IndianRupee size={12} />
                                    Salary range
                                </label>

                                <div className="mt-1.5 grid gap-3 sm:grid-cols-2">
                                    <input
                                        type="number"
                                        name="salaryMin"
                                        value={formData.salaryMin}
                                        onChange={handleChange}
                                        placeholder="Minimum salary"
                                        className="w-full rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm text-[#F5F3FF] outline-none placeholder:text-[#5F6178] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                                    />

                                    <input
                                        type="number"
                                        name="salaryMax"
                                        value={formData.salaryMax}
                                        onChange={handleChange}
                                        placeholder="Maximum salary"
                                        className="w-full rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm text-[#F5F3FF] outline-none placeholder:text-[#5F6178] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                                    />
                                </div>

                                <p className="mt-1.5 text-xs text-[#5F6178]">
                                    Enter annual salary in INR.
                                </p>
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide text-[#8B8CA7]">
                                    Application deadline
                                </label>

                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm text-[#F5F3FF] outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                                />
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="text-xs uppercase tracking-wide text-[#8B8CA7]">
                                    Required skills
                                </label>

                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) =>
                                        setSkillInput(e.target.value)
                                    }
                                    onKeyDown={addSkill}
                                    placeholder="Type a skill and press Enter"
                                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm text-[#F5F3FF] outline-none placeholder:text-[#5F6178] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                                />

                                {/* Skill Tags */}
                                {formData.skills.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {formData.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="flex items-center gap-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1.5 text-xs text-[#C4B5FD]"
                                            >
                                                {skill}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(skill)
                                                    }
                                                    className="transition-colors hover:text-white"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="mt-1.5 text-xs text-[#5F6178]">
                                    Add the main technologies or skills required for this role.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-10 border-t border-white/10 pt-8">

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="font-['Space_Grotesk'] text-lg font-semibold">
                                    Job description
                                </h2>

                                <p className="mt-1 text-xs text-[#8B8CA7]">
                                    Describe the role, responsibilities and requirements.
                                </p>
                            </div>

                            {/* AI Button */}
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                className="flex w-fit items-center gap-2 rounded-lg border border-[#A78BFA]/30 bg-[#8B5CF6]/10 px-4 py-2.5 text-xs font-semibold text-[#C4B5FD] transition-all hover:border-[#A78BFA]/60 hover:bg-[#8B5CF6]/20"
                            >
                                <Sparkles size={15} />
                                Generate with AI
                            </button>
                        </div>

                        <textarea
                            rows={10}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write the job description here, or let AI create one for you..."
                            className="mt-5 w-full resize-y rounded-lg border border-white/10 bg-[#18182A] px-4 py-3 text-sm leading-6 text-[#F5F3FF] outline-none placeholder:text-[#5F6178] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
                        />

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs text-[#5F6178]">
                                You can edit the AI-generated description before posting.
                            </p>

                            <p className="text-xs text-[#5F6178]">
                                {formData.description.length} characters
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-6 sm:flex-row">

                        <button
                            type="button"
                            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-[#8B8CA7] transition-colors hover:border-white/20 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving || loadingCompany}
                            className="rounded-lg bg-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-[#7C3AED]"
                        >
                            {saving
                                ? isEdit
                                    ? "Updating..."
                                    : "Posting..."
                                : isEdit
                                    ? "Update Job"
                                    : "Post Job"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}