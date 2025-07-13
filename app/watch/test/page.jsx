"use client";
import React, { useEffect, useState } from 'react';
import '@mux/mux-player';
import '../../../styles/watch/test.scss';

export default function WatchPage() {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const videoPlayer = document.querySelector('mux-player');
    if (videoPlayer) {
      // Auto-play when metadata loads
      videoPlayer.addEventListener('loadedmetadata', () => {
        videoPlayer.play();
        setIsPlaying(true);
        
        // Unmute the video if it was muted by browser policy
        setTimeout(() => {
          if (videoPlayer.muted) {
            videoPlayer.muted = false;
            videoPlayer.volume = 1;
          }
        }, 100);
      });

      // Listen for play/pause events
      videoPlayer.addEventListener('play', () => {
        setIsPlaying(true);
        // Ensure video is unmuted when playing
        if (videoPlayer.muted) {
          videoPlayer.muted = false;
          videoPlayer.volume = 1;
        }
      });

      videoPlayer.addEventListener('pause', () => {
        setIsPlaying(false);
      });

      // Also listen for user interactions that might pause/play
      videoPlayer.addEventListener('click', () => {
        // Small delay to let the play/pause state update
        setTimeout(() => {
          const isCurrentlyPlaying = !videoPlayer.paused;
          setIsPlaying(isCurrentlyPlaying);
        }, 100);
      });

      // Handle user interaction to enable sound
      const enableSound = () => {
        if (videoPlayer.muted) {
          videoPlayer.muted = false;
          videoPlayer.volume = 1;
        }
        // Remove event listeners after first interaction
        document.removeEventListener('click', enableSound);
        document.removeEventListener('keydown', enableSound);
      };

      // Listen for any user interaction to enable sound
      document.addEventListener('click', enableSound);
      document.addEventListener('keydown', enableSound);
    }
  }, []);

  return (
    <div className="watch-page">
      <div className="video-container">
        <mux-player
          playback-id="e2GsHPL1hyonXQE763o6mxRNkJN01f00oNJ7yv3pq3nUc"
          class="fullscreen-video"
          autoplay="true"
          muted="false"
          controls="true"
          preload="auto"
          volume="1"
        />
      </div>
      
      <div 
        className={`pause-overlay ${isPlaying ? 'hidden' : 'visible'}`}
        onClick={() => {
          const videoPlayer = document.querySelector('mux-player');
          if (videoPlayer) {
            videoPlayer.play();
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <button 
          className="exit-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the overlay click
            window.location.href = '/';
          }}
        >
          ✕
        </button>
        <div className="pause-content">
          <div className="course-image">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" 
              alt="Startup Fundamentals" 
            />
          </div>
          <div className="course-info">
            <h1 className="course-title">The Art of Mechatronic Engineering</h1>
            <p className="course-instructor">By Amro Sabra</p>
            <p className="course-description">
              Learn the essentials of building and scaling your startup from the ground up. 
              This comprehensive course covers everything from ideation to scaling, with 
              real-world examples and practical strategies.
            </p>
            <div className="course-stats">
              <span className="duration">8 hours</span>
              <span className="category">Entrepreneurship</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
