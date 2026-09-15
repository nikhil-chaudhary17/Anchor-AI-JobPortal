import { Link } from "react-router-dom";
import { Anchor, ArrowUpRight, Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-navy">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

                {/* Main Footer */}
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">

                    {/* Brand */}
                    <div className="max-w-md">
                        <Link
                            to="/"
                            className="group inline-flex items-center gap-2"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber/20 bg-amber/10 transition-colors group-hover:bg-amber/15">
                                <Anchor
                                    size={18}
                                    className="text-amber"
                                />
                            </div>

                            <span className="text-xl font-bold tracking-tight text-paper">
                                Anchor
                            </span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-paper/45">
                            Find opportunities that match your skills,
                            powered by AI.
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 text-xs text-paper/35">
                            <Sparkles
                                size={13}
                                className="text-amber"
                            />
                            Smarter job search. Better opportunities.
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">

                        <Link
                            to="/find-jobs"
                            className="text-paper/50 transition-colors hover:text-amber"
                        >
                            Find Jobs
                        </Link>

                        <Link
                            to="/recruiter/post-job"
                            className="text-paper/50 transition-colors hover:text-amber"
                        >
                            Post Jobs
                        </Link>

                        <Link
                            to="/login"
                            className="flex items-center gap-1 text-paper/50 transition-colors hover:text-amber"
                        >
                            Sign In
                            <ArrowUpRight size={13} />
                        </Link>

                        <Link
                            to="/register"
                            className="text-paper/50 transition-colors hover:text-amber"
                        >
                            Create Account
                        </Link>

                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-paper/30">
                        © {new Date().getFullYear()} Anchor. All rights reserved.
                    </p>

                    <p className="text-xs text-paper/30">
                        Built with MERN + AI
                    </p>

                </div>
            </div>
        </footer>
    );
}