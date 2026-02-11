import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeedbackForm = ({ onSubmit, darkMode, isProcessing }) => {  
  const [feedback, setFeedback] = useState({
    difficulty: 3,
    fairness: 5,
    technicalIssues: false,
    aiQuality: 5,
    overallExperience: 5,
    comments: ''
  });

  const [hoveredRating, setHoveredRating] = useState({});
  //  const [isProcessing, setIsProcessing] = useState(false);
  // const navigate = useNavigate();


  const handleSubmit = () => {
    onSubmit(feedback);
  };


  // const handleSubmit = async (feedback) => {
  //   try {
  //     setIsProcessing(true);

  //     const res = await fetch(
  //       `${import.meta.env.VITE_API_BASE_URL}/api/feedback`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({
  //           studentId: user._id,
  //           ...feedback
  //         })
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok) throw new Error(data.message);

  //     navigate(`/report/${data.data._id}`);
  //         onSubmit(feedback);

  //   } catch (err) {
  //     console.error(err);
  //     alert(err.message);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const StarRating = ({ value, onChange, label, name }) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHoveredRating({ ...hoveredRating, [name]: star })}
              onMouseLeave={() => setHoveredRating({ ...hoveredRating, [name]: 0 })}
              onClick={() => onChange(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-all ${
                  star <= (hoveredRating[name] || value)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {value === 1 && "Very Poor"}
          {value === 2 && "Poor"}
          {value === 3 && "Average"}
          {value === 4 && "Good"}
          {value === 5 && "Excellent"}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl mx-auto`}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          How was your experience?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your feedback helps us improve the interview experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Difficulty Rating */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Interview Difficulty
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={feedback.difficulty}
            onChange={(e) => setFeedback({ ...feedback, difficulty: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Too Easy</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {feedback.difficulty === 1 && "Very Easy"}
              {feedback.difficulty === 2 && "Easy"}
              {feedback.difficulty === 3 && "Just Right"}
              {feedback.difficulty === 4 && "Hard"}
              {feedback.difficulty === 5 && "Very Hard"}
            </span>
            <span>Too Hard</span>
          </div>
        </div>

        {/* Star Ratings */}
        <StarRating
          label="Questions were fair and relevant"
          value={feedback.fairness}
          name="fairness"
          onChange={(value) => setFeedback({ ...feedback, fairness: value })}
        />

        <StarRating
          label="AI Interviewer Quality"
          value={feedback.aiQuality}
          name="aiQuality"
          onChange={(value) => setFeedback({ ...feedback, aiQuality: value })}
        />

        <StarRating
          label="Overall Experience"
          value={feedback.overallExperience}
          name="overallExperience"
          onChange={(value) => setFeedback({ ...feedback, overallExperience: value })}
        />

        {/* Technical Issues Checkbox */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={feedback.technicalIssues}
              onChange={(e) => setFeedback({ ...feedback, technicalIssues: e.target.checked })}
              className="mt-1 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <div>
              <span className="text-sm font-medium">I experienced technical issues</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Such as audio problems, connection issues, or system errors
              </p>
            </div>
          </label>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            placeholder="Share your thoughts, suggestions, or report any issues..."
            value={feedback.comments}
            onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
            className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
            rows={4}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {feedback.comments.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: isProcessing ? 1 : 1.02 }}
          whileTap={{ scale: isProcessing ? 1 : 0.98 }}
          onClick={handleSubmit}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              Generating Report...
            </span>
          ) : (
            'Submit Feedback & View Report'
          )}
        </motion.button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Your feedback is anonymous and helps us improve
        </p>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;



// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Star, MessageSquare, Loader } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const FeedbackForm = ({ studentId, darkMode = false }) => {
//   const navigate = useNavigate();

//   const [isProcessing, setIsProcessing] = useState(false);
//   const [hoveredRating, setHoveredRating] = useState({});

//   const [feedback, setFeedback] = useState({
//     difficulty: 3,
//     fairness: 5,
//     technicalIssues: false,
//     aiQuality: 5,
//     overallExperience: 5,
//     comments: ""
//   });

//   // ✅ Correct submit handler
//   const handleSubmit = async () => {
//     try {
//       setIsProcessing(true);

//       const res = await fetch(
//         `http://localhost:8080/api/feedback`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             studentId,
//             ...feedback
//           })
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to submit feedback");
//       }

//       // ✅ Navigate to report
//       // await generatRe
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert(err.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const StarRating = ({ value, onChange, label, name }) => (
//     <div className="mb-6">
//       <label className="block text-sm font-semibold mb-3">{label}</label>
//       <div className="flex gap-2">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <motion.button
//             key={star}
//             type="button"
//             whileHover={{ scale: 1.2 }}
//             whileTap={{ scale: 0.9 }}
//             onMouseEnter={() =>
//               setHoveredRating((p) => ({ ...p, [name]: star }))
//             }
//             onMouseLeave={() =>
//               setHoveredRating((p) => ({ ...p, [name]: 0 }))
//             }
//             onClick={() => onChange(star)}
//             className="focus:outline-none"
//           >
//             <Star
//               className={`w-8 h-8 ${
//                 star <= (hoveredRating[name] || value)
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "text-gray-300 dark:text-gray-600"
//               }`}
//             />
//           </motion.button>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl mx-auto`}
//     >
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
//           <MessageSquare className="w-8 h-8 text-white" />
//         </div>
//         <h2 className="text-2xl md:text-3xl font-bold mb-2">
//           How was your experience?
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400">
//           Your feedback helps us improve the interview experience
//         </p>
//       </div>

//       {/* Difficulty */}
//       <input
//         type="range"
//         min="1"
//         max="5"
//         value={feedback.difficulty}
//         onChange={(e) =>
//           setFeedback({ ...feedback, difficulty: +e.target.value })
//         }
//         className="w-full accent-blue-500"
//       />

//       <StarRating
//         label="Questions were fair and relevant"
//         value={feedback.fairness}
//         name="fairness"
//         onChange={(v) => setFeedback({ ...feedback, fairness: v })}
//       />

//       <StarRating
//         label="AI Interviewer Quality"
//         value={feedback.aiQuality}
//         name="aiQuality"
//         onChange={(v) => setFeedback({ ...feedback, aiQuality: v })}
//       />

//       <StarRating
//         label="Overall Experience"
//         value={feedback.overallExperience}
//         name="overallExperience"
//         onChange={(v) => setFeedback({ ...feedback, overallExperience: v })}
//       />

//       {/* Submit */}
//       <motion.button
//         disabled={isProcessing}
//         onClick={handleSubmit}
//         className={`w-full py-4 rounded-xl font-bold ${
//           isProcessing
//             ? "bg-gray-400"
//             : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
//         }`}
//       >
//         {isProcessing ? (
//           <span className="flex justify-center gap-2">
//             <Loader className="animate-spin" /> Submitting...
//           </span>
//         ) : (
//           "Submit Feedback & View Report"
//         )}
//       </motion.button>
//     </motion.div>
//   );
// };

// export default FeedbackForm;
