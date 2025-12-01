
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, ShieldCheck } from 'lucide-react';
import { UserSettings, ChatMessage } from '../types';
import { chatWithMedicalAI } from '../services/ai';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onAdminLogin: () => void;
}

export const MedicalChat: React.FC<ChatProps> = ({ isOpen, onClose, settings, onAdminLogin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: `Hi ${settings.username}! I'm DocBook AI. How can I help you today?`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // ADMIN LOGIN CHECK
    if (input.trim() === "my name is krishna.0858 and password is @krishna.0858") {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: (Date.now()+1).toString(), 
          sender: 'ai', 
          text: "🔒 CREDENTIALS VERIFIED. Welcome back, Administrator Krishna. Accessing Admin Dashboard...", 
          timestamp: Date.now() 
        }]);
        setIsTyping(false);
        onAdminLogin();
      }, 1000);
      return;
    }

    const history = messages.map(m => ({ sender: m.sender, text: m.text }));
    const response = await chatWithMedicalAI(settings.apiKey, userMsg.text, history);
    
    setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'ai', text: response, timestamp: Date.now() }]);
    setIsTyping(false);
  };

  // Determine if we should mask the input because user is typing credentials
  // We check if it starts with the beginning of the secret phrase
  const isCredentialInput = input.toLowerCase().startsWith("my name is krishna");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 right-4 md:right-8 w-[90vw] md:w-[400px] h-[500px] bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 flex flex-col z-[100] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-indigo-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="text-white" />
              <h3 className="font-bold text-white">Medical Assistant</h3>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20}/></button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0f172a]">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}>
                  {/* If the message matches the exact admin login, mask it in history too for security UI effect */}
                  {m.text === "my name is krishna.0858 and password is @krishna.0858" ? "•••••••••••••••••••••" : m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none text-gray-400 text-xs italic">
                  Typing...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-[#1e293b] border-t border-white/5 flex gap-2">
            <input 
              type={isCredentialInput ? "password" : "text"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isCredentialInput ? "Enter credentials..." : "Ask a question..."}
              className={`flex-1 bg-[#0f172a] rounded-xl px-4 py-2 text-white outline-none border transition-colors ${isCredentialInput ? 'border-amber-500 text-amber-500' : 'border-gray-700 focus:border-indigo-500'}`}
            />
            <button onClick={handleSend} className="p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500">
              <Send size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
