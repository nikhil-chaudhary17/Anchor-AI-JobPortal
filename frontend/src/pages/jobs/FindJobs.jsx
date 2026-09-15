import { useEffect, useState } from "react";
import { Search, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import JobCard from "../../pages/jobs/JobCard";
import api from "../../services/api";

export default function FindJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");

        setJobs(res.data.jobs || []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const title = job.title?.toLowerCase() || "";
    const company = job.company?.name?.toLowerCase() || "";
    const location = job.location?.toLowerCase() || "";

    return (
      title.includes(searchText) ||
      company.includes(searchText) ||
      location.includes(searchText)
    );
  });

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10">
              <BriefcaseBusiness className="text-amber" size={22} />
            </div>

            <h1 className="text-3xl font-bold">
              Find Jobs
            </h1>
          </div>

          <p className="text-gray-400">
            Explore opportunities from recruiters and find your next role.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company, or location..."
              className="w-full rounded-xl border border-white/10 bg-[#121222] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition focus:border-amber/50"
            />
          </div>
        </div>

        {/* Job count */}
        {!loading && (
          <div className="mb-5 text-sm text-gray-400">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "job" : "jobs"} found
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-[#121222] p-10 text-center">
            <p className="text-gray-400">
              Loading jobs...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredJobs.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#121222] p-12 text-center">
            <BriefcaseBusiness
              size={42}
              className="mx-auto mb-4 text-gray-600"
            />

            <h2 className="mb-2 text-lg font-semibold">
              No jobs found
            </h2>

            <p className="text-sm text-gray-400">
              {search
                ? "Try searching with a different keyword."
                : "There are no jobs available right now."}
            </p>
          </div>
        )}

        {/* Jobs */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onClick={() => handleViewDetails(job._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}