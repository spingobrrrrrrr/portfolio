import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMiniatures, type Miniature } from '../lib/storage';
import { X, ZoomIn } from 'lucide-react';

export default function Miniatures() {
  const [miniatures, setMiniatures] = useState<Miniature[]>([]);
  const [selectedMinia, setSelectedMinia] = useState<Miniature | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setMiniatures(await getMiniatures());
    };
    loadData();
  }, []);

  return (
    <div className="space-y-12">
      <div className="text-center md:text-left">
        <h2 className="text-4xl font-black mb-4 tracking-tight">Miniatures & Design</h2>
        <p className="text-slate-400 max-w-2xl">Galerie de mes meilleures créations graphiques et miniatures personnalisées.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {miniatures.map((minia, idx) => (
          <motion.div
            key={minia.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -10 }}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all shadow-xl"
            onClick={() => setSelectedMinia(minia)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={minia.url} 
                alt={minia.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <ZoomIn className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-100">{minia.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedMinia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8"
            onClick={() => setSelectedMinia(null)}
          >
            <button className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800 p-3 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedMinia.url} 
              alt={selectedMinia.title}
              className="max-w-full max-h-full rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {miniatures.length === 0 && (
        <div className="text-center py-20 text-slate-500 bg-slate-800/30 rounded-3xl border border-slate-800 dashed">
          Aucune miniature ajoutée. Rendez-vous dans l'administration.
        </div>
      )}
    </div>
  );
}
