import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const colors = ['#FFD1DC', '#FFA7C4', '#FF85B3', '#FF6B9D', '#FF4785'];

export default function BalloonAnimation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100;
        const duration = 8 + Math.random() * 4;
        
        return (
          <motion.div
            key={i}
            initial={{ y: '100vh', x: `${startX}%`, opacity: 0 }}
            animate={{ 
              y: '-100vh',
              opacity: [0, 1, 1, 0],
              x: `${startX + (Math.random() * 20 - 10)}%`
            }}
            transition={{ 
              duration,
              ease: 'linear',
              opacity: { times: [0, 0.1, 0.9, 1], duration }
            }}
            className="absolute bottom-0"
            style={{ width: 40, height: 50 }}
          >
            <div 
              className="w-full h-full rounded-full" 
              style={{ 
                backgroundColor: color,
                transform: 'rotate(45deg)'
              }}
            />
            <div 
              className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-gray-400"
              style={{ transform: 'translateX(-50%)' }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}