import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Photo, AlbumItem } from "@/pages/Album";

export default function AlbumViewer({
  album,
  initialIndex,
  onClose
}: {
  album: AlbumItem;
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < album.photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button
          className="absolute top-4 right-4 text-white text-2xl z-10"
          onClick={onClose}
        >
          <i className="fa-solid fa-times"></i>
        </button>
        
        {/* 图片展示区域 */}
        <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
          <AnimatePresence initial={false} custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              initial={{ opacity: 0, x: currentIndex > initialIndex ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentIndex > initialIndex ? -100 : 100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <img
                src={album.photos[currentIndex].url}
                alt={album.photos[currentIndex].title}
                className="max-h-full max-w-full object-contain"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* 导航箭头 */}
          {currentIndex > 0 && (
            <button
              className="absolute left-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe('right');
              }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          )}
          
          {currentIndex < album.photos.length - 1 && (
            <button
              className="absolute right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe('left');
              }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          )}
        </div>
        
        {/* 图片信息 */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          <p>{album.photos[currentIndex].title}</p>
          <p className="text-sm opacity-80">
            {currentIndex + 1} / {album.photos.length}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
