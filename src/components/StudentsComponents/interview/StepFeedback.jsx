import { motion } from "framer-motion";
import FeedbackForm from "../helpers/FeedbackForm.jsx";

const StepFeedback = ({ pageVariants, onSubmit, darkMode, processingAI }) => {
  return (
    <motion.div
      key="feedback"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="flex flex-col flex-grow justify-center px-3 sm:px-4"
    >
      <FeedbackForm onSubmit={onSubmit} darkMode={darkMode} isProcessing={processingAI} />
    </motion.div>
  );
};

export default StepFeedback;
