import { useState, useEffect } from 'react';
import { Trash2, Plus, Film, Image as ImageIcon, Loader2, Edit2, Check, X, Lock, Upload } from 'lucide-react';
import { getVideos, saveVideo, deleteVideo, updateVideo, getMiniatures, saveMiniature, deleteMiniature, updateMiniature, fetchYoutubeMetadata, getApiKey, getChannelId, uploadImage, type Video, type Miniature } from '../lib/storage';
import { supabase } from '../lib/supabase';
import YouTubeStats from '../components/YouTubeStats';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading_auth, setLoadingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [videos, setVideos] = useState<Video[]>([]);
  const [miniatures, setMiniatures] = useState<Miniature[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [, setChannelId] = useState('');
  
  // États pour l'édition
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', views: '' });

  const [editingMinia, setEditingMinia] = useState<string | null>(null);
  const [editMiniaForm, setEditMiniaForm] = useState({ title: '', url: '' });
  
  const [videoForm, setVideoForm] = useState({ url: '', type: 'long' as 'long'|'short', views: '' });
  const [miniaForm, setMiniaForm] = useState({ title: '', url: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const refreshData = async () => {
    const [vids, mins] = await Promise.all([getVideos(), getMiniatures()]);
    setVideos(vids);
    setMiniatures(mins);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
      setLoadingAuth(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      refreshData();
      setApiKey(getApiKey());
      setChannelId(getChannelId());
    }
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(false);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (error) throw error;
      // isAdmin sera mis à jour via onAuthStateChange
    } catch (err: any) {
      console.error('Login error:', err.message);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading_auth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-2">Accès Restreint</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">
            Veuillez vous connecter pour accéder à l'interface d'administration.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Adresse mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-900 border ${loginError ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors`}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-slate-900 border ${loginError ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors`}
                required
              />
              {loginError && (
                <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                  Accès refusé. Identifiants incorrects.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white transition-all transform active:scale-95"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.url) return;
    setLoading(true);
    const metadata = await fetchYoutubeMetadata(videoForm.url);
    if (metadata) {
      await saveVideo({
        title: metadata.title,
        url: videoForm.url,
        thumbnail: metadata.thumbnail,
        type: videoForm.type,
        views: metadata.views || videoForm.views
      });
      await refreshData();
      setVideoForm({ url: '', type: 'long', views: '' });
    }
    setLoading(false);
  };

  const handleMiniaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniaForm.title) return;
    
    setUploading(true);
    let imageUrl = miniaForm.url;

    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    if (!imageUrl) {
      setUploading(false);
      return;
    }

    await saveMiniature({ title: miniaForm.title, url: imageUrl });
    await refreshData();
    setMiniaForm({ title: '', url: '' });
    setSelectedFile(null);
    setUploading(false);
  };

  // Fonctions d'édition
  const startEditing = (video: Video) => {
    setEditingVideo(video.id);
    setEditForm({ title: video.title, views: video.views || '' });
  };

  const cancelEditing = () => {
    setEditingVideo(null);
    setEditForm({ title: '', views: '' });
  };

  const handleUpdateVideo = async (id: string) => {
    const video = videos.find(v => v.id === id);
    if (video) {
      await updateVideo({ ...video, title: editForm.title, views: editForm.views });
      await refreshData();
      cancelEditing();
    }
  };

  const startEditingMinia = (minia: Miniature) => {
    setEditingMinia(minia.id);
    setEditMiniaForm({ title: minia.title, url: minia.url });
  };

  const cancelEditingMinia = () => {
    setEditingMinia(null);
    setEditMiniaForm({ title: '', url: '' });
  };

  const handleUpdateMinia = async (id: string) => {
    const minia = miniatures.find(m => m.id === id);
    if (minia) {
      await updateMiniature({ ...minia, title: editMiniaForm.title, url: editMiniaForm.url });
      await refreshData();
      cancelEditingMinia();
    }
  };

  const handleDeleteVideo = async (id: string) => {
    await deleteVideo(id);
    await refreshData();
  };

  const handleDeleteMinia = async (id: string) => {
    await deleteMiniature(id);
    await refreshData();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleLogout}
          className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <X className="w-4 h-4" /> Déconnexion Admin
        </button>
      </div>
      <YouTubeStats />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black mb-2 tracking-tight">Espace Admin</h2>
          <p className="text-slate-400">Gérez vos contenus et l'automatisation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400"><Film className="w-5 h-5" /> Ajouter Manuellement</h3>
            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <input 
                type="url" 
                placeholder="Lien YouTube (Autre chaîne ou spécifique)..."
                value={videoForm.url}
                onChange={e => setVideoForm({...videoForm, url: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                required
              />
              <div className="flex gap-4">
                <select 
                  value={videoForm.type}
                  onChange={e => setVideoForm({...videoForm, type: e.target.value as any})}
                  className="flex-grow bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                >
                  <option value="long">Vidéo Longue (16:9)</option>
                  <option value="short">YouTube Short (9:16)</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Vues"
                  value={videoForm.views}
                  onChange={e => setVideoForm({...videoForm, views: e.target.value})}
                  className="w-1/3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                  disabled={apiKey.length > 0}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Plus />} {loading ? 'Sync...' : 'Ajouter Vidéo'}
              </button>
            </form>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-slate-300 px-1 text-sm">Vidéos publiées</h4>
            <div className="grid grid-cols-1 gap-3">
              {videos.length === 0 ? (
                <p className="text-slate-500 text-xs italic px-1">Aucune vidéo.</p>
              ) : (
                videos.map(v => (
                  <div key={v.id} className="group bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-all">
                    {editingVideo === v.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                          placeholder="Titre de la vidéo"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editForm.views}
                            onChange={e => setEditForm({ ...editForm, views: e.target.value })}
                            className="flex-grow bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                            placeholder="Nombre de vues (ex: 1.2M)"
                          />
                          <button
                            onClick={() => handleUpdateVideo(v.id)}
                            className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <img src={v.thumbnail} className="w-20 h-12 object-cover rounded-lg flex-shrink-0" />
                          <div className="min-w-0">
                            <h5 className="text-sm font-bold text-slate-200 truncate">{v.title}</h5>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-0.5">
                              {v.views || '0'} vues • {v.type === 'long' ? 'Vidéo' : 'Short'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditing(v)}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(v.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-purple-400"><ImageIcon className="w-5 h-5" /> Ajouter Miniature</h3>
            <form onSubmit={handleMiniaSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Nom du projet"
                value={miniaForm.title}
                onChange={e => setMiniaForm({...miniaForm, title: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                required
              />
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Image (Fichier ou URL)</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 min-w-0">
                    <input 
                      type="file" 
                      onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                    <div className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      <span className="truncate">{selectedFile ? selectedFile.name : 'Choisir un fichier...'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-slate-600 font-bold">OU</div>
                  <input 
                    type="text" 
                    placeholder="Lien URL..."
                    value={miniaForm.url}
                    onChange={e => setMiniaForm({...miniaForm, url: e.target.value})}
                    className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                    disabled={!!selectedFile}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={uploading} 
                className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? <Loader2 className="animate-spin" /> : <Plus />}
                {uploading ? 'Envoi en cours...' : 'Ajouter Miniature'}
              </button>
            </form>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {miniatures.map(m => (
              <div key={m.id} className="group bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all">
                {editingMinia === m.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editMiniaForm.title}
                      onChange={e => setEditMiniaForm({ ...editMiniaForm, title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                      placeholder="Nom du projet"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editMiniaForm.url}
                        onChange={e => setEditMiniaForm({ ...editMiniaForm, url: e.target.value })}
                        className="flex-grow bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                        placeholder="Lien de l'image"
                      />
                      <button
                        onClick={() => handleUpdateMinia(m.id)}
                        className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditingMinia}
                        className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <img src={m.url} className="w-16 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div className="min-w-0">
                        <h5 className="text-sm font-bold text-slate-200 truncate">{m.title}</h5>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{m.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditingMinia(m)}
                        className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMinia(m.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
