import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Profile from "./pages/candidate/Profile";
import Dashboard from "./pages/candidate/CandidateDashboard";
import Application from "./pages/candidate/Application";
import MyApplications from "./pages/candidate/MyApplication";
import InterviewPrep from "./pages/candidate/InterviewPrep";

import CompanyProfile from "./pages/company/CompanyProfile";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import Applicants from "./pages/recruiter/Applicants";

import CreateJob from "./pages/jobs/CreateJob";
import MyJobs from "./pages/jobs/MyJobs";
import JobDetails from "./pages/jobs/JobDetails";
import FindJobs from "./pages/jobs/FindJobs";

const HomeRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-navy text-paper">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Landing />;
    }

    if (user.role === "candidate") {
        return <Navigate to="/candidate/dashboard" replace />;
    }

    if (user.role === "recruiter") {
        return <Navigate to="/recruiter/dashboard" replace />;
    }

    return <Landing />;
};

const App = () => {

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>

                    {/* Public routes */}
                    <Route path="/" element={<HomeRoute />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Candidate routes */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["candidate"]} />
                        }
                    >
                        <Route
                            path="/candidate/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/candidate/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/candidate/my-applications"
                            element={<MyApplications />}
                        />

                        <Route
                            path="/candidate/:id/apply"
                            element={<Application />}
                        />

                        <Route
                            path="/candidate/:id/interview-prep"
                            element={<InterviewPrep />}
                        />

                        <Route
                            path="/find-jobs"
                            element={<FindJobs />}
                        />

                        <Route
                            path="/jobs/:id"
                            element={<JobDetails />}
                        />
                    </Route>

                    {/* Recruiter routes */}
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["recruiter"]} />
                        }
                    >
                        <Route
                            path="/recruiter/dashboard"
                            element={<RecruiterDashboard />}
                        />

                        <Route
                            path="/company/profile"
                            element={<CompanyProfile />}
                        />

                        <Route
                            path="/recruiter/post-job"
                            element={<CreateJob />}
                        />

                        <Route
                            path="/recruiter/my-jobs"
                            element={<MyJobs />}
                        />

                        <Route
                            path="/recruiter/jobs/:id"
                            element={<JobDetails />}
                        />

                        <Route
                            path="/recruiter/applicants/:jobId"
                            element={<Applicants />}
                        />
                    </Route>



                    {/* 404 */}
                    <Route
                        path="*"
                        element={<div>404 — Page not found</div>}
                    />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;