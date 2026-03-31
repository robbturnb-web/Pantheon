import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Telescope, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Observatory', path: '/' },
  { label: 'Timeline', path: '/timeline' },
  { label: 'UAP', path: '/uap' },
  { label: 'Gods', path: '/gods' },
  { label: 'Pyramids', path: '/pyramids' },
  { label: 'Consciousness', path: '/consciousness' },
  { label: 'Signals', path: '/signals' },
  { label: 'Community', path: '/community' },
  { label: 'Echo AI', path: '/echo' },
  { label: 'Profile', path: '/profile' },
  { label: 'Search', path: '/search' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'linear-gradient(to bottom, rgba(3,3,9,0.9) 0%, rgba(3,3,9,0) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <Telescope
              size={22}
              className="text-gold group-hover:text-gold-bright transition-colors"
              style={{ color: '#c9a84c' }}
            />
            <span
              className="font-semibold tracking-widest text-sm uppercase hidden sm:block"
              style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}
            >
              Pantheon
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="relative px-3 py-2 text-xs tracking-wider uppercase transition-colors"
                style={{
                  color: isActive(link.path) ? '#f5c842' : 'rgba(255,255,255,0.65)',
                  fontFamily: 'Cinzel, Georgia, serif',
                }}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-0 bottom-0 h-px"
                    style={{ background: '#c9a84c', boxShadow: '0 0 8px #c9a84c' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Search icon (desktop) */}
          <button
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded transition-all"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onClick={() => navigate('/search')}
            aria-label="Search"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c9a84c'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <Search size={16} />
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-gold transition-colors"
            style={{ color: mobileOpen ? '#c9a84c' : undefined }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden"
            style={{ background: 'rgba(3,3,9,0.97)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm tracking-wider uppercase rounded transition-colors"
                  style={{
                    color: isActive(link.path) ? '#f5c842' : 'rgba(255,255,255,0.7)',
                    background: isActive(link.path) ? 'rgba(201,168,76,0.08)' : 'transparent',
                    borderLeft: isActive(link.path) ? '2px solid #c9a84c' : '2px solid transparent',
                    fontFamily: 'Cinzel, Georgia, serif',
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
