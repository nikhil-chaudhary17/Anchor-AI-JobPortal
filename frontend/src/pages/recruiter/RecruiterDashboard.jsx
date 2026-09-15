import {
  BriefcaseBusiness,
  Building2,
  Users,
  UserCheck,
  Plus,
  ArrowRight,
  MapPin,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [jobsRes, companyRes] = await Promise.all([
          api.get("/jobs/my-jobs"),
          api.get("/company/my-company"),
        ]);

        const recruiterJobs = jobsRes.data.jobs || [];

        setJobs(recruiterJobs);
        setCompany(companyRes.data.company || null);

        if (recruiterJobs.length > 0) {
          const applicantResponses = await Promise.all(
            recruiterJobs.map(async (job) => {
              try {
                const res = await api.get(
                  `/applications/job/${job._id}/applicants`
                );

                return res.data.applications || [];
              } catch (error) {
                console.error(
                  `Failed to fetch applicants for job ${job._id}:`,
                  error
                );

                return [];
              }
            })
          );

          const allApplications = applicantResponses.flat();

          setApplications(allApplications);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch recruiter dashboard data:",
          error
        );
      } finally {
        setLoading(false);
        setApplicationsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeJobs = jobs.filter((job) => {
    if (!job.deadline) {
      return true;
    }

    const deadline = new Date(job.deadline);
    deadline.setHours(0, 0, 0, 0);

    return deadline >= today;
  });

  const recentJobs = jobs.slice(0, 3);

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  const hiredCount = applications.filter(
    (application) => application.status === "Hired"
  ).length;

  const formatJobType = (jobType) => {
    if (!jobType) return "";

    return jobType
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const formatSalary = (min, max) => {
    if (!min && !max) {
      return "Salary not specified";
    }

    if (min && max) {
      return `₹${min.toLocaleString(
        "en-IN"
      )} - ₹${max.toLocaleString("en-IN")}`;
    }

    if (min) {
      return `₹${min.toLocaleString("en-IN")}+`;
    }

    return `Up to ₹${max.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen bg-navy text-paper">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-amber">
              Recruiter Dashboard
            </p>

            <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-semibold md:text-4xl">
              Welcome back 👋
            </h1>

            <p className="mt-2 text-sm text-[#7A81A0]">
              Manage your company, jobs and applications from here.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/recruiter/post-job")}
            className="flex w-fit items-center gap-2 rounded-md bg-amber px-5 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:scale-[1.03]"
          >
            <Plus size={16} />
            Post a new job
          </button>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active Jobs */}
          <div className="rounded-xl border border-white/10 bg-white/3 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
                <BriefcaseBusiness
                  size={20}
                  className="text-amber"
                />
              </div>

              <span className="text-xs text-mint">
                Active
              </span>
            </div>

            <p className="mt-5 text-3xl font-semibold">
              {loading ? "—" : activeJobs.length}
            </p>

            <p className="mt-1 text-sm text-[#7A81A0]">
              Active jobs
            </p>
          </div>

          {/* Applications */}
          <div
            onClick={() => navigate("/recruiter/my-jobs")}
            className="cursor-pointer rounded-xl border border-white/10 bg-white/3 p-5 backdrop-blur transition hover:border-mint/30 hover:bg-white/5"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint/10">
                <Users
                  size={20}
                  className="text-mint"
                />
              </div>

              <span className="text-xs text-[#7A81A0]">
                Total
              </span>
            </div>

            <p className="mt-5 text-3xl font-semibold">
              {applicationsLoading
                ? "—"
                : applications.length}
            </p>

            <p className="mt-1 text-sm text-[#7A81A0]">
              Applications
            </p>
          </div>

          {/* Shortlisted */}
          <div className="rounded-xl border border-white/10 bg-white/3 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                <UserCheck
                  size={20}
                  className="text-paper"
                />
              </div>

              <span className="text-xs text-[#7A81A0]">
                Candidates
              </span>
            </div>

            <p className="mt-5 text-3xl font-semibold">
              {applicationsLoading
                ? "—"
                : shortlistedCount}
            </p>

            <p className="mt-1 text-sm text-[#7A81A0]">
              Shortlisted
            </p>
          </div>

          {/* Hires */}
          <div className="rounded-xl border border-white/10 bg-white/3 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
                <UserCheck
                  size={20}
                  className="text-amber"
                />
              </div>

              <span className="text-xs text-[#7A81A0]">
                Candidates
              </span>
            </div>

            <p className="mt-5 text-3xl font-semibold">
              {applicationsLoading
                ? "—"
                : hiredCount}
            </p>

            <p className="mt-1 text-sm text-[#7A81A0]">
              Hires
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Company Card */}
          <div className="rounded-xl border border-white/10 bg-white/3 p-6 backdrop-blur lg:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="font-['Space_Grotesk'] text-lg font-semibold">
                Your company
              </h2>

              <Building2
                size={20}
                className="text-amber"
              />
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-5">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-amber to-mint">
                {company?.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2
                    size={25}
                    className="text-navy"
                  />
                )}
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                {company?.name || "Your Company"}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-sm text-[#7A81A0]">
                <MapPin size={14} />

                <span>
                  {company?.location ||
                    "Add your company location"}
                </span>
              </div>

              <button
                type="button"
                className="mt-5 flex items-center gap-2 text-sm font-medium text-amber transition-colors hover:text-mint"
                onClick={() =>
                  navigate("/company/profile")
                }
              >
                View company profile
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Jobs */}
          <div className="rounded-xl border border-white/10 bg-white/3 p-6 backdrop-blur lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-['Space_Grotesk'] text-lg font-semibold">
                  Your jobs
                </h2>

                <p className="mt-1 text-sm text-[#7A81A0]">
                  Manage the jobs you have posted.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/recruiter/my-jobs")
                }
                className="flex items-center gap-1.5 text-sm font-medium text-amber transition-colors hover:text-mint"
              >
                View all
                <ArrowRight size={15} />
              </button>
            </div>

            {loading ? (
              <div className="mt-6 flex min-h-52 items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/2">
                <p className="text-sm text-[#7A81A0]">
                  Loading jobs...
                </p>
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <BriefcaseBusiness
                    size={21}
                    className="text-[#7A81A0]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  No jobs posted yet
                </h3>

                <p className="mt-1 max-w-sm text-xs text-[#7A81A0]">
                  Create your first job posting and start
                  finding the right candidates.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/recruiter/post-job")
                  }
                  className="mt-4 flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-xs font-medium transition-colors hover:border-amber hover:text-amber"
                >
                  <Plus size={14} />
                  Create your first job
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {recentJobs.map((job) => {
                  const jobIsExpired =
                    job.deadline &&
                    new Date(job.deadline) < today;

                  return (
                    <div
                      key={job._id}
                      className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold">
                            {job.title}
                          </h3>

                          {jobIsExpired && (
                            <span className="shrink-0 rounded-full border border-red-400/20 bg-red-400/10 px-2 py-0.5 text-[10px] text-red-300">
                              Expired
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#7A81A0]">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={13} />
                            {job.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            {formatJobType(job.jobType)}
                          </span>

                          <span>
                            {formatSalary(
                              job.salaryMin,
                              job.salaryMax
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Job Actions */}
                      <div className="flex shrink-0 items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/recruiter/applicants/${job._id}`
                            )
                          }
                          className="flex items-center gap-1.5 text-xs font-medium text-mint transition-colors hover:text-paper"
                        >
                          Applicants
                          <Users size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/jobs/${job._id}`)
                          }
                          className="flex items-center gap-1.5 text-xs font-medium text-amber transition-colors hover:text-mint"
                        >
                          View
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Post Job */}
          <button
            type="button"
            onClick={() =>
              navigate("/recruiter/post-job")
            }
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/3 p-5 text-left transition-all hover:border-amber/40 hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10">
                <Plus
                  size={19}
                  className="text-amber"
                />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Post a job
                </p>

                <p className="mt-1 text-xs text-[#7A81A0]">
                  Create a new opening
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="text-[#7A81A0] transition-transform group-hover:translate-x-1"
            />
          </button>

          {/* Company Profile */}
          <button
            type="button"
            onClick={() =>
              navigate("/company/profile")
            }
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/3 p-5 text-left transition-all hover:border-mint/40 hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint/10">
                <Building2
                  size={19}
                  className="text-mint"
                />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Company profile
                </p>

                <p className="mt-1 text-xs text-[#7A81A0]">
                  Update company details
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="text-[#7A81A0] transition-transform group-hover:translate-x-1"
            />
          </button>

          {/* Applications */}
          <button
            type="button"
            onClick={() =>
              navigate("/recruiter/my-jobs")
            }
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/3 p-5 text-left transition-all hover:border-white/20 hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                <Users
                  size={19}
                  className="text-paper"
                />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Applications
                </p>

                <p className="mt-1 text-xs text-[#7A81A0]">
                  Review candidates
                </p>
              </div>
            </div>

            <ArrowRight
              size={17}
              className="text-[#7A81A0] transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </main>
    </div>
  );
}