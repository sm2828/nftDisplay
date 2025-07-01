import React, { useState, useEffect } from 'react';
import './CyclingText.css';

interface CyclingTextProps {
  sentences: string[];
  className?: string;
}

const CyclingText: React.FC<CyclingTextProps> = ({
  sentences,
  className = ''
}) => {
  const [currentText, setCurrentText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Pick a random sentence on component mount (page refresh)
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    
    setCurrentText(randomSentence);
    
    // Small delay to trigger the fade-in animation
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, [sentences]);

  return (
    <span className={`cycling-text ${className} ${isVisible ? 'visible' : 'hidden'}`}>
      {currentText}
    </span>
  );
};

export default CyclingText; 