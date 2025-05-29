import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import EventForm from "@/components/EventForm";
import Timeline from "@/components/Timeline";
import BalloonAnimation from "@/components/BalloonAnimation";

export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="pb-20 min-h-screen bg-[#F5F5DC]"
    >
      <div className="container mx-auto px-4 py-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="text-2xl font-bold text-[#FFD1DC] mb-6"
        >
          纪念日
        </motion.h1>
          
        {isAdding ? (
          <EventForm 
            onAdd={() => {
              setRefresh(!refresh);
              setIsAdding(false);
            }} 
            onCancel={() => setIsAdding(false)} 
          />
        ) : (
          <div className="space-y-4">
            <Timeline onBirthdayEvent={() => setShowBalloons(true)} />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="fixed bottom-24 right-6 w-12 h-12 bg-[#FFD1DC] text-white rounded-full shadow-lg flex items-center justify-center"
              onClick={() => setIsAdding(true)}
            >
              <motion.i 
                className="fa-solid fa-plus text-xl"
                animate={{ rotate: isAdding ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        )}
      </div>
      
      <Navbar />
      {showBalloons && <BalloonAnimation />}

      {/* 背景装饰元素 */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#FFD1DC]"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10, 0],
              x: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}