import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {useToast} from "../Context/ToastContext.jsx";

const StudentSignup = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyIdFromUrl = queryParams.get("companyId");

  const navigate = useNavigate();
  const { id } = useParams();
  const jobId = id;
  const [otpVerificationStatus, setOtpVerificationStatus] = useState(false);
  const {showToast} = useToast();


  const [formData, setFormData] = useState({
    companyId: "64b7f1c2a9e4c8f5d1234567",
    phoneNumber: "",
    studentName: "",
    email: "",
    adharNumber: "",
    otp: "",
    resumeUrl: "",
  });

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const api = axios.create({
    baseURL: "http://localhost:8080/students",
    withCredentials: true, // ✅ allows JWT cookies
  });


    useEffect(() => {
    if (companyIdFromUrl) {
      setFormData((prev) => ({ ...prev, companyId: companyIdFromUrl }));
    }
  }, [companyIdFromUrl]);


//   /* ===================== AUTO-LOGIN (JWT check) ===================== */
  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await api.get("/check-auth");
  //       console.log("Auth check response:", res.data);
  //       const studentId =  localStorage.getItem("studentId");

  //       if (res.data.success) {
  //           console.log("User already logged in, redirecting to home page.");
  //        console.log("Auth check response:", res);

  //         navigate(`/StudentHomePage/${studentId}`); // Redirect if logged in
  //       }
  //     } catch (err) {
  //       console.warn("Auth check skipped");
  //     }
  //   };
  //   checkAuth();
  // }, [navigate]);

  // const handleVerifyPhone = async () => {
  //   if (!formData.phoneNumber) {
  //     alert("Please enter phone number first.");
  //     return;
  //   }
  //   setLoading(true);
    
  //   setTimeout(() => {
  //     setShowOtpInput(true);
  //     setOtpSent(true);
  //     setLoading(false);
  //   }, 1500);
  // };

  
    const handleVerifyPhone = async () => {
    if (!formData.phoneNumber) {
      showToast("Please enter phone number first.", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/send-otp", {
        phoneNumber: formData.phoneNumber,
      });

      if (res.data.success) {
        setShowOtpInput(true);
        setOtpSent(true);
      } else {
        showToast(res.data.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error sending OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      alert("Enter OTP before verifying.");
      return;
    }
    setLoading(true);
    
    setTimeout(() => {
      setOtpVerified(true);
      setLoading(false);
    }, 1200);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!otpVerified) {
  //     alert("Please verify OTP first.");
  //     return;
  //   }

  //   setSubmitting(true);
    
  //   setTimeout(() => {
  //     console.log("Form submitted:", formData);
  //     setSubmitting(false);
  //     alert("Registration successful!");
  //   }, 2000);
  // };



  //   /* ===================== SUBMIT FORM ===================== */
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCompanyId = formData.companyId || companyIdFromUrl;

    // if (!finalCompanyId) {
    //   alert("Missing company ID. Please check your link.");
    //   return;
    // }

    if (!otpVerified) {
      showToast("Please verify OTP first.","warning");
      return;
    }

    // if (!formData.resumeUrl) {
    //   alert("Please upload your resume first.");
    //   return;
    // }


    setSubmitting(true);


    const submissionData = {
      ...formData,
      companyId: finalCompanyId,
    };

    setLoading(true);
    try {
      const res = await api.post("/save-student-details", submissionData);

      if (res.data.success) {
        showToast("Student details saved successfully", "success");
          setSubmitting(false);

        
        // ✅ Go to home page only now
        const studentId = res.data.student_id || localStorage.getItem("studentId");
  
        navigate(`/StudentHomePage/${studentId}`);
      } else {
        showToast(res.data.message || "Already registered or save failed","info");
      }
    } catch (err) {
      console.error(err);
      showToast("Error submitting student details", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-3 sm:py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-6 sm:px-8 sm:py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="inline-flex p-2.5 sm:p-3 rounded-full bg-white/20 backdrop-blur-sm mb-3 sm:mb-4">
                <svg className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-1.5 sm:mb-2">
                Student Registration
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm px-2">
                Complete your profile to begin the interview process
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <div className="px-4 py-6 sm:px-8 sm:py-10 space-y-5 sm:space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2.5 sm:gap-3 pb-2.5 sm:pb-3 border-b-2 border-gray-200">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">Personal Information</h3>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base text-gray-900"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base text-gray-900"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base text-gray-900"
                    placeholder="Enter phone number"
                    maxLength="10"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyPhone}
                  disabled={loading}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : otpSent ? (
                    "Resend OTP"
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>
            </div>

            {/* OTP Section */}
            <AnimatePresence>
              {showOtpInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <label className="block text-xs sm:text-sm font-semibold text-blue-700">
                      Enter OTP
                    </label>
                  </div>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-blue-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-center text-base sm:text-lg tracking-widest font-semibold"
                    placeholder="••••••"
                    maxLength="6"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="mt-3 sm:mt-4 w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verify OTP
                      </>
                    )}
                  </button>
                  {otpVerified && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3 flex items-center gap-2 text-blue-700 text-xs sm:text-sm font-medium bg-white px-3 py-2 rounded-lg"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      OTP Verified Successfully!
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Aadhar Number */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Aadhar Number (Last 4 digits) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="adharNumber"
                  value={formData.adharNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm sm:text-base text-gray-900"
                  placeholder="Enter last 4 digits"
                  maxLength="4"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base sm:text-lg rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 group relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {submitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </motion.div>
                ) : (
                  <motion.div
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <span>Submit Application</span>
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="text-center pt-3 sm:pt-4 border-t">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                   onClick={() =>
                    navigate(`/StudentSignin`)
                  }
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-4 sm:mt-6 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4"
        >
          <div className="flex items-start gap-2.5 sm:gap-3">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5 sm:mb-1">Your Privacy Matters</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                All information provided is encrypted and will only be used for interview purposes. We respect your privacy and handle your data with care.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentSignup;