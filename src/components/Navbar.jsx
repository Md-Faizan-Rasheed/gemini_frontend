import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import CustomNavLink from "./CustomNavlink";
import { AuthContext } from "./Context/AuthContext";
import { 
  Menu, 
  X, 
  Zap, 
  LogOut, 
  UserCircle2,
  ChevronRight,
  Sparkles
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useContext(AuthContext);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("aiQuestions");
    localStorage.removeItem("email");
    localStorage.removeItem("jobPostData");
    localStorage.removeItem("jobs");
    logout();
    navigate("/SignIn");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/PricingPage", label: "Pricing" },
    { to: "/JDcreation", label: "JD Creation" },
    { to: "/ContactUsPage", label: "Contact" }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-xl group-hover:shadow-green-500/30 transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent tracking-tight">
                  Cerplunk
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 -mt-0.5 hidden sm:block font-medium">
                  AI Interview Platform
                </span>
              </div>
            </Link>                                                                        
            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <CustomNavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `relative px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 group ${
                        isActive
                          ? "text-green-600"
                          : "text-gray-700 hover:text-green-600 hover:bg-green-50/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-green-500 to-lime-500 rounded-full transition-all duration-300 ${
                          isActive ? "w-6" : "w-0 group-hover:w-6"
                        }`}></span>
                      </>
                    )}
                  </CustomNavLink>
                </li>
              ))}
            </ul>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-green-600 font-semibold text-sm rounded-xl hover:bg-green-50 transition-all duration-200"
                  >
                    <UserCircle2 className="w-4 h-4" strokeWidth={2} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 border border-gray-200 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-4 py-2 text-gray-700 hover:text-green-600 font-semibold text-sm rounded-xl hover:bg-green-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/organisationsignup"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-200"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6" strokeWidth={2} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          menuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Menu Content - Slide from Right */}
        <div 
          className={`absolute top-0 right-0 bottom-0 w-[85%] sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Scrollable Content */}
          <div className="h-full overflow-y-auto">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-green-500 to-lime-500 px-5 py-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Cerplunk</h2>
                  <p className="text-xs text-white/90 font-medium">Navigation Menu</p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2.5 rounded-xl text-white hover:bg-white/20 active:bg-white/30 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>

            {/* Navigation Section */}
            <div className="px-5 pt-6 pb-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                Navigation
              </h3>
              <nav className="space-y-1.5">
                {navLinks.map((link) => (
                  <CustomNavLink
                    key={link.to}
                    to={link.to}
                  >
                    {({ isActive }) => (
                      <div
                       onClick={() => {
                      console.log("Nav clicked");
                      setMenuOpen(false);
                    }}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-green-500 to-lime-500 text-white shadow-md shadow-green-500/20"
                            : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive ? (
                          <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                        )}
                      </div>
                    )}
                  </CustomNavLink>
                ))}
              </nav>
            </div>

            {/* Account Section */}
            <div className="px-5 pt-4 pb-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                Account
              </h3>
              <div className="space-y-2.5">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 font-semibold text-[15px] rounded-xl transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-lime-50 border border-green-100 flex items-center justify-center">
                          <UserCircle2 className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                        </div>
                        <span>Dashboard</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center justify-between w-full px-4 py-3.5 bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 font-semibold text-[15px] rounded-xl transition-all duration-200 border border-red-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                          <LogOut className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                        </div>
                        <span>Logout</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-3.5 text-gray-700 hover:bg-gray-50 active:bg-gray-100 font-semibold text-[15px] rounded-xl transition-all duration-200"
                    >
                      <span>Sign In</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
                    </Link>
                    
                    <Link
                      to="/organisationsignup"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2.5 w-full px-4 py-4 bg-gradient-to-r from-green-500 to-lime-500 text-white font-bold text-[15px] rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl active:scale-[0.98] transition-all duration-200"
                    >
                      <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                      <span>Get Started</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto px-5 py-5 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center font-medium">
                © 2024 Cerplunk. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 sm:h-18"></div>
    </>
  );
};

export default Navbar;