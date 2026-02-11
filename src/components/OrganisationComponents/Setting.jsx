
import React, { useEffect, useState } from 'react';
import Onavbar from './Onavbar';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Video, 
  MapPin, 
  Save, 
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Settings as SettingsIcon,
  Globe,
  FileText
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    company_name: "",
    emp_size: 9,
    field_of_work: "Media & Entertainment",
    interviewIntroVideo: "",
    companyLocation: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8080/jobs/api/user-id', {
          method: 'POST',
          headers: {
            'authorization': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        if (!response.ok) throw new Error('Failed to fetch user ID');
        const data = await response.json();
        setUserId(data.userId);
        fetchUserData(data.userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
        toast.error("Failed to load user data");
        setInitialLoading(false);
      }
    };

    fetchUserId();
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/jobs/api/users/${userId}`);
      const data = await response.json();

      setFormData({
        company_name: data.company_name || "",
        emp_size: data.emp_size || 9,
        field_of_work: data.field_of_work || "Media & Entertainment",
        interviewIntroVideo: data.interviewIntroVideo || "",
        companyLocation: data.companyLocation || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load organization data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/jobs/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Organization information updated successfully!");
      } else {
        toast.error("Failed to update information. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const companySizes = [
    { value: 10, label: "1-10 employees" },
    { value: 50, label: "11-50 employees" },
    { value: 200, label: "51-200 employees" },
    { value: 500, label: "201-500 employees" },
    { value: 1500, label: "500+ employees" },
  ];

  const industries = [
    "Media & Entertainment",
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Retail",
    "Manufacturing",
    "Consulting",
    "Real Estate",
    "Other"
  ];

  if (initialLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <div className="hidden lg:block">
          <Onavbar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading organization settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      {/* Sidebar Navigation - Hidden on mobile */}
      <div className="hidden lg:block">
        <Onavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          
          {/* Mobile Header with Back Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              <span className="font-medium">Back</span>
            </button>
          </div>

          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-lime-50 border border-green-100 rounded-full mb-3 sm:mb-4">
              <SettingsIcon className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-green-700 tracking-wide uppercase">
                Organization Settings
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 tracking-tight leading-tight">
              Organization Information
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Manage your organization details and preferences
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              
              {/* Company Information Section */}
              <div>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Building2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Company Details</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Basic information about your organization</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Company Name */}
                  <FormField
                    label="Company Name"
                    required
                    icon={<Building2 className="w-4 h-4" />}
                  >
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter company name"
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
                    />
                  </FormField>

                  {/* Company Size */}
                  <FormField
                    label="Company Size"
                    icon={<Users className="w-4 h-4" />}
                  >
                    <select
                      name="emp_size"
                      value={formData.emp_size}
                      onChange={handleChange}
                      className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none appearance-none cursor-pointer text-sm sm:text-base"
                    >
                      {companySizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  {/* Industry */}
                  <FormField
                    label="Industry"
                    required
                    icon={<Briefcase className="w-4 h-4" />}
                  >
                    <select
                      name="field_of_work"
                      value={formData.field_of_work}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-10 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none appearance-none cursor-pointer text-sm sm:text-base"
                    >
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </div>

              {/* Media Section */}
              <div>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Video className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Media & Branding</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Add videos and visual content</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Interview Intro Video */}
                  <FormField
                    label="Interview Intro Video (URL)"
                    icon={<Video className="w-4 h-4" />}
                    description="Add a video URL to introduce your company to candidates"
                  >
                    <input
                      type="url"
                      name="interviewIntroVideo"
                      value={formData.interviewIntroVideo}
                      onChange={handleChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
                    />
                  </FormField>
                </div>
              </div>

              {/* Location Section */}
              <div>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">Location Details</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Where is your company located?</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Company Location */}
                  <FormField
                    label="Company Address"
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    <input
                      type="text"
                      name="companyLocation"
                      value={formData.companyLocation}
                      onChange={handleChange}
                      placeholder="Street address or location"
                      className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
                    />
                  </FormField>

                  {/* City, State, Country - Grid Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                    {/* City */}
                    <FormField
                      label="City"
                      icon={<MapPin className="w-4 h-4" />}
                    >
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
                      />
                    </FormField>

                    {/* State */}
                    <FormField
                      label="State"
                      icon={<MapPin className="w-4 h-4" />}
                    >
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
                      />
                    </FormField>

                    {/* Country */}
                    <FormField
                      label="Country"
                      icon={<Globe className="w-4 h-4" />}
                    >
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile Fixed Bottom */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" strokeWidth={2.5} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Bottom Padding */}
          <div className="lg:hidden h-20"></div>
        </div>
      </div>
    </div>
  );
};

// Helper component for form fields
const FormField = ({ label, required, icon, description, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-900 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {description && (
      <p className="text-xs text-gray-600 mb-2">{description}</p>
    )}
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      {children}
    </div>
  </div>
);

export default Settings;


