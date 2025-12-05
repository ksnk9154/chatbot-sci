
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Zap, Trash2, RefreshCw, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Message } from './components/Message';
import { TypingIndicator } from './components/TypingIndicator';
import { askBackend, BackendResult } from './api';

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  backendResults?: BackendResult[];
  usedContext?: boolean;
}



function formatResultsAsMessage(results: BackendResult[]) {
  if (!results || results.length === 0) return "Sorry — I couldn't find a good match.";
  return `Found ${results.length} relevant result${results.length !== 1 ? 's' : ''}. See details below.`;
}

// SearchResult component for displaying individual results with actions
function SearchResult({ result, index }: { result: BackendResult; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const scorePct = (result.score * 100).toFixed(1);
  const displayText = isExpanded ? result.text : (result.text.length > 200 ? result.text.slice(0, 200).trim() + "…" : result.text);


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/20 mb-3"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-semibold">#{index + 1}</span>
          <span className="text-green-400 text-sm">Score: {scorePct}%</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyToClipboard}
            className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition-colors"
            title="Copy snippet"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          {result.text.length > 200 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>
          )}
        </div>
      </div>
      <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{displayText}</p>
      {copied && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="mt-2 text-green-400 text-xs"
        >
          Copied to clipboard!
        </motion.div>
      )}
    </motion.div>
  );
}

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
  const [error, setError] = useState<string | null>(null);
  const contextLength = 2; // Number of previous messages to include
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    // Clear any previous errors
    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    // Build context from recent messages for better search
    const recentMessages = messages.slice(-contextLength * 2); // Get last N pairs of messages
    const contextParts = recentMessages
      .filter(msg => !msg.isBot)
      .map(msg => msg.content)
      .slice(-contextLength); // Keep only last N user messages

    const contextQuery = contextParts.length > 0
      ? `${contextParts.join(' ')} ${inputValue}`.trim()
      : inputValue;
    const hasContext = contextQuery !== inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const resp = await askBackend(contextQuery, 3);
      const botText = formatResultsAsMessage(resp.results);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botText,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        backendResults: resp.results,
        usedContext: hasContext,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Backend call failed:", err);
      const errorMessage = err?.message ?? "Unknown error";
      setError(`Backend connection failed: ${errorMessage}`);
      const errMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Sorry — could not reach the backend. Make sure the TF-IDF server is running and CORS is enabled.`,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsTyping(false);
    }
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
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.3) contrast(0.8)' }}
      >
        <source src="/background.webm" type="video/webm" />
      </video>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-white/70 hover:text-white ml-2"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl z-5" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-5" />
      
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
          className="px-6 py-4 border-b border-cyan-500/20 bg-linear-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm"
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
                className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center cursor-pointer"
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
              <div key={message.id}>
                <Message
                  content={message.content}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                />
                {message.isBot && message.backendResults && message.backendResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-2"
                  >
                    {message.backendResults.map((result, index) => (
                      <SearchResult key={`${message.id}-result-${index}`} result={result} index={index} />
                    ))}
                  </motion.div>
                )}
              </div>
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
          className="px-6 py-4 border-t border-cyan-500/20 bg-linear-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm"
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
              className="px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 group font-semibold text-sm"
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
