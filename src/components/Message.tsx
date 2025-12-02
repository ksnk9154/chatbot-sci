import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { forwardRef } from 'react';

interface MessageProps {
  content: string;
  isBot: boolean;
  timestamp: string;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ content, isBot, timestamp }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
      >
        {isBot && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/50"
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
        )}
        
        <div className={`flex flex-col gap-1 max-w-[70%] ${!isBot && 'items-end'}`}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.3 }}
            className={`px-4 py-3 rounded-2xl ${
              isBot
                ? 'bg-linear-to-br from-slate-800/80 to-slate-900/80 text-cyan-100 border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
                : 'bg-linear-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
            } backdrop-blur-sm cursor-pointer`}
          >
            <p className="leading-relaxed text-sm font-normal">{content}</p>
          </motion.div>
          <span className="text-xs font-medium text-slate-500 px-2">{timestamp}</span>
        </div>

        {!isBot && (
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50"
          >
            <User className="w-5 h-5 text-white" />
          </motion.div>
        )}
      </motion.div>
    );
  }
);

Message.displayName = 'Message';
