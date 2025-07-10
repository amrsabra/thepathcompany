"use client";
import { motion } from "framer-motion";
import React from "react";

export const ThreeDMarquee = ({
  images,
  className,
}) => {
  // Split the images array into 3 equal parts
  const numCols = 3;
  const chunkSize = Math.ceil(images.length / numCols);
  const chunks = Array.from({ length: numCols }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return images.slice(start, start + chunkSize);
  });
  return (
    <div
      className={`marquee-root ${className || ""}`}
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', height: '100%', transform: 'scale(1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              transform: "rotateX(35deg) rotateY(0deg) rotateZ(-30deg)",
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              placeItems: 'center',
            }}
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                transition={{
                  duration: colIndex % 2 === 0 ? 20 : 30,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                key={colIndex + "marquee"}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
              >
                {subarray.map((image, imageIndex) => (
                  <div className="relative" key={imageIndex + image}>
                    <motion.img
                      whileHover={{
                        y: -10,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      key={imageIndex + image}
                      src={image}
                      alt={`Image ${imageIndex + 1}`}
                      style={{ width: '180px', height: '130px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 