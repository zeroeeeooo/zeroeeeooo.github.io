import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  date: string;
  category: string;
  photo: string;
  reminder: string;
};

export default function Timeline({ onBirthdayEvent }: { onBirthdayEvent: () => void }) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(storedEvents.sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, []);

  const calculateCountdown = (date: string) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays < 0) return `已过 ${Math.abs(diffDays)} 天`;
    return `还有 ${diffDays} 天`;
  };

  useEffect(() => {
    const hasBirthdayToday = events.some(event => {
      const today = new Date();
      const eventDate = new Date(event.date);
      return (
        event.category === 'birthday' &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getDate() === today.getDate()
      );
    });
    
    if (hasBirthdayToday) {
      onBirthdayEvent();
    }
  }, [events, onBirthdayEvent]);

  return (
    <div className="relative pb-20">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#FFD1DC]"></div>
      
      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10 text-gray-500"
        >
          暂无纪念日，请添加
        </motion.div>
      ) : (
        events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            whileHover={{ y: -5 }}
            className="relative pl-10 mb-6"
          >
            <div className="absolute left-0 w-8 h-8 rounded-full bg-[#FFD1DC] flex items-center justify-center text-white font-medium">
              {new Date(event.date).getDate()}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-[#FFD1DC]">{event.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()} · {event.category === 'birthday' ? '生日' : event.category === 'anniversary' ? '纪念日' : '节日'}
                  </p>
                  <p className="text-sm mt-1">{calculateCountdown(event.date)}</p>
                </div>
                
                <div className="flex items-start gap-2">
                  {event.photo && (
                    <div className="w-16 h-16 rounded overflow-hidden">
                      <img src={event.photo} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <button
                    className="text-red-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      const confirmDelete = confirm(`确定要删除"${event.title}"吗？`);
                      if (confirmDelete) {
                        const updatedEvents = events.filter(e => e.id !== event.id);
                        setEvents(updatedEvents);
                        localStorage.setItem('events', JSON.stringify(updatedEvents));
                        toast.success('纪念日已删除');
                      }
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              
              {event.reminder && (
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <i className="fa-solid fa-bell mr-1"></i>
                  <span>提醒时间: {event.reminder}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}