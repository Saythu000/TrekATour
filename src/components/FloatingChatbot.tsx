import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronRight, Backpack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatbotService, ChatMessage } from '@/lib/chatbotService';
import { tripService, Trip } from '@/lib/dataService';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Initialize with greeting and show pop-up after a delay
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([chatbotService.getInitialMessage()]);
    }
    
    // Show the "Hi I'm Riya" popup after 2 seconds
    const timer = setTimeout(() => {
      if (!isOpen) setShowPopup(true);
    }, 2000);

    // Hide popup after 10 seconds
    const hideTimer = setTimeout(() => {
      setShowPopup(false);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date()
    };
    addMessage(userMsg);
    setInputValue('');
    
    setIsTyping(true);
    setTimeout(async () => {
      const keywordStep = chatbotService.findStepByKeyword(text);
      if (keywordStep) {
        const botResponse = await chatbotService.handleUserChoice(keywordStep);
        addMessage(botResponse);
      } else {
        try {
          const allTrips = await tripService.getActive();
          const matches = allTrips.filter(t => 
            t.title.toLowerCase().includes(text.toLowerCase()) || 
            (t.slug && t.slug.toLowerCase().includes(text.toLowerCase()))
          );

          if (matches.length > 0) {
            addMessage({
              id: Date.now().toString(),
              type: 'bot',
              text: `I found ${matches.length} adventure(s) matching "${text}":`,
              timestamp: new Date(),
              trips: matches,
              options: ['🏠 Main Menu']
            });
          } else {
            addMessage({
              id: Date.now().toString(),
              type: 'bot',
              text: "I'm not quite sure I understand that. Feel free to use the buttons below or ask about trips, prices, or contact info!",
              timestamp: new Date(),
              options: ['🏔️ Browse Trips', '📞 Contact Support', '🏠 Main Menu']
            });
          }
        } catch (error) {
          console.error('Search error:', error);
        }
      }
      setIsTyping(false);
    }, 800);
  };

  const handleShowItinerary = (trip: Trip) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage({
        id: Date.now().toString(),
        type: 'bot',
        text: `Here is the short itinerary for ${trip.title}:\n\n${trip.short_desc}`,
        timestamp: new Date(),
        options: ['🏔️ Browse Trips', '📞 Contact Support', '🏠 Main Menu']
      });
      setIsTyping(false);
    }, 600);
  };

  const handleOptionClick = async (option: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: option,
      timestamp: new Date()
    };
    addMessage(userMsg);

    setIsTyping(true);
    const categories = ['Himachal Trips', 'Weekend Getaway', 'Backpacking Trips', 'Camping Escapes'];
    
    if (categories.includes(option)) {
      setTimeout(async () => {
        try {
          const trips = await tripService.getByCategory(option);
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            text: `Here are our current ${option} adventures:`,
            timestamp: new Date(),
            trips: trips,
            options: ['🏠 Main Menu', '📞 Talk to Human']
          });
        } catch (error) {
          addMessage({
            id: Date.now().toString(),
            type: 'bot',
            text: "Oops, I had trouble fetching the trips. Please try again or contact us!",
            timestamp: new Date(),
            options: ['🏠 Main Menu']
          });
        }
        setIsTyping(false);
      }, 800);
      return;
    }

    if (option === 'Group Discounts') {
      setTimeout(async () => {
        addMessage({
          id: Date.now().toString(),
          type: 'bot',
          text: "For groups, we offer great deals! Minimum 8 packs you will get 10% discount or free rides.",
          timestamp: new Date(),
          options: ['🏠 Main Menu', '📞 Contact Support']
        });
        setIsTyping(false);
      }, 800);
      return;
    }

    if (option.includes('WhatsApp')) {
      window.open('https://wa.me/918248107567', '_blank');
      setIsTyping(false);
      return;
    }

    setTimeout(async () => {
      const botResponse = await chatbotService.handleUserChoice(option);
      addMessage(botResponse);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-orange-600 p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                  <Backpack className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Riya - TrekATour</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-orange-100">Active now</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col",
                  msg.type === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                    msg.type === 'user' 
                      ? "bg-orange-600 text-white rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  
                  {msg.trips && msg.trips.length > 0 && (
                    <div className="mt-3 space-y-2 w-full">
                      {msg.trips.map(trip => (
                        <div 
                          key={trip.id} 
                          onClick={() => {
                            navigate(`/trip/${trip.slug || trip.id}`);
                            setIsOpen(false);
                          }}
                          className="flex gap-3 p-2 bg-white border border-orange-100 rounded-xl hover:border-orange-400 transition-colors cursor-pointer group"
                        >
                          <img 
                            src={trip.image_url || '/placeholder.svg'} 
                            alt={trip.title} 
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold truncate group-hover:text-orange-600">{trip.title}</h4>
                            <p className="text-[10px] text-gray-500 mb-1">{trip.duration}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-orange-600">₹{trip.base_price}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShowItinerary(trip);
                                }}
                                className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded hover:bg-orange-200 transition-colors"
                              >
                                📋 Short Itinerary
                              </button>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 self-center text-gray-300 group-hover:text-orange-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-3 justify-start max-w-[90%]">
                      {msg.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-orange-600 hover:text-white transition-all transform active:scale-95 shadow-sm"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-1 p-2 bg-white border border-gray-100 rounded-full w-12 items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 bg-white border-t border-gray-100 flex gap-2"
            >
              <Input
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="rounded-full bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-orange-400"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim()}
                className="bg-orange-600 hover:bg-orange-700 rounded-full shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standard Toggle Button with Pop-up */}
      <div className="relative group">
        <AnimatePresence>
          {showPopup && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-16 -right-4 w-48 bg-white text-gray-800 p-3 rounded-2xl shadow-xl border border-orange-100 text-xs font-medium z-50 pointer-events-none"
            >
              Hi! I'm Riya, your travel coordinator. I'm here to help!
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-orange-100 rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(234, 88, 12, 0.4)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowPopup(false);
          }}
          className="w-16 h-16 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center border-2 border-white relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div 
                key="open" 
                initial={{ scale: 0, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0, opacity: 0 }}
                className="w-full h-full flex items-center justify-center"
              >
                <MessageCircle className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingChatbot;
