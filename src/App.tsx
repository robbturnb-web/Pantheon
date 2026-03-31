import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import StarfieldCanvas from './components/layout/StarfieldCanvas';
import CosmicCursor from './components/layout/CosmicCursor';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EchoAI from './components/echo/EchoAI';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import UAPPage from './pages/UAPPage';
import GodsPage from './pages/GodsPage';
import PyramidsPage from './pages/PyramidsPage';
import ConsciousnessPage from './pages/ConsciousnessPage';
import SignalsPage from './pages/SignalsPage';
import CommunityPage from './pages/CommunityPage';
import EchoAIPage from './pages/EchoAIPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import TransmissionPage from './pages/TransmissionPage';
import ConsciousnessWebPage from './pages/ConsciousnessWebPage';
import SoundChamberPage from './pages/SoundChamberPage';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const pageTransition = {
  duration: 0.4,
  ease: 'easeInOut' as const,
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/uap" element={<UAPPage />} />
          <Route path="/gods" element={<GodsPage />} />
          <Route path="/pyramids" element={<PyramidsPage />} />
          <Route path="/consciousness" element={<ConsciousnessPage />} />
          <Route path="/signals" element={<SignalsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/echo" element={<EchoAIPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/transmission" element={<TransmissionPage />} />
          <Route path="/web" element={<ConsciousnessWebPage />} />
          <Route path="/sound" element={<SoundChamberPage />} />
        </Routes>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StarfieldCanvas />
      <CosmicCursor />
      <Navbar />
      <AnimatedRoutes />
      <EchoAI />
    </BrowserRouter>
  );
}
