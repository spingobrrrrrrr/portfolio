import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, Smartphone, Mail, ChevronDown } from "lucide-react";

const titleWords = ["Salut,", "moi", "c'est"];
const nameLetters = "weib !".split("");

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const wordVariant = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const letterVariant = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.55 + i * 0.07,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const subtitleVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.7, ease: "easeOut" } },
};

const buttonContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 1.5 } },
};

const buttonVariant = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center space-y-12 py-12">

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold tracking-widest uppercase"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        Portfolio Officiel
      </motion.div>

      {/* Titre */}
      <div className="perspective-1000">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-x-6 text-5xl md:text-8xl font-black tracking-tighter leading-none mb-2"
        >
          {titleWords.map((word) => (
            <motion.span key={word} variants={wordVariant} className="inline-block">
              {word}
            </motion.span>
          ))}
        </motion.div>

        <div
          className="flex justify-center text-5xl md:text-8xl font-black tracking-tighter leading-none"
          style={{ perspective: "600px" }}
        >
          {nameLetters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariant}
              initial="hidden"
              animate="visible"
              className={`inline-block ${letter === " " ? "w-4 md:w-6" : "text-blue-400 hover:text-blue-300 transition-colors cursor-default"}`}
              whileHover={letter !== " " ? { y: -6, transition: { duration: 0.2 } } : {}}
            >
              {letter === " " ? " " : letter}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Subtitle */}
      <motion.p
        variants={subtitleVariant}
        initial="hidden"
        animate="visible"
        className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
      >
        Je donne vie à vos idées à travers des montages percutants, des
        miniatures qui cliquent et des formats courts viraux.
      </motion.p>

      {/* Boutons */}
      <motion.div
        variants={buttonContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <motion.div variants={buttonVariant}>
          <Link
            to="/longs"
            className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            <PlayCircle className="w-5 h-5" />
            Vidéos Longues
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <motion.div variants={buttonVariant}>
          <Link
            to="/shorts"
            className="group flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-semibold border border-slate-700 hover:border-slate-500 transition-all hover:scale-105 shadow-lg"
          >
            <Smartphone className="w-5 h-5" />
            YouTube Shorts
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <motion.div variants={buttonVariant}>
          <a
            href="mailto:alexandrenoury17@gmail.com"
            className="group flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold border border-white/10 hover:border-white/20 transition-all hover:scale-105"
          >
            <Mail className="w-5 h-5" />
            Me contacter
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600 text-xs tracking-widest uppercase"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

    </div>
  );
}
