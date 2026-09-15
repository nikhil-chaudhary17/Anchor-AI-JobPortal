import { useEffect, useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import JobCard from "./JobCard";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/my-jobs");

        setJobs(res.data.jobs || []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleViewDetails = (jobId) => {
    console.log("View job details:", jobId);
    navigate(`/recruiter/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navbar />

      <main className="px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Keep your existing heading/buttons here */}

          <section>
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness
                    size={16}
                    className="text-[#A78BFA]"
                  />

                  <h2 className="text-sm font-semibold text-[#F3F4F6]">
                    Your job postings
                  </h2>
                </div>

                <p className="mt-1.5 text-xs text-[#6B7280]">
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"} posted
                </p>
              </div>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm text-[#9CA3AF]">
                Loading your jobs...
              </p>
            ) : jobs.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#121222] px-6 py-10 text-center">
                <p className="text-sm text-[#9CA3AF]">
                  You haven't posted any jobs yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onClick={() => handleViewDetails(job._id)}
                    onApplicantsClick={() =>
                      navigate(`/recruiter/applicants/${job._id}`)
                    }
                  />
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}