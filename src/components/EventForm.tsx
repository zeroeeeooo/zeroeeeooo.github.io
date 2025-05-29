import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function EventForm({ onAdd, onCancel }: { onAdd: () => void; onCancel?: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'birthday',
    reminder: '',
    photo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      toast.error('请填写标题和日期');
      return;
    }

    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push({ ...formData, id: Date.now().toString() });
    localStorage.setItem('events', JSON.stringify(events));
    
    toast.success('纪念日已添加');
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      category: 'birthday',
      reminder: '',
      photo: ''
    });
    onAdd();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('图片大小不能超过5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({...formData, photo: event.target?.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-4 rounded-lg shadow"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">事件标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded focus:ring-1 focus:ring-[#FFD1DC]"
            placeholder="请输入事件名称"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">日期</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full p-2 border rounded focus:ring-1 focus:ring-[#FFD1DC]"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">分类</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded focus:ring-1 focus:ring-[#FFD1DC]"
          >
            <option value="birthday">生日</option>
            <option value="anniversary">纪念日</option>
            <option value="holiday">节日</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">提醒时间</label>
          <input
            type="time"
            value={formData.reminder}
            onChange={(e) => setFormData({...formData, reminder: e.target.value})}
            className="w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#FFD1DC]"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">照片</label>
          {formData.photo && (
            <div className="relative mb-2">
              <img 
                src={formData.photo} 
                alt="预览" 
                className="w-full h-32 object-cover rounded"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => setFormData({...formData, photo: ''})}
              >
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded focus:ring-1 focus:ring-[#FFD1DC]"
          />
          <p className="text-xs text-gray-500 mt-1">支持JPG/PNG格式，最大5MB</p>
        </div>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              onClick={onCancel}
            >
              取消
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-[#FFD1DC] text-white rounded hover:bg-opacity-90"
          >
            添加
          </button>
        </div>
      </form>
    </motion.div>
  );
}