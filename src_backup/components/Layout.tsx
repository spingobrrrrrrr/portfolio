import { Outlet, Link, useLocation } from 'react-router-dom';
import { Film, MonitorPlay, Home, Image as ImageIcon, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/parcours', label: 'Mon parcours', icon: User },
    { path: '/longs', label: 'Vidéos', icon: MonitorPlay },
    { path: '/miniatures', label: 'Miniatures', icon: ImageIcon },
    { path: '/shorts', label: 'Shorts', icon: Film },
    { path: 'mailto:alexandrenoury17@gmail.com', label: 'Contact', icon: Mail, isExternal: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      {/* Orbes de fond */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, 15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-500/25 blur-[80px]"
        />
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] left-[-8%] w-[550px] h-[550px] rounded-full bg-purple-500/20 blur-[80px]"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[30%] w-[350px] h-[350px] rounded-full bg-pink-500/15 blur-[70px]"
        />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5">
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link
              to="/"
              className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity py-1 px-1 leading-none"
            >
              weib
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                if (item.isExternal) {
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="relative border-t border-white/5 py-10 text-center text-slate-600 text-sm">
        <div className="space-y-2">
          <p className="text-slate-500">
            © {new Date().getFullYear()}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              weib
            </span>
            {' '}— Créateur de contenu & Monteur Vidéo.
          </p>
          <a
            href="mailto:alexandrenoury17@gmail.com"
            className="text-blue-400/70 hover:text-blue-400 transition-colors hover:underline"
          >
            alexandrenoury17@gmail.com
          </a>
        </div>
      </footer>

    </div>
  );
}
