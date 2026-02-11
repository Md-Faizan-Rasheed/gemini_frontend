import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronLeft,
  History,
  LogOut,
  Play,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useToast } from "../Context/ToastContext.jsx";
import { domains } from "./config/domains.js";
import { skillRecommendations } from "./config/skillrecommendation.js";

const DRAFT_EXPIRY = 24 * 60 * 60 * 1000;
const OPTIMAL_SKILL_MIN = 3;
const OPTIMAL_SKILL_MAX = 7;
const levels = ["Beginner", "Intermediate", "Advanced"];

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default function StudentHomePage() {
  const [homeView, setHomeView] = useState("landing");
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillLevels, setSkillLevels] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDraftRestore, setShowDraftRestore] = useState(false);
  const [savedDraft, setSavedDraft] = useState(null);
  const [highlightMissingLevels, setHighlightMissingLevels] = useState(false);
  const [customDomains, setCustomDomains] = useState([]);
  const [showCustomDomainModal, setShowCustomDomainModal] = useState(false);
  const [customDomainName, setCustomDomainName] = useState("");
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [customDomainSkills, setCustomDomainSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState("");

  const navigate = useNavigate();
  const { studentId } = useParams();
  const { showToast } = useToast();

  const api = axios.create({
    baseURL: "http://localhost:8080/students",
    withCredentials: true,
  });

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/check-auth", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!res.data.success) {
          navigate("/StudentSignin");
        }
      } catch {
        navigate("/StudentSignin");
      }
    };
    checkAuth();
  }, [navigate]);

  // Check for saved draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('interviewDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (Date.now() - parsed.timestamp < DRAFT_EXPIRY) {
          setSavedDraft(parsed);
          setShowDraftRestore(true);
        } else {
          localStorage.removeItem('interviewDraft');
        }
      } catch (error) {
        localStorage.removeItem('interviewDraft');
      }
    }
  }, []);

  // Load custom domains from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("customDomains");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const normalized = parsed.map((d) => {
          const icon = typeof d.icon === "function" ? d.icon : Plus;
          return {
            ...d,
            icon,
            color: d.color || "from-slate-400 to-gray-500",
            skills: Array.isArray(d.skills) ? d.skills : [],
            isCustom: true,
          };
        });
        setCustomDomains(normalized);
      }
    } catch {
      localStorage.removeItem("customDomains");
    }
  }, []);

  // Persist custom domains
  useEffect(() => {
    localStorage.setItem("customDomains", JSON.stringify(customDomains));
  }, [customDomains]);


  // Save progress to localStorage
  useEffect(() => {
    if (selectedDomain || selectedSkills.length > 0) {
      const draft = {
        domainId: selectedDomain?.id,
        selectedSkills,
        skillLevels,
        timestamp: Date.now()
      };
      localStorage.setItem('interviewDraft', JSON.stringify(draft));
    }
  }, [selectedDomain, selectedSkills, skillLevels]);

  const allDomains = useMemo(() => {
    return [...domains, ...customDomains];
  }, [customDomains]);

  // Restore draft
  const handleRestoreDraft = useCallback(() => {
    if (savedDraft) {
      const domain = allDomains.find(d => d.id === savedDraft.domainId);
      if (domain) {
        setSelectedDomain(domain);
        setSelectedSkills(savedDraft.selectedSkills || []);
        setSkillLevels(savedDraft.skillLevels || {});
      }
      setShowDraftRestore(false);
      showToast("Draft restored successfully!", "success");
    }
  }, [savedDraft, showToast, allDomains]);

  const handleDiscardDraft = useCallback(() => {
    localStorage.removeItem('interviewDraft');
    setShowDraftRestore(false);
    setSavedDraft(null);
  }, []);

  // Get recommended skills
  const getRecommendedSkills = useMemo(() => {
    if (!selectedDomain || selectedSkills.length === 0) return [];
    
    const recommended = new Set();
    selectedSkills.forEach(skillId => {
      const suggestions = skillRecommendations[skillId] || [];
      suggestions.forEach(suggestion => {
        // Only recommend if it exists in current domain and isn't already selected
        const skillExists = selectedDomain.skills.some(s => s.id === suggestion);
        if (skillExists && !selectedSkills.includes(suggestion)) {
          recommended.add(suggestion);
        }
      });
    });
    
    return Array.from(recommended).slice(0, 4); // Limit to 4 recommendations
  }, [selectedDomain, selectedSkills]);

  // Filter skills by search query
  const filteredSkills = useMemo(() => {
    if (!selectedDomain) return [];
    
    return selectedDomain.skills.filter(skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedDomain, searchQuery]);

  // Group skills by category
  const groupedSkills = useMemo(() => {
    return filteredSkills.reduce((acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [filteredSkills]);

  const handleAddCustomSkillToModal = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (customDomainSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setCustomSkillInput("");
      return;
    }
    setCustomDomainSkills((prev) => [
      ...prev,
      { id: trimmed.toLowerCase().replace(/\s+/g, "-"), name: trimmed, category: "custom" },
    ]);
    setCustomSkillInput("");
  };

  const handleCreateCustomDomain = () => {
    const name = customDomainName.trim();
    if (!name) {
      showToast("Please enter a domain name", "warning");
      return;
    }
    if (customDomainSkills.length === 0) {
      showToast("Add at least one skill", "warning");
      return;
    }

    const newDomain = {
      id: `custom-${Date.now()}`,
      name,
      icon: Plus,
      color: "from-slate-400 to-gray-500",
      skills: customDomainSkills,
      isCustom: true,
    };

    setCustomDomains((prev) => [newDomain, ...prev]);
    closeCustomDomainModal();
    showToast("Custom domain created!", "success");
  };

  const handleRemoveCustomSkill = (skillId) => {
    setCustomDomainSkills((prev) => prev.filter((s) => s.id !== skillId));
  };

  const closeCustomDomainModal = () => {
    setShowCustomDomainModal(false);
    setCustomDomainName("");
    setCustomSkillInput("");
    setCustomDomainSkills([]);
  };

  const handleAddSkillToCustomDomain = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed || !selectedDomain?.isCustom) return;

    const newSkill = {
      id: trimmed.toLowerCase().replace(/\s+/g, "-"),
      name: trimmed,
      category: "custom",
    };

    setCustomDomains((prev) =>
      prev.map((d) =>
        d.id === selectedDomain.id
          ? {
              ...d,
              skills: d.skills.some((s) => s.id === newSkill.id) ? d.skills : [...d.skills, newSkill],
            }
          : d
      )
    );

    setSelectedDomain((prev) =>
      prev
        ? {
            ...prev,
            skills: prev.skills.some((s) => s.id === newSkill.id) ? prev.skills : [...prev.skills, newSkill],
          }
        : prev
    );

    setNewSkillInput("");
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setSelectedSkills([]);
    setSkillLevels({});
    setSearchQuery("");
    setHighlightMissingLevels(false);
  };

  const handleBack = () => {
    setSelectedDomain(null);
    setSearchQuery("");
    setHighlightMissingLevels(false);
  };

  // Debounced skill toggle
  const toggleSkillImmediate = useCallback((skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
    // Clear level if deselecting
    if (selectedSkills.includes(skillId)) {
      setSkillLevels((prev) => {
        const newLevels = { ...prev };
        delete newLevels[skillId];
        return newLevels;
      });
    }
    setHighlightMissingLevels(false);
  }, [selectedSkills]);

  const toggleSkill = useMemo(
    () => debounce(toggleSkillImmediate, 100),
    [toggleSkillImmediate]
  );

  const setSkillLevel = (skillId, level) => {
    setSkillLevels((prev) => ({ ...prev, [skillId]: level }));
    setHighlightMissingLevels(false);
  };

  // Add recommended skill
  const addRecommendedSkill = (skillId) => {
    if (!selectedSkills.includes(skillId)) {
      setSelectedSkills(prev => [...prev, skillId]);
      showToast("Skill added!", "success");
    }
  };

  const handleStartInterview = async () => {
    // Validate skill selection
    if (selectedSkills.length === 0) {
      showToast("Please select at least one skill.", "info");
      return;
    }

    // Check if all skills have levels
    const missingLevels = selectedSkills.filter(s => !skillLevels[s]);
    if (missingLevels.length > 0) {
      setHighlightMissingLevels(true);
      showToast("Please select proficiency levels for all skills", "warning");
      return;
    }

    setLoading(true);
    try {
      const formattedSkills = selectedSkills.map((s) => ({
        skill: s,
        level: skillLevels[s] || "Beginner",
      }));

      await axios.patch("http://localhost:8080/students/update-skills", {
        studentId,
        skills: formattedSkills,
      });

      // Clear draft after successful submission
      localStorage.removeItem('interviewDraft');
      showToast("Skills saved successfully!", "success");
      navigate(`/StudentInterviewPage/${studentId}`);
    } catch (err) {
      showToast("Error saving skills", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("studentId");
      localStorage.removeItem("token");
      localStorage.removeItem('interviewDraft');
      navigate("/StudentSignin");
    } catch {
      showToast("Logout failed", "error");
    }
  };

  // Get skill count guidance message
  const getSkillCountGuidance = () => {
    const count = selectedSkills.length;
    if (count === 0) {
      return { message: "Select 3-7 skills for best results", color: "text-gray-600" };
    }
    if (count < OPTIMAL_SKILL_MIN) {
      return { message: `Consider adding ${OPTIMAL_SKILL_MIN - count} more skill${OPTIMAL_SKILL_MIN - count > 1 ? 's' : ''} (3-7 recommended)`, color: "text-blue-600" };
    }
    if (count > OPTIMAL_SKILL_MAX) {
      return { message: "⚠️ Too many skills may result in surface-level questions", color: "text-orange-600" };
    }
    return { message: "Good selection! Ready to start", color: "text-green-600" };
  };

  const skillGuidance = getSkillCountGuidance();

  const formatHistoryDate = (value) => {
    if (!value) return "Unknown date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getReportRating = (item) => {
    return (
      item?.overall_Rating ??
      item?.overallRating ??
      item?.structuredReport?.overallRating ??
      null
    );
  };

  const getReportText = (item) => {
    return (
      item?.rawReportText ||
      item?.reportText ||
      item?.rawReportText?.reportText ||
      item?.aiContent ||
      ""
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex flex-col">
      {/* Draft Restore Modal */}
      <AnimatePresence>
        {showDraftRestore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleDiscardDraft}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Resume Previous Session?</h3>
                  <p className="text-sm text-gray-600">We found your unsaved progress</p>
                </div>
              </div>
              
              {savedDraft && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{savedDraft.selectedSkills?.length || 0}</span> skills selected
                    {savedDraft.domainId && (
                      <span className="ml-2 text-gray-500">
                        in {allDomains.find(d => d.id === savedDraft.domainId)?.name}
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleDiscardDraft}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Start Fresh
                </button>
                <button
                  onClick={handleRestoreDraft}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-500 text-white font-medium hover:from-emerald-600 hover:to-lime-600 transition-all"
                >
                  Restore
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-md sticky top-0 z-50 px-3 py-3 sm:px-6 sm:py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
                AI Interview Platform
              </h1>
              <p className="text-xs text-gray-600 hidden xs:block truncate">
                Select your expertise
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {homeView !== "landing" && (
              <button
                onClick={() => setHomeView("landing")}
                className="flex items-center gap-1 px-2 py-1 sm:px-3 text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Options</span>
              </button>
            )}
            {homeView === "skills" && selectedDomain && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-2 py-1 sm:px-3 text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Back</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-1 sm:px-3 text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {homeView === "landing" && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center mb-4">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Continue Interview
                    </h2>
                    <p className="text-sm text-gray-600">
                      Select your domain and skills to start a new interview session.
                    </p>
                  </div>
                  <button
                    onClick={() => setHomeView("skills")}
                    className="mt-5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 transition-all flex items-center justify-center gap-2"
                  >
                    Start Interview
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
                      <History className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      Past History
                    </h2>
                    <p className="text-sm text-gray-600">
                      View your past interview reports and the skills you selected.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/StudentHistory/${studentId}`)}
                    className="mt-5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    View History
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              </motion.div>
            )}

            {homeView === "skills" && !selectedDomain && (
              <motion.div
                key="domains"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              >
                {allDomains.map((domain) => (
                  <motion.button
                    key={domain.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDomainSelect(domain)}
                    className="bg-white rounded-xl shadow-sm p-4 sm:p-5 flex items-center justify-between border border-gray-100 hover:shadow-md active:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <domain.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-gray-900 text-left truncate">
                        {domain.name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCustomDomainModal(true)}
                  className="bg-white rounded-xl shadow-sm p-4 sm:p-5 flex items-center justify-between border-2 border-dashed border-gray-200 hover:border-emerald-300 hover:shadow-md active:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-gray-900 text-left truncate">
                      Add Custom Domain
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}

            {homeView === "skills" && selectedDomain && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${selectedDomain.color} flex items-center justify-center flex-shrink-0`}>
                      <selectedDomain.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                      {selectedDomain.name}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">
                    Select the technologies you know best
                  </p>

                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {selectedDomain?.isCustom && (
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        placeholder="Add a custom skill"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      />
                      <button
                        onClick={handleAddSkillToCustomDomain}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 transition-all"
                      >
                        Add Skill
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    {selectedSkills.length > 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs sm:text-sm font-medium text-emerald-700">
                          {selectedSkills.length} selected
                        </span>
                      </div>
                    )}
                    <p className={`text-xs sm:text-sm font-medium ${skillGuidance.color}`}>
                      {skillGuidance.message}
                    </p>
                  </div>
                </div>

                {getRecommendedSkills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-sm text-gray-900">Recommended for you</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getRecommendedSkills.map(skillId => {
                        const skill = selectedDomain.skills.find(s => s.id === skillId);
                        return skill ? (
                          <button
                            key={skillId}
                            onClick={() => addRecommendedSkill(skillId)}
                            className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center gap-1.5"
                          >
                            <span>{skill.name}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : null;
                      })}
                    </div>
                  </motion.div>
                )}

                {Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 capitalize px-1">
                      {category.replace(/-/g, " ")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {skills.map((skill) => {
                        const selected = selectedSkills.includes(skill.id);
                        const needsLevel = selected && !skillLevels[skill.id] && highlightMissingLevels;

                        return (
                          <motion.div
                            key={skill.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                              needsLevel
                                ? "border-orange-400 bg-orange-50 shadow-sm ring-2 ring-orange-300"
                                : selected
                                ? "border-emerald-400 bg-emerald-50 shadow-sm"
                                : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                            }`}
                            onClick={() => toggleSkillImmediate(skill.id)}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-medium text-gray-800 text-sm leading-tight">
                                {skill.name}
                              </span>
                              {selected && (
                                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${needsLevel ? "text-orange-500" : "text-emerald-500"}`} />
                              )}
                            </div>

                            {selected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 space-y-2"
                              >
                                {needsLevel && (
                                  <p className="text-xs text-orange-600 font-medium">
                                    ⚠️ Select proficiency level
                                  </p>
                                )}
                                <div className="flex gap-1.5 flex-wrap">
                                  {levels.map((lvl) => (
                                    <button
                                      key={lvl}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSkillLevel(skill.id, lvl);
                                      }}
                                      className={`px-2.5 py-1 text-xs rounded-full font-medium border transition-all duration-200 ${
                                        skillLevels[skill.id] === lvl
                                          ? "bg-gradient-to-r from-emerald-400 to-lime-500 text-white border-transparent shadow-sm"
                                          : "border-gray-300 text-gray-700 hover:border-emerald-400 bg-white"
                                      }`}
                                    >
                                      {lvl}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {filteredSkills.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No skills found matching "{searchQuery}"</p>
                  </div>
                )}

                <div className="h-20 sm:h-24" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Button */}
      {homeView === "skills" && selectedDomain && (
        <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <motion.button
              whileHover={{ scale: selectedSkills.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: selectedSkills.length > 0 ? 0.98 : 1 }}
              disabled={selectedSkills.length === 0 || loading}
              onClick={handleStartInterview}
              className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold shadow-md transition-all duration-300 ${
                selectedSkills.length > 0
                  ? "bg-gradient-to-r from-emerald-500 to-lime-500 text-white hover:from-emerald-600 hover:to-lime-600 hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                `Start Interview${selectedSkills.length > 0 ? ` (${selectedSkills.length})` : ''}`
              )}
            </motion.button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showCustomDomainModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeCustomDomainModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">Create Custom Domain</h3>
                  <p className="text-xs text-gray-500">Add your own domain and skills</p>
                </div>
                <button
                  onClick={closeCustomDomainModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Domain Name</label>
                  <input
                    type="text"
                    value={customDomainName}
                    onChange={(e) => setCustomDomainName(e.target.value)}
                    placeholder="e.g. Data Analytics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Add Skills</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      placeholder="e.g. Power BI"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                    <button
                      onClick={handleAddCustomSkillToModal}
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {customDomainSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
                    >
                      {skill.name}
                      <button
                        onClick={() => handleRemoveCustomSkill(skill.id)}
                        className="text-gray-500 hover:text-gray-700"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {customDomainSkills.length === 0 && (
                    <p className="text-xs text-gray-500">No skills added yet</p>
                  )}
                </div>
              </div>

              <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={closeCustomDomainModal}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCustomDomain}
                  className="flex-1 px-4 py-2 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 transition-all"
                >
                  Create Domain
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
