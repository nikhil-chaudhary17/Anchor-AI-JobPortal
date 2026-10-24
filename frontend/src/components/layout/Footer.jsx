import { Link } from "react-router-dom";
import { Anchor, ArrowUpRight, Sparkles } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-navy">
            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
                {/* Main Footer */}
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-16">
                    {/* Brand */}
                    <div className="max-w-md text-center sm:text-left">
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

                        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-paper/45 sm:mx-0">
                            Find opportunities that match your skills,
                            powered by AI.
                        </p>

                        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-paper/35 sm:justify-start">
                            <Sparkles
                                size={13}
                                className="shrink-0 text-amber"
                            />
                            <span>
                                Smarter job search. Better opportunities.
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="grid w-full grid-cols-2 gap-x-6 gap-y-4 text-sm sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-4 md:justify-end">
                        <Link
                            to="/find-jobs"
                            className="text-center text-paper/50 transition-colors hover:text-amber sm:text-left"
                        >
                            Find Jobs
                        </Link>

                        <Link
                            to="/recruiter/post-job"
                            className="text-center text-paper/50 transition-colors hover:text-amber sm:text-left"
                        >
                            Post Jobs
                        </Link>

                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-1 text-paper/50 transition-colors hover:text-amber sm:justify-start"
                        >
                            Sign In
                            <ArrowUpRight size={13} />
                        </Link>

                        <Link
                            to="/register"
                            className="text-center text-paper/50 transition-colors hover:text-amber sm:text-left"
                        >
                            Create Account
                        </Link>
                    </nav>
                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col items-center gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
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