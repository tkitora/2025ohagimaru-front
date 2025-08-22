import cloud1Image from '../assets/Home/cloud1.png';
import cloud2Image from '../assets/Home/cloud2.png';
import cloud3Image from '../assets/Home/cloud3.png';
import cloud4Image from '../assets/Home/cloud4.png';

const clouds = [//雲の上からのなん％か、速度、最初に配置される位置を調整
  { src: cloud1Image, top: '5%', duration: '60s', delay: '-10s' },
  { src: cloud2Image, top: '2%', duration: '60s', delay: '-40s' },
  { src: cloud3Image, top: '20%', duration: '60s', delay: '-30s' },
  { src: cloud4Image, top: '30%', duration: '60s', delay: '-50s' },
];

const MovingClouds = () => {
  return (
    <>
      <style>
        {`
        @keyframes slide {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-100%);
          }
        }
        `}
      </style>
      {clouds.map((cloud, index) => (
        <img
          key={index}
          src={cloud.src}
          alt={`Cloud ${index + 1}`}
          className="absolute z-10"//太陽より後ろ
          style={{
            top: cloud.top,
            animation: `slide ${cloud.duration} linear infinite`,
            animationDelay: cloud.delay,
          }}
        />
      ))}
    </>
  );
};

export default MovingClouds;
