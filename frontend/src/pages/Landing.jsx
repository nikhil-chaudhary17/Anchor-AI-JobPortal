import { Link } from "react-router-dom";
import {
    ArrowRight,
    FileText,
    Sparkles,
    Send,
    CheckCircle2,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";


export default function Landing() {
    return (
        <div className="min-h-screen overflow-hidden bg-navy text-paper">

            {/* ==================== ANIMATIONS ==================== */}
            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-12px);
                    }
                }

                @keyframes blobMove {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }

                    50% {
                        transform: translate(20px, -20px) scale(1.05);
                    }
                }

                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes marquee {
                    from {
                        transform: translateX(0);
                    }

                    to {
                        transform: translateX(-50%);
                    }
                }

                .animate-float {
                    animation: float 5s ease-in-out infinite;
                }

                .animate-blob {
                    animation: blobMove 8s ease-in-out infinite;
                }

                .animate-fade-up {
                    animation: fadeUp 0.8s ease-out forwards;
                }

                .animate-marquee {
                    animation: marquee 25s linear infinite;
                }
            `}</style>

            {/* ==================== NAVBAR ==================== */}
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section className="relative px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">

                {/* Decorative Background */}
                <div
                    aria-hidden="true"
                    className="animate-blob absolute -right-32 top-10 h-80 w-80 rounded-full bg-amber/10 blur-3xl"
                />

                <div
                    aria-hidden="true"
                    className="animate-blob absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
                />

                <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

                    {/* Hero Content */}
                    <div className="animate-fade-up">

                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-paper/80">
                            <Sparkles size={16} className="text-amber" />
                            Powered by AI matching
                        </div>

                        {/* Heading */}
                        <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                            Apply to jobs your resume is actually built for.
                        </h1>

                        {/* Description */}
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/60">
                            Anchor reads your resume, understands your skills,
                            and helps you discover opportunities that actually
                            match your profile.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                            <Link
                                to="/find-jobs"
                                className="group inline-flex items-center justify-center gap-2 rounded-full bg-amber px-6 py-3.5 font-semibold text-navy transition hover:opacity-90"
                            >
                                Browse jobs

                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <Link
                                to="/register?role=recruiter"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-semibold text-paper transition hover:bg-white/5"
                            >
                                Post a job
                            </Link>

                        </div>

                        {/* Trust Text */}
                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-paper/50">

                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                Free job browsing
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                AI-powered matching
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                Easy applications
                            </div>

                        </div>
                    </div>

                    {/* ==================== MATCH SCORE CARD ==================== */}
                    <div className="relative flex justify-center lg:justify-end">

                        <div className="animate-float relative w-full max-w-md">

                            {/* Glow */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 rounded-3xl bg-amber/10 blur-3xl"
                            />

                            {/* Card */}
                            <div className="relative rounded-3xl border border-white/10 bg-white/6 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-amber/30 hover:shadow-amber/10">

                                {/* Card Header */}
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm text-paper/50">
                                            AI Match Score
                                        </p>

                                        <h3 className="mt-1 text-lg font-semibold">
                                            Frontend Engineer
                                        </h3>
                                    </div>

                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-amber/30 transition-transform duration-300 hover:scale-110">
                                        <span className="text-xl font-bold text-amber">
                                            92%
                                        </span>
                                    </div>

                                </div>

                                {/* Skills */}
                                <div className="mt-6">

                                    <p className="mb-3 text-sm text-paper/50">
                                        Matching skills
                                    </p>

                                    <div className="flex flex-wrap gap-2">

                                        {[
                                            "React",
                                            "Node.js",
                                            "MongoDB",
                                            "REST APIs",
                                        ].map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-paper/70 transition-colors duration-300 hover:bg-amber/10 hover:text-amber"
                                            >
                                                {skill}
                                            </span>
                                        ))}

                                    </div>
                                </div>

                                {/* Match Info */}
                                <div className="mt-6 rounded-2xl bg-white/5 p-4 transition-colors duration-300 hover:bg-white/10">

                                    <div className="flex items-center gap-3">

                                        <div className="rounded-xl bg-amber/10 p-2">
                                            <Sparkles
                                                size={18}
                                                className="text-amber"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                Strong match
                                            </p>

                                            <p className="text-xs text-paper/50">
                                                Your skills align with this role
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ==================== AI FEATURES MARQUEE ==================== */}
            <section className="border-y border-white/10 py-6">

                <div className="overflow-hidden">

                    <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">

                        {[
                            "AI Resume Matching",
                            "Smart Recommendations",
                            "Instant Cover Letters",
                            "Interview Preparation",
                            "Role-based Dashboards",
                            "AI Resume Matching",
                            "Smart Recommendations",
                            "Instant Cover Letters",
                            "Interview Preparation",
                            "Role-based Dashboards",
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 text-sm font-medium text-paper/50"
                            >
                                <Sparkles
                                    size={15}
                                    className="text-amber"
                                />

                                {item}
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* ==================== HOW IT WORKS ==================== */}
            <section className="px-6 py-24 lg:px-8">

                <div className="mx-auto max-w-7xl">

                    {/* Section Heading */}
                    <div className="max-w-2xl">

                        <p className="text-sm font-semibold uppercase tracking-widest text-amber">
                            How it works
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            From resume to opportunity.
                        </h2>

                        <p className="mt-4 text-paper/50">
                            Anchor makes the job search easier by using AI
                            throughout the process.
                        </p>

                    </div>

                    {/* Steps */}
                    <div className="mt-14 grid gap-6 md:grid-cols-3">

                        {/* Step 1 */}
                        <div className="group rounded-3xl border border-white/10 bg-white/3 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-amber/30 hover:bg-white/6 hover:shadow-2xl">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/10 transition-transform duration-300 group-hover:scale-110">

                                <FileText
                                    size={22}
                                    className="text-amber"
                                />

                            </div>

                            <p className="mt-6 text-sm font-semibold text-amber">
                                01
                            </p>

                            <h3 className="mt-2 text-xl font-semibold">
                                Build your profile
                            </h3>

                            <p className="mt-3 leading-7 text-paper/50">
                                Add your skills, experience, education and
                                resume to create your candidate profile.
                            </p>

                        </div>

                        {/* Step 2 */}
                        <div className="group rounded-3xl border border-white/10 bg-white/3 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-amber/30 hover:bg-white/6 hover:shadow-2xl">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/10 transition-transform duration-300 group-hover:scale-110">

                                <Sparkles
                                    size={22}
                                    className="text-amber"
                                />

                            </div>

                            <p className="mt-6 text-sm font-semibold text-amber">
                                02
                            </p>

                            <h3 className="mt-2 text-xl font-semibold">
                                Discover better matches
                            </h3>

                            <p className="mt-3 leading-7 text-paper/50">
                                AI analyzes job requirements and your profile
                                to help you find relevant opportunities.
                            </p>

                        </div>

                        {/* Step 3 */}
                        <div className="group rounded-3xl border border-white/10 bg-white/3 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-amber/30 hover:bg-white/6 hover:shadow-2xl">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber/10 transition-transform duration-300 group-hover:scale-110">

                                <Send
                                    size={22}
                                    className="text-amber"
                                />

                            </div>

                            <p className="mt-6 text-sm font-semibold text-amber">
                                03
                            </p>

                            <h3 className="mt-2 text-xl font-semibold">
                                Apply with confidence
                            </h3>

                            <p className="mt-3 leading-7 text-paper/50">
                                Apply to suitable jobs and use AI tools to
                                prepare better applications and interviews.
                            </p>

                        </div>

                    </div>
                </div>
            </section>

            {/* ==================== FINAL CTA ==================== */}
            <section className="px-6 pb-24 lg:px-8">

                <div className="mx-auto max-w-7xl">

                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 px-6 py-16 text-center sm:px-12">

                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-amber/10 blur-3xl"
                        />

                        <div className="relative">

                            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                                Your next opportunity could be one search away.
                            </h2>

                            <p className="mx-auto mt-4 max-w-xl text-paper/50">
                                Explore jobs, discover companies and find
                                opportunities that match your skills.
                            </p>

                            <Link
                                to="/find-jobs"
                                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 font-semibold text-navy transition hover:opacity-90"
                            >
                                Explore jobs

                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== FOOTER ==================== */}
            <Footer />

        </div>
    );
}