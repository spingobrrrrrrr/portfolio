import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMiniatures, type Miniature } from '../lib/storage';
import { X, ZoomIn } from 'lucide-react';

export default function Miniatures() {
  const [miniatures, setMiniatures] = useState<Miniature[]>([]);
  const [selectedMinia, setSelectedMinia] = useState<Miniature | null>(null);

  useEffect(() => {
    getMiniatures().then(setMiniatures);
  }, []);

  return (
    <div className="space-y-10">

      <div className="space-y-1">
        <p className="text-amber-500 text-xs font-semibold tracking-[0.2em] uppercase">Portfolio</p>
        <h2 className="text-4xl font-bold tracking-tight">Miniatures & Design</h2>
        <p className="text-zinc-500 text-sm pt-1 max-w-xl">
          Galerie de mes meilleures créations graphiques et miniatures personnalisées.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {miniatures.map((minia, idx) => (
          <motion.div
            key={minia.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -6 }}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 transition-all duration-300 shadow-lg hover:shadow-amber-500/5"
            onClick={() => setSelectedMinia(minia)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={minia.url}
                alt={minia.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <ZoomIn className="w-9 h-9 text-white drop-shadow-lg" />
              </div>
            </div>
            <div className="px-4 py-3">
              <h3 className="text-sm font-semibold text-zinc-100">{minia.title}</h3>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/96 p-4 md:p-10"
            onClick={() => setSelectedMinia(null)}
          >
            <button className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 p-3 rounded-full border border-zinc-800 transition-all">
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedMinia.url}
              alt={selectedMinia.title}
              className="max-w-full max-h-full rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {miniatures.length === 0 && (
        <div className="text-center py-24 text-zinc-600 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
          Aucune miniature ajoutée. Rendez-vous dans l'administration.
        </div>
      )}
    </div>
  );
}
