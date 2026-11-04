import React from 'react';
import { motion } from 'framer-motion';

export const RevealOnScroll = ({
  children,
  delay = 0,
  duration = 0.6,
  y = 24,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
