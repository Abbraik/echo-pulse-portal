
import React, { useState, useRef, useEffect } from 'react';
import { X, SendHorizontal, Paperclip, Maximize2, Minimize2, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: { name: string; type: string; url: string }[];
}

interface AiAdvisorChatProps {
  onClose: () => void;
}

const AiAdvisorChat: React.FC<AiAdvisorChatProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      content: "Hello! I'm your AI Strategy Advisor. How can I help with your strategic planning today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      const aiResponses = [
        "Based on your strategic objectives, I recommend focusing on the Water Resource pathway which has the highest impact score among your selected objectives.",
        "Looking at the network analysis, I can see that the Ministry of Economy has the highest betweenness centrality. They should be your primary coordination point for new initiatives.",
        "Your DEI score is currently at 74, which is within equilibrium bands. However, the Resources pillar at 65 could use attention to improve overall system stability.",
        "Would you like me to analyze a specific part of your strategy in more detail?",
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: randomResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttach = () => {
    setIsAttaching(true);
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setIsAttaching(false);
      return;
    }

    // Handle file attachments
    const attachments = Array.from(files).map(file => {
      return {
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      };
    });

    // Create a message with attachments
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: "I'm sharing some files with you.",
      timestamp: new Date(),
      attachments
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsAttaching(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Simulate AI response acknowledging the files
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content: `I've received your ${attachments.length > 1 ? 'files' : 'file'}. Let me analyze ${attachments.length > 1 ? 'them' : 'it'} for you.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className={`fixed ${isExpanded ? 'inset-4' : 'bottom-16 left-16 w-80 h-96'} z-40 bg-navy-800/95 backdrop-blur-lg rounded-lg border border-white/10 shadow-xl flex flex-col`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <BrainCircuit size={18} className="text-teal-400" />
            <h3 className="font-medium text-teal-400">AI ADVISOR</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-white/10"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-white/10"
              onClick={onClose}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
        
        {/* Messages */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className={`h-8 w-8 ${msg.sender === 'ai' ? 'bg-teal-600' : 'bg-blue-600'}`}>
                    <span className="text-xs">{msg.sender === 'ai' ? 'AI' : 'You'}</span>
                  </Avatar>
                  <div className={`p-3 rounded-lg ${msg.sender === 'ai' ? 'bg-teal-500/20' : 'bg-blue-500/20'}`}>
                    <p className="text-sm">{msg.content}</p>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((file, i) => (
                          <div key={i} className="text-xs bg-white/10 rounded p-1 flex items-center">
                            <Paperclip size={12} className="mr-1" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <span className="block text-[10px] text-gray-400 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10"
              onClick={handleAttach}
              disabled={isAttaching}
            >
              <Paperclip size={18} />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="bg-white/5 border-white/10"
              placeholder={t("askYourAdvisor")}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-400"
              onClick={handleSendMessage}
              disabled={!input.trim()}
            >
              <SendHorizontal size={18} />
            </Button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileSelected}
            multiple
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AiAdvisorChat;
