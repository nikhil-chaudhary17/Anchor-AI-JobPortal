import { useEffect, useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    Briefcase,
    Loader2,
    MapPin,
    MessageSquare,
    Sparkles,
    Target,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

const difficultyStyles = {
    Easy: "border-mint/20 bg-mint/5 text-mint",
    Medium: "border-amber-400/20 bg-amber-400/5 text-amber-300",
    Hard: "border-red-400/20 bg-red-400/5 text-red-300",
};

const formatJobType = (jobType) => {
    if (!jobType) return "Not specified";

    return jobType
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export default function InterviewPrep() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const [prep, setPrep] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}`);
                setJob(res.data.job);
            } catch (error) {
                console.error("Failed to load job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const generateInterviewPrep = async () => {
        if (!job) return;

        try {
            setAiLoading(true);
            setAiError("");

            const response = await api.post("/ai/interview-prep", {
                jobTitle: job.title,
                jobDescription: job.description,
                skills: job.skillsRequired,
            });

            setPrep(response.data.result);
        } catch (error) {
            console.error("Interview preparation failed:", error);

            setAiError(
                error.response?.data?.message ||
                "Unable to generate interview preparation right now."
            );
        } finally {
            setAiLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-navy text-paper">
                <Navbar />

                <main className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-sm text-[#8F96AC]">
                        Loading interview preparation...
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
                    <div className="text-center">
                        <p className="text-sm text-red-300">
                            Unable to load this job.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/candidate/applications")}
                            className="mt-4 text-sm text-mint hover:underline"
                        >
                            Back to applications
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy text-paper">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate("/candidate/my-applications")}
                    className="mb-7 inline-flex items-center gap-2 text-sm text-[#8F96AC] transition hover:text-paper"
                >
                    <ArrowLeft size={16} />
                    Back to applications
                </button>

                {/* Header */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/3">
                    <div className="border-b border-white/10 bg-linear-to-r from-mint/10 via-transparent to-transparent p-6 sm:p-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mint/10">
                                    <Sparkles size={22} className="text-mint" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-mint">
                                        AI Interview Preparation
                                    </p>

                                    <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                                        Prepare for your interview
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8F96AC]">
                                        Get personalized interview questions based on this job
                                        and your skills.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={generateInterviewPrep}
                                disabled={aiLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-md bg-mint px-4 py-2.5 text-sm font-semibold text-navy transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {aiLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        {prep ? "Regenerate with AI" : "Generate with AI"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Job summary */}
                    <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
                        <div>
                            <p className="text-xs text-[#626A80]">Position</p>

                            <div className="mt-1 flex items-center gap-2">
                                <Briefcase size={15} className="text-mint" />

                                <p className="text-sm font-medium text-paper">
                                    {job.title}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-[#626A80]">Company</p>

                            <p className="mt-1 text-sm font-medium text-paper">
                                {job.company?.name || "Company"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-[#626A80]">Location</p>

                            <div className="mt-1 flex items-center gap-2">
                                <MapPin size={15} className="text-mint" />

                                <p className="text-sm font-medium text-paper">
                                    {job.location || "Not specified"}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-[#626A80]">Job type</p>

                            <p className="mt-1 text-sm font-medium text-paper">
                                {formatJobType(job.jobType)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Error */}
                {aiError && (
                    <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-4">
                        <p className="text-sm text-red-300">{aiError}</p>
                    </div>
                )}

                {/* Before AI generation */}
                {!prep && !aiLoading && (
                    <section className="mt-6 rounded-xl border border-white/10 bg-white/3 p-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint/10">
                            <Target size={24} className="text-mint" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold">
                            Ready to prepare?
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#7F879F]">
                            Click "Generate with AI" to create technical, behavioral, and
                            scenario-based interview questions specifically for this role.
                        </p>

                        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-2">
                            <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#A5ABC2]">
                                5 Technical
                            </span>

                            <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#A5ABC2]">
                                3 Behavioral
                            </span>

                            <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#A5ABC2]">
                                2 Scenario
                            </span>
                        </div>
                    </section>
                )}

                {/* Loading */}
                {aiLoading && (
                    <section className="mt-6 rounded-xl border border-white/10 bg-white/3 p-10 text-center">
                        <Loader2
                            size={28}
                            className="mx-auto animate-spin text-mint"
                        />

                        <h2 className="mt-4 text-base font-semibold">
                            AI is preparing your interview...
                        </h2>

                        <p className="mt-2 text-sm text-[#7F879F]">
                            Analyzing the job description and required skills.
                        </p>
                    </section>
                )}

                {/* AI Results */}
                {prep && !aiLoading && (
                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        {/* Main questions */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Technical */}
                            <QuestionSection
                                icon={<BookOpen size={18} className="text-mint" />}
                                title="Technical Questions"
                                description="Test your technical knowledge for this role."
                                questions={prep.technicalQuestions}
                            />

                            {/* Behavioral */}
                            <QuestionSection
                                icon={<MessageSquare size={18} className="text-mint" />}
                                title="Behavioral Questions"
                                description="Prepare for questions about your experience and approach."
                                questions={prep.behavioralQuestions}
                            />

                            {/* Scenario */}
                            <QuestionSection
                                icon={<Target size={18} className="text-mint" />}
                                title="Scenario Questions"
                                description="Practice solving realistic situations you may face."
                                questions={prep.scenarioQuestions}
                            />
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Skills */}
                            <section className="rounded-xl border border-white/10 bg-white/3 p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-mint/10">
                                        <Briefcase size={17} className="text-mint" />
                                    </div>

                                    <div>
                                        <h2 className="text-base font-semibold">
                                            Job skills
                                        </h2>

                                        <p className="mt-1 text-xs text-[#7F879F]">
                                            Skills considered by the AI.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {(job.skillsRequired || []).map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#A5ABC2]"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Preparation tip */}
                            <section className="rounded-xl border border-mint/15 bg-mint/5 p-6">
                                <div className="flex items-start gap-3">
                                    <Sparkles
                                        size={18}
                                        className="mt-0.5 shrink-0 text-mint"
                                    />

                                    <div>
                                        <h2 className="text-sm font-semibold">
                                            AI preparation tip
                                        </h2>

                                        <p className="mt-2 text-xs leading-5 text-[#A5ABC2]">
                                            Don't just memorize answers. Practice explaining your
                                            reasoning and connect your answers to projects you have
                                            actually worked on.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Back to job */}
                            <button
                                type="button"
                                onClick={() => navigate(`/jobs/${id}`)}
                                className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-paper transition hover:bg-white/10"
                            >
                                <Briefcase size={15} />
                                View Job Details
                            </button>
                        </aside>
                    </div>
                )}
            </main>
        </div>
    );
}

function QuestionSection({
    icon,
    title,
    description,
    questions = [],
}) {
    return (
        <section className="rounded-xl border border-white/10 bg-white/3 p-6">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-mint/10">
                    {icon}
                </div>

                <div>
                    <h2 className="text-base font-semibold">{title}</h2>

                    <p className="mt-1 text-xs text-[#7F879F]">
                        {description}
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {questions.map((item, index) => {
                    const difficulty =
                        difficultyStyles[item.difficulty] ||
                        "border-white/10 bg-white/5 text-[#A5ABC2]";

                    return (
                        <div
                            key={`${item.question}-${index}`}
                            className="rounded-lg border border-white/10 bg-white/5 p-4"
                        >
                            <div className="flex items-start gap-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mint/10 text-xs font-semibold text-mint">
                                    {index + 1}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <p className="text-sm font-medium leading-6 text-paper">
                                            {item.question}
                                        </p>

                                        <span
                                            className={`w-fit shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${difficulty}`}
                                        >
                                            {item.difficulty}
                                        </span>
                                    </div>

                                    <div className="mt-3 rounded-md border border-white/10 bg-black/10 px-3 py-2.5">
                                        <p className="text-[11px] font-medium uppercase tracking-wider text-[#626A80]">
                                            What to expect
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-[#8F96AC]">
                                            {item.whatToExpect}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}