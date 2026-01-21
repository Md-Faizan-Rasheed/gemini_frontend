import { useState ,useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";import { 
  Code, 
  Server, 
  Cloud, 
  Brain, 
  Database, 
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  Smartphone,
  Shield,
  Gamepad2,
  LineChart,
  Palette,
  Network,
  Bot,
  Blocks,
  LogOut
} from "lucide-react";
import axios from "axios";
import { useToast } from "../Context/ToastContext.jsx";

const levels = ["Beginner", "Intermediate", "Expert"];

export default function StudentHomePage() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillLevels, setSkillLevels] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const { studentId } = useParams();
  const {showToast} = useToast();

    const domains = [
    {
      id: "frontend",
      name: "Frontend",
      icon: Code,
      color: "from-emerald-400 to-lime-500",
      skills: [
        { id: "react", name: "React.js", category: "framework" },
        { id: "angular", name: "Angular", category: "framework" },
        { id: "vue", name: "Vue.js", category: "framework" },
        { id: "nextjs", name: "Next.js", category: "framework" },
        { id: "svelte", name: "Svelte", category: "framework" },
        { id: "javascript", name: "JavaScript", category: "language" },
        { id: "typescript", name: "TypeScript", category: "language" },
        { id: "html", name: "HTML5", category: "language" },
        { id: "css", name: "CSS3", category: "language" },
        { id: "tailwind", name: "Tailwind CSS", category: "styling" },
        { id: "sass", name: "SASS/SCSS", category: "styling" },
        { id: "bootstrap", name: "Bootstrap", category: "styling" },
        { id: "material-ui", name: "Material-UI", category: "styling" },
        { id: "redux", name: "Redux", category: "state-management" },
        { id: "mobx", name: "MobX", category: "state-management" },
        { id: "zustand", name: "Zustand", category: "state-management" },
        { id: "webpack", name: "Webpack", category: "tools" },
        { id: "vite", name: "Vite", category: "tools" },
        { id: "jest", name: "Jest", category: "testing" },
        { id: "cypress", name: "Cypress", category: "testing" }
      ]
    },
    {
      id: "backend",
      name: "Backend",
      icon: Server,
      color: "from-lime-400 to-green-500",
      skills: [
        { id: "nodejs", name: "Node.js", category: "runtime" },
        { id: "express", name: "Express.js", category: "framework" },
        { id: "nestjs", name: "NestJS", category: "framework" },
        { id: "fastify", name: "Fastify", category: "framework" },
        { id: "python", name: "Python", category: "language" },
        { id: "django", name: "Django", category: "framework" },
        { id: "flask", name: "Flask", category: "framework" },
        { id: "fastapi", name: "FastAPI", category: "framework" },
        { id: "java", name: "Java", category: "language" },
        { id: "springboot", name: "Spring Boot", category: "framework" },
        { id: "go", name: "Go", category: "language" },
        { id: "gin", name: "Gin", category: "framework" },
        { id: "ruby", name: "Ruby on Rails", category: "framework" },
        { id: "php", name: "PHP", category: "language" },
        { id: "laravel", name: "Laravel", category: "framework" },
        { id: "csharp", name: "C#", category: "language" },
        { id: "dotnet", name: ".NET Core", category: "framework" },
        { id: "graphql", name: "GraphQL", category: "api" },
        { id: "rest", name: "REST API", category: "api" },
        { id: "grpc", name: "gRPC", category: "api" }
      ]
    },
    {
      id: "mobile",
      name: "Mobile Development",
      icon: Smartphone,
      color: "from-pink-400 to-rose-500",
      skills: [
        { id: "react-native", name: "React Native", category: "framework" },
        { id: "flutter", name: "Flutter", category: "framework" },
        { id: "swift", name: "Swift", category: "language" },
        { id: "swiftui", name: "SwiftUI", category: "framework" },
        { id: "kotlin", name: "Kotlin", category: "language" },
        { id: "java-android", name: "Java (Android)", category: "language" },
        { id: "jetpack-compose", name: "Jetpack Compose", category: "framework" },
        { id: "dart", name: "Dart", category: "language" },
        { id: "ionic", name: "Ionic", category: "framework" },
        { id: "xamarin", name: "Xamarin", category: "framework" },
        { id: "cordova", name: "Apache Cordova", category: "framework" },
        { id: "firebase", name: "Firebase", category: "backend-service" },
        { id: "realm", name: "Realm", category: "database" },
        { id: "sqlite", name: "SQLite", category: "database" },
        { id: "push-notifications", name: "Push Notifications", category: "feature" },
        { id: "in-app-purchase", name: "In-App Purchases", category: "feature" }
      ]
    },
    {
      id: "devops",
      name: "DevOps",
      icon: Cloud,
      color: "from-green-400 to-teal-500",
      skills: [
        { id: "docker", name: "Docker", category: "containerization" },
        { id: "kubernetes", name: "Kubernetes", category: "orchestration" },
        { id: "helm", name: "Helm", category: "orchestration" },
        { id: "jenkins", name: "Jenkins", category: "ci-cd" },
        { id: "gitlab", name: "GitLab CI", category: "ci-cd" },
        { id: "github-actions", name: "GitHub Actions", category: "ci-cd" },
        { id: "circleci", name: "CircleCI", category: "ci-cd" },
        { id: "travis", name: "Travis CI", category: "ci-cd" },
        { id: "aws", name: "AWS", category: "cloud" },
        { id: "azure", name: "Azure", category: "cloud" },
        { id: "gcp", name: "Google Cloud", category: "cloud" },
        { id: "terraform", name: "Terraform", category: "iac" },
        { id: "ansible", name: "Ansible", category: "iac" },
        { id: "cloudformation", name: "CloudFormation", category: "iac" },
        { id: "prometheus", name: "Prometheus", category: "monitoring" },
        { id: "grafana", name: "Grafana", category: "monitoring" },
        { id: "elk", name: "ELK Stack", category: "logging" },
        { id: "nginx", name: "Nginx", category: "web-server" },
        { id: "linux", name: "Linux", category: "os" },
        { id: "bash", name: "Bash Scripting", category: "scripting" }
      ]
    },
    {
      id: "ml",
      name: "Machine Learning",
      icon: Brain,
      color: "from-teal-400 to-cyan-500",
      skills: [
        { id: "python-ml", name: "Python", category: "language" },
        { id: "r", name: "R", category: "language" },
        { id: "tensorflow", name: "TensorFlow", category: "framework" },
        { id: "pytorch", name: "PyTorch", category: "framework" },
        { id: "keras", name: "Keras", category: "framework" },
        { id: "scikit", name: "Scikit-learn", category: "library" },
        { id: "pandas", name: "Pandas", category: "library" },
        { id: "numpy", name: "NumPy", category: "library" },
        { id: "matplotlib", name: "Matplotlib", category: "visualization" },
        { id: "seaborn", name: "Seaborn", category: "visualization" },
        { id: "opencv", name: "OpenCV", category: "computer-vision" },
        { id: "yolo", name: "YOLO", category: "computer-vision" },
        { id: "nlp", name: "NLP/NLTK", category: "nlp" },
        { id: "spacy", name: "spaCy", category: "nlp" },
        { id: "huggingface", name: "Hugging Face", category: "nlp" },
        { id: "transformers", name: "Transformers", category: "nlp" },
        { id: "jupyter", name: "Jupyter", category: "tools" },
        { id: "mlflow", name: "MLflow", category: "mlops" },
        { id: "kubeflow", name: "Kubeflow", category: "mlops" },
        { id: "spark-ml", name: "Apache Spark MLlib", category: "big-data" }
      ]
    },
    {
      id: "data-engineering",
      name: "Data Engineering",
      icon: Database,
      color: "from-cyan-400 to-blue-500",
      skills: [
        { id: "sql", name: "SQL", category: "language" },
        { id: "python-de", name: "Python", category: "language" },
        { id: "scala", name: "Scala", category: "language" },
        { id: "postgresql", name: "PostgreSQL", category: "database" },
        { id: "mysql", name: "MySQL", category: "database" },
        { id: "mongodb", name: "MongoDB", category: "database" },
        { id: "cassandra", name: "Cassandra", category: "database" },
        { id: "dynamodb", name: "DynamoDB", category: "database" },
        { id: "redis", name: "Redis", category: "cache" },
        { id: "memcached", name: "Memcached", category: "cache" },
        { id: "elasticsearch", name: "Elasticsearch", category: "search" },
        { id: "kafka", name: "Apache Kafka", category: "streaming" },
        { id: "flink", name: "Apache Flink", category: "streaming" },
        { id: "airflow", name: "Apache Airflow", category: "orchestration" },
        { id: "luigi", name: "Luigi", category: "orchestration" },
        { id: "spark-de", name: "Apache Spark", category: "processing" },
        { id: "hadoop", name: "Hadoop", category: "big-data" },
        { id: "hive", name: "Apache Hive", category: "big-data" },
        { id: "snowflake", name: "Snowflake", category: "warehouse" },
        { id: "redshift", name: "Redshift", category: "warehouse" },
        { id: "bigquery", name: "BigQuery", category: "warehouse" },
        { id: "databricks", name: "Databricks", category: "platform" }
      ]
    },
    {
      id: "cybersecurity",
      name: "Cybersecurity",
      icon: Shield,
      color: "from-red-400 to-orange-500",
      skills: [
        { id: "penetration-testing", name: "Penetration Testing", category: "offensive" },
        { id: "ethical-hacking", name: "Ethical Hacking", category: "offensive" },
        { id: "metasploit", name: "Metasploit", category: "tools" },
        { id: "burp-suite", name: "Burp Suite", category: "tools" },
        { id: "wireshark", name: "Wireshark", category: "tools" },
        { id: "nmap", name: "Nmap", category: "tools" },
        { id: "kali-linux", name: "Kali Linux", category: "os" },
        { id: "owasp", name: "OWASP Top 10", category: "knowledge" },
        { id: "cryptography", name: "Cryptography", category: "knowledge" },
        { id: "network-security", name: "Network Security", category: "defensive" },
        { id: "firewall", name: "Firewall Configuration", category: "defensive" },
        { id: "ids-ips", name: "IDS/IPS", category: "defensive" },
        { id: "siem", name: "SIEM", category: "monitoring" },
        { id: "splunk", name: "Splunk", category: "monitoring" },
        { id: "incident-response", name: "Incident Response", category: "defensive" },
        { id: "forensics", name: "Digital Forensics", category: "investigation" },
        { id: "malware-analysis", name: "Malware Analysis", category: "investigation" },
        { id: "security-compliance", name: "Security Compliance", category: "governance" }
      ]
    },
    {
      id: "game-dev",
      name: "Game Development",
      icon: Gamepad2,
      color: "from-purple-400 to-pink-500",
      skills: [
        { id: "unity", name: "Unity", category: "engine" },
        { id: "unreal", name: "Unreal Engine", category: "engine" },
        { id: "godot", name: "Godot", category: "engine" },
        { id: "csharp-game", name: "C#", category: "language" },
        { id: "cpp", name: "C++", category: "language" },
        { id: "gdscript", name: "GDScript", category: "language" },
        { id: "blueprints", name: "Blueprints", category: "visual-scripting" },
        { id: "3d-modeling", name: "3D Modeling", category: "art" },
        { id: "blender", name: "Blender", category: "tools" },
        { id: "maya", name: "Maya", category: "tools" },
        { id: "substance", name: "Substance Painter", category: "tools" },
        { id: "photoshop", name: "Photoshop", category: "tools" },
        { id: "game-physics", name: "Game Physics", category: "programming" },
        { id: "ai-programming", name: "AI Programming", category: "programming" },
        { id: "multiplayer", name: "Multiplayer Networking", category: "programming" },
        { id: "shader", name: "Shader Programming", category: "graphics" },
        { id: "opengl", name: "OpenGL", category: "graphics" },
        { id: "directx", name: "DirectX", category: "graphics" }
      ]
    },
    {
      id: "data-science",
      name: "Data Science",
      icon: LineChart,
      color: "from-blue-400 to-indigo-500",
      skills: [
        { id: "python-ds", name: "Python", category: "language" },
        { id: "r-ds", name: "R", category: "language" },
        { id: "statistics", name: "Statistics", category: "mathematics" },
        { id: "probability", name: "Probability", category: "mathematics" },
        { id: "linear-algebra", name: "Linear Algebra", category: "mathematics" },
        { id: "pandas-ds", name: "Pandas", category: "library" },
        { id: "numpy-ds", name: "NumPy", category: "library" },
        { id: "scipy", name: "SciPy", category: "library" },
        { id: "matplotlib-ds", name: "Matplotlib", category: "visualization" },
        { id: "seaborn-ds", name: "Seaborn", category: "visualization" },
        { id: "plotly", name: "Plotly", category: "visualization" },
        { id: "tableau", name: "Tableau", category: "bi-tools" },
        { id: "power-bi", name: "Power BI", category: "bi-tools" },
        { id: "excel", name: "Advanced Excel", category: "tools" },
        { id: "hypothesis-testing", name: "Hypothesis Testing", category: "analysis" },
        { id: "regression", name: "Regression Analysis", category: "analysis" },
        { id: "time-series", name: "Time Series Analysis", category: "analysis" },
        { id: "ab-testing", name: "A/B Testing", category: "experimentation" }
      ]
    },
    {
      id: "uiux",
      name: "UI/UX Design",
      icon: Palette,
      color: "from-indigo-400 to-purple-500",
      skills: [
        { id: "figma", name: "Figma", category: "tools" },
        { id: "sketch", name: "Sketch", category: "tools" },
        { id: "adobe-xd", name: "Adobe XD", category: "tools" },
        { id: "photoshop-ui", name: "Photoshop", category: "tools" },
        { id: "illustrator", name: "Illustrator", category: "tools" },
        { id: "invision", name: "InVision", category: "prototyping" },
        { id: "framer", name: "Framer", category: "prototyping" },
        { id: "protopie", name: "ProtoPie", category: "prototyping" },
        { id: "user-research", name: "User Research", category: "research" },
        { id: "usability-testing", name: "Usability Testing", category: "research" },
        { id: "wireframing", name: "Wireframing", category: "design" },
        { id: "prototyping", name: "Prototyping", category: "design" },
        { id: "visual-design", name: "Visual Design", category: "design" },
        { id: "interaction-design", name: "Interaction Design", category: "design" },
        { id: "design-systems", name: "Design Systems", category: "design" },
        { id: "accessibility", name: "Accessibility", category: "standards" },
        { id: "responsive-design", name: "Responsive Design", category: "standards" },
        { id: "design-thinking", name: "Design Thinking", category: "methodology" }
      ]
    },
    {
      id: "blockchain",
      name: "Blockchain",
      icon: Blocks,
      color: "from-violet-400 to-purple-500",
      skills: [
        { id: "solidity", name: "Solidity", category: "language" },
        { id: "rust-blockchain", name: "Rust", category: "language" },
        { id: "ethereum", name: "Ethereum", category: "platform" },
        { id: "hyperledger", name: "Hyperledger", category: "platform" },
        { id: "polkadot", name: "Polkadot", category: "platform" },
        { id: "smart-contracts", name: "Smart Contracts", category: "development" },
        { id: "web3js", name: "Web3.js", category: "library" },
        { id: "ethersjs", name: "Ethers.js", category: "library" },
        { id: "hardhat", name: "Hardhat", category: "tools" },
        { id: "truffle", name: "Truffle", category: "tools" },
        { id: "metamask", name: "MetaMask", category: "wallet" },
        { id: "ipfs", name: "IPFS", category: "storage" },
        { id: "defi", name: "DeFi Protocols", category: "domain" },
        { id: "nft", name: "NFT Development", category: "domain" },
        { id: "dao", name: "DAO Architecture", category: "domain" },
        { id: "consensus", name: "Consensus Mechanisms", category: "knowledge" },
        { id: "cryptography-bc", name: "Cryptography", category: "knowledge" }
      ]
    },
    {
      id: "ai-automation",
      name: "AI & Automation",
      icon: Bot,
      color: "from-amber-400 to-orange-500",
      skills: [
        { id: "chatgpt", name: "ChatGPT API", category: "llm" },
        { id: "openai", name: "OpenAI API", category: "llm" },
        { id: "claude", name: "Claude API", category: "llm" },
        { id: "langchain", name: "LangChain", category: "framework" },
        { id: "llamaindex", name: "LlamaIndex", category: "framework" },
        { id: "prompt-engineering", name: "Prompt Engineering", category: "skill" },
        { id: "rpa", name: "RPA", category: "automation" },
        { id: "uipath", name: "UiPath", category: "tools" },
        { id: "automation-anywhere", name: "Automation Anywhere", category: "tools" },
        { id: "selenium", name: "Selenium", category: "testing" },
        { id: "puppeteer", name: "Puppeteer", category: "automation" },
        { id: "playwright", name: "Playwright", category: "automation" },
        { id: "vector-db", name: "Vector Databases", category: "database" },
        { id: "pinecone", name: "Pinecone", category: "database" },
        { id: "rag", name: "RAG Architecture", category: "architecture" },
        { id: "fine-tuning", name: "Model Fine-tuning", category: "training" },
        { id: "agent-frameworks", name: "Agent Frameworks", category: "framework" }
      ]
    },
    {
      id: "networking",
      name: "Networking",
      icon: Network,
      color: "from-sky-400 to-blue-500",
      skills: [
        { id: "tcp-ip", name: "TCP/IP", category: "protocols" },
        { id: "http-https", name: "HTTP/HTTPS", category: "protocols" },
        { id: "dns", name: "DNS", category: "protocols" },
        { id: "dhcp", name: "DHCP", category: "protocols" },
        { id: "routing", name: "Routing", category: "core" },
        { id: "switching", name: "Switching", category: "core" },
        { id: "vlan", name: "VLAN", category: "core" },
        { id: "vpn", name: "VPN", category: "security" },
        { id: "cisco", name: "Cisco", category: "vendor" },
        { id: "juniper", name: "Juniper", category: "vendor" },
        { id: "load-balancing", name: "Load Balancing", category: "infrastructure" },
        { id: "cdn", name: "CDN", category: "infrastructure" },
        { id: "network-monitoring", name: "Network Monitoring", category: "management" },
        { id: "packet-analysis", name: "Packet Analysis", category: "troubleshooting" },
        { id: "bgp", name: "BGP", category: "advanced" },
        { id: "ospf", name: "OSPF", category: "advanced" },
        { id: "mpls", name: "MPLS", category: "advanced" }
      ]
    }
  ];
 
  const api = axios.create({
    baseURL: "https://jubilant-fortnight-node-backend.onrender.com/students",
    withCredentials: true,
  });
  

  //    /* ✅ AUTH CHECK + LOGOUT HANDLERS */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication for student ID:", studentId);
const res = await api.get("/check-auth", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});
        console.log("Auth check response:", res.data);
        if (!res.data.success) {
          navigate("/StudentSignin");
        }
      } catch {
        navigate("/StudentSignin");
      }
    };
    checkAuth();
  }, [navigate]);

  


  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setSelectedSkills([]);
    setSkillLevels({});
  };

  const handleBack = () => {
    setSelectedDomain(null);
  };

  const toggleSkill = (skillId) => {

    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const setSkillLevel = (skillId, level) => {
    setSkillLevels((prev) => ({ ...prev, [skillId]: level }));
  };

  const handleStartInterview = async () => {
    if (selectedSkills.length === 0) {
      showToast("Please select at least one skill.", "info");
      return;
    }
    setLoading(true);
    try {
      const formattedSkills = selectedSkills.map((s) => ({
        skill: s,
        level: skillLevels[s] || "Beginner",
      }));
    console.log("Formatted Skills:", formattedSkills);
    console.log("Student ID:", studentId);
      await axios.patch("https://jubilant-fortnight-node-backend.onrender.com/students/update-skills", {
        studentId,
        skills: formattedSkills,
      });

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
      navigate("/StudentSignin");
    } catch {
      showToast("Logout failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 flex flex-col">
      {/* Header - Fully Responsive */}
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
            {selectedDomain && (
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

      {/* Main Content - Responsive Padding */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!selectedDomain ? (
              /* Domain Selection - Responsive Grid */
              <motion.div
                key="domains"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              >
                {domains.map((domain) => (
                  <motion.button
                    key={domain.id}
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
              </motion.div>
            ) : (
              /* Skills Selection - Responsive Layout */
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Domain Header Card */}
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${selectedDomain.color} flex items-center justify-center flex-shrink-0`}>
                      <selectedDomain.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                      {selectedDomain.name}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Select the technologies you know best:
                  </p>
                  
                  {/* Selected Count Badge */}
                  {selectedSkills.length > 0 && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs sm:text-sm font-medium text-emerald-700">
                        {selectedSkills.length} selected
                      </span>
                    </div>
                  )}
                </div>

                {/* Skills Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedDomain.skills.map((skill) => {
                    const selected = selectedSkills.includes(skill.id);
                    return (
                      <motion.div
                        key={skill.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          selected
                            ? "border-emerald-400 bg-emerald-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                        }`}
                        onClick={() => toggleSkill(skill.id)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-medium text-gray-800 text-sm leading-tight">
                            {skill.name}
                          </span>
                          {selected && (
                            <CheckCircle2 className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                          )}
                        </div>

                        {/* Level Selection - Responsive Buttons */}
                        {selected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 flex gap-1.5 flex-wrap"
                          >
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
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bottom Spacing for Fixed Button */}
                <div className="h-20 sm:h-24" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Action Button - Fixed & Responsive */}
      {selectedDomain && (
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
                `Start Interview (${selectedSkills.length})`
              )}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
