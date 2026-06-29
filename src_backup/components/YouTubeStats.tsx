import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Youtube, Users, Video as VideoIcon, Eye, LogOut, TrendingUp, Download, CheckCircle2, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveVideo, getVideos } from '../lib/storage';

interface YouTubeData {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    customUrl: string;
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
  contentDetails: {
    relatedPlaylists: {
      uploads: string;
    };
  };
}

interface YTVideo {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  publishedAt: string;
  duration: string;
  type: 'long' | 'short';
  imported: boolean;
}

export default function YouTubeStats() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('yt_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [channelData, setChannelData] = useState<YouTubeData | null>(() => {
    const saved = localStorage.getItem('yt_channel');
    return saved ? JSON.parse(saved) : null;
  });
  const [videos, setVideos] = useState<YTVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.access_token && channelData) {
      fetchLatestVideos(user.access_token, channelData.contentDetails.relatedPlaylists.uploads);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setUser(tokenResponse);
      localStorage.setItem('yt_user', JSON.stringify(tokenResponse));
      fetchChannelData(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setError('Échec de la connexion Google');
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
  });

  const fetchChannelData = async (accessToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/channels',
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            mine: true,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        setChannelData(channel);
        localStorage.setItem('yt_channel', JSON.stringify(channel));
        fetchLatestVideos(accessToken, channel.contentDetails.relatedPlaylists.uploads);
      } else {
        setError('Aucune chaîne YouTube trouvée pour ce compte.');
      }
    } catch (err: any) {
      console.error('Error fetching YouTube data:', err);
      const message = err.response?.data?.error?.message || 'Erreur lors de la récupération des données YouTube.';
      setError(message);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestVideos = async (accessToken: string, uploadsPlaylistId: string) => {
    setLoadingVideos(true);
    try {
      // 1. Récupérer les 10 dernières vidéos de la playlist d'uploads
      const playlistResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/playlistItems',
        {
          params: {
            part: 'snippet,contentDetails',
            playlistId: uploadsPlaylistId,
            maxResults: 10,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const videoIds = playlistResponse.data.items.map((item: any) => item.contentDetails.videoId).join(',');

      // 2. Récupérer les stats, la durée et le statut pour chaque vidéo
      const videoDetailsResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'snippet,statistics,contentDetails,status',
            id: videoIds,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const existingVideos = await getVideos();
      
      const formattedVideos = videoDetailsResponse.data.items
        .filter((item: any) => item.status.privacyStatus === 'public')
        .map((item: any) => {
          const duration = item.contentDetails.duration;

          // Fonction pour convertir la durée ISO 8601 (ex: PT1M21S) en secondes
          const parseISO8601Duration = (isoDuration: string) => {
            const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (!matches) return 0;
            const hours = parseInt(matches[1] || '0');
            const minutes = parseInt(matches[2] || '0');
            const seconds = parseInt(matches[3] || '0');
            return hours * 3600 + minutes * 60 + seconds;
          };

          const totalSeconds = parseISO8601Duration(duration);
          const isShort = totalSeconds <= 60; // Un Short fait 60 secondes ou moins

          const videoUrl = `https://www.youtube.com/watch?v=${item.id}`;

        const alreadyImported = existingVideos.some(v => v.url === videoUrl);

        return {
          id: item.id,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url,
          views: item.statistics.viewCount,
          publishedAt: item.snippet.publishedAt,
          duration: duration,
          type: isShort ? 'short' : 'long',
          imported: alreadyImported,
        };
      });

      setVideos(formattedVideos);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleImport = (video: YTVideo) => {
    saveVideo({
      title: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnail: video.thumbnail,
      type: video.type,
      views: formatNumberShort(video.views),
    });

    setVideos(prev => prev.map(v => v.id === video.id ? { ...v, imported: true } : v));
  };

  const logout = () => {
    setUser(null);
    setChannelData(null);
    setVideos([]);
    localStorage.removeItem('yt_user');
    localStorage.removeItem('yt_channel');
  };

  const formatNumber = (num: string) => {
    return new Intl.NumberFormat('fr-FR').format(parseInt(num));
  };

  const formatNumberShort = (num: string) => {
    const val = parseInt(num);
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
    return num;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      <AnimatePresence mode="wait">
        {!channelData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl text-center shadow-2xl"
          >
            <div className="bg-red-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Connexion YouTube Creator</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Accède à tes statistiques en direct et importe tes dernières vidéos directement dans ton portfolio en un clic.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => login()}
                disabled={loading}
                className="group flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold transition-all hover:scale-105 hover:bg-slate-100 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    />
                  </svg>
                )}
                {loading ? 'Connexion...' : 'Se connecter avec Google'}
              </button>
            </div>
            {error && <p className="mt-4 text-red-400 text-sm font-medium">{error}</p>}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Header avec Stats */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <img
                    src={channelData.snippet.thumbnails.medium.url}
                    alt={channelData.snippet.title}
                    referrerPolicy="no-referrer"
                    className="relative w-20 h-20 rounded-full border-2 border-slate-700 shadow-xl"
                  />
                  <div className="absolute bottom-0 right-0 bg-red-600 p-1 rounded-full border-2 border-slate-800">
                    <Youtube className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-black text-white mb-0.5 flex items-center gap-2 justify-center md:justify-start">
                    {channelData.snippet.title}
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">@{channelData.snippet.customUrl?.replace('@', '') || 'YouTube'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center justify-center group hover:border-blue-500/50 transition-colors">
                  <Users className="w-5 h-5 text-blue-400 mb-2" />
                  <span className="text-xl font-black text-white">{formatNumber(channelData.statistics.subscriberCount)}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-1">Abonnés</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center justify-center group hover:border-purple-500/50 transition-colors">
                  <Eye className="w-5 h-5 text-purple-400 mb-2" />
                  <span className="text-xl font-black text-white">{formatNumber(channelData.statistics.viewCount)}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-1">Vues</span>
                </div>
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center justify-center group hover:border-pink-500/50 transition-colors">
                  <VideoIcon className="w-5 h-5 text-pink-400 mb-2" />
                  <span className="text-xl font-black text-white">{formatNumber(channelData.statistics.videoCount)}</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mt-1">Vidéos</span>
                </div>
              </div>
            </div>

            {/* Liste des dernières vidéos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-red-500" />
                  Tes dernières vidéos
                </h3>
                {loadingVideos && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-4 group hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className={`w-24 h-14 object-cover rounded-lg border border-slate-700 ${video.type === 'short' ? 'aspect-[9/16] w-10 h-16' : ''}`}
                      />
                      {video.type === 'short' && (
                        <div className="absolute top-1 right-1 bg-red-600 rounded px-1 text-[8px] font-bold text-white">
                          SHORT
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-bold text-slate-200 truncate pr-4">{video.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        {formatNumber(video.views)} vues • {new Date(video.publishedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <button
                      onClick={() => !video.imported && handleImport(video)}
                      disabled={video.imported}
                      className={`p-2.5 rounded-xl transition-all ${
                        video.imported 
                        ? 'bg-green-500/10 text-green-500' 
                        : 'bg-blue-600 text-white hover:scale-105 active:scale-95'
                      }`}
                      title={video.imported ? 'Déjà importé' : 'Importer dans le portfolio'}
                    >
                      {video.imported ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {videos.length === 0 && !loadingVideos && (
                <div className="text-center py-10 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                  <p className="text-slate-500 text-sm">Chargement de tes vidéos...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
