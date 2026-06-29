import { motion } from 'framer-motion';
import {
  Code2, Palette, Video, Camera, Globe, Users, Lightbulb, TrendingUp, Layers, Megaphone,
} from 'lucide-react';

const skills = [
  { icon: Video, title: 'Montage & Production vidéo', desc: 'Captation, montage, étalonnage, motion design — du rush au rendu final.' },
  { icon: Code2, title: 'Développement Web', desc: 'HTML, CSS, JavaScript, React. Comprendre comment une page fonctionne change tout à la façon dont on la conçoit.' },
  { icon: Palette, title: 'Design & UX/UI', desc: 'Identité visuelle, hiérarchie, maquettes — penser l\'expérience avant l\'esthétique.' },
  { icon: Camera, title: 'Photo & Prise de vue', desc: 'Composition, lumière, cadrage. Un œil formé pour l\'image, que ce soit en vidéo ou en miniature.' },
  { icon: Globe, title: 'Culture numérique', desc: 'Comprendre les algorithmes, les plateformes, les tendances — savoir où et comment diffuser.' },
  { icon: Megaphone, title: 'Communication & Marketing', desc: 'Stratégie de contenu, storytelling, personal branding. Le fond autant que la forme.' },
  { icon: Layers, title: 'Gestion de projet', desc: 'Planification, brief, livrables, itération. Travailler seul ou en équipe de façon structurée.' },
  { icon: Users, title: 'Travail collaboratif', desc: 'Projets transversaux avec des profils différents : dev, design, comm. Apprendre à parler tous les langages.' },
];

const impacts = [
  { icon: Lightbulb, title: 'Un regard 360°', desc: 'Le MMI m\'a appris à voir un projet sous tous ses angles à la fois — le fond, la forme, la technique et l\'audience. Quand je monte une vidéo, je pense déjà à la miniature, au titre, à la diffusion.' },
  { icon: TrendingUp, title: 'Passer de zéro à tout faire soi-même', desc: 'Avant de déléguer, il faut comprendre. Le MMI m\'a donné les bases pour tout faire moi-même : tourner, monter, designer, publier. Ça donne une autonomie totale sur mes projets créatifs.' },
  { icon: Video, title: 'La vidéo comme métier, pas juste un hobby', desc: 'C\'est la formation qui m\'a structuré. J\'avais déjà l\'envie, le MMI m\'a donné les outils, le vocabulaire et la rigueur pour en faire quelque chose de professionnel.' },
  { icon: Globe, title: 'Comprendre Internet, pas juste l\'utiliser', desc: 'Savoir comment fonctionne un site, un algorithme, une campagne — ça change la manière dont tu crées du contenu. Tu ne postes plus au hasard, tu réfléchis à chaque décision.' },
];

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-24">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="space-y-6"
      >
        <p className="text-amber-500 text-xs font-semibold tracking-[0.22em] uppercase">
          Mon parcours
        </p>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
          D'où je viens,<br />
          <span className="text-amber-500">qui je suis.</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Je suis étudiant en{' '}
          <span className="text-white font-semibold">MMI — Métiers du Multimédia et de l'Internet</span>.
          Une formation qui touche à tout : vidéo, code, design, communication.
          C'est elle qui a transformé une passion en vrai savoir-faire.
        </p>
      </motion.div>

      {/* Compétences */}
      <section className="space-y-10">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Les compétences du MMI
          </h2>
          <p className="text-zinc-500">
            Ce que la formation m'a appris à maîtriser — et qui ressort dans chaque projet.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {skills.map((skill, i) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.title}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07 } as any}
                className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-amber-500/30 hover:bg-zinc-900 transition-all duration-300 cursor-default"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/18 transition-colors">
                  <Icon className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2 leading-snug">{skill.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{skill.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Impact */}
      <section className="space-y-10">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ce que ça m'a apporté
          </h2>
          <p className="text-zinc-500">
            Le MMI, c'est pas juste des cours. C'est une façon de voir les choses différemment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {impacts.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06 } as any}
                className="flex gap-5 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-300"
              >
                <div className="shrink-0 w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-amber-500" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-white leading-snug">{item.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="flex flex-wrap gap-3 pb-4"
      >
        <a
          href="/longs"
          className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-[1.03] shadow-lg shadow-amber-500/20"
        >
          Voir mes vidéos
        </a>
        <a
          href="mailto:alexandrenoury17@gmail.com"
          className="bg-white/[0.05] hover:bg-white/[0.08] text-white px-6 py-3 rounded-full font-semibold text-sm border border-white/[0.1] hover:border-white/[0.18] transition-all hover:scale-[1.03]"
        >
          Me contacter
        </a>
      </motion.div>

    </div>
  );
}
