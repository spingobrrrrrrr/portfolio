import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
const Player = ReactPlayer as any;
import { getVideos, fetchChannelVideos, type Video } from '../lib/storage';
import { X, Play, BarChart3, Loader2 } from 'lucide-react';

export default function ShortVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      const manual = (await getVideos()).filter((v) => v.type === 'short');
      const auto = (await fetchChannelVideos()).filter((v) => v.type === 'short');
      const all = [...manual];
      auto.forEach((av) => {
        if (!all.some((mv) => mv.url === av.url)) all.push(av);
      });
      setVideos(all);
      setLoading(false);
    };
    loadVideos();
  }, []);

  return (
    <div className="space-y-10">

      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-amber-500 text-xs font-semibold tracking-[0.2em] uppercase">Portfolio</p>
          <h2 className="text-4xl font-bold tracking-tight">YouTube Shorts</h2>
        </div>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-amber-500 mb-1" />}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {videos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 transition-all duration-300 shadow-lg"
            onClick={() => setActiveVideo(video)}
          >
            <div className="relative aspect-[9/16] overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                <Play className="w-9 h-9 text-white fill-white drop-shadow-lg" />
              </div>
              {video.views && (
                <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[9px] font-bold text-white flex items-center gap-1 border border-white/[0.06]">
                  <BarChart3 className="w-2.5 h-2.5 text-amber-400" /> {video.views}
                </div>
              )}
              {video.isAuto && (
                <div className="absolute top-2.5 left-2.5 bg-amber-500/90 px-2 py-0.5 rounded text-[8px] font-black text-black uppercase tracking-wide">
                  LIVE
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug">{video.title}</h3>
              </div>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/96 p-4"
          >
            <div className="absolute top-6 right-6 md:right-10 flex items-center gap-3 z-50">
              {activeVideo.views && (
                <div className="bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800 flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span>{activeVideo.views} vues</span>
                </div>
              )}
              <button
                onClick={() => setActiveVideo(null)}
                className="text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 p-3 rounded-full border border-zinc-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full max-w-[380px] aspect-[9/16] bg-black rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              {/* @ts-ignore */}
              <Player url={activeVideo.url} width="100%" height="100%" controls playing />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && videos.length === 0 && (
        <div className="text-center py-24 text-zinc-600 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
          Aucun short trouvé.
        </div>
      )}
    </div>
  );
}
