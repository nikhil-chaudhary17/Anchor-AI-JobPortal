import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, CalendarDays, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import api from "../../services/api";

const statusStyles = {
  Applied: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  Shortlisted: "border-mint/20 bg-mint/10 text-mint",
  Rejected: "border-red-400/20 bg-red-400/10 text-red-300",
  Hired: "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

const formatJobType = (jobType) => {
  if (!jobType) return "Not specified";

  return jobType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (date) => {
  if (!date) return "Unknown date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function MyApplications() {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/applications/my-applications");

        setApplications(res.data.applications || []);
      } catch (error) {
        console.error("Failed to fetch applications:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your applications."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-navy text-paper">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-mint">
            Candidate
          </p>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            My Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8F96AC]">
            Track the jobs you have applied for and monitor your application
            status.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-white/10 bg-white/3 p-10 text-center">
            <p className="text-sm text-[#8F96AC]">
              Loading your applications...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-6">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && applications.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/3 px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <Briefcase size={21} className="text-[#7F879F]" />
            </div>

            <h2 className="mt-4 text-base font-semibold text-paper">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7F879F]">
              Once you apply for a job, your application will appear here.
            </p>

            <button
              type="button"
              onClick={() => navigate("/find-jobs")}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-mint px-4 py-2.5 text-sm font-semibold text-navy transition hover:opacity-90"
            >
              Find jobs
              <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Applications */}
        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((application) => {
              const job = application.jobId;

              if (!job) return null;

              const status =
                statusStyles[application.status] ||
                "border-white/10 bg-white/5 text-[#A5ABC2]";

              return (
                <article
                  key={application._id}
                  className="rounded-xl border border-white/10 bg-white/3 p-5 transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Job information */}
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-mint/10">
                          <Briefcase size={18} className="text-mint" />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-base font-semibold text-paper">
                            {job.title}
                          </h2>

                          <p className="mt-1 text-sm text-[#A5ABC2]">
                            {job.company?.name || "Company"}
                          </p>
                        </div>
                      </div>

                      {/* Job metadata */}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#7F879F]">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} />
                          {job.location || "Location not specified"}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase size={14} />
                          {formatJobType(job.jobType)}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          Applied {formatDate(application.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Status + actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <span
                        className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-medium ${status}`}
                      >
                        {application.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-paper transition hover:border-white/20 hover:bg-white/10"
                      >
                        View Job
                        <ArrowRight size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/candidate/${job._id}/interview-prep`)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-mint/20 bg-mint/5 px-4 py-2.5 text-xs font-medium text-mint transition hover:bg-mint/10"
                      >
                        ✨ Interview Prep
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}