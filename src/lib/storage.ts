import { supabase } from './supabase';

export type Video = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  views?: string;
  type: 'long' | 'short';
  isAuto?: boolean;
};

export type Miniature = {
  id: string;
  title: string;
  url: string;
};

export const getApiKey = () => localStorage.getItem('yt-api-key') || '';
export const saveApiKey = (key: string) => localStorage.setItem('yt-api-key', key);

export const getChannelId = () => localStorage.getItem('yt-channel-id') || '';
export const saveChannelId = (id: string) => localStorage.setItem('yt-channel-id', id);

const formatViews = (views: string) => {
  const num = parseInt(views);
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return views;
};

// Fonctions vidéos avec Supabase
export const getVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
  return data || [];
};

export const saveVideo = async (video: Omit<Video, 'id'>) => {
  const { data, error } = await supabase
    .from('videos')
    .insert([video])
    .select();
  
  if (error) console.error('Error saving video:', error);
  return data;
};

export const updateVideo = async (updatedVideo: Video) => {
  const { error } = await supabase
    .from('videos')
    .update({ 
      title: updatedVideo.title, 
      views: updatedVideo.views,
      thumbnail: updatedVideo.thumbnail,
      url: updatedVideo.url,
      type: updatedVideo.type
    })
    .eq('id', updatedVideo.id);
  
  if (error) console.error('Error updating video:', error);
};

export const deleteVideo = async (id: string) => {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Error deleting video:', error);
};

// Fonctions miniatures avec Supabase
export const uploadImage = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('miniatures')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('miniatures')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const fetchChannelVideos = async (): Promise<Video[]> => {
  const apiKey = getApiKey();
  const channelId = getChannelId();
  if (!apiKey || !channelId) return [];

  try {
    const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=contentDetails&key=${apiKey}`);
    const channelData = await channelRes.json();
    if (!channelData.items?.length) return [];
    
    const uploadsId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
    const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${uploadsId}&part=contentDetails&maxResults=50&key=${apiKey}`);
    const playlistData = await playlistRes.json();
    if (!playlistData.items?.length) return [];

    const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');
    const detailsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&part=snippet,statistics,contentDetails&key=${apiKey}`);
    const detailsData = await detailsRes.json();

    return (detailsData.items || []).map((item: any) => {
      const duration = item.contentDetails.duration;
      const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = parseInt(matches?.[1] || '0');
      const minutes = parseInt(matches?.[2] || '0');
      const seconds = parseInt(matches?.[3] || '0');
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      return {
        id: item.id,
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        views: formatViews(item.statistics.viewCount),
        type: totalSeconds <= 60 ? 'short' : 'long',
        isAuto: true
      };
    });
  } catch (err) {
    console.error('Error fetching channel videos:', err);
    return [];
  }
};

export const getMiniatures = async (): Promise<Miniature[]> => {
  const { data, error } = await supabase
    .from('miniatures')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching miniatures:', error);
    return [];
  }
  return data || [];
};

export const saveMiniature = async (minia: Omit<Miniature, 'id'>) => {
  const { data, error } = await supabase
    .from('miniatures')
    .insert([minia])
    .select();
  
  if (error) console.error('Error saving miniature:', error);
  return data;
};

export const updateMiniature = async (updatedMinia: Miniature) => {
  const { error } = await supabase
    .from('miniatures')
    .update({ title: updatedMinia.title, url: updatedMinia.url })
    .eq('id', updatedMinia.id);
  
  if (error) console.error('Error updating miniature:', error);
};

export const deleteMiniature = async (id: string) => {
  const { error } = await supabase
    .from('miniatures')
    .delete()
    .eq('id', id);
  
  if (error) console.error('Error deleting miniature:', error);
};

export const fetchYoutubeMetadata = async (url: string) => {
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYoutubeId(url);
  if (!ytId) return null;
  const apiKey = getApiKey();

  try {
    if (apiKey) {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${ytId}&part=snippet,statistics&key=${apiKey}`);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        return {
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url,
          views: formatViews(item.statistics.viewCount)
        };
      }
    }
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`);
    const data = await response.json();
    return { title: data.title, thumbnail: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`, views: '' };
  } catch (error) { return null; }
};
