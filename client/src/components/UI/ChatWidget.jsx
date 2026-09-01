import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Clock } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! Welcome to IPMC. How can we help you today?', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    'Request a Proposal',
    'ESG Services',
    'Career Opportunities',
    'Contact Info',
  ];

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const responses = {
        'proposal': 'You can request a proposal by visiting our Proposal Request page or sending an email to enquiries@ipmc-ng.com. Our team typically responds within 48 hours.',
        'esg': 'Our ESG services include ratings, assessments, sustainability reporting, and carbon footprint analysis. Would you like to speak with our ESG team?',
        'career': 'We have several openings! Please visit our Careers page to view current positions and submit your application.',
        'contact': 'You can reach us at:\n📍 18B Olu Holloway Road, Ikoyi-Lagos\n📞 +234 704 026 9249\n✉️ enquiries@ipmc-ng.com',
      };

      let responseText = 'Thank you for your message. Our team will get back to you shortly. For immediate assistance, please call +234 704 026 9249 or email enquiries@ipmc-ng.com.';

      for (const [key, value] of Object.entries(responses)) {
        if (text.toLowerCase().includes(key)) {
          responseText = value;
          break;
        }
      }

      const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-8 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-xl flex items-center justify-center z-40 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-8 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-primary-950 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center">
                <span className="text-white font-bold">IP</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">IPMC Support</div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Typically replies in minutes
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2.5 text-sm`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`text-xs mt-1 block ${msg.sender === 'user' ? 'text-primary-200' : 'text-gray-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="px-3 py-1.5 bg-primary-50 text-primary-600 text-xs rounded-full hover:bg-primary-100 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:border-primary-500 outline-none text-sm"
                />
                <button
                  onClick={() => sendMessage(input)}
                  className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
