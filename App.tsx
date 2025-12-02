import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Zap, Trash2, RefreshCw } from 'lucide-react';
import { Message } from './components/Message';
import { TypingIndicator } from './components/TypingIndicator';
import { ParticleBackground } from './components/ParticleBackground';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
}

const botResponses = [
  "I'm processing your request through quantum neural networks...",
  "Analyzing data streams across multiple dimensions...",
  "Fascinating question! Let me access the knowledge matrix...",
  "I've scanned 847 terabytes of data to find the answer...",
  "Initializing response protocols from the cloud consciousness...",
  "Your inquiry has been received and processed through AI cores...",
  "Interesting! I'm synthesizing information from parallel universes...",
  "Computing optimal response using advanced algorithms...",
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Greetings, human. I am your AI assistant from the future. How may I assist you today?',
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: 'Chat cleared. How can I help you?',
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const resetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        content: 'System rebooted. Ready to assist you again!',
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl h-[90vh] bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 flex flex-col relative z-10 overflow-hidden"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="px-6 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(6, 182, 212, 0.5)',
                    '0 0 40px rgba(6, 182, 212, 0.8)',
                    '0 0 20px rgba(6, 182, 212, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center cursor-pointer"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-cyan-100 text-xl font-bold">NEXUS AI Assistant</h1>
                <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50"
                  />
                  <span>Online • Neural Network Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetChat}
                className="p-2 rounded-lg bg-slate-800/50 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                title="Reset chat"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearChat}
                className="p-2 rounded-lg bg-slate-800/50 text-red-400 hover:bg-red-500/20 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-cyan-400"
              >
                <Zap className="w-6 h-6" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <Message
                key={message.id}
                content={message.content}
                isBot={message.isBot}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator key="typing" />}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="px-6 py-4 border-t border-cyan-500/20 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm"
        >
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message to the AI..."
                rows={1}
                className="w-full px-4 py-3 bg-slate-800/60 border border-cyan-500/30 rounded-2xl text-cyan-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 resize-none backdrop-blur-sm transition-all text-sm font-normal"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group font-semibold text-sm"
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Send className="w-5 h-5" />
              </motion.div>
              <span>Send</span>
            </motion.button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs font-medium text-slate-600"
            >
              {isTyping ? 'AI is thinking...' : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}