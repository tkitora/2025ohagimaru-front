import React from 'react';
import sunImage from '../assets/Home/sun.png';

const RotatingSun = () => {
  return (
    <>
      <style>
        {`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .spin-slow {
          animation: spin 100s linear infinite;// アニメーションの速度を調整
        }
        `}
      </style>
      <img
        src={sunImage}
        alt="Sun"
        className="absolute -top-40 -left-40 w-96 h-96 z-20 spin-slow"// 太陽の位置、サイズを調整
      />
    </>
  );
};

export default RotatingSun;