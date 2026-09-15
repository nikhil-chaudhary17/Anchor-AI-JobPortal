import {
  BriefcaseBusiness,
  MapPin,
  Clock3,
  IndianRupee,
  CalendarDays,
  ChevronRight,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function JobCard({
  job,
  onClick,
  onApplicantsClick,
}) {
  const { user } = useAuth();

  const isJobOwner =
    user?.role === "recruiter" &&
    job?.postedBy?._id === user?._id;

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

  return (
    <div className="group rounded-xl border border-white/10 bg-[#121222] px-4 py-4 transition-all duration-200 hover:border-[#8B5CF6]/40 hover:bg-[#151528]">
      
      {/* Top section */}
      <div className="flex items-center gap-3">
        
        {/* Company Logo */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#18182A]">
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <BriefcaseBusiness
              size={18}
              className="text-[#A78BFA]"
            />
          )}
        </div>

        {/* Title + Company */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-['Space_Grotesk'] text-base font-semibold text-[#F5F3FF]">
            {job.title}
          </h3>

          <p className="mt-0.5 truncate text-xs text-[#8B8CA7]">
            {job.company?.name || "Company"}
          </p>
        </div>

        {/* Experience */}
        <span className="hidden shrink-0 rounded-full border border-white/10 bg-[#18182A] px-2.5 py-1 text-xs text-[#C4B5FD] sm:block">
          {job.experience}
        </span>
      </div>

      {/* Job information */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/5 pt-3 text-xs text-[#8B8CA7]">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} />
          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock3 size={13} />
          <span className="capitalize">
            {job.jobType?.replace("-", " ")}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <IndianRupee size={13} />
          <span>
            ₹{formatSalary(job.salaryMin)} – ₹
            {formatSalary(job.salaryMax)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <CalendarDays size={13} />
          <span>Apply by {formatDeadline(job.deadline)}</span>
        </div>
      </div>

      {/* Bottom section */}
      <div className="mt-3 flex items-center justify-between gap-3">
        
        {/* Skills */}
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {job.skillsRequired?.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-[#8B5CF6]/10 px-2 py-1 text-[11px] text-[#A78BFA]"
            >
              {skill}
            </span>
          ))}

          {job.skillsRequired?.length > 4 && (
            <span className="px-1 py-1 text-[11px] text-[#5F6178]">
              +{job.skillsRequired.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Only the recruiter who owns this job can see this */}
          {isJobOwner && onApplicantsClick && (
            <button
              type="button"
              onClick={onApplicantsClick}
              className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#D8D5E8] transition-all hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10 hover:text-white"
            >
              <Users size={14} />
              Applicants
            </button>
          )}

          {/* View details */}
          <button
            type="button"
            onClick={onClick}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#D8D5E8] transition-all hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10 hover:text-white"
          >
            View details
            <ChevronRight size={14} />
          </button>

        </div>
      </div>
    </div>
  );
}