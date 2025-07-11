"use client";
import React from 'react';
import '@mux/mux-player';
import '../../../styles/coursecatalog/test.scss';

export default function CourseCatalogPage() {
  return (
    <div className="test-course-page">
      <div className="test-course-content">
        <mux-player
          playback-id="e2GsHPL1hyonXQE763o6mxRNkJN01f00oNJ7yv3pq3nUc"
          class="test-course-video"
        />
        <h1 className="test-course-title">The Art of Mechatronic Engineering</h1>
        <div className="test-course-separator" />
        <div className="test-course-instructor">
          <img src="/logo.png" alt="TPC Icon" className="tpc-icon" />
          <span className="tpc-x">x</span>
          <span className="tpc-instructor-name">Amro Sabra</span>
        </div>
      </div>
    </div>
  );
}