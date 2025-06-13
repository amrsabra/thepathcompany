'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/personalization.scss';

const questions = [
  {
    id: 1,
    question: "What's your primary learning goal?",
    options: [
      { id: 'academic', label: 'Academic Excellence' },
      { id: 'entrepreneur', label: 'Entrepreneurship' },
      { id: 'personal', label: 'Personal Development' },
      { id: 'career', label: 'Career Advancement' }
    ]
  },
  {
    id: 2,
    question: "How much time can you dedicate weekly?",
    options: [
      { id: '2-4', label: '2-4 hours' },
      { id: '4-6', label: '4-6 hours' },
      { id: '6-8', label: '6-8 hours' },
      { id: '8+', label: '8+ hours' }
    ]
  },
  {
    id: 3,
    question: "What's your preferred learning style?",
    options: [
      { id: 'visual', label: 'Visual (Videos & Graphics)' },
      { id: 'practical', label: 'Practical (Hands-on Projects)' },
      { id: 'theoretical', label: 'Theoretical (In-depth Analysis)' },
      { id: 'interactive', label: 'Interactive (Group Discussions)' }
    ]
  }
];

const PersonalizationFlow = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isVisible, setIsVisible] = useState(true);

  const handleOptionSelect = (optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: optionId
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        onComplete(answers);
      }, 500);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="personalization-flow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="personalization-flow__progress">
            <div 
              className="personalization-flow__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <motion.div
            key={currentQuestion}
            className="personalization-flow__content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="personalization-flow__question">
              {questions[currentQuestion].question}
            </h2>
            
            <div className="personalization-flow__options">
              {questions[currentQuestion].options.map((option) => (
                <motion.button
                  key={option.id}
                  className="personalization-flow__option"
                  onClick={() => handleOptionSelect(option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersonalizationFlow; 