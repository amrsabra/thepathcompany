import React from 'react';
import '../styles/instructor-marquee.scss';

const InstructorMarquee = ({ images = [] }) => {
  return (
    <div className="instructor-marquee">
      <div className="carousel">
        {images.map((src, idx) => (
          <div
            className="carousel__item"
            key={idx}
            style={{ '--i': idx + 1, '--total': images.length }}
          >
            <img src={src} alt={`Instructor ${idx + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorMarquee;
