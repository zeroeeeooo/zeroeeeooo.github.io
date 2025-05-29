import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import AlbumViewer from "@/components/AlbumViewer";

export type Photo = {
  id: string;
  url: string;
  title: string;
};

export type AlbumItem = {
  id: string;
  date: string;
  photos: Photo[];
};

export default function Album() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [viewingAlbumId, setViewingAlbumId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<{photoId: string, title: string} | null>(null);

  useEffect(() => {
    const storedAlbums = JSON.parse(localStorage.getItem('albums') || '[]');
    setAlbums(storedAlbums.sort((a: AlbumItem, b: AlbumItem) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length > 9) {
      toast.error('每次最多上传9张图片');
      return;
    }

    const newPhotos: Photo[] = [];
    const promises = Array.from(files).map(file => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newPhotos.push({
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            url: event.target?.result as string,
            title: file.name.split('.')[0]
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(() => {
      const today = new Date().toISOString().split('T')[0];
      const todayAlbumIndex = albums.findIndex(a => a.date === today);
      
      let updatedAlbums;
      if (todayAlbumIndex >= 0) {
        updatedAlbums = [...albums];
        updatedAlbums[todayAlbumIndex].photos = [...updatedAlbums[todayAlbumIndex].photos, ...newPhotos];
      } else {
        updatedAlbums = [{
          id: Date.now().toString(),
          date: today,
          photos: newPhotos
        }, ...albums];
      }
      
      setAlbums(updatedAlbums);
      localStorage.setItem('albums', JSON.stringify(updatedAlbums));
      toast.success(`已上传${newPhotos.length}张图片`);
    });
  };

  const handleEditTitle = (photoId: string, newTitle: string) => {
    const updatedAlbums = albums.map(album => ({
      ...album,
      photos: album.photos.map(photo => 
        photo.id === photoId ? {...photo, title: newTitle} : photo
      )
    }));
    
    setAlbums(updatedAlbums);
    localStorage.setItem('albums', JSON.stringify(updatedAlbums));
    setEditingTitle(null);
  };

  const handleViewPhoto = (albumId: string, photoIndex: number) => {
    setViewingAlbumId(albumId);
    setSelectedPhotoIndex(photoIndex);
  };

  const groupedByYear = albums.reduce((acc, album) => {
    const year = new Date(album.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(album);
    return acc;
  }, {} as Record<number, AlbumItem[]>);

  return (
    <div className="pb-20 min-h-screen bg-[#F5F5DC]">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-[#FFD1DC] mb-6">我的相册</h1>
        
        <div className="relative">
          {/* 时间轴线条 */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#FFD1DC]"></div>
          
          {Object.entries(groupedByYear).map(([year, yearAlbums]) => (
            <div key={year} className="relative pl-10 mb-8">
              {/* 年份标签 */}
              <div className="absolute left-0 w-8 h-8 rounded-full bg-[#FFD1DC] flex items-center justify-center text-white font-medium">
                {year}
              </div>
              
              {/* 该年份下的相册 */}
              {yearAlbums.map(album => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <div className="text-sm text-[#FFD1DC] mb-2">
                    {new Date(album.date).toLocaleDateString()}
                  </div>
                  
                  {/* 图片网格 */}
                  <div className="grid grid-cols-3 gap-2">
                    {album.photos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                        className="relative aspect-square"
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover rounded"
                          onClick={() => handleViewPhoto(album.id, index)}
                        />
                        
                        {editingTitle?.photoId === photo.id ? (
                          <input
                            type="text"
                            value={editingTitle.title}
                            onChange={(e) => setEditingTitle({...editingTitle, title: e.target.value})}
                            onBlur={() => handleEditTitle(photo.id, editingTitle.title)}
                            onKeyDown={(e) => e.key === 'Enter' && handleEditTitle(photo.id, editingTitle.title)}
                            className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-1 text-xs"
                            autoFocus
                          />
                        ) : (
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center bg-white bg-opacity-80 p-1">
                            <span 
                              className="text-xs truncate"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTitle({photoId: photo.id, title: photo.title});
                              }}
                            >
                              {photo.title}
                            </span>
                            <button
                              className="text-red-500 hover:text-red-700 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                const confirmDelete = confirm('确定要删除这张照片吗？');
                                if (confirmDelete) {
                                  const updatedAlbums = albums.map(album => ({
                                    ...album,
                                    photos: album.photos.filter(p => p.id !== photo.id)
                                  }));
                                  setAlbums(updatedAlbums.filter(a => a.photos.length > 0));
                                  localStorage.setItem('albums', JSON.stringify(updatedAlbums.filter(a => a.photos.length > 0)));
                                  toast.success('照片已删除');
                                }
                              }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        
        {/* 上传按钮 */}
        <label className="fixed bottom-24 right-6 w-12 h-12 bg-[#FFD1DC] text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer">
          <i className="fa-solid fa-plus text-xl"></i>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>
      
      <Navbar />
      
      {/* 全屏查看器 */}
      {viewingAlbumId && selectedPhotoIndex !== null && (
        <AlbumViewer
          album={albums.find(a => a.id === viewingAlbumId)!}
          initialIndex={selectedPhotoIndex}
          onClose={() => {
            setViewingAlbumId(null);
            setSelectedPhotoIndex(null);
          }}
        />
      )}
    </div>
  );
}
