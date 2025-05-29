import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

type DiaryItem = {
  id: string;
  date: string;
  title: string;
  content: string;
  photo: string | null;
  showComments?: boolean;
  comments: {
    id: string;
    content: string;
    author: string;
    createdAt: string;
  }[];
};

function DiaryEditor({ 
  diary, 
  onSave, 
  onCancel 
}: { 
  diary: DiaryItem | null; 
  onSave: (diary: DiaryItem) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState<DiaryItem>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    photo: null,
    ...diary
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('请填写标题和内容');
      return;
    }
    onSave(formData);
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
          <label className="block text-sm text-gray-600 mb-1">标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded focus:ring-1 focus:ring-[#FFD1DC]"
            placeholder="日记标题"
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
          <label className="block text-sm text-gray-600 mb-1">内容</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="w-full p-2 border rounded focus:ring-1 focus:ring-[#FFD1DC] h-32"
            placeholder="写下你的心情..."
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">图片</label>
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
                onClick={() => setFormData({...formData, photo: null})}
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
          <button
            type="button"
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#FFD1DC] text-white rounded hover:bg-opacity-90"
          >
            保存
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default function Diary() {
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [editingDiary, setEditingDiary] = useState<DiaryItem | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('匿名用户');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedDiaries = JSON.parse(localStorage.getItem('diaries') || '[]');
    setDiaries(storedDiaries.sort((a: DiaryItem, b: DiaryItem) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, []);

  const handleSave = (diary: DiaryItem) => {
    let updatedDiaries;
    if (diary.id) {
      // Update existing diary
      updatedDiaries = diaries.map(d => d.id === diary.id ? diary : d);
    } else {
      // Add new diary
      const newDiary = { ...diary, id: Date.now().toString() };
      updatedDiaries = [newDiary, ...diaries];
    }
    
    setDiaries(updatedDiaries);
    localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
    setIsEditing(false);
    setEditingDiary(null);
    toast.success('日记已保存');
  };

  const handleDelete = (id: string) => {
    const confirmDelete = confirm('确定要删除这篇日记吗？');
    if (confirmDelete) {
      const updatedDiaries = diaries.filter(d => d.id !== id);
      setDiaries(updatedDiaries);
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
      toast.success('日记已删除');
    }
  };

  const generateSummary = (content: string) => {
    return content.length > 60 ? content.substring(0, 60) + '...' : content;
  };

  const handleAddComment = (diaryId: string) => {
    if (!newComment.trim()) {
      toast.error('评论内容不能为空');
      return;
    }

    const updatedDiaries = diaries.map(diary => {
      if (diary.id === diaryId) {
        return {
          ...diary,
          comments: [
            ...diary.comments,
            {
              id: Date.now().toString(),
              content: newComment,
              author: commentAuthor,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return diary;
    });

    setDiaries(updatedDiaries);
    localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
    setNewComment('');
    toast.success('评论已添加');
  };

  const handleDeleteComment = (diaryId: string, commentId: string) => {
    const confirmDelete = confirm('确定要删除这条评论吗？');
    if (confirmDelete) {
      const updatedDiaries = diaries.map(diary => {
        if (diary.id === diaryId) {
          return {
            ...diary,
            comments: diary.comments.filter(comment => comment.id !== commentId)
          };
        }
        return diary;
      });

      setDiaries(updatedDiaries);
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
      toast.success('评论已删除');
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-[#F5F5DC]">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#FFD1DC] mb-6">我的日记</h1>
        
        {isEditing ? (
          <DiaryEditor 
            diary={editingDiary} 
            onSave={handleSave} 
            onCancel={() => {
              setIsEditing(false);
              setEditingDiary(null);
            }} 
          />
        ) : (
          <div className="space-y-4">
            {diaries.length === 0 ? (
              <div className="text-center py-10 text-gray-500">暂无日记，点击下方按钮添加</div>
            ) : (
              diaries.map(diary => (
                <motion.div
                  key={diary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div 
                    className="flex cursor-pointer"
                    onClick={() => {
                      setEditingDiary(diary);
                      setIsEditing(true);
                    }}
                  >
                    {diary.photo && (
                      <div className="w-2/5 p-2">
                        <img 
                          src={diary.photo} 
                          alt={diary.title} 
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                    <div className={`${diary.photo ? 'w-3/5' : 'w-full'} p-4`}>
                      <h3 className="font-medium text-[#FFD1DC]">{diary.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(diary.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-2 text-gray-700">
                        {generateSummary(diary.content)}
                      </p>
                      <button
                        className="mt-3 text-xs text-red-400 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(diary.id);
                        }}
                      >
                        <i className="fa-solid fa-trash mr-1"></i>删除日记
                      </button>
                    </div>
                  </div>

                  {/* 评论按钮 */}
                  <div className="border-t p-3 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm text-[#FFD1DC] flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDiaries(diaries.map(d => 
                          d.id === diary.id ? {...d, showComments: !d.showComments} : d
                        ));
                      }}
                    >
                      <i className="fa-regular fa-comment mr-1"></i>
                      评论 ({diary.comments?.length || 0})
                    </motion.button>
                  </div>

                  {/* 评论区域 - 可折叠 */}
                  {diary.showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t p-4 overflow-hidden"
                      onClick={e => e.stopPropagation()}
                    >
                      {diary.comments?.map(comment => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mb-3"
                        >
                          <div className="flex items-start space-x-2">
                            <div className="w-8 h-8 rounded-full bg-[#FFD1DC] flex items-center justify-center text-white text-xs">
                              {comment.author.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-lg p-2">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium">{comment.author}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                                </div>
                                <p className="text-sm mt-1">{comment.content}</p>
                              </div>
                              <button
                                className="text-xs text-gray-400 hover:text-red-500 mt-1 ml-2"
                                onClick={() => handleDeleteComment(diary.id, comment.id)}
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      <div className="mt-4">
                        <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
                          <input
                            type="text"
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                            className="bg-transparent text-sm w-20 mr-2 focus:outline-none"
                            placeholder="昵称"
                          />
                          <div className="flex-1">
                            <input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="w-full bg-transparent text-sm focus:outline-none"
                              placeholder="写评论..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAddComment(diary.id);
                                }
                              }}
                            />
                          </div>
                          {newComment && (
                            <motion.button
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-[#FFD1DC] text-sm font-medium"
                              onClick={() => handleAddComment(diary.id)}
                            >
                              发送
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
            <button
              className="fixed bottom-24 right-6 w-12 h-12 bg-[#FFD1DC] text-white rounded-full shadow-lg flex items-center justify-center"
              onClick={() => {
                setEditingDiary({
                  id: '',
                  date: new Date().toISOString().split('T')[0],
                  title: '',
                  content: '',
                  photo: null,
                  comments: []
                });
                setIsEditing(true);
              }}
            >
              <i className="fa-solid fa-plus text-xl"></i>
            </button>
          </div>
        )}
      </div>
      
      <Navbar />
    </div>
  );
}