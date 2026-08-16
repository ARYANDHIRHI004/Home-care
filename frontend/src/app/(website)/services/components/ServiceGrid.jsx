import React from 'react';
import { motion } from 'framer-motion';

export default function ServiceGrid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {children}
    </div>
  );
}
