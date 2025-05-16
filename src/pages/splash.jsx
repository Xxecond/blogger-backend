import b from '../assets/BB.jpg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Splash = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      const delay = setTimeout(() => {
        navigate('/'); // redirect to root (Home page)
      }, 550); // wait for fade-out animation
      return () => clearTimeout(delay);
    }
  }, [showSplash, navigate]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff'
          }}
        >
          <img
            src={b}
            alt="Splash Logo"
            style={{ width: '200px', height: 'auto' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Splash;