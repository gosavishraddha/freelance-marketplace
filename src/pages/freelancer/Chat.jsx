import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { chatService } from "../../services/chatService";
import { authService } from "../../services/authService";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Send, MessageSquare, ShieldAlert, Star } from "lucide-react";

export const FreelancerChat = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get("userId");

  const [chats, setChats] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);

  const loadChats = async () => {
    try {
      const list = await chatService.getActiveChats(user.id);
      setChats(list);

      // Check if URL specifies a target user to converse with
      if (targetUserId) {
        const partnerDetails = list.find(c => c.user.id === targetUserId);
        if (partnerDetails) {
          setActivePartner(partnerDetails.user);
        } else {
          // If not in active chat, load details manually
          const allUsers = await authService.getAllUsers();
          const target = allUsers.find(u => u.id === targetUserId);
          if (target) {
            setActivePartner(target);
          }
        }
      } else if (list.length > 0 && !activePartner) {
        // Fallback to first chat in list
        setActivePartner(list[0].user);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!activePartner) return;
    try {
      const thread = await chatService.getMessagesBetweenUsers(user.id, activePartner.id);
      setMessages(thread);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadChats();
  }, [user, targetUserId]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [activePartner]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activePartner) return;

    try {
      const newMsg = await chatService.sendMessage(user.id, activePartner.id, text.trim());
      setMessages(prev => [...prev, newMsg]);
      setText("");
      
      const updatedChats = await chatService.getActiveChats(user.id);
      setChats(updatedChats);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[80vh] flex bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 rounded-3xl overflow-hidden shadow-premium">
      
      {/* Sidebar - active conversations */}
      <aside className="w-full md:w-80 border-r border-gray-150 dark:border-gray-850 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-150 dark:border-gray-850">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Active Conversations</h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-6 text-center text-gray-405">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">No active chats. Place proposals to start coordination.</p>
            </div>
          ) : (
            chats.map((chat) => {
              const partner = chat.user;
              const isSelected = activePartner?.id === partner.id;
              return (
                <div
                  key={partner.id}
                  onClick={() => setActivePartner(partner)}
                  className={`p-4 border-b border-gray-50 dark:border-gray-850 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-855/25 cursor-pointer flex gap-3 transition-all ${
                    isSelected ? "bg-accent-50/20 dark:bg-accent-950/15" : ""
                  }`}
                >
                  <img
                    src={partner.avatar}
                    alt={partner.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{partner.name}</h4>
                      <span className="text-[9px] text-gray-400">
                        {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xxs text-gray-450 dark:text-gray-450 truncate">
                      {chat.lastMessage.content}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main message pane */}
      <section className="flex-1 flex flex-col justify-between bg-gray-50 dark:bg-gray-955">
        {activePartner ? (
          <>
            {/* Header info */}
            <div className="px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-150 dark:border-gray-855 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activePartner.avatar}
                  alt={activePartner.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-905 dark:text-white leading-none mb-1">{activePartner.name}</h4>
                  <p className="text-[9px] text-gray-400 font-semibold uppercase">{activePartner.company || "Client Enterprise"}</p>
                </div>
              </div>

              {activePartner.rating && (
                <div className="flex text-amber-505 bg-amber-50 dark:bg-amber-950/10 px-2 py-0.5 rounded text-xxs font-bold items-center">
                  <Star className="w-3 h-3 fill-current mr-0.5" />
                  {activePartner.rating}
                </div>
              )}
            </div>

            {/* Messages box */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-accent text-white rounded-tr-none"
                          : "bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-850 rounded-tl-none"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className={`text-[9px] text-right block mt-1.5 font-medium ${
                        isMe ? "text-white/60" : "text-gray-400"
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messageEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-150 dark:border-gray-855 flex gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 text-xs border border-gray-205 dark:border-gray-800 dark:bg-gray-950 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
              />
              <Button type="submit" className="px-4 py-2 shrink-0" variant="accent">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
            <MessageSquare className="w-12 h-12 text-gray-305 dark:text-gray-800 mb-3" />
            <p className="text-sm font-semibold">Select a conversation thread</p>
            <p className="text-xs text-gray-400 mt-1">Coordinate deliverables and finalize contract parameters.</p>
          </div>
        )}
      </section>
      
    </div>
  );
};
