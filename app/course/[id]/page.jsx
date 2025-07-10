"use client";
import React from 'react';
import '@mux/mux-player';

export default function CourseCatalogPage() {
  return (
    <div style={{ background: '#111', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <mux-player
        playback-id="e2GsHPL1hyonXQE763o6mxRNkJN01f00oNJ7yv3pq3nUc"
        style={{ width: '100%', maxWidth: 900, aspectRatio: '16/9', background: '#222', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.13)' }}
      />
    </div>
  );
}