import {
    BriefcaseBusiness,
    FileText,
    UserRound,
    ArrowRight,
    CheckCircle2,
    Clock3,
    Search,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState("");

    const [applications, setApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);

    const profileFields = [
        user?.name,
        user?.bio,
        user?.phone,
        user?.location,
        user?.skills?.length > 0,
        user?.resume?.url,
    ];

    const completedFields = profileFields.filter(Boolean).length;

    const profileCompletion = Math.round(
        (completedFields / profileFields.length) * 100
    );

    const hasBasicInfo = Boolean(
        user?.name &&
        user?.email &&
        user?.phone &&
        user?.location
    );

    const hasResume = Boolean(user?.resume?.url);
    const hasBio = Boolean(user?.bio?.trim());
    const hasSkills = user?.skills?.length > 0;


    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get("/applications/my-applications");
                setApplications(res.data.applications || []);
            } catch (error) {
                console.error("Failed to fetch applications:", error);
            } finally {
                setApplicationsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!user?.skills?.length) {
                setRecommendations([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                // Get all available jobs
                const jobsRes = await api.get("/jobs");

                const jobs = jobsRes.data.jobs || [];

                if (jobs.length === 0) {
                    setRecommendations([]);
                    return;
                }

                // Send only required job information to AI
                const jobsForAI = jobs.map((job) => ({
                    jobId: job._id,
                    title: job.title,
                    description: job.description,
                    location: job.location,
                    jobType: job.jobType,
                    experience: job.experience,
                    skillsRequired: job.skillsRequired,
                }));

                // Ask AI for recommendations
                const aiRes = await api.post("/ai/job-recommendations", {
                    skills: user.skills,
                    jobs: jobsForAI,
                });

                const aiRecommendations =
                    aiRes.data.result?.recommendations || [];

                // Match AI recommendations with actual jobs
                const recommendedJobs = aiRecommendations
                    .map((recommendation) => {
                        const job = jobs.find(
                            (job) =>
                                String(job._id) ===
                                String(recommendation.jobId)
                        );

                        if (!job) {
                            return null;
                        }

                        return {
                            ...job,
                            matchScore: recommendation.matchScore,
                            reason: recommendation.reason,
                        };
                    })
                    .filter(Boolean);

                setRecommendations(recommendedJobs);
            } catch (error) {
                console.error(
                    "Failed to fetch job recommendations:",
                    error
                );

                setError(
                    "Unable to load AI job recommendations right now."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user?.skills]);

    return (
        <div className="min-h-screen bg-[#080B14] text-paper">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                {/* Welcome */}
                <section className="mb-8">
                    <p className="mb-2 text-sm text-mint">
                        Candidate Dashboard
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                        Welcome back,{" "}
                        {user?.name?.split(" ")[0] || "there"} 👋
                    </h1>

                    <p className="mt-2 text-[#7A81A0]">
                        Find opportunities that match your skills and career
                        goals.
                    </p>
                </section>

                {/* Quick Stats */}
                <section className="grid gap-4 md:grid-cols-3">
                    {/* Profile */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                                <UserRound
                                    size={20}
                                    className="text-mint"
                                />
                            </div>

                            <span className="text-xs text-[#7A81A0]">
                                Profile
                            </span>
                        </div>

                        <h2 className="text-2xl font-semibold">
                            {profileCompletion === 100
                                ? "Complete"
                                : `${profileCompletion}%`}
                        </h2>

                        <p className="mt-1 text-sm text-[#7A81A0]">
                            Keep your profile updated.
                        </p>
                    </div>

                    {/* Resume */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                                <FileText
                                    size={20}
                                    className="text-mint"
                                />
                            </div>

                            <span className="text-xs text-[#7A81A0]">
                                Resume
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {user?.resume?.url ? (
                                <>
                                    <CheckCircle2
                                        size={18}
                                        className="text-mint"
                                    />

                                    <h2 className="text-2xl font-semibold">
                                        Uploaded
                                    </h2>
                                </>
                            ) : (
                                <>
                                    <Clock3
                                        size={18}
                                        className="text-amber"
                                    />

                                    <h2 className="text-2xl font-semibold">
                                        Missing
                                    </h2>
                                </>
                            )}
                        </div>

                        <p className="mt-1 text-sm text-[#7A81A0]">
                            {user?.resume?.url
                                ? "Your resume is ready."
                                : "Upload your resume to apply."}
                        </p>
                    </div>

                    {/* Applications */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5"
                        onClick={() => navigate("/candidate/my-applications")}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                                <BriefcaseBusiness
                                    size={20}
                                    className="text-mint"
                                />
                            </div>

                            <span className="text-xs text-[#7A81A0]">
                                Applications
                            </span>
                        </div>

                        <h2 className="text-2xl font-semibold">{applicationsLoading ? "__" : applications.length}</h2>

                        <p className="mt-1 text-sm text-[#7A81A0]">
                            Applications submitted
                        </p>
                    </div>
                </section>

                {/* Main Content */}
                <section className="mt-8 grid gap-6 lg:grid-cols-3">
                    {/* Recommended Jobs */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Recommended Jobs
                                </h2>

                                <p className="mt-1 text-sm text-[#7A81A0]">
                                    AI-powered opportunities based on your
                                    skills.
                                </p>
                            </div>

                            <BriefcaseBusiness
                                size={22}
                                className="text-mint"
                            />
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="flex min-h-55 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 px-6 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                                    <Search
                                        size={22}
                                        className="animate-pulse text-mint"
                                    />
                                </div>

                                <h3 className="text-base font-medium">
                                    Finding your best matches...
                                </h3>

                                <p className="mt-2 max-w-md text-sm text-[#7A81A0]">
                                    Our AI is analyzing available jobs against
                                    your skills.
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <div className="flex min-h-55 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 px-6 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                                    <Search
                                        size={22}
                                        className="text-amber"
                                    />
                                </div>

                                <h3 className="text-base font-medium">
                                    Recommendations unavailable
                                </h3>

                                <p className="mt-2 max-w-md text-sm text-[#7A81A0]">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* No Skills */}
                        {!loading && !error && !hasSkills && (
                            <div className="flex min-h-55 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 px-6 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                                    <UserRound
                                        size={22}
                                        className="text-[#7A81A0]"
                                    />
                                </div>

                                <h3 className="text-base font-medium">
                                    Add your skills first
                                </h3>

                                <p className="mt-2 max-w-md text-sm text-[#7A81A0]">
                                    Add your technical skills to your profile
                                    so Anchor can recommend relevant jobs.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/candidate/profile")
                                    }
                                    className="mt-5 flex items-center gap-2 rounded-md bg-mint px-4 py-2 text-sm font-medium text-[#080B14] transition hover:opacity-90"
                                >
                                    Add Skills
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* No Recommendations */}
                        {!loading &&
                            !error &&
                            hasSkills &&
                            recommendations.length === 0 && (
                                <div className="flex min-h-55 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 px-6 text-center">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                                        <Search
                                            size={22}
                                            className="text-[#7A81A0]"
                                        />
                                    </div>

                                    <h3 className="text-base font-medium">
                                        No matching jobs found
                                    </h3>

                                    <p className="mt-2 max-w-md text-sm text-[#7A81A0]">
                                        We couldn't find jobs that strongly
                                        match your current skills. Check back
                                        as new jobs are posted.
                                    </p>
                                </div>
                            )}

                        {/* Recommended Job Cards */}
                        {!loading &&
                            !error &&
                            recommendations.length > 0 && (
                                <div className="space-y-4">
                                    {recommendations.map((job) => (
                                        <div
                                            key={job._id}
                                            className="rounded-lg border border-white/10 bg-[#080B14]/60 p-5 transition hover:border-white/20"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        {job.title}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-mint">
                                                        {job.company?.name ||
                                                            "Company"}
                                                    </p>
                                                </div>

                                                {/* AI Match Score */}
                                                <div className="shrink-0 rounded-md border border-mint/20 bg-mint/10 px-3 py-2 text-center">
                                                    <p className="text-xs text-[#7A81A0]">
                                                        AI Match
                                                    </p>

                                                    <p className="text-lg font-semibold text-mint">
                                                        {job.matchScore}%
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Job Info */}
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {job.location && (
                                                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[#A5ABC2]">
                                                        {job.location}
                                                    </span>
                                                )}

                                                {job.jobType && (
                                                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[#A5ABC2]">
                                                        {job.jobType}
                                                    </span>
                                                )}

                                                {job.experience && (
                                                    <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-[#A5ABC2]">
                                                        {job.experience}
                                                    </span>
                                                )}
                                            </div>

                                            {/* AI Reason */}
                                            {job.reason && (
                                                <p className="mt-4 text-sm leading-6 text-[#A5ABC2]">
                                                    <span className="font-medium text-paper">
                                                        Why this matches:{" "}
                                                    </span>
                                                    {job.reason}
                                                </p>
                                            )}

                                            {/* View Details */}
                                            <div className="mt-5 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/jobs/${job._id}`
                                                        )
                                                    }
                                                    className="flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-medium transition hover:border-amber hover:text-amber"
                                                >
                                                    View Details
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>

                    {/* Profile Completion */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <h2 className="text-xl font-semibold">
                            Profile
                        </h2>

                        <p className="mt-1 text-sm text-[#7A81A0]">
                            Make your profile stand out to employers.
                        </p>

                        <div className="mt-6">
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span>Profile completion</span>

                                <span className="text-mint">
                                    {profileCompletion}%
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-mint"
                                    style={{
                                        width: `${profileCompletion}%`,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {/* Basic Information */}
                            <div className="flex items-center gap-3">
                                {hasBasicInfo ? (
                                    <CheckCircle2
                                        size={18}
                                        className="text-mint"
                                    />
                                ) : (
                                    <Clock3
                                        size={18}
                                        className="text-amber"
                                    />
                                )}

                                <span className="text-sm">
                                    Basic information
                                </span>
                            </div>

                            {/* Bio */}
                            <div className="flex items-center gap-3">
                                {hasBio ? (
                                    <CheckCircle2
                                        size={18}
                                        className="text-mint"
                                    />
                                ) : (
                                    <Clock3
                                        size={18}
                                        className="text-amber"
                                    />
                                )}

                                <span className="text-sm">
                                    Bio added
                                </span>
                            </div>

                            {/* Skills */}
                            <div className="flex items-center gap-3">
                                {hasSkills ? (
                                    <CheckCircle2
                                        size={18}
                                        className="text-mint"
                                    />
                                ) : (
                                    <Clock3
                                        size={18}
                                        className="text-amber"
                                    />
                                )}

                                <span className="text-sm">
                                    Skills added
                                </span>
                            </div>

                            {/* Resume */}
                            <div className="flex items-center gap-3">
                                {hasResume ? (
                                    <CheckCircle2
                                        size={18}
                                        className="text-mint"
                                    />
                                ) : (
                                    <Clock3
                                        size={18}
                                        className="text-amber"
                                    />
                                )}

                                <span className="text-sm">
                                    Resume uploaded
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/candidate/profile")
                            }
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm font-medium transition hover:border-amber hover:text-amber"
                        >
                            Edit Profile
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mt-8">
                    <h2 className="mb-4 text-xl font-semibold">
                        Quick Actions
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">
                        <button
                            type="button"
                            onClick={() => navigate("/find-jobs")}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20"
                        >
                            <div>
                                <p className="font-medium">Find Jobs</p>

                                <p className="mt-1 text-sm text-[#7A81A0]">
                                    Explore new opportunities
                                </p>
                            </div>

                            <ArrowRight size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/candidate/profile")
                            }
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20"
                        >
                            <div>
                                <p className="font-medium">
                                    Edit Profile
                                </p>

                                <p className="mt-1 text-sm text-[#7A81A0]">
                                    Update your information
                                </p>
                            </div>

                            <ArrowRight size={18} />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/candidate/my-applications")
                            }
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20"
                        >
                            <div>
                                <p className="font-medium">
                                    My Applications
                                </p>

                                <p className="mt-1 text-sm text-[#7A81A0]">
                                    Track your applications
                                </p>
                            </div>

                            <ArrowRight size={18} />
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}