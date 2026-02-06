import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {useToast} from "../Context/ToastContext.jsx";

const StudentSignin = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get("companyId");

  const navigate = useNavigate();
  const { id } = useParams();
  const jobid = id;
  const {showToast} = useToast();

  /* ===================== STATE ===================== */
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [studentId, setStudentId] = useState(null);

  /* ===================== AXIOS CONFIG ===================== */
  const api = axios.create({
    baseURL: "https://jubilant-fortnight-node-backend.onrender.com/students",
    withCredentials: true,
  });

  /* ===================== HANDLERS ===================== */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===================== SEND OTP ===================== */
  const handleSendOtp = async () => {
    if (!formData.email) {
      showToast("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const checkResponse = await api.post("/check-student", {
        email: formData.email,
      });

      if (!checkResponse.data.exists) {
        showToast(checkResponse.data.message || "Student not found. Please sign up first.","info");
        setLoading(false);
        return;
      }

      const StudentId = checkResponse.data.studentId;
      setStudentId(StudentId);

      const response = await api.post("/send-otp", {
        email: formData.email,
      });

      if (response.data.success) {
        setShowOtpInput(true);
        setOtpSent(true);
        showToast("OTP sent successfully!", "success");
      } else {
        showToast(response.data.message || "Failed to send OTP", "error");
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error sending OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== VERIFY OTP & SIGN IN ===================== */
  const handleSignin = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      showToast("Please enter OTP","warning");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.data.success) {
        showToast("Sign in successful! ✅", "success");

        const studentIdFromBackend = response.data.studentId || studentId;
        localStorage.setItem("studentId", studentIdFromBackend);

        setFormData({ email: "", otp: "" });
        setShowOtpInput(false);
        setOtpSent(false);

        navigate(`/StudentHomePage/${studentIdFromBackend}`);
      } else {
        showToast(response.data.message || "Invalid OTP", "error");
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Sign in failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto"
      >
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-6 md:px-8 py-6 sm:py-7 md:py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                Student Sign In
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm">
                Sign in to continue your interview
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <form className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 space-y-5 sm:space-y-6" onSubmit={handleSignin}>
            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full sm:flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg sm:rounded-xl transition-all outline-none text-sm sm:text-base"
                  placeholder="your.email@example.com"
                  required
                  disabled={showOtpInput}
                />
                {!showOtpInput && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                )}
              </div>
            </div>

            {/* OTP */}
            {showOtpInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-5"
              >
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg sm:rounded-xl text-center text-base sm:text-lg font-medium tracking-wider outline-none transition-all"
                  placeholder="• • • • • •"
                  maxLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="mt-3 text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </motion.div>
            )}

            {/* Submit */}
            {showOtpInput && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 text-white font-bold rounded-lg sm:rounded-xl text-sm sm:text-base transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>
            )}

            {/* Signup */}
            <div className="text-center pt-4 sm:pt-5 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate(`/organisationsignup`)}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentSignin;
