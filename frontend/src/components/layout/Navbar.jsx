import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const { user, loading, logout } = useAuth();


    const publicLinks = [];

    const candidateLinks = [
        { label: "Find jobs", href: "/find-jobs" },
        { label: "My applications", href: "/candidate/my-applications" },
        { label: "Profile", href: "/candidate/profile" },
    ];


    const recruiterLinks = [
        { label: "Profile", href: "/company/profile" },
        { label: "Post job", href: "/recruiter/post-job" },
        { label: "My jobs", href: "/recruiter/my-jobs" },
    ];


    const adminLinks = [
        { label: "All users", href: "/admin/users" },
        { label: "All jobs", href: "/admin/jobs" },
        { label: "Dashboard", href: "/admin/dashboard" },
    ];

    // Decide which links to show
    const links = !user
        ? publicLinks
        : user.role === "candidate"
            ? candidateLinks
            : user.role === "recruiter"
                ? recruiterLinks
                : user.role === "admin"
                    ? adminLinks
                    : publicLinks;

    const handleLogout = async () => {
        setOpen(false);
        await logout();
    };

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur-md">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

                {/* Logo */}
                <Link
                    to={
                        !user
                            ? "/"
                            : user.role === "candidate"
                                ? "/candidate/dashboard"
                                : user.role === "recruiter"
                                    ? "/recruiter/dashboard"
                                    : user.role === "admin"
                                        ? "/admin/dashboard"
                                        : "/"
                    }
                    onClick={() => setOpen(false)}
                    className="text-2xl font-bold tracking-tight text-paper"
                >
                    Anchor
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            to={link.href}
                            className="text-sm font-medium text-paper/70 transition-colors duration-200 hover:text-paper"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-4 md:flex">
                    {loading ? (
                        <div className="h-9 w-20 animate-pulse rounded-full bg-white/5" />
                    ) : user ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-sm font-medium text-paper/80 transition-colors duration-200 hover:text-paper"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-medium text-paper/80 transition-colors duration-200 hover:text-paper"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg text-paper transition-colors duration-200 hover:bg-white/5 md:hidden"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                >
                    {/* Menu Icon */}
                    <Menu
                        size={24}
                        className={`absolute transition-all duration-300 ease-in-out ${open
                            ? "rotate-90 scale-0 opacity-0"
                            : "rotate-0 scale-100 opacity-100"
                            }`}
                    />

                    {/* Close Icon */}
                    <X
                        size={24}
                        className={`absolute transition-all duration-300 ease-in-out ${open
                            ? "rotate-0 scale-100 opacity-100"
                            : "-rotate-90 scale-0 opacity-0"
                            }`}
                    />
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                className={`overflow-hidden border-t border-white/10 bg-navy transition-all duration-300 ease-in-out md:hidden ${open
                    ? "max-h-96 opacity-100"
                    : "pointer-events-none max-h-0 opacity-0"
                    }`}
            >
                <div className="px-6 py-6">

                    {/* Mobile Links */}
                    <div className="flex flex-col gap-5">
                        {links.map((link, index) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setOpen(false)}
                                className="text-base font-medium text-paper/80 transition-all duration-300 hover:text-paper"
                                style={{
                                    transitionDelay: open
                                        ? `${index * 50}ms`
                                        : "0ms",
                                    transform: open
                                        ? "translateY(0)"
                                        : "translateY(-8px)",
                                    opacity: open ? 1 : 0,
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Actions */}
                    <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5">
                        {loading ? (
                            <div className="mx-auto h-10 w-24 animate-pulse rounded-full bg-white/5" />
                        ) : user ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-center text-sm font-medium text-paper/80 transition-colors duration-200 hover:text-paper"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setOpen(false)}
                                    className="text-center text-sm font-medium text-paper/80 transition-colors duration-200 hover:text-paper"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setOpen(false)}
                                    className="rounded-full bg-amber px-5 py-3 text-center text-sm font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
                                >
                                    Get started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}