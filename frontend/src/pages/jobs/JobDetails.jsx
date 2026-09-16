import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    Clock3,
    Edit3,
    Globe,
    IndianRupee,
    MapPin,
    Trash2,
    Users,
    Sparkles,
    CheckCircle2,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [myApplication, setMyApplication] = useState(null);
    const [applicationLoading, setApplicationLoading] = useState(true);

    // AI Resume Match
    const [matchResult, setMatchResult] = useState(null);
    const [matchLoading, setMatchLoading] = useState(false);
    const [matchError, setMatchError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data.job);
            } catch (error) {
                console.error("Failed to fetch job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);


    useEffect(() => {
        const fetchMyApplication = async () => {
            if (user?.role !== "candidate") {
                setApplicationLoading(false);
                return;
            }

            try {
                setApplicationLoading(true);

                const res = await api.get("/applications/my-applications");

                const applications = res.data.applications || [];

                const application = applications.find(
                    (application) =>
                        application.jobId?._id === id ||
                        application.jobId === id
                );

                setMyApplication(application || null);
            } catch (error) {
                console.error(
                    "Failed to check application status:",
                    error
                );
            } finally {
                setApplicationLoading(false);
            }
        };

        fetchMyApplication();
    }, [id, user?.role]);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are You sure u want to delete this job?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            await api.delete(`/jobs/${id}`);

            alert("Job deleted successfully.");

            navigate("/recruiter/my-jobs");
        } catch (error) {
            console.error("Failed to delete job:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete job. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleResumeMatch = async () => {
        if (!user?.resume?.extractedText) {
            setMatchError(
                "Please upload your resume before checking the AI match."
            );
            return;
        }

        if (!job?.description) {
            setMatchError(
                "Job description is not available for matching."
            );
            return;
        }

        try {
            setMatchLoading(true);
            setMatchError("");
            setMatchResult(null);

            const res = await api.post("/ai/resume-match", {
                resumeText: user.resume.extractedText,
                jobDescription: job.description,
            });

            setMatchResult(res.data.result);
        } catch (error) {
            console.error("Resume match failed:", error);

            setMatchError(
                error.response?.data?.message ||
                "Unable to analyze your resume right now."
            );
        } finally {
            setMatchLoading(false);
        }
    };

    const getMatchLabel = (score) => {
        if (score >= 80) return "Strong Match";
        if (score >= 60) return "Good Match";
        if (score >= 40) return "Moderate Match";
        return "Low Match";
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

    const formatSalary = (salary) => {
        return new Intl.NumberFormat("en-IN").format(salary);
    };

    const formatDeadline = (deadline) => {
        return new Date(deadline).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111827]">
                <Navbar />

                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-sm text-[#9CA3AF]">
                        Loading job details...
                    </p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-[#111827]">
                <Navbar />

                <div className="flex min-h-[60vh] flex-col items-center justify-center">
                    <h2 className="text-lg font-semibold text-white">
                        Job not found
                    </h2>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                user?.role === "recruiter"
                                    ? "/recruiter/my-jobs"
                                    : "/find-jobs"
                            )
                        }
                        className="mt-4 rounded-lg bg-[#8B5CF6] px-4 py-2 text-sm font-medium text-white"
                    >
                        Back to jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111827]">
            <Navbar />

            <main className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">

                    {/* Back button */}
                    <button
                        type="button"
                        className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF] transition hover:text-white"
                        onClick={() =>
                            navigate(
                                user?.role === "recruiter"
                                    ? "/recruiter/my-jobs"
                                    : "/find-jobs"
                            )
                        }
                    >
                        <ArrowLeft size={17} />
                        Back to jobs
                    </button>



                    <section className="rounded-2xl border border-white/10 bg-[#121222] p-6 sm:p-8">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                            {/* Job title + company */}
                            <div className="flex gap-4">

                                {/* Company logo */}
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#1B1B2E] text-[#A78BFA]">
                                    <BriefcaseBusiness size={25} />
                                </div>

                                <div>
                                    <h1 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                        {job.title}
                                    </h1>

                                    <p className="mt-1 text-sm font-medium text-[#A78BFA]">
                                        {job.company?.name}
                                    </p>

                                    {/* Basic job information */}
                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#9CA3AF]">

                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={15} />
                                            {job.location}
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <BriefcaseBusiness size={15} />
                                            {formatJobType(job.jobType)}
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <Clock3 size={15} />
                                            {job.experience}
                                        </span>

                                    </div>
                                </div>
                            </div>

                            {/* Salary + Recruiter actions */}
                            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">

                                {/* Salary */}
                                <div className="rounded-xl border border-white/10 bg-[#18182A] px-5 py-4">
                                    <p className="text-xs text-[#6B7280]">
                                        Salary
                                    </p>

                                    <p className="mt-1 flex items-center text-lg font-semibold text-white">
                                        <IndianRupee size={17} />

                                        {formatSalary(job.salaryMin)} -{" "}
                                        {formatSalary(job.salaryMax)}
                                    </p>

                                    <p className="mt-0.5 text-xs text-[#6B7280]">
                                        per month
                                    </p>
                                </div>

                                {/* Edit + Delete / Apply */}
                                {user?.role === "recruiter" ? (
                                    <div className="flex gap-2">

                                        <button
                                            type="button"
                                            className="flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2.5 text-sm font-medium text-[#D1D5DB] transition hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10 hover:text-white"
                                            onClick={() =>
                                                navigate(
                                                    `/recruiter/post-job/edit/${id}`
                                                )
                                            }
                                        >
                                            <Edit3 size={16} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            className="flex items-center gap-2 rounded-lg border border-red-500/20 px-3.5 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />

                                            {deleting
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>

                                    </div>
                                ) : (
                                    <>
                                        {applicationLoading ? (
                                            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-[#9CA3AF]">
                                                Checking application...
                                            </div>
                                        ) : myApplication ? (
                                            <div
                                                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 ${myApplication.status === "Applied"
                                                    ? "border-blue-400/20 bg-blue-400/10"
                                                    : myApplication.status === "Shortlisted"
                                                        ? "border-amber-400/20 bg-amber-400/10"
                                                        : myApplication.status === "Hired"
                                                            ? "border-mint/20 bg-mint/10"
                                                            : myApplication.status === "Rejected"
                                                                ? "border-red-400/20 bg-red-400/10"
                                                                : "border-white/10 bg-white/5"
                                                    }`}
                                            >
                                                <CheckCircle2
                                                    size={16}
                                                    className={
                                                        myApplication.status === "Applied"
                                                            ? "text-blue-400"
                                                            : myApplication.status === "Shortlisted"
                                                                ? "text-amber-400"
                                                                : myApplication.status === "Hired"
                                                                    ? "text-mint"
                                                                    : myApplication.status === "Rejected"
                                                                        ? "text-red-400"
                                                                        : "text-[#9CA3AF]"
                                                    }
                                                />

                                                <div>
                                                    <p className="text-xs text-[#9CA3AF]">
                                                        Application status
                                                    </p>

                                                    <p
                                                        className={`text-sm font-medium ${myApplication.status === "Applied"
                                                            ? "text-blue-400"
                                                            : myApplication.status === "Shortlisted"
                                                                ? "text-amber-400"
                                                                : myApplication.status === "Hired"
                                                                    ? "text-mint"
                                                                    : myApplication.status === "Rejected"
                                                                        ? "text-red-400"
                                                                        : "text-[#9CA3AF]"
                                                            }`}
                                                    >
                                                        {myApplication.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="flex items-center gap-2 rounded-lg bg-[#8B5CF6] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#7C3AED]"
                                                onClick={() => navigate(`/candidate/${id}/apply`)}
                                            >
                                                Apply now
                                                <ArrowRight size={16} />
                                            </button>
                                        )}
                                    </>
                                )}

                            </div>
                        </div>
                    </section>

                    {/* MAIN CONTENT */}

                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">

                        {/* LEFT CONTENT */}

                        <div className="space-y-6">

                            {/* About the role */}
                            <section className="rounded-2xl border border-white/10 bg-[#121222] p-6 sm:p-8">
                                <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-white">
                                    About the role
                                </h2>

                                <div className="mt-5 whitespace-pre-line text-sm leading-7 text-[#B6BBC7]">
                                    {job.description}
                                </div>
                            </section>

                            {/* Skills */}
                            <section className="rounded-2xl border border-white/10 bg-[#121222] p-6 sm:p-8">
                                <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-white">
                                    Skills required
                                </h2>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {job.skillsRequired.map(
                                        (skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-lg border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 px-3 py-1.5 text-xs font-medium text-[#C4B5FD]"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT SIDEBAR */}

                        <aside className="space-y-6">

                            {/* Job information */}
                            <section className="rounded-2xl border border-white/10 bg-[#121222] p-6">
                                <h2 className="font-['Space_Grotesk'] text-base font-semibold text-white">
                                    Job information
                                </h2>

                                <div className="mt-5 space-y-4">

                                    {/* Deadline */}
                                    <div className="flex items-start gap-3">
                                        <CalendarDays
                                            size={17}
                                            className="mt-0.5 text-[#A78BFA]"
                                        />

                                        <div>
                                            <p className="text-xs text-[#6B7280]">
                                                Application deadline
                                            </p>

                                            <p className="mt-1 text-sm text-[#E5E7EB]">
                                                {formatDeadline(
                                                    job.deadline
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-3">
                                        <MapPin
                                            size={17}
                                            className="mt-0.5 text-[#A78BFA]"
                                        />

                                        <div>
                                            <p className="text-xs text-[#6B7280]">
                                                Location
                                            </p>

                                            <p className="mt-1 text-sm text-[#E5E7EB]">
                                                {job.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Experience */}
                                    <div className="flex items-start gap-3">
                                        <Users
                                            size={17}
                                            className="mt-0.5 text-[#A78BFA]"
                                        />

                                        <div>
                                            <p className="text-xs text-[#6B7280]">
                                                Experience
                                            </p>

                                            <p className="mt-1 text-sm text-[#E5E7EB]">
                                                {job.experience}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </section>

                            {/* =====================================================
                                AI RESUME MATCH
                            ====================================================== */}

                            {user?.role === "candidate" && (
                                <section className="rounded-2xl border border-white/10 bg-[#121222] p-6">

                                    {/* Header */}
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8B5CF6]/10">
                                            <Sparkles
                                                size={20}
                                                className="text-[#A78BFA]"
                                            />
                                        </div>

                                        <div>
                                            <h2 className="font-['Space_Grotesk'] text-base font-semibold text-white">
                                                AI Resume Match
                                            </h2>

                                            <p className="text-xs text-[#6B7280]">
                                                See how well your resume matches
                                                this job
                                            </p>
                                        </div>

                                    </div>

                                    {/* Before Match */}
                                    {!matchResult && !matchLoading && (
                                        <>
                                            <p className="mt-5 text-sm leading-6 text-[#B6BBC7]">
                                                Let Anchor AI compare your resume
                                                with this job and estimate your
                                                compatibility.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={handleResumeMatch}
                                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#8B5CF6] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#7C3AED]"
                                            >
                                                <Sparkles size={16} />
                                                Match My Resume
                                            </button>

                                            {matchError && (
                                                <p className="mt-3 text-sm text-red-400">
                                                    {matchError}
                                                </p>
                                            )}
                                        </>
                                    )}

                                    {/* Loading */}
                                    {matchLoading && (
                                        <div className="mt-6 rounded-xl border border-white/10 bg-[#18182A] p-5 text-center">

                                            <Sparkles
                                                size={22}
                                                className="mx-auto animate-pulse text-[#A78BFA]"
                                            />

                                            <p className="mt-3 text-sm font-medium text-white">
                                                Analyzing your resume...
                                            </p>

                                            <p className="mt-1 text-xs text-[#6B7280]">
                                                Anchor AI is comparing your
                                                resume with this job.
                                            </p>

                                        </div>
                                    )}

                                    {/* AI Result */}
                                    {matchResult && !matchLoading && (
                                        <div className="mt-6">

                                            {/* Score */}
                                            <div className="rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/10 p-5 text-center">

                                                <p className="text-xs text-[#9CA3AF]">
                                                    AI Match Score
                                                </p>

                                                <p className="mt-1 text-4xl font-semibold text-[#A78BFA]">
                                                    {matchResult.score}%
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-white">
                                                    {getMatchLabel(
                                                        matchResult.score
                                                    )}
                                                </p>

                                            </div>

                                            {/* Feedback */}
                                            <div className="mt-5">

                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2
                                                        size={17}
                                                        className="text-[#A78BFA]"
                                                    />

                                                    <h3 className="text-sm font-medium text-white">
                                                        AI Feedback
                                                    </h3>
                                                </div>

                                                <p className="mt-3 text-sm leading-6 text-[#B6BBC7]">
                                                    {matchResult.feedback}
                                                </p>

                                            </div>

                                            {/* Check Again */}
                                            <button
                                                type="button"
                                                onClick={handleResumeMatch}
                                                className="mt-5 w-full rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-[#D1D5DB] transition hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10 hover:text-white"
                                            >
                                                Check Again
                                            </button>

                                        </div>
                                    )}

                                </section>
                            )}

                            {/* About company */}
                            <section className="rounded-2xl border border-white/10 bg-[#121222] p-6">

                                <h2 className="font-['Space_Grotesk'] text-base font-semibold text-white">
                                    About the company
                                </h2>

                                <div className="mt-4 flex items-center gap-3">

                                    {/* Company logo */}
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B1B2E] text-[#A78BFA]">
                                        <BriefcaseBusiness size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            {job.company?.name}
                                        </p>

                                        <p className="text-xs text-[#6B7280]">
                                            Technology & Software
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    disabled={!job.company?.website}
                                    onClick={() => {
                                        if (!job.company?.website) return;

                                        const website = job.company.website.startsWith("http")
                                            ? job.company.website
                                            : `https://${job.company.website}`;

                                        window.open(website, "_blank", "noopener,noreferrer");
                                    }}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-[#D1D5DB] transition hover:border-[#8B5CF6]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Globe size={16} />
                                    Visit company
                                </button>
                            </section>

                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
}