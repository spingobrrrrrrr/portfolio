import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
const Player = ReactPlayer as any;
import { getVideos, fetchChannelVideos, type Video } from '../lib/storage';
import { X, Play, BarChart3, Loader2 } from 'lucide-react';

export default function LongVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      const manual = (await getVideos()).filter(v => v.type === 'long');
      const auto = (await fetchChannelVideos()).filter(v => v.type === 'long');
      
      // Fusionner et éviter les doublons par URL
      const all = [...manual];
      auto.forEach(av => {
        if (!all.some(mv => mv.url === av.url)) all.push(av);
      });
      
      setVideos(all);
      setLoading(false);
    };
    loadVideos();
  }, []);

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Vidéos Longues</h2>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500 transition-colors shadow-lg"
            onClick={() => setActiveVideo(video)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-blue-500 p-4 rounded-full shadow-lg shadow-blue-500/50">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
              {video.views && (
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                  <BarChart3 className="w-3 h-3" /> {video.views}
                </div>
              )}
              {video.isAuto && (
                <div className="absolute top-2 left-2 bg-blue-500/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-tighter">
                  LIVE YOUTUBE
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-100 line-clamp-2">{video.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12"
          >
            <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
              {activeVideo.views && (
                <div className="bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 flex items-center gap-2 text-blue-400 font-bold">
                  <BarChart3 className="w-4 h-4" />
                  <span>{activeVideo.views} vues</span>
                </div>
              )}
              <button onClick={() => setActiveVideo(null)} className="text-slate-400 hover:text-white bg-slate-800 p-3 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-800">
              {/* @ts-ignore */}
              <Player url={activeVideo.url} width="100%" height="100%" controls playing />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!loading && videos.length === 0 && (
        <div className="text-center py-20 text-slate-500 bg-slate-800/50 rounded-2xl border border-slate-800 border-dashed">
          Aucune vidéo trouvée.
        </div>
      )}
    </div>
  );
}
