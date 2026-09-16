import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Briefcase,
    FileText,
    Loader2,
    Mail,
    User,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

const statusStyles = {
    Applied: "border-blue-400/20 bg-blue-400/10 text-blue-300",
    Shortlisted: "border-mint/20 bg-mint/10 text-mint",
    Rejected: "border-red-400/20 bg-red-400/10 text-red-300",
    Hired: "border-amber/20 bg-amber/10 text-amber",
};

export default function Applicants() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await api.get(`/applications/job/${jobId}/applicants`);

                setApplications(res.data.applications || []);
            } catch (error) {
                console.error("Failed to fetch applicants:", error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load applicants right now."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobId]);


    const handleDelete = async (applicationId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this rejected application?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/applications/${applicationId}`);

            setApplications((prevApplications) =>
                prevApplications.filter(
                    (application) => application._id !== applicationId
                )
            );

            alert("Application deleted successfully.");
        } catch (error) {
            console.error("Failed to delete application:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete application. Please try again."
            );
        }
    };


    const handleStatusChange = async (applicationId, status) => {
        try {
            setUpdatingId(applicationId);

            const res = await api.put(`/applications/${applicationId}/status`, {
                status,
            });

            setApplications((prevApplications) =>
                prevApplications.map((application) =>
                    application._id === applicationId
                        ? {
                            ...application,
                            status: res.data.application.status,
                        }
                        : application
                )
            );
        } catch (error) {
            console.error("Failed to update application status:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update application status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-navy text-paper">
            <Navbar />

            <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate("/recruiter/my-jobs")}
                    className="mb-7 inline-flex items-center gap-2 text-sm text-[#8F96AC] transition hover:text-paper"
                >
                    <ArrowLeft size={16} />
                    Back to my jobs
                </button>

                {/* Header */}
                <section className="mb-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mint/10">
                            <Briefcase size={21} className="text-mint" />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-mint">
                                Recruiter
                            </p>

                            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                                Job Applicants
                            </h1>

                            <p className="mt-2 text-sm text-[#8F96AC]">
                                Review candidates who applied for this job.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Loading */}
                {loading && (
                    <div className="rounded-xl border border-white/10 bg-white/3 p-10 text-center">
                        <Loader2
                            size={26}
                            className="mx-auto animate-spin text-mint"
                        />

                        <p className="mt-3 text-sm text-[#8F96AC]">
                            Loading applicants...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-6 text-center">
                        <XCircle
                            size={28}
                            className="mx-auto text-red-300"
                        />

                        <p className="mt-3 text-sm text-red-300">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-paper transition hover:bg-white/10"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && applications.length === 0 && (
                    <div className="rounded-xl border border-white/10 bg-white/3 p-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                            <User size={25} className="text-[#626A80]" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold">
                            No applicants yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7F879F]">
                            Candidates who apply for this job will appear here.
                        </p>
                    </div>
                )}

                {/* Applicants */}
                {!loading && !error && applications.length > 0 && (
                    <>
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-sm text-[#8F96AC]">
                                {applications.length}{" "}
                                {applications.length === 1
                                    ? "applicant"
                                    : "applicants"}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {applications.map((application) => {
                                const candidate = application.candidateId;

                                const statusClass =
                                    statusStyles[application.status] ||
                                    "border-white/10 bg-white/5 text-[#A5ABC2]";

                                return (
                                    <article
                                        key={application._id}
                                        className="rounded-xl border border-white/10 bg-white/3 p-5 transition hover:border-white/15"
                                    >
                                        {/* Top */}
                                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                            <div className="flex min-w-0 items-start gap-4">
                                                {/* Avatar */}
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-mint/10">
                                                    {candidate?.avatar ? (
                                                        <img
                                                            src={candidate.avatar}
                                                            alt={candidate.name || "Candidate"}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <User
                                                            size={19}
                                                            className="text-mint"
                                                        />
                                                    )}
                                                </div>

                                                {/* Candidate info */}
                                                <div className="min-w-0">
                                                    <h2 className="truncate text-base font-semibold text-paper">
                                                        {candidate?.name || "Candidate"}
                                                    </h2>

                                                    <div className="mt-1 flex items-center gap-2 text-xs text-[#8F96AC]">
                                                        <Mail size={13} />
                                                        <span className="truncate">
                                                            {candidate?.email || "No email"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <span
                                                className={`w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${statusClass}`}
                                            >
                                                {application.status}
                                            </span>
                                        </div>

                                        {/* Candidate details */}
                                        <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-2">
                                            {/* Skills */}
                                            <div>
                                                <p className="text-xs text-[#626A80]">
                                                    Skills
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {candidate?.skills?.length > 0 ? (
                                                        candidate.skills.map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-[#A5ABC2]"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-[#626A80]">
                                                            No skills added
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* AI Score */}
                                            <div>
                                                <p className="text-xs text-[#626A80]">
                                                    AI Match Score
                                                </p>

                                                <div className="mt-2">
                                                    {application.AIScore !== null &&
                                                        application.AIScore !== undefined ? (
                                                        <span className="text-lg font-semibold text-mint">
                                                            {application.AIScore}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-[#626A80]">
                                                            Not analyzed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        {candidate?.bio && (
                                            <div className="mt-4">
                                                <p className="text-xs text-[#626A80]">
                                                    About candidate
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-[#8F96AC]">
                                                    {candidate.bio}
                                                </p>
                                            </div>
                                        )}

                                        {/* Cover Letter */}
                                        <div className="mt-4">
                                            <p className="text-xs text-[#626A80]">
                                                Cover Letter
                                            </p>

                                            {application.coverLetter ? (
                                                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#8F96AC]">
                                                    {application.coverLetter}
                                                </p>
                                            ) : (
                                                <p className="mt-1 text-sm text-[#626A80]">
                                                    No cover letter provided
                                                </p>
                                            )}
                                        </div>

                                        {/* Bottom actions */}
                                        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                            {/* Resume */}
                                            <div>
                                                {application.resume ? (
                                                    <a
                                                        href={application.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-paper transition hover:bg-white/10"
                                                    >
                                                        <FileText size={15} />
                                                        View Resume
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-[#626A80]">
                                                        Resume unavailable
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label
                                                    htmlFor={`status-${application._id}`}
                                                    className="text-xs text-[#626A80]"
                                                >
                                                    Status
                                                </label>

                                                <select
                                                    id={`status-${application._id}`}
                                                    value={application.status}
                                                    disabled={updatingId === application._id}
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            application._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="rounded-md border border-white/10 bg-[#121222] px-3 py-2 text-xs text-paper outline-none transition focus:border-mint/40 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <option value="Applied">
                                                        Applied
                                                    </option>

                                                    <option value="Shortlisted">
                                                        Shortlisted
                                                    </option>

                                                    <option value="Rejected">
                                                        Rejected
                                                    </option>

                                                    <option value="Hired">
                                                        Hired
                                                    </option>
                                                </select>

                                                {updatingId === application._id && (
                                                    <Loader2
                                                        size={15}
                                                        className="animate-spin text-mint"
                                                    />
                                                )}

                                                {application.status === "Rejected" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(application._id)}
                                                        className="rounded-md border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs font-medium text-red-300 transition hover:border-red-400/40 hover:bg-red-400/10"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}