import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { forwardRef } from 'react';

export const TypingIndicator = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-3 justify-start"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
        <Bot className="w-5 h-5 text-white" />
      </div>
      
      <div className="px-4 py-3 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-500/30 shadow-lg shadow-cyan-500/20 backdrop-blur-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';
