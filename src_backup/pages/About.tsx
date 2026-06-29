import { motion } from "framer-motion";
import {
  Code2,
  Palette,
  Video,
  Camera,
  Globe,
  Users,
  Lightbulb,
  TrendingUp,
  Layers,
  Megaphone,
} from "lucide-react";

const skills = [
  {
    icon: Video,
    title: "Montage & Production vidéo",
    desc: "Captation, montage, étalonnage, motion design — du rush au rendu final.",
  },
  {
    icon: Code2,
    title: "Développement Web",
    desc: "HTML, CSS, JavaScript, React. Comprendre comment une page fonctionne change tout à la façon dont on la conçoit.",
  },
  {
    icon: Palette,
    title: "Design & UX/UI",
    desc: "Identité visuelle, hiérarchie, maquettes — penser l'expérience avant l'esthétique.",
  },
  {
    icon: Camera,
    title: "Photo & Prise de vue",
    desc: "Composition, lumière, cadrage. Un œil formé pour l'image, que ce soit en vidéo ou en miniature.",
  },
  {
    icon: Globe,
    title: "Culture numérique",
    desc: "Comprendre les algorithmes, les plateformes, les tendances — savoir où et comment diffuser.",
  },
  {
    icon: Megaphone,
    title: "Communication & Marketing",
    desc: "Stratégie de contenu, storytelling, personal branding. Le fond autant que la forme.",
  },
  {
    icon: Layers,
    title: "Gestion de projet",
    desc: "Planification, brief, livrables, itération. Travailler seul ou en équipe de façon structurée.",
  },
  {
    icon: Users,
    title: "Travail collaboratif",
    desc: "Projets transversaux avec des profils différents : dev, design, comm. Apprendre à parler tous les langages.",
  },
];

const impacts = [
  {
    icon: Lightbulb,
    title: "Un regard 360°",
    desc: "Le MMI m'a appris à voir un projet sous tous ses angles à la fois — le fond, la forme, la technique et l'audience. Quand je monte une vidéo, je pense déjà à la miniature, au titre, à la diffusion.",
  },
  {
    icon: TrendingUp,
    title: "Passer de zéro à tout faire soi-même",
    desc: "Avant de déléguer, il faut comprendre. Le MMI m'a donné les bases pour tout faire moi-même : tourner, monter, designer, publier. Ça donne une autonomie totale sur mes projets créatifs.",
  },
  {
    icon: Video,
    title: "La vidéo comme métier, pas juste un hobby",
    desc: "C'est la formation qui m'a structuré. J'avais déjà l'envie, le MMI m'a donné les outils, le vocabulaire et la rigueur pour en faire quelque chose de professionnel.",
  },
  {
    icon: Globe,
    title: "Comprendre Internet, pas juste l'utiliser",
    desc: "Savoir comment fonctionne un site, un algorithme, une campagne — ça change la manière dont tu crées du contenu. Tu ne postes plus au hasard, tu réfléchis à chaque décision.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-12 space-y-24">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="inline-block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-[length:200%_auto] bg-clip-text text-transparent"
        >
          <span className="text-lg font-bold tracking-widest uppercase">Mon parcours</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
          D'où je viens,<br />
          <span className="text-blue-400">qui je suis.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Je suis étudiant en <span className="text-white font-semibold">MMI — Métiers du Multimédia et de l'Internet</span>.
          Une formation qui touche à tout : vidéo, code, design, communication.
          C'est elle qui a transformé une passion en vrai savoir-faire.
        </p>
      </motion.div>

      {/* Compétences MMI */}
      <section className="space-y-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Les compétences du MMI
          </h2>
          <p className="text-slate-400 text-lg">
            Ce que la formation m'a appris à maîtriser — et qui ressort dans chaque projet.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.title}
                variants={itemVariants}
                className="group bg-slate-800/50 border border-slate-700 rounded-2xl p-5 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2 leading-snug">{skill.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{skill.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Impact sur ma vie */}
      <section className="space-y-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Ce que ça m'a apporté
          </h2>
          <p className="text-slate-400 text-lg">
            Le MMI, c'est pas juste des cours. C'est une façon de voir les choses différemment.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {impacts.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex gap-5 bg-slate-800/30 border border-slate-700/60 rounded-2xl p-6 hover:border-purple-500/40 hover:bg-slate-800/60 transition-all duration-300"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg leading-snug">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* CTA bas de page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 pb-4"
      >
        <p className="text-slate-400 text-lg">
          Tu veux voir le résultat concret de tout ça ?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/longs"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            Voir mes vidéos
          </a>
          <a
            href="mailto:alexandrenoury17@gmail.com"
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-semibold border border-slate-700 transition-all hover:scale-105"
          >
            Me contacter
          </a>
        </div>
      </motion.div>

    </div>
  );
}
