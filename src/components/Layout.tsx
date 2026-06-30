import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/parcours', label: 'Parcours' },
    { path: '/longs', label: 'Vidéos' },
    { path: '/miniatures', label: 'Miniatures' },
    { path: '/shorts', label: 'Shorts' },
    { path: 'mailto:alexandrenoury17@gmail.com', label: 'Contact', isExternal: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      {/* Fond ambiant */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-8%] w-[650px] h-[650px] rounded-full bg-amber-500/[0.07] blur-[130px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/[0.04] blur-[110px]" />
        <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] rounded-full bg-zinc-700/[0.06] blur-[90px]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-zinc-950/75 backdrop-blur-xl" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-14">

            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors duration-200"
            >
              Alexandre Noury
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;

                if (item.isExternal) {
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors duration-200 rounded-lg"
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                      isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 -mr-1 text-zinc-500 hover:text-white transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="md:hidden relative border-t border-white/[0.06] bg-zinc-950/95 backdrop-blur-xl"
            >
              <div className="max-w-7xl mx-auto px-5 py-3 flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  if (item.isExternal) {
                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-white bg-white/[0.06] border border-white/[0.08]'
                          : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-10 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-zinc-600 text-sm">
            © {new Date().getFullYear()}{' '}
            <span className="text-amber-500 font-semibold">Alexandre Noury</span>
            {' '}- Monteur Vidéo & MiniaMaker
          </span>
          <a
            href="mailto:alexandrenoury17@gmail.com"
            className="text-zinc-600 hover:text-zinc-300 transition-colors text-sm"
          >
            alexandrenoury17@gmail.com
          </a>
        </div>
      </footer>

    </div>
  );
}
