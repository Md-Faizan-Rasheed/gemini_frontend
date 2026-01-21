// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { renderToStaticMarkup } from 'react-dom/server';
// import { X, Sparkles, ChevronDown, ChevronUp, Plus, DollarSign, MapPin, Briefcase, FileText, Save } from 'lucide-react';
// import { AI_PROMPTSEC } from './constants/options';
// import { chatSessionSecond } from "./service/ai/chatSessionSecond.js";
// import Onavbar from './Onavbar';
// import { useToast } from '../Context/ToastContext.jsx';

// const Jobpost = () => {
//   const navigate = useNavigate();
//     const { showToast } = useToast();

//   const categoryMap = {
//     software: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer", "DevOps Engineer", "QA Engineer", "Software Architect", "Game Developer", "Embedded Systems Engineer"],
//     design: ["UI/UX Designer", "Graphic Designer", "Product Designer", "Motion Designer", "Game Designer", "Visual Designer", "Interaction Designer", "Brand Designer", "Web Designer"],
//     marketing: ["Digital Marketing Manager", "SEO Specialist", "Content Marketing Manager", "Social Media Manager", "Email Marketing Specialist", "Marketing Analyst", "Brand Manager", "Growth Marketer", "Performance Marketing Manager"],
//     sales: ["Inside Sales Representative", "Field Sales Executive", "Account Executive", "Business Development Manager", "Sales Manager", "Key Account Manager", "Sales Engineer", "Regional Sales Manager", "Channel Sales Manager"],
//     data: ["Data Analyst", "Data Scientist", "Machine Learning Engineer", "Data Engineer", "Business Intelligence Analyst", "AI Research Scientist", "Analytics Manager", "Big Data Engineer", "Data Architect"],
//     management: ["Project Manager", "Product Manager", "Operations Manager", "Program Manager", "Engineering Manager", "Delivery Manager", "Portfolio Manager", "Agile Coach", "Scrum Master"],
//     hr: ["Recruitment Specialist", "HR Generalist", "Payroll Specialist", "Talent Acquisition Manager", "HR Business Partner", "Compensation & Benefits Manager", "Learning & Development Manager", "Employee Relations Manager", "HR Operations Manager"],
//     finance: ["Accountant", "Financial Analyst", "Auditor", "Tax Consultant", "Financial Controller", "Investment Analyst", "Treasury Manager", "Budget Analyst", "Credit Analyst"],
//     support: ["Customer Support Representative", "Technical Support Engineer", "Helpdesk Specialist", "Customer Success Manager", "Support Team Lead", "Application Support Analyst", "IT Support Specialist", "Client Services Manager"],
//     it: ["System Administrator", "Network Engineer", "Cyber Security Analyst", "Cloud Engineer", "IT Manager", "Database Administrator", "Solutions Architect", "Infrastructure Engineer", "Security Operations Analyst"],
//     production: ["Production Manager", "Manufacturing Engineer", "Quality Control Inspector", "Production Supervisor", "Plant Manager", "Industrial Engineer", "Production Planner", "Process Engineer", "Operations Coordinator"],
//     logistics: ["Logistics Coordinator", "Supply Chain Manager", "Warehouse Manager", "Procurement Specialist", "Inventory Manager", "Distribution Manager", "Freight Coordinator", "Transportation Manager", "Materials Manager"],
//     healthcare: ["Registered Nurse", "Medical Assistant", "Healthcare Administrator", "Clinical Coordinator", "Pharmacy Technician", "Medical Records Specialist", "Health Information Manager", "Patient Care Coordinator", "Medical Billing Specialist"],
//     education: ["Teacher", "Curriculum Developer", "Education Coordinator", "Training Specialist", "Academic Advisor", "Instructional Designer", "Learning Specialist", "Education Consultant", "Program Director"],
//     legal: ["Legal Counsel", "Paralegal", "Compliance Officer", "Contract Manager", "Legal Assistant", "Corporate Lawyer", "IP Attorney", "Litigation Associate", "Legal Operations Manager"],
//     consulting: ["Business Consultant", "Management Consultant", "Strategy Consultant", "IT Consultant", "Financial Consultant", "HR Consultant", "Operations Consultant", "Risk Consultant", "Change Management Consultant"],
//     retail: ["Store Manager", "Retail Sales Associate", "Visual Merchandiser", "Inventory Specialist", "Retail Buyer", "Customer Service Representative", "Assistant Store Manager", "Category Manager", "Retail Operations Manager"],
//     hospitality: ["Hotel Manager", "Front Desk Agent", "Event Coordinator", "Hospitality Manager", "Concierge", "Restaurant Manager", "Guest Relations Manager", "Catering Manager", "Housekeeping Supervisor"],
//     media: ["Content Creator", "Video Editor", "Journalist", "Copywriter", "Social Media Coordinator", "Content Strategist", "Broadcast Producer", "Media Planner", "Public Relations Specialist"],
//     research: ["Research Scientist", "Research Analyst", "Lab Technician", "Clinical Research Coordinator", "Market Research Analyst", "UX Researcher", "Research Associate", "Product Research Manager", "Data Research Specialist"]
//   };

//   // Job title keywords mapping to categories and subcategories
//   const jobTitleMapping = {
//     // Software keywords
//     "frontend": { category: "software", subcategory: "frontend-developer" },
//     "react": { category: "software", subcategory: "frontend-developer" },
//     "angular": { category: "software", subcategory: "frontend-developer" },
//     "vue": { category: "software", subcategory: "frontend-developer" },
//     "backend": { category: "software", subcategory: "backend-developer" },
//     "node": { category: "software", subcategory: "backend-developer" },
//     "python": { category: "software", subcategory: "backend-developer" },
//     "java": { category: "software", subcategory: "backend-developer" },
//     "fullstack": { category: "software", subcategory: "full-stack-developer" },
//     "full stack": { category: "software", subcategory: "full-stack-developer" },
//     "mobile": { category: "software", subcategory: "mobile-app-developer" },
//     "android": { category: "software", subcategory: "mobile-app-developer" },
//     "ios": { category: "software", subcategory: "mobile-app-developer" },
//     "devops": { category: "software", subcategory: "devops-engineer" },
//     "qa": { category: "software", subcategory: "qa-engineer" },
//     "testing": { category: "software", subcategory: "qa-engineer" },
//     "software engineer": { category: "software", subcategory: "full-stack-developer" },
    
//     // Design keywords
//     "designer": { category: "design", subcategory: "ui/ux-designer" },
//     "ui": { category: "design", subcategory: "ui/ux-designer" },
//     "ux": { category: "design", subcategory: "ui/ux-designer" },
//     "graphic": { category: "design", subcategory: "graphic-designer" },
//     "product design": { category: "design", subcategory: "product-designer" },
//     "motion": { category: "design", subcategory: "motion-designer" },
    
//     // Marketing keywords
//     "marketing": { category: "marketing", subcategory: "digital-marketing-manager" },
//     "seo": { category: "marketing", subcategory: "seo-specialist" },
//     "content": { category: "marketing", subcategory: "content-marketing-manager" },
//     "social media": { category: "marketing", subcategory: "social-media-manager" },
//     "digital marketing": { category: "marketing", subcategory: "digital-marketing-manager" },
    
//     // Sales keywords
//     "sales": { category: "sales", subcategory: "inside-sales-representative" },
//     "account executive": { category: "sales", subcategory: "account-executive" },
//     "business development": { category: "sales", subcategory: "business-development-manager" },
    
//     // Data keywords
//     "data analyst": { category: "data", subcategory: "data-analyst" },
//     "data scientist": { category: "data", subcategory: "data-scientist" },
//     "machine learning": { category: "data", subcategory: "machine-learning-engineer" },
//     "ml engineer": { category: "data", subcategory: "machine-learning-engineer" },
//     "data engineer": { category: "data", subcategory: "data-engineer" },
//     "ai": { category: "data", subcategory: "ai-research-scientist" },
    
//     // Management keywords
//     "project manager": { category: "management", subcategory: "project-manager" },
//     "product manager": { category: "management", subcategory: "product-manager" },
//     "operations manager": { category: "management", subcategory: "operations-manager" },
//     "scrum master": { category: "management", subcategory: "scrum-master" },
    
//     // HR keywords
//     "hr": { category: "hr", subcategory: "hr-generalist" },
//     "recruiter": { category: "hr", subcategory: "recruitment-specialist" },
//     "talent acquisition": { category: "hr", subcategory: "talent-acquisition-manager" },
//     "payroll": { category: "hr", subcategory: "payroll-specialist" },
    
//     // Finance keywords
//     "accountant": { category: "finance", subcategory: "accountant" },
//     "financial analyst": { category: "finance", subcategory: "financial-analyst" },
//     "auditor": { category: "finance", subcategory: "auditor" },
//     "tax": { category: "finance", subcategory: "tax-consultant" },
    
//     // Support keywords
//     "customer support": { category: "support", subcategory: "customer-support-representative" },
//     "technical support": { category: "support", subcategory: "technical-support-engineer" },
//     "helpdesk": { category: "support", subcategory: "helpdesk-specialist" },
    
//     // IT keywords
//     "system admin": { category: "it", subcategory: "system-administrator" },
//     "network engineer": { category: "it", subcategory: "network-engineer" },
//     "cyber security": { category: "it", subcategory: "cyber-security-analyst" },
//     "cloud engineer": { category: "it", subcategory: "cloud-engineer" },
//     "security": { category: "it", subcategory: "cyber-security-analyst" },
    
//     // Production keywords
//     "production": { category: "production", subcategory: "production-manager" },
//     "manufacturing": { category: "production", subcategory: "manufacturing-engineer" },
//     "quality control": { category: "production", subcategory: "quality-control-inspector" },
//     "plant manager": { category: "production", subcategory: "plant-manager" },
    
//     // Logistics keywords
//     "logistics": { category: "logistics", subcategory: "logistics-coordinator" },
//     "supply chain": { category: "logistics", subcategory: "supply-chain-manager" },
//     "warehouse": { category: "logistics", subcategory: "warehouse-manager" },
//     "procurement": { category: "logistics", subcategory: "procurement-specialist" },
    
//     // Healthcare keywords
//     "nurse": { category: "healthcare", subcategory: "registered-nurse" },
//     "medical": { category: "healthcare", subcategory: "medical-assistant" },
//     "healthcare": { category: "healthcare", subcategory: "healthcare-administrator" },
    
//     // Education keywords
//     "teacher": { category: "education", subcategory: "teacher" },
//     "trainer": { category: "education", subcategory: "training-specialist" },
//     "education": { category: "education", subcategory: "education-coordinator" },
    
//     // Legal keywords
//     "legal": { category: "legal", subcategory: "legal-counsel" },
//     "lawyer": { category: "legal", subcategory: "corporate-lawyer" },
//     "paralegal": { category: "legal", subcategory: "paralegal" },
//     "compliance": { category: "legal", subcategory: "compliance-officer" },
    
//     // Consulting keywords
//     "consultant": { category: "consulting", subcategory: "business-consultant" },
//     "consulting": { category: "consulting", subcategory: "management-consultant" },
    
//     // Retail keywords
//     "retail": { category: "retail", subcategory: "store-manager" },
//     "store manager": { category: "retail", subcategory: "store-manager" },
//     "merchandiser": { category: "retail", subcategory: "visual-merchandiser" },
    
//     // Hospitality keywords
//     "hotel": { category: "hospitality", subcategory: "hotel-manager" },
//     "hospitality": { category: "hospitality", subcategory: "hospitality-manager" },
//     "event": { category: "hospitality", subcategory: "event-coordinator" },
    
//     // Media keywords
//     "editor": { category: "media", subcategory: "video-editor" },
//     "journalist": { category: "media", subcategory: "journalist" },
//     "copywriter": { category: "media", subcategory: "copywriter" },
//     "content creator": { category: "media", subcategory: "content-creator" },
    
//     // Research keywords
//     "research": { category: "research", subcategory: "research-scientist" },
//     "scientist": { category: "research", subcategory: "research-scientist" },
//     "lab technician": { category: "research", subcategory: "lab-technician" }
//   };

//   // Function to auto-detect category and subcategory from job title
//   const detectCategoryFromJobTitle = (title) => {
//     if (!title) return { category: '', subcategory: '' };
    
//     const lowerTitle = title.toLowerCase();
    
//     // Check for exact matches first
//     for (const [keyword, mapping] of Object.entries(jobTitleMapping)) {
//       if (lowerTitle.includes(keyword)) {
//         return mapping;
//       }
//     }
    
//     return { category: '', subcategory: '' };
//   };
  
//   const loadInitialState = () => {
//     const savedData = localStorage.getItem('jobPostData');
//     if (savedData) {
//       return JSON.parse(savedData);
//     }
//     return null;
//   };
  
//   const initialState = loadInitialState();

//   // State for input fields
//   const [jobTitle, setJobTitle] = useState(initialState?.jobTitle || '');
//   const [category, setCategory] = useState(initialState?.category || '');
//   const [subcategory, setSubcategory] = useState(initialState?.subcategory || '');
//   const [locationType, setLocationType] = useState(initialState?.locationType || '');
//   const [city, setCity] = useState(initialState?.city || '');
//   const [state, setState] = useState(initialState?.state || '');
//   const [country, setCountry] = useState(initialState?.country || '');
//   const [jobDescription, setJobDescription] = useState(initialState?.jobDescription || '');
//   const [selectedJobTypes, setSelectedJobTypes] = useState(initialState?.selectedJobTypes || []);
//   const [selectedExperienceLevel, setSelectedExperienceLevel] = useState(initialState?.selectedExperienceLevel || null);
//   const [selectedSchedules, setSelectedSchedules] = useState(initialState?.selectedSchedules || []);
//   const [payRange, setPayRange] = useState(initialState?.payRange || { min: '', max: '' });
//   const [benefits, setBenefits] = useState(initialState?.benefits || []);
  
//   // UI State
//   const [isJobInfoOpen, setJobInfoOpen] = useState(true);
//   const [isJobDescriptionOpen, setJobDescriptionOpen] = useState(true);
//   const [isCompensationOpen, setCompensationOpen] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [newBenefit, setNewBenefit] = useState('');
//   const [loggedInUser, setLoggedInUser] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(false);

//   const handleContentChange = (e) => {
//     setJobDescription(e.target.innerHTML);
//   };

//   const handleAddBenefit = () => {
//     if (newBenefit.trim()) {
//       setBenefits([...benefits, newBenefit.trim()]);
//       setNewBenefit('');
//       setShowModal(false);
//     }
//   };

//   // Auto-detect category when job title changes
//   const handleJobTitleChange = (e) => {
//     const newTitle = e.target.value;
//     setJobTitle(newTitle);
    
//     // Auto-detect and set category/subcategory
//     const detected = detectCategoryFromJobTitle(newTitle);
//     if (detected.category) {
//       setCategory(detected.category);
//       setSubcategory(detected.subcategory);
//     }
//   };

//   useEffect(() => {
//     const dataToSave = {
//       jobTitle,
//       category,
//       subcategory,
//       locationType,
//       city,
//       state,
//       country,
//       jobDescription,
//       selectedJobTypes,
//       selectedExperienceLevel,
//       selectedSchedules,
//       payRange,
//       benefits,
//     };
//     localStorage.setItem("jobPostData", JSON.stringify(dataToSave));
//   }, [jobTitle, category, subcategory, locationType, city, state, country, jobDescription, selectedJobTypes, selectedExperienceLevel, selectedSchedules, payRange, benefits]);

//   const handleRemoveBenefit = (index) => {
//     const updatedBenefits = benefits.filter((_, i) => i !== index);
//     setBenefits(updatedBenefits);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPayRange((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSaveAndNext = () => {
//     if (jobTitle && jobDescription) {
//       const jobData = {
//         jobTitle,
//         category,
//         subcategory,
//         locationType,
//         location: { city, state, country },
//         jobDescription,
//         selectedJobTypes,
//         selectedExperienceLevel,
//         selectedSchedules,
//         payRange,
//         benefits,
//       };
//       navigate('/Aiquestion', { state: { jobData } });
//     }
//   };

//   useEffect(() => {
//     const user = localStorage.getItem('loggedInUser');
//     if (user) {
//       setLoggedInUser(user);
//     }
//   }, []);

//   const FINAL_PROMPT = AI_PROMPTSEC
//     .replace("{role}", jobTitle || "N/A")
//     .replace("{comapany_name}", loggedInUser || "N/A");

//   const handleGenerateDescription = async () => {
//     setIsLoading(true);
//     try {
//       if (jobTitle) {
//         const result = await chatSessionSecond(FINAL_PROMPT);
//         const jobDescriptionData = JSON.parse(result);

//         const formattedDescriptionJSX = (
//           <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.6" }}>
//             <p style={{ marginBottom: "15px", marginTop: "10px", color: "#4b5563" }}>
//               {jobDescriptionData.Company || "N/A"}
//             </p>
//             <p>
//               <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Responsibilities:</strong>
//               <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
//                 {(jobDescriptionData.Responsibilities || []).map((item, index) => (
//                   <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
//                 ))}
//               </ul>
//             </p>
//             <p>
//               <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Qualifications:</strong>
//               <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
//                 {(jobDescriptionData.Qualifications || []).map((item, index) => (
//                   <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
//                 ))}
//               </ul>
//             </p>
//             <p>
//               <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Benefits:</strong>
//               <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
//                 {(jobDescriptionData.Benefits || []).map((item, index) => (
//                   <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
//                 ))}
//               </ul>
//             </p>
//             <p>
//               <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Requirements:</strong>
//               <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
//                 {(jobDescriptionData.Requirements || []).map((item, index) => (
//                   <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
//                 ))}
//               </ul>
//             </p>
//           </div>
//         );

//         const formattedDescriptionString = renderToStaticMarkup(formattedDescriptionJSX);
//         setJobDescription(formattedDescriptionString);
//       }
//     } catch (error) {
//       console.log("Failed to generate description:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const SectionCard = ({ title, icon: Icon, isOpen, toggle, children }) => (
//     <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
//       <button
//         onClick={toggle}
//         className="w-full flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-green-500 to-lime-500 text-white hover:from-green-600 hover:to-lime-600 transition-all duration-300"
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
//             <Icon className="w-5 h-5" />
//           </div>
//           <h2 className="font-semibold text-base sm:text-lg">{title}</h2>
//         </div>
//         {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//       </button>

//       {isOpen && (
//         <div className="p-4 sm:p-6">
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-lime-50/20">
//       <Onavbar />

//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//           {/* Header */}
//           <div className="mb-6 sm:mb-8">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-4">
//               <Sparkles className="w-4 h-4 text-green-500" />
//               <span className="text-sm font-medium text-gray-700">Create Job Posting</span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
//               Post a New Position
//             </h1>
//             <p className="text-gray-600 mt-2">Fill in the details to attract the best candidates</p>
//           </div>

//           <div className="space-y-6">
//             {/* Job Information */}
//             <SectionCard title="Job Information" icon={Briefcase} isOpen={isJobInfoOpen} toggle={() => setJobInfoOpen(!isJobInfoOpen)}>
//               <div className="space-y-4 sm:space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Job Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={jobTitle}
//                     onChange={handleJobTitleChange}
//                     placeholder="e.g. Senior Software Engineer"
//                     className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 placeholder-gray-400"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">💡 Category will auto-detect based on job title</p>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
//                     <select
//                       value={category}
//                       onChange={(e) => {
//                         setCategory(e.target.value);
//                         setSubcategory(""); // reset subcategory when category changes
//                       }}
//                       className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900"
//                     >
//                       <option value="">Select category</option>
//                       <option value="software">Software Development</option>
//                       <option value="design">Design</option>
//                       <option value="marketing">Marketing</option>
//                       <option value="sales">Sales</option>
//                       <option value="data">Data & Analytics</option>
//                       <option value="management">Management</option>
//                       <option value="hr">Human Resources</option>
//                       <option value="finance">Finance</option>
//                       <option value="support">Support</option>
//                       <option value="it">IT & Infrastructure</option>
//                       <option value="production">Production & Manufacturing</option>
//                       <option value="logistics">Logistics & Supply Chain</option>
//                       <option value="healthcare">Healthcare</option>
//                       <option value="education">Education & Training</option>
//                       <option value="legal">Legal</option>
//                       <option value="consulting">Consulting</option>
//                       <option value="retail">Retail</option>
//                       <option value="hospitality">Hospitality</option>
//                       <option value="media">Media & Communications</option>
//                       <option value="research">Research & Development</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Subcategory</label>
//                     <select
//                       value={subcategory}
//                       onChange={(e) => setSubcategory(e.target.value)}
//                       disabled={!category}
//                       className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     >
//                       <option value="">Select subcategory</option>
//                       {category &&
//                         categoryMap[category]?.map((sub, i) => (
//                           <option key={i} value={sub.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "/")}>
//                             {sub}
//                           </option>
//                         ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     <MapPin className="w-4 h-4 inline mr-1" />
//                     Location
//                   </label>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <input
//                       placeholder="City"
//                       value={city}
//                       onChange={(e) => setCity(e.target.value)}
//                       className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 placeholder-gray-400"
//                     />
//                     <input
//                       placeholder="State"
//                       value={state}
//                       onChange={(e) => setState(e.target.value)}
//                       className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 placeholder-gray-400"
//                     />
//                     <input
//                       placeholder="Country"
//                       value={country}
//                       onChange={(e) => setCountry(e.target.value)}
//                       className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 placeholder-gray-400"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </SectionCard>

//             {/* Job Description */}
//             <SectionCard title="Job Description" icon={FileText} isOpen={isJobDescriptionOpen} toggle={() => setJobDescriptionOpen(!isJobDescriptionOpen)}>
//               <div className="space-y-4">
//                 <button
//                   onClick={handleGenerateDescription}
//                   disabled={isLoading || !jobTitle}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Sparkles className="w-5 h-5" />
//                   {isLoading ? "Generating..." : "Generate with AI"}
//                 </button>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <div
//                     contentEditable
//                     onInput={handleContentChange}
//                     dangerouslySetInnerHTML={{ __html: jobDescription || '<p class="text-gray-400">Click "Generate with AI" or start typing...</p>' }}
//                     className="min-h-[300px] max-h-[500px] border-2 border-gray-200 p-4 rounded-xl bg-white overflow-y-auto focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
//                   />
//                 </div>
//               </div>
//             </SectionCard>

        
//              {/* Compensation */}
//              <SectionCard title="Compensation & Benefits" icon={DollarSign} isOpen={isCompensationOpen} toggle={() => setCompensationOpen(!isCompensationOpen)}>
//               <div className="space-y-6">
//                  <div>
//                    <label className="block text-sm font-semibold text-gray-900 mb-2">Salary Range (USD)</label>                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <input
//                       name="min"
//                       type="number"
//                       placeholder="Minimum"
//                       value={payRange.min}
//                       onChange={handleInputChange}
//                       className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 placeholder-gray-400"
//                     />
//                     <input
//                       name="max"
//                       type="number"
//                       placeholder="Maximum"
//                       value={payRange.max}
//                       onChange={handleInputChange}
//                       className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 placeholder-gray-400"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-3">Benefits</label>
//                   <div className="flex flex-wrap gap-2 mb-3">
//                     {benefits.map((b, i) => (
//                       <span
//                         key={i}
//                         className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-lime-100 text-green-700 rounded-full text-sm font-medium"
//                       >
//                         {b}
//                         <button
//                           onClick={() => handleRemoveBenefit(i)}
//                           className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => setShowModal(true)}
//                     className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-600 transition-all"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Benefit
//                   </button>
//                 </div>
//               </div>
//             </SectionCard>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pb-8">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSaveAndNext}
//               disabled={!jobTitle || !jobDescription}
//               className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Save className="w-5 h-5" />
//               Save & Continue
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add Benefit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Add Benefit</h3>
//             <input
//               value={newBenefit}
//               onChange={(e) => setNewBenefit(e.target.value)}
//               placeholder="e.g., Health Insurance"
//               className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-900 placeholder-gray-400 mb-6"
//               onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
//             />
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddBenefit}
//                 className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Jobpost;









// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { renderToStaticMarkup } from 'react-dom/server';
// import { X, Sparkles, ChevronDown, ChevronUp, Plus, DollarSign, MapPin, Briefcase, FileText, Save } from 'lucide-react';
// import { AI_PROMPTSEC } from './constants/options';
// import { chatSessionSecond } from "./service/ai/chatSessionSecond.js";
// import Onavbar from './Onavbar';
// import { useToast } from '../Context/ToastContext.jsx';

// const Jobpost = () => {
//   const navigate = useNavigate();
//   const { showToast } = useToast();

//   const categoryMap = {
//     software: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer", "DevOps Engineer", "QA Engineer", "Software Architect", "Game Developer", "Embedded Systems Engineer"],
//     design: ["UI/UX Designer", "Graphic Designer", "Product Designer", "Motion Designer", "Game Designer", "Visual Designer", "Interaction Designer", "Brand Designer", "Web Designer"],
//     marketing: ["Digital Marketing Manager", "SEO Specialist", "Content Marketing Manager", "Social Media Manager", "Email Marketing Specialist", "Marketing Analyst", "Brand Manager", "Growth Marketer", "Performance Marketing Manager"],
//     sales: ["Inside Sales Representative", "Field Sales Executive", "Account Executive", "Business Development Manager", "Sales Manager", "Key Account Manager", "Sales Engineer", "Regional Sales Manager", "Channel Sales Manager"],
//     data: ["Data Analyst", "Data Scientist", "Machine Learning Engineer", "Data Engineer", "Business Intelligence Analyst", "AI Research Scientist", "Analytics Manager", "Big Data Engineer", "Data Architect"],
//     management: ["Project Manager", "Product Manager", "Operations Manager", "Program Manager", "Engineering Manager", "Delivery Manager", "Portfolio Manager", "Agile Coach", "Scrum Master"],
//     hr: ["Recruitment Specialist", "HR Generalist", "Payroll Specialist", "Talent Acquisition Manager", "HR Business Partner", "Compensation & Benefits Manager", "Learning & Development Manager", "Employee Relations Manager", "HR Operations Manager"],
//     finance: ["Accountant", "Financial Analyst", "Auditor", "Tax Consultant", "Financial Controller", "Investment Analyst", "Treasury Manager", "Budget Analyst", "Credit Analyst"],
//     support: ["Customer Support Representative", "Technical Support Engineer", "Helpdesk Specialist", "Customer Success Manager", "Support Team Lead", "Application Support Analyst", "IT Support Specialist", "Client Services Manager"],
//     it: ["System Administrator", "Network Engineer", "Cyber Security Analyst", "Cloud Engineer", "IT Manager", "Database Administrator", "Solutions Architect", "Infrastructure Engineer", "Security Operations Analyst"],
//     production: ["Production Manager", "Manufacturing Engineer", "Quality Control Inspector", "Production Supervisor", "Plant Manager", "Industrial Engineer", "Production Planner", "Process Engineer", "Operations Coordinator"],
//     logistics: ["Logistics Coordinator", "Supply Chain Manager", "Warehouse Manager", "Procurement Specialist", "Inventory Manager", "Distribution Manager", "Freight Coordinator", "Transportation Manager", "Materials Manager"],
//     healthcare: ["Registered Nurse", "Medical Assistant", "Healthcare Administrator", "Clinical Coordinator", "Pharmacy Technician", "Medical Records Specialist", "Health Information Manager", "Patient Care Coordinator", "Medical Billing Specialist"],
//     education: ["Teacher", "Curriculum Developer", "Education Coordinator", "Training Specialist", "Academic Advisor", "Instructional Designer", "Learning Specialist", "Education Consultant", "Program Director"],
//     legal: ["Legal Counsel", "Paralegal", "Compliance Officer", "Contract Manager", "Legal Assistant", "Corporate Lawyer", "IP Attorney", "Litigation Associate", "Legal Operations Manager"],
//     consulting: ["Business Consultant", "Management Consultant", "Strategy Consultant", "IT Consultant", "Financial Consultant", "HR Consultant", "Operations Consultant", "Risk Consultant", "Change Management Consultant"],
//     retail: ["Store Manager", "Retail Sales Associate", "Visual Merchandiser", "Inventory Specialist", "Retail Buyer", "Customer Service Representative", "Assistant Store Manager", "Category Manager", "Retail Operations Manager"],
//     hospitality: ["Hotel Manager", "Front Desk Agent", "Event Coordinator", "Hospitality Manager", "Concierge", "Restaurant Manager", "Guest Relations Manager", "Catering Manager", "Housekeeping Supervisor"],
//     media: ["Content Creator", "Video Editor", "Journalist", "Copywriter", "Social Media Coordinator", "Content Strategist", "Broadcast Producer", "Media Planner", "Public Relations Specialist"],
//     research: ["Research Scientist", "Research Analyst", "Lab Technician", "Clinical Research Coordinator", "Market Research Analyst", "UX Researcher", "Research Associate", "Product Research Manager", "Data Research Specialist"],
//     other: ["General Position", "Entry Level", "Internship", "Trainee", "Consultant", "Specialist", "Coordinator", "Assistant", "Associate"]
//   };

//   // Enhanced keyword mapping with more comprehensive coverage
//   const jobTitleMapping = {
//     // Software keywords
//     "frontend": { category: "software", subcategory: "frontend-developer" },
//     "front-end": { category: "software", subcategory: "frontend-developer" },
//     "react": { category: "software", subcategory: "frontend-developer" },
//     "angular": { category: "software", subcategory: "frontend-developer" },
//     "vue": { category: "software", subcategory: "frontend-developer" },
//     "backend": { category: "software", subcategory: "backend-developer" },
//     "back-end": { category: "software", subcategory: "backend-developer" },
//     "node": { category: "software", subcategory: "backend-developer" },
//     "python": { category: "software", subcategory: "backend-developer" },
//     "java developer": { category: "software", subcategory: "backend-developer" },
//     "fullstack": { category: "software", subcategory: "full-stack-developer" },
//     "full stack": { category: "software", subcategory: "full-stack-developer" },
//     "full-stack": { category: "software", subcategory: "full-stack-developer" },
//     "mobile": { category: "software", subcategory: "mobile-app-developer" },
//     "android": { category: "software", subcategory: "mobile-app-developer" },
//     "ios": { category: "software", subcategory: "mobile-app-developer" },
//     "swift": { category: "software", subcategory: "mobile-app-developer" },
//     "flutter": { category: "software", subcategory: "mobile-app-developer" },
//     "react native": { category: "software", subcategory: "mobile-app-developer" },
//     "devops": { category: "software", subcategory: "devops-engineer" },
//     "sre": { category: "software", subcategory: "devops-engineer" },
//     "qa": { category: "software", subcategory: "qa-engineer" },
//     "quality assurance": { category: "software", subcategory: "qa-engineer" },
//     "testing": { category: "software", subcategory: "qa-engineer" },
//     "tester": { category: "software", subcategory: "qa-engineer" },
//     "software engineer": { category: "software", subcategory: "full-stack-developer" },
//     "software developer": { category: "software", subcategory: "full-stack-developer" },
//     "programmer": { category: "software", subcategory: "full-stack-developer" },
//     "architect": { category: "software", subcategory: "software-architect" },
//     "game developer": { category: "software", subcategory: "game-developer" },
//     "embedded": { category: "software", subcategory: "embedded-systems-engineer" },
    
//     // Design keywords
//     "designer": { category: "design", subcategory: "ui/ux-designer" },
//     "ui designer": { category: "design", subcategory: "ui/ux-designer" },
//     "ux designer": { category: "design", subcategory: "ui/ux-designer" },
//     "ui/ux": { category: "design", subcategory: "ui/ux-designer" },
//     "graphic": { category: "design", subcategory: "graphic-designer" },
//     "product design": { category: "design", subcategory: "product-designer" },
//     "motion": { category: "design", subcategory: "motion-designer" },
//     "visual designer": { category: "design", subcategory: "visual-designer" },
//     "interaction design": { category: "design", subcategory: "interaction-designer" },
//     "brand designer": { category: "design", subcategory: "brand-designer" },
//     "web designer": { category: "design", subcategory: "web-designer" },
    
//     // Marketing keywords
//     "marketing": { category: "marketing", subcategory: "digital-marketing-manager" },
//     "seo": { category: "marketing", subcategory: "seo-specialist" },
//     "content": { category: "marketing", subcategory: "content-marketing-manager" },
//     "social media": { category: "marketing", subcategory: "social-media-manager" },
//     "digital marketing": { category: "marketing", subcategory: "digital-marketing-manager" },
//     "email marketing": { category: "marketing", subcategory: "email-marketing-specialist" },
//     "growth": { category: "marketing", subcategory: "growth-marketer" },
//     "brand manager": { category: "marketing", subcategory: "brand-manager" },
//     "marketing analyst": { category: "marketing", subcategory: "marketing-analyst" },
    
//     // Sales keywords
//     "sales": { category: "sales", subcategory: "inside-sales-representative" },
//     "account executive": { category: "sales", subcategory: "account-executive" },
//     "business development": { category: "sales", subcategory: "business-development-manager" },
//     "sales manager": { category: "sales", subcategory: "sales-manager" },
//     "sales representative": { category: "sales", subcategory: "inside-sales-representative" },
//     "sales executive": { category: "sales", subcategory: "field-sales-executive" },
//     "key account": { category: "sales", subcategory: "key-account-manager" },
//     "sales engineer": { category: "sales", subcategory: "sales-engineer" },
    
//     // Data keywords
//     "data analyst": { category: "data", subcategory: "data-analyst" },
//     "data scientist": { category: "data", subcategory: "data-scientist" },
//     "machine learning": { category: "data", subcategory: "machine-learning-engineer" },
//     "ml engineer": { category: "data", subcategory: "machine-learning-engineer" },
//     "data engineer": { category: "data", subcategory: "data-engineer" },
//     "ai engineer": { category: "data", subcategory: "ai-research-scientist" },
//     "artificial intelligence": { category: "data", subcategory: "ai-research-scientist" },
//     "bi analyst": { category: "data", subcategory: "business-intelligence-analyst" },
//     "business intelligence": { category: "data", subcategory: "business-intelligence-analyst" },
//     "big data": { category: "data", subcategory: "big-data-engineer" },
//     "data architect": { category: "data", subcategory: "data-architect" },
    
//     // Management keywords
//     "project manager": { category: "management", subcategory: "project-manager" },
//     "product manager": { category: "management", subcategory: "product-manager" },
//     "operations manager": { category: "management", subcategory: "operations-manager" },
//     "program manager": { category: "management", subcategory: "program-manager" },
//     "engineering manager": { category: "management", subcategory: "engineering-manager" },
//     "scrum master": { category: "management", subcategory: "scrum-master" },
//     "agile coach": { category: "management", subcategory: "agile-coach" },
//     "delivery manager": { category: "management", subcategory: "delivery-manager" },
    
//     // HR keywords
//     "hr": { category: "hr", subcategory: "hr-generalist" },
//     "human resources": { category: "hr", subcategory: "hr-generalist" },
//     "recruiter": { category: "hr", subcategory: "recruitment-specialist" },
//     "talent acquisition": { category: "hr", subcategory: "talent-acquisition-manager" },
//     "payroll": { category: "hr", subcategory: "payroll-specialist" },
//     "hr business partner": { category: "hr", subcategory: "hr-business-partner" },
//     "compensation": { category: "hr", subcategory: "compensation-&-benefits-manager" },
//     "learning": { category: "hr", subcategory: "learning-&-development-manager" },
    
//     // Finance keywords
//     "accountant": { category: "finance", subcategory: "accountant" },
//     "financial analyst": { category: "finance", subcategory: "financial-analyst" },
//     "auditor": { category: "finance", subcategory: "auditor" },
//     "tax": { category: "finance", subcategory: "tax-consultant" },
//     "controller": { category: "finance", subcategory: "financial-controller" },
//     "investment": { category: "finance", subcategory: "investment-analyst" },
//     "treasury": { category: "finance", subcategory: "treasury-manager" },
//     "budget": { category: "finance", subcategory: "budget-analyst" },
    
//     // Support keywords
//     "customer support": { category: "support", subcategory: "customer-support-representative" },
//     "technical support": { category: "support", subcategory: "technical-support-engineer" },
//     "helpdesk": { category: "support", subcategory: "helpdesk-specialist" },
//     "customer success": { category: "support", subcategory: "customer-success-manager" },
//     "support engineer": { category: "support", subcategory: "technical-support-engineer" },
    
//     // IT keywords
//     "system admin": { category: "it", subcategory: "system-administrator" },
//     "sysadmin": { category: "it", subcategory: "system-administrator" },
//     "network engineer": { category: "it", subcategory: "network-engineer" },
//     "cyber security": { category: "it", subcategory: "cyber-security-analyst" },
//     "security analyst": { category: "it", subcategory: "cyber-security-analyst" },
//     "cloud engineer": { category: "it", subcategory: "cloud-engineer" },
//     "cloud architect": { category: "it", subcategory: "solutions-architect" },
//     "database admin": { category: "it", subcategory: "database-administrator" },
//     "dba": { category: "it", subcategory: "database-administrator" },
//     "infrastructure": { category: "it", subcategory: "infrastructure-engineer" },
//     "it manager": { category: "it", subcategory: "it-manager" },
//     // Production keywords
//     "production": { category: "production", subcategory: "production-manager" },
//     "manufacturing": { category: "production", subcategory: "manufacturing-engineer" },
//     "quality control": { category: "production", subcategory: "quality-control-inspector" },
//     "plant manager": { category: "production", subcategory: "plant-manager" },
//     "industrial engineer": { category: "production", subcategory: "industrial-engineer" },
//     "process engineer": { category: "production", subcategory: "process-engineer" },
    
//     // Logistics keywords
//     "logistics": { category: "logistics", subcategory: "logistics-coordinator" },
//     "supply chain": { category: "logistics", subcategory: "supply-chain-manager" },
//     "warehouse": { category: "logistics", subcategory: "warehouse-manager" },
//     "procurement": { category: "logistics", subcategory: "procurement-specialist" },
//     "inventory": { category: "logistics", subcategory: "inventory-manager" },
//     "distribution": { category: "logistics", subcategory: "distribution-manager" },
    
//     // Healthcare keywords
//     "nurse": { category: "healthcare", subcategory: "registered-nurse" },
//     "medical": { category: "healthcare", subcategory: "medical-assistant" },
//     "healthcare": { category: "healthcare", subcategory: "healthcare-administrator" },
//     "clinical": { category: "healthcare", subcategory: "clinical-coordinator" },
//     "pharmacy": { category: "healthcare", subcategory: "pharmacy-technician" },
    
//     // Education keywords
//     "teacher": { category: "education", subcategory: "teacher" },
//     "trainer": { category: "education", subcategory: "training-specialist" },
//     "education": { category: "education", subcategory: "education-coordinator" },
//     "curriculum": { category: "education", subcategory: "curriculum-developer" },
//     "instructional": { category: "education", subcategory: "instructional-designer" },
    
//     // Legal keywords
//     "legal": { category: "legal", subcategory: "legal-counsel" },
//     "lawyer": { category: "legal", subcategory: "corporate-lawyer" },
//     "attorney": { category: "legal", subcategory: "corporate-lawyer" },
//     "paralegal": { category: "legal", subcategory: "paralegal" },
//     "compliance": { category: "legal", subcategory: "compliance-officer" },
//     "contract": { category: "legal", subcategory: "contract-manager" },
    
//     // Consulting keywords
//     "consultant": { category: "consulting", subcategory: "business-consultant" },
//     "consulting": { category: "consulting", subcategory: "management-consultant" },
//     "strategy": { category: "consulting", subcategory: "strategy-consultant" },
    
//     // Retail keywords
//     "retail": { category: "retail", subcategory: "store-manager" },
//     "store manager": { category: "retail", subcategory: "store-manager" },
//     "merchandiser": { category: "retail", subcategory: "visual-merchandiser" },
//     "retail buyer": { category: "retail", subcategory: "retail-buyer" },
    
//     // Hospitality keywords
//     "hotel": { category: "hospitality", subcategory: "hotel-manager" },
//     "hospitality": { category: "hospitality", subcategory: "hospitality-manager" },
//     "event": { category: "hospitality", subcategory: "event-coordinator" },
//     "restaurant": { category: "hospitality", subcategory: "restaurant-manager" },
//     "catering": { category: "hospitality", subcategory: "catering-manager" },
    
//     // Media keywords
//     "editor": { category: "media", subcategory: "video-editor" },
//     "video editor": { category: "media", subcategory: "video-editor" },
//     "journalist": { category: "media", subcategory: "journalist" },
//     "copywriter": { category: "media", subcategory: "copywriter" },
//     "content creator": { category: "media", subcategory: "content-creator" },
//     "media planner": { category: "media", subcategory: "media-planner" },
//     "public relations": { category: "media", subcategory: "public-relations-specialist" },
    
//     // Research keywords
//     "research": { category: "research", subcategory: "research-scientist" },
//     "scientist": { category: "research", subcategory: "research-scientist" },
//     "lab technician": { category: "research", subcategory: "lab-technician" },
//     "research analyst": { category: "research", subcategory: "research-analyst" }
//   };

//   // Enhanced detection function with scoring system
//   const detectCategoryFromJobTitle = (title) => {
//     if (!title || title.trim() === '') return { category: '', subcategory: '' };
    
//     const lowerTitle = title.toLowerCase().trim();
//     let bestMatch = { category: '', subcategory: '', score: 0 };
    
//     // Check for keyword matches with scoring
//     for (const [keyword, mapping] of Object.entries(jobTitleMapping)) {
//       if (lowerTitle.includes(keyword)) {
//         // Calculate score based on keyword length and position
//         const keywordLength = keyword.length;
//         const position = lowerTitle.indexOf(keyword);
//         const score = keywordLength * 10 + (position === 0 ? 50 : 0);
        
//         if (score > bestMatch.score) {
//           bestMatch = { ...mapping, score };
//         }
//       }
//     }
    
//     // If we found a good match, return it
//     if (bestMatch.score > 0) {
//       return { category: bestMatch.category, subcategory: bestMatch.subcategory };
//     }
    
//     // If no match found, default to 'other' category
//     return { category: 'other', subcategory: 'general-position' };
//   };
  
//   const loadInitialState = () => {
//     const savedData = localStorage.getItem('jobPostData');
//     if (savedData) {
//       return JSON.parse(savedData);
//     }
//     return null;
//   };
  
//   const initialState = loadInitialState();

//   // State for input fields
//   const [jobTitle, setJobTitle] = useState(initialState?.jobTitle || '');
//   const [category, setCategory] = useState(initialState?.category || '');
//   const [subcategory, setSubcategory] = useState(initialState?.subcategory || '');
//   const [locationType, setLocationType] = useState(initialState?.locationType || '');
//   const [city, setCity] = useState(initialState?.city || '');
//   const [state, setState] = useState(initialState?.state || '');
//   const [country, setCountry] = useState(initialState?.country || '');
//   const [jobDescription, setJobDescription] = useState(initialState?.jobDescription || '');
//   const [selectedJobTypes, setSelectedJobTypes] = useState(initialState?.selectedJobTypes || []);
//   const [selectedExperienceLevel, setSelectedExperienceLevel] = useState(initialState?.selectedExperienceLevel || null);
//   const [selectedSchedules, setSelectedSchedules] = useState(initialState?.selectedSchedules || []);
//   const [payRange, setPayRange] = useState(initialState?.payRange || { min: '', max: '' });
//   const [benefits, setBenefits] = useState(initialState?.benefits || []);
  
//   // UI State
//   const [isJobInfoOpen, setJobInfoOpen] = useState(true);
//   const [isJobDescriptionOpen, setJobDescriptionOpen] = useState(true);
//   const [isCompensationOpen, setCompensationOpen] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [newBenefit, setNewBenefit] = useState('');
//   const [loggedInUser, setLoggedInUser] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [showAutoDetectHint, setShowAutoDetectHint] = useState(false);

//   const handleContentChange = (e) => {
//     setJobDescription(e.target.innerHTML);
//   };

//   const handleAddBenefit = () => {
//     if (newBenefit.trim()) {
//       setBenefits([...benefits, newBenefit.trim()]);
//       setNewBenefit('');
//       setShowModal(false);
//     }
//   };

//   // Auto-detect category when job title changes
//   const handleJobTitleChange = (e) => {
//     const newTitle = e.target.value;
//     setJobTitle(newTitle);
    
//     // Auto-detect and set category/subcategory
//     const detected = detectCategoryFromJobTitle(newTitle);
//     if (detected.category && newTitle.trim() !== '') {
//       setCategory(detected.category);
//       setSubcategory(detected.subcategory);
//       setShowAutoDetectHint(true);
//       setTimeout(() => setShowAutoDetectHint(false), 3000);
//     }
//   };

//   useEffect(() => {
//     const dataToSave = {
//       jobTitle,
//       category,
//       subcategory,
//       locationType,
//       city,
//       state,
//       country,
//       jobDescription,
//       selectedJobTypes,
//       selectedExperienceLevel,
//       selectedSchedules,
//       payRange,
//       benefits,
//     };
//     localStorage.setItem("jobPostData", JSON.stringify(dataToSave));
//   }, [jobTitle, category, subcategory, locationType, city, state, country, jobDescription, selectedJobTypes, selectedExperienceLevel, selectedSchedules, payRange, benefits]);

//   const handleRemoveBenefit = (index) => {
//     const updatedBenefits = benefits.filter((_, i) => i !== index);
//     setBenefits(updatedBenefits);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPayRange((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSaveAndNext = () => {
//     if (jobTitle && jobDescription) {
//       const jobData = {
//         jobTitle,
//         category,
//         subcategory,
//         locationType,
//         location: { city, state, country },
//         jobDescription,
//         selectedJobTypes,
//         selectedExperienceLevel,
//         selectedSchedules,
//         payRange,
//         benefits,
//       };
//       navigate('/Aiquestion', { state: { jobData } });
//     }
//   };

//   useEffect(() => {
//     const user = localStorage.getItem('loggedInUser');
//     if (user) {
//       setLoggedInUser(user);
//     }
//   }, []);

//   const FINAL_PROMPT = AI_PROMPTSEC
//     .replace("{role}", jobTitle || "N/A")
//     .replace("{comapany_name}", loggedInUser || "N/A");

//   const handleGenerateDescription = async () => {
//     setIsLoading(true);
//     try {
//       if (jobTitle) {
//         const result = await chatSessionSecond(FINAL_PROMPT);
//         const jobDescriptionData = JSON.parse(result);

//         const formattedDescriptionJSX = (
//           <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.6" }}>
//             <p style={{ marginBottom: "15px", marginTop: "10px", color: "#4b5563" }}>
//               {jobDescriptionData.Company || "N/A"}
//             </p>
//             <p>
//               <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Responsibilities:</strong>
//               <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
//                 {(jobDescriptionData.Responsibilities || []).map((item, index) => (
//                   <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
//                 ))}
//               </ul>
//             </p>
//             <p>
//               <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Qualifications:</strong>
//               <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
//                 {(jobDescriptionData.Qualifications || []).map((item, index) => (
//                   <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
//                 ))}
//               </ul>
//             </p>
//             <p>
//               <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Benefits:</strong>
//               <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
//                 {(jobDescriptionData.Benefits || []).map((item, index) => (
//                   <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
//                 ))}
//               </ul>
//             </p>
//             <p>
//               <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Requirements:</strong>
//               <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
//                 {(jobDescriptionData.Requirements || []).map((item, index) => (
//                   <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
//                 ))}
//               </ul>
//             </p>
//           </div>
//         );

//         const formattedDescriptionString = renderToStaticMarkup(formattedDescriptionJSX);
//         setJobDescription(formattedDescriptionString);
//       }
//     } catch (error) {
//       console.log("Failed to generate description:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const SectionCard = ({ title, icon: Icon, isOpen, toggle, children }) => (
//     <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
//       <button
//         onClick={toggle}
//         className="w-full flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-green-500 to-lime-500 text-white hover:from-green-600 hover:to-lime-600 transition-all duration-300"
//       >
//         <div className="flex items-center gap-2 sm:gap-3">
//           <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
//             <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
//           </div>
//           <h2 className="font-semibold text-sm sm:text-base lg:text-lg">{title}</h2>
//         </div>
//         {isOpen ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
//       </button>

//       {isOpen && (
//         <div className="p-4 sm:p-6">
//           {children}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-lime-50/20">
//       <Onavbar />

//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//           {/* Header */}
//           <div className="mb-4 sm:mb-6 lg:mb-8">
//             <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-3 sm:mb-4">
//               <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
//               <span className="text-xs sm:text-sm font-medium text-gray-700">Create Job Posting</span>
//             </div>
//             <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
//               Post a New Position
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Fill in the details to attract the best candidates</p>
//           </div>

//           <div className="space-y-4 sm:space-y-6">
//             {/* Job Information */}
//             <SectionCard title="Job Information" icon={Briefcase} isOpen={isJobInfoOpen} toggle={() => setJobInfoOpen(!isJobInfoOpen)}>
//               <div className="space-y-4 sm:space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Job Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     value={jobTitle}
//                     onChange={handleJobTitleChange}
//                     placeholder="e.g. Senior Software Engineer, Marketing Manager, Data Analyst..."
//                     className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
//                   />
//                   <div className="mt-2 space-y-1">
//                     <p className="text-xs text-gray-500">💡 Type any job title freely - we'll auto-detect the category</p>
//                     {showAutoDetectHint && category && (
//                       <p className="text-xs text-green-600 font-medium animate-pulse">
//                         ✓ Auto-detected: {category.charAt(0).toUpperCase() + category.slice(1)} category
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
//                     <select
//                       value={category}
//                       onChange={(e) => {
//                         setCategory(e.target.value);
//                         setSubcategory("");
//                       }}
//                       className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900"
//                     >
//                       <option value="">Select category</option>
//                       <option value="software">Software Development</option>
//                       <option value="design">Design</option>
//                       <option value="marketing">Marketing</option>
//                       <option value="sales">Sales</option>
//                       <option value="data">Data & Analytics</option>
//                       <option value="management">Management</option>
//                       <option value="hr">Human Resources</option>
//                       <option value="finance">Finance</option>
//                       <option value="support">Support</option>
//                       <option value="it">IT & Infrastructure</option>
//                       <option value="production">Production & Manufacturing</option>
//                       <option value="logistics">Logistics & Supply Chain</option>
//                       <option value="healthcare">Healthcare</option>
//                       <option value="education">Education & Training</option>
//                       <option value="legal">Legal</option>
//                       <option value="consulting">Consulting</option>
//                       <option value="retail">Retail</option>
//                       <option value="hospitality">Hospitality</option>
//                       <option value="media">Media & Communications</option>
//                       <option value="research">Research & Development</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-900 mb-2">Subcategory</label>
//                     <select
//                       value={subcategory}
//                       onChange={(e) => setSubcategory(e.target.value)}
//                       disabled={!category}
//                       className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     >
//                       <option value="">Select subcategory</option>
//                       {category &&
//                         categoryMap[category]?.map((sub, i) => (
//                           <option key={i} value={sub.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "&")}>
//                             {sub}
//                           </option>
//                         ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     <MapPin className="w-4 h-4 inline mr-1" />
//                     Location
//                   </label>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//                     <input
//                       placeholder="City"
//                       value={city}
//                       onChange={(e) => setCity(e.target.value)}
//                       className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
//                     />
//                     <input
//                       placeholder="State"
//                       value={state}
//                       onChange={(e) => setState(e.target.value)}
//                       className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
//                     />
//                     <input
//                       placeholder="Country"
//                       value={country}
//                       onChange={(e) => setCountry(e.target.value)}
//                       className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </SectionCard>

//             {/* Job Description */}
//             <SectionCard title="Job Description" icon={FileText} isOpen={isJobDescriptionOpen} toggle={() => setJobDescriptionOpen(!isJobDescriptionOpen)}>
//               <div className="space-y-4">
//                 <button
//                   onClick={handleGenerateDescription}
//                   disabled={isLoading || !jobTitle}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
//                   {isLoading ? "Generating..." : "Generate with AI"}
//                 </button>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">
//                     Description <span className="text-red-500">*</span>
//                   </label>
//                   <div
//                     contentEditable
//                     onInput={handleContentChange}
//                     dangerouslySetInnerHTML={{ __html: jobDescription || '<p class="text-gray-400">Click "Generate with AI" or start typing...</p>' }}
//                     className="min-h-[250px] sm:min-h-[300px] max-h-[400px] sm:max-h-[500px] border-2 border-gray-200 p-3 sm:p-4 rounded-xl bg-white overflow-y-auto focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
//                   />
//                 </div>
//               </div>
//             </SectionCard>

//             {/* Compensation */}
//             <SectionCard title="Compensation & Benefits" icon={DollarSign} isOpen={isCompensationOpen} toggle={() => setCompensationOpen(!isCompensationOpen)}>
//               <div className="space-y-4 sm:space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-2">Salary Range (USD)</label>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     <input
//                       name="min"
//                       type="number"
//                       placeholder="Minimum"
//                       value={payRange.min}
//                       onChange={handleInputChange}
//                       className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
//                     />
//                     <input
//                       name="max"
//                       type="number"
//                       placeholder="Maximum"
//                       value={payRange.max}
//                       onChange={handleInputChange}
//                       className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-900 mb-3">Benefits</label>
//                   <div className="flex flex-wrap gap-2 mb-3">
//                     {benefits.map((b, i) => (
//                       <span
//                         key={i}
//                         className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-lime-100 text-green-700 rounded-full text-xs sm:text-sm font-medium"
//                       >
//                         <span className="break-all">{b}</span>
//                         <button
//                           onClick={() => handleRemoveBenefit(i)}
//                           className="hover:bg-green-200 rounded-full p-0.5 transition-colors flex-shrink-0"
//                         >
//                           <X className="w-3 h-3 sm:w-4 sm:h-4" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => setShowModal(true)}
//                     className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm sm:text-base text-gray-600 hover:border-green-500 hover:text-green-600 transition-all"
//                   >
//                     <Plus className="w-4 h-4 flex-shrink-0" />
//                     Add Benefit
//                   </button>
//                 </div>
//               </div>
//             </SectionCard>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pb-6 sm:pb-8">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm sm:text-base hover:border-gray-300 hover:bg-gray-50 transition-all order-2 sm:order-1"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSaveAndNext}
//               disabled={!jobTitle || !jobDescription}
//               className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
//             >
//               <Save className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
//               Save & Continue
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add Benefit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 lg:p-8">
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Add Benefit</h3>
//             <input
//               value={newBenefit}
//               onChange={(e) => setNewBenefit(e.target.value)}
//               placeholder="e.g., Health Insurance"
//               className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400 mb-5 sm:mb-6"
//               onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
//             />
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all order-2 sm:order-1"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddBenefit}
//                 className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all order-1 sm:order-2"
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Jobpost;


import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { X, Sparkles, ChevronDown, ChevronUp, Plus, DollarSign, MapPin, Briefcase, FileText, Save } from 'lucide-react';
import { AI_PROMPTSEC } from './constants/options';
import { chatSessionSecond } from "./service/ai/chatSessionSecond.js";
import Onavbar from './Onavbar';
import { useToast } from '../Context/ToastContext.jsx';

const Jobpost = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const categoryMap = {
    software: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile App Developer", "DevOps Engineer", "QA Engineer", "Software Architect", "Game Developer", "Embedded Systems Engineer"],
    design: ["UI/UX Designer", "Graphic Designer", "Product Designer", "Motion Designer", "Game Designer", "Visual Designer", "Interaction Designer", "Brand Designer", "Web Designer"],
    marketing: ["Digital Marketing Manager", "SEO Specialist", "Content Marketing Manager", "Social Media Manager", "Email Marketing Specialist", "Marketing Analyst", "Brand Manager", "Growth Marketer", "Performance Marketing Manager"],
    sales: ["Inside Sales Representative", "Field Sales Executive", "Account Executive", "Business Development Manager", "Sales Manager", "Key Account Manager", "Sales Engineer", "Regional Sales Manager", "Channel Sales Manager"],
    data: ["Data Analyst", "Data Scientist", "Machine Learning Engineer", "Data Engineer", "Business Intelligence Analyst", "AI Research Scientist", "Analytics Manager", "Big Data Engineer", "Data Architect"],
    management: ["Project Manager", "Product Manager", "Operations Manager", "Program Manager", "Engineering Manager", "Delivery Manager", "Portfolio Manager", "Agile Coach", "Scrum Master"],
    hr: ["Recruitment Specialist", "HR Generalist", "Payroll Specialist", "Talent Acquisition Manager", "HR Business Partner", "Compensation & Benefits Manager", "Learning & Development Manager", "Employee Relations Manager", "HR Operations Manager"],
    finance: ["Accountant", "Financial Analyst", "Auditor", "Tax Consultant", "Financial Controller", "Investment Analyst", "Treasury Manager", "Budget Analyst", "Credit Analyst"],
    support: ["Customer Support Representative", "Technical Support Engineer", "Helpdesk Specialist", "Customer Success Manager", "Support Team Lead", "Application Support Analyst", "IT Support Specialist", "Client Services Manager"],
    it: ["System Administrator", "Network Engineer", "Cyber Security Analyst", "Cloud Engineer", "IT Manager", "Database Administrator", "Solutions Architect", "Infrastructure Engineer", "Security Operations Analyst"],
    production: ["Production Manager", "Manufacturing Engineer", "Quality Control Inspector", "Production Supervisor", "Plant Manager", "Industrial Engineer", "Production Planner", "Process Engineer", "Operations Coordinator"],
    logistics: ["Logistics Coordinator", "Supply Chain Manager", "Warehouse Manager", "Procurement Specialist", "Inventory Manager", "Distribution Manager", "Freight Coordinator", "Transportation Manager", "Materials Manager"],
    healthcare: ["Registered Nurse", "Medical Assistant", "Healthcare Administrator", "Clinical Coordinator", "Pharmacy Technician", "Medical Records Specialist", "Health Information Manager", "Patient Care Coordinator", "Medical Billing Specialist"],
    education: ["Teacher", "Curriculum Developer", "Education Coordinator", "Training Specialist", "Academic Advisor", "Instructional Designer", "Learning Specialist", "Education Consultant", "Program Director"],
    legal: ["Legal Counsel", "Paralegal", "Compliance Officer", "Contract Manager", "Legal Assistant", "Corporate Lawyer", "IP Attorney", "Litigation Associate", "Legal Operations Manager"],
    consulting: ["Business Consultant", "Management Consultant", "Strategy Consultant", "IT Consultant", "Financial Consultant", "HR Consultant", "Operations Consultant", "Risk Consultant", "Change Management Consultant"],
    retail: ["Store Manager", "Retail Sales Associate", "Visual Merchandiser", "Inventory Specialist", "Retail Buyer", "Customer Service Representative", "Assistant Store Manager", "Category Manager", "Retail Operations Manager"],
    hospitality: ["Hotel Manager", "Front Desk Agent", "Event Coordinator", "Hospitality Manager", "Concierge", "Restaurant Manager", "Guest Relations Manager", "Catering Manager", "Housekeeping Supervisor"],
    media: ["Content Creator", "Video Editor", "Journalist", "Copywriter", "Social Media Coordinator", "Content Strategist", "Broadcast Producer", "Media Planner", "Public Relations Specialist"],
    research: ["Research Scientist", "Research Analyst", "Lab Technician", "Clinical Research Coordinator", "Market Research Analyst", "UX Researcher", "Research Associate", "Product Research Manager", "Data Research Specialist"],
    other: ["General Position", "Entry Level", "Internship", "Trainee", "Consultant", "Specialist", "Coordinator", "Assistant", "Associate"]
  };

  // Enhanced keyword mapping with more comprehensive coverage
  const jobTitleMapping = {
    // Software keywords
    "frontend": { category: "software", subcategory: "frontend-developer" },
    "front-end": { category: "software", subcategory: "frontend-developer" },
    "react": { category: "software", subcategory: "frontend-developer" },
    "angular": { category: "software", subcategory: "frontend-developer" },
    "vue": { category: "software", subcategory: "frontend-developer" },
    "backend": { category: "software", subcategory: "backend-developer" },
    "back-end": { category: "software", subcategory: "backend-developer" },
    "node": { category: "software", subcategory: "backend-developer" },
    "python": { category: "software", subcategory: "backend-developer" },
    "java developer": { category: "software", subcategory: "backend-developer" },
    "fullstack": { category: "software", subcategory: "full-stack-developer" },
    "full stack": { category: "software", subcategory: "full-stack-developer" },
    "full-stack": { category: "software", subcategory: "full-stack-developer" },
    "mobile": { category: "software", subcategory: "mobile-app-developer" },
    "android": { category: "software", subcategory: "mobile-app-developer" },
    "ios": { category: "software", subcategory: "mobile-app-developer" },
    "swift": { category: "software", subcategory: "mobile-app-developer" },
    "flutter": { category: "software", subcategory: "mobile-app-developer" },
    "react native": { category: "software", subcategory: "mobile-app-developer" },
    "devops": { category: "software", subcategory: "devops-engineer" },
    "sre": { category: "software", subcategory: "devops-engineer" },
    "qa": { category: "software", subcategory: "qa-engineer" },
    "quality assurance": { category: "software", subcategory: "qa-engineer" },
    "testing": { category: "software", subcategory: "qa-engineer" },
    "tester": { category: "software", subcategory: "qa-engineer" },
    "software engineer": { category: "software", subcategory: "full-stack-developer" },
    "software developer": { category: "software", subcategory: "full-stack-developer" },
    "programmer": { category: "software", subcategory: "full-stack-developer" },
    "architect": { category: "software", subcategory: "software-architect" },
    "game developer": { category: "software", subcategory: "game-developer" },
    "embedded": { category: "software", subcategory: "embedded-systems-engineer" },
    
    // Design keywords
    "designer": { category: "design", subcategory: "ui/ux-designer" },
    "ui designer": { category: "design", subcategory: "ui/ux-designer" },
    "ux designer": { category: "design", subcategory: "ui/ux-designer" },
    "ui/ux": { category: "design", subcategory: "ui/ux-designer" },
    "graphic": { category: "design", subcategory: "graphic-designer" },
    "product design": { category: "design", subcategory: "product-designer" },
    "motion": { category: "design", subcategory: "motion-designer" },
    "visual designer": { category: "design", subcategory: "visual-designer" },
    "interaction design": { category: "design", subcategory: "interaction-designer" },
    "brand designer": { category: "design", subcategory: "brand-designer" },
    "web designer": { category: "design", subcategory: "web-designer" },
    
    // Marketing keywords
    "marketing": { category: "marketing", subcategory: "digital-marketing-manager" },
    "seo": { category: "marketing", subcategory: "seo-specialist" },
    "content": { category: "marketing", subcategory: "content-marketing-manager" },
    "social media": { category: "marketing", subcategory: "social-media-manager" },
    "digital marketing": { category: "marketing", subcategory: "digital-marketing-manager" },
    "email marketing": { category: "marketing", subcategory: "email-marketing-specialist" },
    "growth": { category: "marketing", subcategory: "growth-marketer" },
    "brand manager": { category: "marketing", subcategory: "brand-manager" },
    "marketing analyst": { category: "marketing", subcategory: "marketing-analyst" },
    
    // Sales keywords
    "sales": { category: "sales", subcategory: "inside-sales-representative" },
    "account executive": { category: "sales", subcategory: "account-executive" },
    "business development": { category: "sales", subcategory: "business-development-manager" },
    "sales manager": { category: "sales", subcategory: "sales-manager" },
    "sales representative": { category: "sales", subcategory: "inside-sales-representative" },
    "sales executive": { category: "sales", subcategory: "field-sales-executive" },
    "key account": { category: "sales", subcategory: "key-account-manager" },
    "sales engineer": { category: "sales", subcategory: "sales-engineer" },
    
    // Data keywords
    "data analyst": { category: "data", subcategory: "data-analyst" },
    "data scientist": { category: "data", subcategory: "data-scientist" },
    "machine learning": { category: "data", subcategory: "machine-learning-engineer" },
    "ml engineer": { category: "data", subcategory: "machine-learning-engineer" },
    "data engineer": { category: "data", subcategory: "data-engineer" },
    "ai engineer": { category: "data", subcategory: "ai-research-scientist" },
    "artificial intelligence": { category: "data", subcategory: "ai-research-scientist" },
    "bi analyst": { category: "data", subcategory: "business-intelligence-analyst" },
    "business intelligence": { category: "data", subcategory: "business-intelligence-analyst" },
    "big data": { category: "data", subcategory: "big-data-engineer" },
    "data architect": { category: "data", subcategory: "data-architect" },
    
    // Management keywords
    "project manager": { category: "management", subcategory: "project-manager" },
    "product manager": { category: "management", subcategory: "product-manager" },
    "operations manager": { category: "management", subcategory: "operations-manager" },
    "program manager": { category: "management", subcategory: "program-manager" },
    "engineering manager": { category: "management", subcategory: "engineering-manager" },
    "scrum master": { category: "management", subcategory: "scrum-master" },
    "agile coach": { category: "management", subcategory: "agile-coach" },
    "delivery manager": { category: "management", subcategory: "delivery-manager" },
    
    // HR keywords
    "hr": { category: "hr", subcategory: "hr-generalist" },
    "human resources": { category: "hr", subcategory: "hr-generalist" },
    "recruiter": { category: "hr", subcategory: "recruitment-specialist" },
    "talent acquisition": { category: "hr", subcategory: "talent-acquisition-manager" },
    "payroll": { category: "hr", subcategory: "payroll-specialist" },
    "hr business partner": { category: "hr", subcategory: "hr-business-partner" },
    "compensation": { category: "hr", subcategory: "compensation-&-benefits-manager" },
    "learning": { category: "hr", subcategory: "learning-&-development-manager" },
    
    // Finance keywords
    "accountant": { category: "finance", subcategory: "accountant" },
    "financial analyst": { category: "finance", subcategory: "financial-analyst" },
    "auditor": { category: "finance", subcategory: "auditor" },
    "tax": { category: "finance", subcategory: "tax-consultant" },
    "controller": { category: "finance", subcategory: "financial-controller" },
    "investment": { category: "finance", subcategory: "investment-analyst" },
    "treasury": { category: "finance", subcategory: "treasury-manager" },
    "budget": { category: "finance", subcategory: "budget-analyst" },
    
    // Support keywords
    "customer support": { category: "support", subcategory: "customer-support-representative" },
    "technical support": { category: "support", subcategory: "technical-support-engineer" },
    "helpdesk": { category: "support", subcategory: "helpdesk-specialist" },
    "customer success": { category: "support", subcategory: "customer-success-manager" },
    "support engineer": { category: "support", subcategory: "technical-support-engineer" },
    
    // IT keywords
    "system admin": { category: "it", subcategory: "system-administrator" },
    "sysadmin": { category: "it", subcategory: "system-administrator" },
    "network engineer": { category: "it", subcategory: "network-engineer" },
    "cyber security": { category: "it", subcategory: "cyber-security-analyst" },
    "security analyst": { category: "it", subcategory: "cyber-security-analyst" },
    "cloud engineer": { category: "it", subcategory: "cloud-engineer" },
    "cloud architect": { category: "it", subcategory: "solutions-architect" },
    "database admin": { category: "it", subcategory: "database-administrator" },
    "dba": { category: "it", subcategory: "database-administrator" },
    "infrastructure": { category: "it", subcategory: "infrastructure-engineer" },
    
    
    // Production keywords
    "production": { category: "production", subcategory: "production-manager" },
    "manufacturing": { category: "production", subcategory: "manufacturing-engineer" },
    "quality control": { category: "production", subcategory: "quality-control-inspector" },
    "plant manager": { category: "production", subcategory: "plant-manager" },
    "industrial engineer": { category: "production", subcategory: "industrial-engineer" },
    "process engineer": { category: "production", subcategory: "process-engineer" },
    
    // Logistics keywords
    "logistics": { category: "logistics", subcategory: "logistics-coordinator" },
    "supply chain": { category: "logistics", subcategory: "supply-chain-manager" },
    "warehouse": { category: "logistics", subcategory: "warehouse-manager" },
    "procurement": { category: "logistics", subcategory: "procurement-specialist" },
    "inventory": { category: "logistics", subcategory: "inventory-manager" },
    "distribution": { category: "logistics", subcategory: "distribution-manager" },
    
    // Healthcare keywords
    "nurse": { category: "healthcare", subcategory: "registered-nurse" },
    "medical": { category: "healthcare", subcategory: "medical-assistant" },
    "healthcare": { category: "healthcare", subcategory: "healthcare-administrator" },
    "clinical": { category: "healthcare", subcategory: "clinical-coordinator" },
    "pharmacy": { category: "healthcare", subcategory: "pharmacy-technician" },
    
    // Education keywords
    "teacher": { category: "education", subcategory: "teacher" },
    "trainer": { category: "education", subcategory: "training-specialist" },
    "education": { category: "education", subcategory: "education-coordinator" },
    "curriculum": { category: "education", subcategory: "curriculum-developer" },
    "instructional": { category: "education", subcategory: "instructional-designer" },
    
    // Legal keywords
    "legal": { category: "legal", subcategory: "legal-counsel" },
    "lawyer": { category: "legal", subcategory: "corporate-lawyer" },
    "attorney": { category: "legal", subcategory: "corporate-lawyer" },
    "paralegal": { category: "legal", subcategory: "paralegal" },
    "compliance": { category: "legal", subcategory: "compliance-officer" },
    "contract": { category: "legal", subcategory: "contract-manager" },
    
    // Consulting keywords
    "consultant": { category: "consulting", subcategory: "business-consultant" },
    "consulting": { category: "consulting", subcategory: "management-consultant" },
    "strategy": { category: "consulting", subcategory: "strategy-consultant" },
    
    // Retail keywords
    "retail": { category: "retail", subcategory: "store-manager" },
    "store manager": { category: "retail", subcategory: "store-manager" },
    "merchandiser": { category: "retail", subcategory: "visual-merchandiser" },
    "retail buyer": { category: "retail", subcategory: "retail-buyer" },
    
    // Hospitality keywords
    "hotel": { category: "hospitality", subcategory: "hotel-manager" },
    "hospitality": { category: "hospitality", subcategory: "hospitality-manager" },
    "event": { category: "hospitality", subcategory: "event-coordinator" },
    "restaurant": { category: "hospitality", subcategory: "restaurant-manager" },
    "catering": { category: "hospitality", subcategory: "catering-manager" },
    
    // Media keywords
    "editor": { category: "media", subcategory: "video-editor" },
    "video editor": { category: "media", subcategory: "video-editor" },
    "journalist": { category: "media", subcategory: "journalist" },
    "copywriter": { category: "media", subcategory: "copywriter" },
    "content creator": { category: "media", subcategory: "content-creator" },
    "media planner": { category: "media", subcategory: "media-planner" },
    "public relations": { category: "media", subcategory: "public-relations-specialist" },
    
    // Research keywords
    "research": { category: "research", subcategory: "research-scientist" },
    "scientist": { category: "research", subcategory: "research-scientist" },
    "lab technician": { category: "research", subcategory: "lab-technician" },
    "research analyst": { category: "research", subcategory: "research-analyst" }
  };

  // Enhanced detection function with scoring system
  const detectCategoryFromJobTitle = (title) => {
    if (!title || title.trim() === '') return { category: '', subcategory: '' };
    
    const lowerTitle = title.toLowerCase().trim();
    let bestMatch = { category: '', subcategory: '', score: 0 };
    
    // Check for keyword matches with scoring
    for (const [keyword, mapping] of Object.entries(jobTitleMapping)) {
      if (lowerTitle.includes(keyword)) {
        // Calculate score based on keyword length and position
        const keywordLength = keyword.length;
        const position = lowerTitle.indexOf(keyword);
        const score = keywordLength * 10 + (position === 0 ? 50 : 0);
        
        if (score > bestMatch.score) {
          bestMatch = { ...mapping, score };
        }
      }
    }
    
    // If we found a good match, return it
    if (bestMatch.score > 0) {
      return { category: bestMatch.category, subcategory: bestMatch.subcategory };
    }
    
    // If no match found, default to 'other' category
    return { category: 'other', subcategory: 'general-position' };
  };
  
  const loadInitialState = () => {
    const savedData = localStorage.getItem('jobPostData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  };
  
  const initialState = loadInitialState();

  // State for input fields
  const [jobTitle, setJobTitle] = useState(initialState?.jobTitle || '');
  const [category, setCategory] = useState(initialState?.category || '');
  const [subcategory, setSubcategory] = useState(initialState?.subcategory || '');
  const [locationType, setLocationType] = useState(initialState?.locationType || '');
  const [city, setCity] = useState(initialState?.city || '');
  const [state, setState] = useState(initialState?.state || '');
  const [country, setCountry] = useState(initialState?.country || '');
  const [jobDescription, setJobDescription] = useState(initialState?.jobDescription || '');
  const [selectedJobTypes, setSelectedJobTypes] = useState(initialState?.selectedJobTypes || []);
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState(initialState?.selectedExperienceLevel || null);
  const [selectedSchedules, setSelectedSchedules] = useState(initialState?.selectedSchedules || []);
  const [payRange, setPayRange] = useState(initialState?.payRange || { min: '', max: '' });
  const [benefits, setBenefits] = useState(initialState?.benefits || []);
  
  // UI State
  const [isJobInfoOpen, setJobInfoOpen] = useState(false);
  const [isJobDescriptionOpen, setJobDescriptionOpen] = useState(false);
  const [isCompensationOpen, setCompensationOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');
  const [loggedInUser, setLoggedInUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showAutoDetectHint, setShowAutoDetectHint] = useState(false);
  const descriptionRef = useRef(null);
  const jobTitleRef = useRef(null);
  const autoDetectTimeoutRef = useRef(null);

  const handleContentChange = (e) => {
    setJobDescription(e.target.innerHTML);
  };

  // Fix for contentEditable focus issue
  useEffect(() => {
    if (descriptionRef.current && document.activeElement === descriptionRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(descriptionRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [jobDescription]);


  useEffect(() => {
  jobTitleRef.current?.focus();
}, [jobTitle]);


  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
      setShowModal(false);
    }
  };

  // Auto-detect category when job title changes
  const handleJobTitleChange = (e) => {
    const newTitle = e.target.value;
    setJobTitle(newTitle);
      jobTitleRef.current?.focus();
    // Clear existing timeout
    if (autoDetectTimeoutRef.current) {
      clearTimeout(autoDetectTimeoutRef.current);
    }
    
    // Auto-detect and set category/subcategory with debounce
    autoDetectTimeoutRef.current = setTimeout(() => {
      const detected = detectCategoryFromJobTitle(newTitle);
      if (detected.category && newTitle.trim() !== '') {
        setCategory(detected.category);
        setSubcategory(detected.subcategory);
        setShowAutoDetectHint(true);
        setTimeout(() => setShowAutoDetectHint(false), 3000);
      }
    }, 500); // Wait 500ms after user stops typing
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoDetectTimeoutRef.current) {
        clearTimeout(autoDetectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const dataToSave = {
      jobTitle,
      category,
      subcategory,
      locationType,
      city,
      state,
      country,
      jobDescription,
      selectedJobTypes,
      selectedExperienceLevel,
      selectedSchedules,
      payRange,
      benefits,
    };
    localStorage.setItem("jobPostData", JSON.stringify(dataToSave));
  }, [jobTitle, category, subcategory, locationType, city, state, country, jobDescription, selectedJobTypes, selectedExperienceLevel, selectedSchedules, payRange, benefits]);

  const handleRemoveBenefit = (index) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveAndNext = () => {
    if (jobTitle && jobDescription) {
      const jobData = {
        jobTitle,
        category,
        subcategory,
        locationType,
        location: { city, state, country },
        jobDescription,
        selectedJobTypes,
        selectedExperienceLevel,
        selectedSchedules,
        payRange,
        benefits,
      };
      navigate('/Aiquestion', { state: { jobData } });
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const FINAL_PROMPT = AI_PROMPTSEC
    .replace("{role}", jobTitle || "N/A")
    .replace("{comapany_name}", loggedInUser || "N/A");

  const handleGenerateDescription = async () => {
    setIsLoading(true);
    try {
      if (jobTitle) {
        const result = await chatSessionSecond(FINAL_PROMPT);
        const jobDescriptionData = JSON.parse(result);

        const formattedDescriptionJSX = (
          <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.6" }}>
            <p style={{ marginBottom: "15px", marginTop: "10px", color: "#4b5563" }}>
              {jobDescriptionData.Company || "N/A"}
            </p>
            <p>
              <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Responsibilities:</strong>
              <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
                {(jobDescriptionData.Responsibilities || []).map((item, index) => (
                  <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
                ))}
              </ul>
            </p>
            <p>
              <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Qualifications:</strong>
              <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
                {(jobDescriptionData.Qualifications || []).map((item, index) => (
                  <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
                ))}
              </ul>
            </p>
            <p>
              <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Benefits:</strong>
              <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
                {(jobDescriptionData.Benefits || []).map((item, index) => (
                  <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
                ))}
              </ul>
            </p>
            <p>
              <strong style={{ fontSize: "16px", marginBottom: "8px", display: "block", color: "#111827" }}>Requirements:</strong>
              <ul style={{ marginLeft: "20px", marginTop: "5px", color: "#4b5563" }}>
                {(jobDescriptionData.Requirements || []).map((item, index) => (
                  <li key={index} style={{ marginBottom: "6px" }}>{item}</li>
                ))}
              </ul>
            </p>
          </div>
        );

        const formattedDescriptionString = renderToStaticMarkup(formattedDescriptionJSX);
        setJobDescription(formattedDescriptionString);
      }
    } catch (error) {
      console.log("Failed to generate description:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const SectionCard = ({ title, icon: Icon, isOpen, toggle, children }) => (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-green-500 to-lime-500 text-white hover:from-green-600 hover:to-lime-600 transition-all duration-300"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h2 className="font-semibold text-sm sm:text-base lg:text-lg">{title}</h2>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 flex-shrink-0" />}
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-lime-50/20">
      <Onavbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-3 sm:mb-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Create Job Posting</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">
              Post a New Position
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Fill in the details to attract the best candidates</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Job Information */}
            <SectionCard title="Job Information" icon={Briefcase} isOpen={isJobInfoOpen} toggle={() => setJobInfoOpen(!isJobInfoOpen)}>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={jobTitleRef}
                    value={jobTitle}
                    onChange={handleJobTitleChange}
                    placeholder="e.g. Senior Software Engineer, Marketing Manager, Data Analyst..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">💡 Type any job title freely - we'll auto-detect the category</p>
                    {showAutoDetectHint && category && (
                      <p className="text-xs text-green-600 font-medium animate-pulse">
                        ✓ Auto-detected: {category.charAt(0).toUpperCase() + category.slice(1)} category
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory("");
                      }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900"
                    >
                      <option value="">Select category</option>
                      <option value="software">Software Development</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="data">Data & Analytics</option>
                      <option value="management">Management</option>
                      <option value="hr">Human Resources</option>
                      <option value="finance">Finance</option>
                      <option value="support">Support</option>
                      <option value="it">IT & Infrastructure</option>
                      <option value="production">Production & Manufacturing</option>
                      <option value="logistics">Logistics & Supply Chain</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education & Training</option>
                      <option value="legal">Legal</option>
                      <option value="consulting">Consulting</option>
                      <option value="retail">Retail</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="media">Media & Communications</option>
                      <option value="research">Research & Development</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Subcategory</label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      disabled={!category}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select subcategory</option>
                      {category &&
                        categoryMap[category]?.map((sub, i) => (
                          <option key={i} value={sub.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "&")}>
                            {sub}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
                    />
                    <input
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
                    />
                    <input
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Job Description */}
            <SectionCard title="Job Description" icon={FileText} isOpen={isJobDescriptionOpen} toggle={() => setJobDescriptionOpen(!isJobDescriptionOpen)}>
              <div className="space-y-4">
                <button
                  onClick={handleGenerateDescription}
                  disabled={isLoading || !jobTitle}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  {isLoading ? "Generating..." : "Generate with AI"}
                </button>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div
                    ref={descriptionRef}
                    contentEditable
                    onInput={handleContentChange}
                    suppressContentEditableWarning={true}
                    dangerouslySetInnerHTML={jobDescription ? undefined : { __html: '<p class="text-gray-400">Click "Generate with AI" or start typing...</p>' }}
                    className="min-h-[250px] sm:min-h-[300px] max-h-[400px] sm:max-h-[500px] border-2 border-gray-200 p-3 sm:p-4 rounded-xl bg-white overflow-y-auto focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base"
                  >
                    {jobDescription && <div dangerouslySetInnerHTML={{ __html: jobDescription }} />}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Compensation */}
            <SectionCard title="Compensation & Benefits" icon={DollarSign} isOpen={isCompensationOpen} toggle={() => setCompensationOpen(!isCompensationOpen)}>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Salary Range (USD)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      name="min"
                      type="number"
                      placeholder="Minimum"
                      value={payRange.min}
                      onChange={handleInputChange}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
                    />
                    <input
                      name="max"
                      type="number"
                      placeholder="Maximum"
                      value={payRange.max}
                      onChange={handleInputChange}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Benefits</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {benefits.map((b, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-lime-100 text-green-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        <span className="break-all">{b}</span>
                        <button
                          onClick={() => handleRemoveBenefit(i)}
                          className="hover:bg-green-200 rounded-full p-0.5 transition-colors flex-shrink-0"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm sm:text-base text-gray-600 hover:border-green-500 hover:text-green-600 transition-all"
                  >
                    <Plus className="w-4 h-4 flex-shrink-0" />
                    Add Benefit
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pb-6 sm:pb-8">
            <button
              onClick={() => navigate(-1)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm sm:text-base hover:border-gray-300 hover:bg-gray-50 transition-all order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndNext}
              disabled={!jobTitle || !jobDescription}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              Save & Continue
            </button>
          </div>
        </div>
      </div>

      {/* Add Benefit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Add Benefit</h3>
            <input
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              placeholder="e.g., Health Insurance"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-sm sm:text-base text-gray-900 placeholder-gray-400 mb-5 sm:mb-6"
              onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBenefit}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all order-1 sm:order-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobpost;