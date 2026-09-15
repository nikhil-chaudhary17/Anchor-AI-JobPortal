import {
    Building2,
    Globe,
    MapPin,
    Users,
    Upload,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import { useState, useEffect ,useRef } from "react";
import api from "../../services/api";

export default function CompanyProfile() {
    const [formData, setFormData] = useState({
        companyName: "",
        about: "",
        website: "",
        location: "",
        companySize: "1–10 employees",
    });

    const [loading, setLoading] = useState(true);
    const [logo, setLogo] = useState(null);
    const [saving, setSaving] = useState(false);
    const [companyId, setCompanyId] = useState(null);

    const inputRef = useRef(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle logo selection
    const handleLogoChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setLogo(file);
        }
    };

    // Create or update company
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);

        try {
            const companyData = {
                name: formData.companyName,
                about: formData.about,
                website: formData.website,
                location: formData.location,
                companySize: formData.companySize,
            };

            let res;
            let isCreating = false;

            if (companyId) {
                // Existing company → UPDATE
                res = await api.put(
                    `/company/${companyId}`,
                    companyData
                );
            } else {
                // No company → CREATE
                res = await api.post(
                    "/company/create",
                    companyData
                );

                isCreating = true;
            }

            const company = res.data.company;

           
            setCompanyId(company._id);


            setFormData({
                companyName: company.name || "",
                about: company.about || "",
                website: company.website || "",
                location: company.location || "",
                companySize: company.companySize || "1–10 employees",
            });

            alert(
                isCreating
                    ? "Company profile created successfully!"
                    : "Company profile updated successfully!"
            );
        } catch (error) {
            console.error(
                "Error saving company profile:",
                error
            );

            alert(
                error?.response?.data?.message ||
                    "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    // Fetch company when page loads
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get(
                    "/company/my-company"
                );

                const company = res.data.company;

                // No company created yet
                if (!company) {
                    setLoading(false);
                    return;
                }

            
                setCompanyId(company._id);

                // Load saved company data
                setFormData({
                    companyName: company.name || "",
                    about: company.about || "",
                    website: company.website || "",
                    location: company.location || "",
                    companySize:
                        company.companySize ||
                        "1–10 employees",
                });
            } catch (error) {
                console.error(
                    "Error loading company profile:",
                    error
                );

                alert(
                    error?.response?.data?.message ||
                        "Failed to load company profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCompany();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-navy text-paper">
                <Navbar />

                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-sm text-[#7A81A0]">
                        Loading company profile...
                    </p>
                </div>
            </div>
        );
    }

    
    const isCompanyCreated = Boolean(companyId);

    return (
        <div className="min-h-screen bg-navy text-paper">
            <Navbar />

            <div className="mx-auto max-w-3xl px-6 py-16">

                {/* Page heading */}
                <h1 className="font-['Space_Grotesk'] text-2xl font-semibold md:text-3xl">
                    {isCompanyCreated
                        ? "Update company details"
                        : "Register your company"}
                </h1>

                <p className="mt-2 text-sm text-[#7A81A0]">
                    {isCompanyCreated
                        ? "Keep your company information up to date for candidates."
                        : "Create your company profile so candidates can learn about your organization."}
                </p>

                <div className="mt-10 rounded-xl border border-white/10 bg-white/3 p-8 backdrop-blur">

                    {/* Logo */}
                    <div className="flex items-center gap-5">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber to-mint">
                            <Building2
                                size={30}
                                className="text-navy"
                            />
                        </div>

                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-paper transition-all duration-200 hover:border-white/30 hover:bg-white/5"
                            onClick={() => inputRef.current.click()}
                        >
                            <Upload size={14} />
                            Upload logo
                        </button>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            ref={inputRef}
                            className="hidden"
                        />
                    </div>

                    {/* Fields */}
                    <div className="mt-8 space-y-5 border-t border-white/10 pt-8">

                        <div>
                            <label className="text-xs uppercase tracking-wide text-[#7A81A0]">
                                Company name
                            </label>

                            <input
                                type="text"
                                placeholder="Acme Inc."
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber"
                            />
                        </div>

                        {/* About */}
                        <div>
                            <label className="text-xs uppercase tracking-wide text-[#7A81A0]">
                                About
                            </label>

                            <textarea
                                rows={4}
                                placeholder="What does your company do?"
                                name="about"
                                value={formData.about}
                                onChange={handleChange}
                                className="mt-1.5 w-full resize-none rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber"
                            />
                        </div>

                
                        <div className="grid gap-5 md:grid-cols-2">

                            
                            <div>
                                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#7A81A0]">
                                    <Globe size={12} />
                                    Website
                                </label>

                                <input
                                    type="url"
                                    placeholder="https://acme.com"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber"
                                />
                            </div>

                         
                            <div>
                                <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#7A81A0]">
                                    <MapPin size={12} />
                                    Location
                                </label>

                                <input
                                    type="text"
                                    placeholder="Bengaluru, India"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber"
                                />
                            </div>
                        </div>

                       
                        <div>
                            <label className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[#7A81A0]">
                                <Users size={12} />
                                Company size
                            </label>

                            <select
                                name="companySize"
                                value={formData.companySize}
                                onChange={handleChange}
                                className="mt-1.5 w-full rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none transition-colors focus:border-amber focus:ring-1 focus:ring-amber"
                            >
                                <option className="bg-panel">
                                    1–10 employees
                                </option>

                                <option className="bg-panel">
                                    11–50 employees
                                </option>

                                <option className="bg-panel">
                                    51–200 employees
                                </option>

                                <option className="bg-panel">
                                    200+ employees
                                </option>
                            </select>
                        </div>
                    </div>

                    
                    <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
                        <button
                            className="rounded-md bg-amber px-5 py-2.5 text-sm font-semibold text-navy transition-all duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : isCompanyCreated
                                ? "Update company profile"
                                : "Save company profile"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}