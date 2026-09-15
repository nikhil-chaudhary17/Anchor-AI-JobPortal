import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    FileText,
    MapPin,
    Upload,
    User,
    Sparkles
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/useAuth";
import api from "../../services/api";


const Application = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [coverMessage, setCoverMessage] = useState("");
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [coverLoading, setCoverLoading] = useState(false);

    const [selectedResume, setSelectedResume] = useState(
        user?.resume?.url ? "profile" : "new"
    );
    const [applicationResume, setApplicationResume] = useState(null);
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);

                setJob(res.data.job);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchJobDetails();
    }, [id])



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!job) return;

        try {
            setSubmitting(true);

            let resumeUrl = "";
            let resumeText = ""

            // Use existing profile resume

            if (selectedResume === "profile") {
                if (!user?.resume?.url) {
                    alert("Please select or upload a resume before applying.");
                    return;
                }

                resumeUrl = user.resume.url;
                resumeText = user.resume.extractedText || "";
            }

            // Upload new resume

            if (selectedResume === "new") {
                if (!applicationResume) {
                    alert("Please select a resume file.");
                    return;
                }

                const formData = new FormData();
                formData.append("resume", applicationResume);

                const uploadResponse = await api.post(
                    "/resume/upload-resume",
                    formData
                );

                resumeUrl = uploadResponse.data.result.resume.url;
                resumeText =
                    uploadResponse.data.result.resume.extractedText || "";
            }


            await api.post(`/applications/${id}/apply`, {
                resume: resumeUrl,
                resumeText,
                coverLetter: coverMessage,
            });

            // Redirect only after successful submission

            alert("Application submitted successfully!");
            navigate("/find-jobs");

        } catch (error) {
            console.error("Application submission failed:", error);

            alert(
                error.response?.data?.message ||
                "Unable to submit application. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };



    const generateCoverLetter = async () => {
        if (!job) return;

        try {
            setCoverLoading(true);

            const coverLetterDetails = {
                candidateName: user?.name,
                skills: user?.skills,
                jobTitle: job.title,
                company: job.company?.name,
                jobDescription: job.description,
            };

            const res = await api.post(
                "/ai/cover-letter",
                coverLetterDetails
            );

            setCoverMessage(res.data.result.coverLetter);
        } catch (error) {
            console.error(
                "Failed to generate cover letter",
                error
            );
        } finally {
            setCoverLoading(false);
        }
    };

    const formatJobType = (jobType) => {
        return jobType
            .split("-")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    };

    const handleResumeSelect = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a PDF or DOCX file.");
            event.target.value = "";
            return;
        }

        setApplicationResume(file);
        setSelectedResume("new");
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-navy text-paper">
                <Navbar />

                <main className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-sm text-[#A5ABC2]">
                        Loading application...
                    </p>
                </main>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-navy text-paper">
                <Navbar />

                <main className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-sm text-red-300">
                        Unable to load this job.
                    </p>
                </main>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-navy text-paper">
            <Navbar />

            <main className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    {/* Back */}
                    <button
                        type="button"
                        onClick={() => navigate(`/jobs/${id}`)}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#A5ABC2] transition hover:text-paper"
                    >
                        <ArrowLeft size={16} />
                        Back to job
                    </button>

                    {/* Page Header */}
                    <div className="mb-7">
                        <p className="text-xs font-medium uppercase tracking-wider text-mint">
                            Job Application
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
                            Apply for this position
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A5ABC2]">
                            Complete your application and submit your profile
                            to the recruiter.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                            {/* Main Form */}
                            <div className="space-y-6">
                                {/* Job Summary */}
                                <section className="rounded-xl border border-white/10 bg-white/3 p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                                            <BriefcaseBusiness
                                                size={21}
                                                className="text-mint"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="text-lg font-semibold text-paper">
                                                {job.title}
                                            </h2>

                                            <p className="mt-1 text-sm text-[#A5ABC2]">
                                                {job.company?.name}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#7F879F]">
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin
                                                        size={13}
                                                        className="text-mint"
                                                    />
                                                    {job.location}
                                                </span>

                                                <span className="flex items-center gap-1.5">
                                                    <BriefcaseBusiness
                                                        size={13}
                                                        className="text-mint"
                                                    />
                                                    {formatJobType(job.jobType)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Personal Information */}
                                <section className="rounded-xl border border-white/10    p-6">
                                    <div className="mb-5">
                                        <h2 className="text-base font-semibold text-paper">
                                            Your information
                                        </h2>

                                        <p className="mt-1 text-xs text-[#7F879F]">
                                            This information will be shared
                                            with the recruiter.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {/* Name */}
                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-[#A5ABC2]">
                                                Full name
                                            </label>

                                            <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3.5 py-3">
                                                <User
                                                    size={16}
                                                    className="shrink-0 text-[#7F879F]"
                                                />

                                                <span className="truncate text-sm text-paper">
                                                    {user?.name ||
                                                        "Your name"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-[#A5ABC2]">
                                                Email
                                            </label>

                                            <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3.5 py-3">
                                                <span className="shrink-0 text-sm text-[#7F879F]">
                                                    @
                                                </span>

                                                <span className="truncate text-sm text-paper">
                                                    {user?.email ||
                                                        "your@email.com"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-[#A5ABC2]">
                                                Phone
                                            </label>

                                            <div className="rounded-md border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-paper">
                                                {user?.phone ||
                                                    "Phone number not added"}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="mb-2 block text-xs font-medium text-[#A5ABC2]">
                                                Location
                                            </label>

                                            <div className="rounded-md border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-paper">
                                                {user?.location ||
                                                    "Location not added"}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Resume */}
                                <section className="rounded-xl border border-white/10 bg-white/3 p-6">
                                    <div className="mb-5">
                                        <h2 className="text-base font-semibold text-paper">
                                            Resume
                                        </h2>

                                        <p className="mt-1 text-xs text-[#7F879F]">
                                            Choose an existing profile resume or upload a different one
                                            for this application.
                                        </p>
                                    </div>

                                    <div className="space-y-4">

                                        {/* Profile Resume */}
                                        {user?.resume?.url ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedResume("profile");
                                                    setApplicationResume(null);
                                                }}
                                                className={`w-full rounded-lg border p-4 text-left transition ${selectedResume === "profile"
                                                    ? "border-mint/40 bg-mint/5"
                                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex min-w-0 items-start gap-3">
                                                        <div
                                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${selectedResume === "profile"
                                                                ? "bg-mint/10"
                                                                : "bg-white/5"
                                                                }`}
                                                        >
                                                            <FileText
                                                                size={19}
                                                                className={
                                                                    selectedResume === "profile"
                                                                        ? "text-mint"
                                                                        : "text-[#7F879F]"
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-paper">
                                                                Use profile resume
                                                            </p>

                                                            <p className="mt-1 truncate text-xs text-[#7F879F]">
                                                                Your currently uploaded resume
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {selectedResume === "profile" && (
                                                        <CheckCircle2
                                                            size={19}
                                                            className="shrink-0 text-mint"
                                                        />
                                                    )}
                                                </div>

                                                <div className="mt-3 rounded-md border border-white/10 bg-black/10 px-3 py-2">
                                                    <p className="truncate text-xs text-[#A5ABC2]">
                                                        Profile resume selected
                                                    </p>
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4">
                                                <div className="flex items-start gap-3">
                                                    <Upload
                                                        size={18}
                                                        className="mt-0.5 shrink-0 text-amber-300"
                                                    />

                                                    <div>
                                                        <p className="text-sm font-medium text-paper">
                                                            No profile resume
                                                        </p>

                                                        <p className="mt-1 text-xs leading-5 text-[#A5ABC2]">
                                                            You can upload a new resume below.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Divider */}
                                        <div className="flex items-center gap-3">
                                            <div className="h-px flex-1 bg-white/10" />

                                            <span className="text-[11px] uppercase tracking-wider text-[#626A80]">
                                                Or
                                            </span>

                                            <div className="h-px flex-1 bg-white/10" />
                                        </div>

                                        {/* Upload New Resume */}
                                        <label
                                            className={`block cursor-pointer rounded-lg border p-4 transition ${selectedResume === "new"
                                                ? "border-mint/40 bg-mint/5"
                                                : "border-white/10 bg-white/5 hover:border-white/20"
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                accept=".pdf,.docx"
                                                onChange={handleResumeSelect}
                                                className="hidden"
                                            />

                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${selectedResume === "new"
                                                            ? "bg-mint/10"
                                                            : "bg-white/5"
                                                            }`}
                                                    >
                                                        <Upload
                                                            size={19}
                                                            className={
                                                                selectedResume === "new"
                                                                    ? "text-mint"
                                                                    : "text-[#7F879F]"
                                                            }
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-paper">
                                                            Upload a new resume
                                                        </p>

                                                        <p className="mt-1 text-xs text-[#7F879F]">
                                                            Choose a PDF or DOCX file from your computer.
                                                        </p>
                                                    </div>
                                                </div>

                                                {selectedResume === "new" && (
                                                    <CheckCircle2
                                                        size={19}
                                                        className="shrink-0 text-mint"
                                                    />
                                                )}
                                            </div>

                                            {applicationResume ? (
                                                <div className="mt-3 rounded-md border border-mint/20 bg-mint/5 px-3 py-2">
                                                    <p className="truncate text-xs font-medium text-mint">
                                                        {applicationResume.name}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-[#7F879F]">
                                                        {(applicationResume.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="mt-3 rounded-md border border-dashed border-white/10 px-3 py-2.5 text-center">
                                                    <span className="text-xs font-medium text-[#A5ABC2]">
                                                        Click to choose a resume
                                                    </span>
                                                </div>
                                            )}
                                        </label>

                                    </div>
                                </section>

                                {/* Cover Message */}
                                <section className="rounded-xl border border-white/10 bg-white/3 p-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <h2 className="text-base font-semibold text-paper">
                                            Cover message
                                            <span className="ml-2 text-xs font-normal text-[#7F879F]">
                                                Optional
                                            </span>
                                        </h2>

                                        <button
                                            type="button"
                                            onClick={generateCoverLetter}
                                            disabled={coverLoading}
                                            className="inline-flex items-center gap-2 rounded-md border border-mint/20 bg-mint/5 px-3 py-2 text-xs font-medium text-mint transition hover:bg-mint/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Sparkles size={14} />

                                            {coverLoading
                                                ? "Generating..."
                                                : "Generate with AI"}
                                        </button>
                                    </div>
                                    <textarea
                                        value={coverMessage}
                                        onChange={(e) =>
                                            setCoverMessage(
                                                e.target.value
                                            )
                                        }
                                        rows={6}
                                        placeholder="Write a short message to the recruiter..."
                                        className="w-full resize-none rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-paper outline-none placeholder:text-[#626A80] transition focus:border-mint/40 focus:bg-white/[0.07]"
                                    />

                                    <div className="mt-2 text-right text-xs text-[#626A80]">
                                        {coverMessage.length}/1000
                                    </div>
                                </section>

                                {/* Submit */}
                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/jobs/${id}`)
                                        }
                                        className="rounded-md border border-white/10 px-5 py-2.5 text-sm font-medium text-[#A5ABC2] transition hover:bg-white/5 hover:text-paper"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center justify-center gap-2 rounded-md bg-mint px-5 py-2.5 text-sm font-semibold text-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {submitting ? "Submitting..." : "Submit application"}

                                        {!submitting && <ArrowRight size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <aside className="space-y-6">
                                {/* Application Tips */}
                                <section className="rounded-xl border border-white/10 bg-white/3 p-5">
                                    <h2 className="text-sm font-semibold text-paper">
                                        Application tips
                                    </h2>

                                    <div className="mt-4 space-y-4">
                                        <div className="flex gap-3">
                                            <CheckCircle2
                                                size={16}
                                                className="mt-0.5 shrink-0 text-mint"
                                            />

                                            <p className="text-xs leading-5 text-[#A5ABC2]">
                                                Make sure your resume is
                                                up to date.
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <CheckCircle2
                                                size={16}
                                                className="mt-0.5 shrink-0 text-mint"
                                            />

                                            <p className="text-xs leading-5 text-[#A5ABC2]">
                                                Highlight skills relevant
                                                to this position.
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <CheckCircle2
                                                size={16}
                                                className="mt-0.5 shrink-0 text-mint"
                                            />

                                            <p className="text-xs leading-5 text-[#A5ABC2]">
                                                Keep your cover message
                                                clear and professional.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Application Status */}
                                <section className="rounded-xl border border-white/10 bg-white/3 p-5">
                                    <h2 className="text-sm font-semibold text-paper">
                                        Before you submit
                                    </h2>

                                    <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-mint/10">
                                                <FileText
                                                    size={15}
                                                    className="text-mint"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-xs font-medium text-paper">
                                                    Resume
                                                </p>

                                                <p className="mt-0.5 text-xs text-[#7F879F]">
                                                    {user?.resume?.url
                                                        ? "Ready to submit"
                                                        : "Not uploaded"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </aside>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Application;