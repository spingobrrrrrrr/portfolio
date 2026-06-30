import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PlayCircle,
  Smartphone,
  Mail,
  MonitorPlay,
  Image as ImageIcon,
  Film,
} from "lucide-react";

const nameLetters = "Alexandre Noury.".split("");

const letterVariant = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.3 + i * 0.08,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const marqueeItems = [
  "Montage Long",
  "YouTube Shorts",
  "Miniatures",
  "Motion Design",
  "Storytelling",
  "Montage Long",
  "YouTube Shorts",
  "Miniatures",
  "Motion Design",
  "Storytelling",
];

const cards = [
  {
    to: "/longs",
    label: "Vidéos longues",
    desc: "Montage narratif, étalonnage, rendu final.",
    Icon: MonitorPlay,
  },
  {
    to: "/miniatures",
    label: "Miniatures",
    desc: "Design graphique, thumbnails YouTube qui convertissent.",
    Icon: ImageIcon,
  },
  {
    to: "/shorts",
    label: "Shorts",
    desc: "Formats courts viraux, reels, édits dynamiques.",
    Icon: Film,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero */}
      <div className="space-y-8 max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-amber-500 text-xs font-semibold tracking-[0.22em] uppercase"
        >
          Monteur Vidéo & MiniaMaker
        </motion.p>

        <div style={{ perspective: "700px" }} className="overflow-visible">
          <div className="flex items-end gap-[0.02em] leading-[0.85] text-[clamp(5rem,13vw,9rem)] font-bold tracking-tighter">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariant}
                initial="hidden"
                animate="visible"
                className={`inline-block select-none ${
                  letter === "."
                    ? "text-amber-500"
                    : "text-white hover:text-zinc-200 transition-colors cursor-default"
                }`}
                whileHover={
                  letter !== "." ? { y: -8, transition: { duration: 0.2 } } : {}
                }
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.75, ease: "easeOut" }}
          className="text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed"
        >
          Je transforme tes idées en vidéos qui captivent. Montage percutant,
          miniatures qui convertissent, formats courts viraux.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
          className="flex flex-wrap gap-3"
        >
          <Link
            to="/longs"
            className="group flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-[1.03] shadow-lg shadow-amber-500/20"
          >
            <PlayCircle className="w-4 h-4" />
            Voir les vidéos
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/shorts"
            className="group flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] text-white px-6 py-3 rounded-full font-semibold text-sm border border-white/[0.1] hover:border-white/[0.18] transition-all duration-200 hover:scale-[1.03]"
          >
            <Smartphone className="w-4 h-4" />
            Shorts
          </Link>
          <a
            href="mailto:alexandrenoury17@gmail.com"
            className="group flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.08] text-white px-6 py-3 rounded-full font-semibold text-sm border border-white/[0.1] hover:border-white/[0.18] transition-all duration-200 hover:scale-[1.03]"
          >
            <Mail className="w-4 h-4" />
            Contact
          </a>
        </motion.div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="overflow-hidden border-y border-white/[0.05] py-4 -mx-5 sm:-mx-8 lg:-mx-10"
      >
        <div className="flex whitespace-nowrap marquee-track">
          {marqueeItems.concat(marqueeItems).map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-5 px-6 text-[11px] font-semibold text-zinc-600 uppercase tracking-[0.18em]"
            >
              {item}
              <span className="w-1 h-1 rounded-full bg-amber-500/50 flex-shrink-0" />
            </span>
          ))}
        </div>
      </motion.div>

      {/* Cartes de navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {cards.map(({ to, label, desc, Icon }) => (
          <Link
            key={to}
            to={to}
            className="group relative p-6 rounded-2xl border border-white/[0.07] hover:border-amber-500/25 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/18 transition-colors">
              <Icon className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-semibold text-white text-sm mb-1.5">{label}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            <ArrowRight className="absolute top-6 right-6 w-4 h-4 text-zinc-700 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all duration-200" />
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
