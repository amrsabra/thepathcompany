import React, { useEffect, useState, useRef } from 'react';
import './container-text-flip.scss';

export function ContainerTextFlip({ words }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (!words || words.length < 2) return;
    if (paused) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [words, paused]);

  const handlePauseToggle = () => setPaused((p) => !p);

  return (
    <span className="container-text-flip" style={{ position: 'relative', display: 'inline-block', width: 630, minHeight: 200 }}>
      <span className="flip-word" key={index}>&ldquo;{words[index]}&rdquo;</span>
      <button
        className="flip-pause-btn"
        onClick={handlePauseToggle}
        aria-label={paused ? 'Play testimonials' : 'Pause testimonials'}
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          fontSize: 28,
          position: 'absolute',
          right: 0,
          bottom: -56,
          marginLeft: 0,
          zIndex: 2
        }}
      >
        {paused ? (
          <svg width="28" height="28" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="6,4 14,9 6,14" fill="currentColor"/></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="3" height="10" fill="currentColor"/><rect x="11" y="4" width="3" height="10" fill="currentColor"/></svg>
        )}
      </button>
      {/* Dots indicator */}
      <span
        className="flip-dots"
        style={{
          position: 'absolute',
          right: -60,
          bottom: 10,
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          zIndex: 3,
        }}
      >
        {words.slice(0, 5).map((_, i) => (
          <span
            key={i}
            className={i === index ? 'flip-dot active' : 'flip-dot'}
            style={{
              width: i === index ? 16 : 10,
              height: i === index ? 16 : 10,
              borderRadius: '50%',
              background: i === index ? '#fff' : 'rgba(255,255,255,0.3)',
              boxShadow: i === index ? '0 0 8px #fff' : 'none',
              transition: 'all 0.2s',
              margin: '0 auto',
            }}
          />
        ))}
      </span>
    </span>
  );
} 