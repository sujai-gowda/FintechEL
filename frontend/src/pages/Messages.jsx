import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { apiFetch } from '../services/api';
import { LayoutDashboard, Briefcase, Shield, Activity, MessageSquare, Search, PlusCircle } from 'lucide-react';
import { ROLES } from '../constants/roles';

const CLIENT_NAV = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Post Job', path: '/jobs/create', icon: PlusCircle },
  { label: 'My Jobs', path: '/jobs/my', icon: Briefcase },
  { label: 'Escrow', path: '/escrow', icon: Shield },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'History', path: '/history', icon: Activity },
];

const FREELANCER_NAV = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Find Jobs', path: '/jobs', icon: Search },
  { label: 'My Applications', path: '/jobs/applied', icon: Briefcase },
  { label: 'Escrow', path: '/escrow', icon: Shield },
  { label: 'Messages', path: '/messages', icon: MessageSquare },
  { label: 'History', path: '/history', icon: Activity },
];

const Messages = () => {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const toUserId = searchParams.get('to');

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatMeta, setChatMeta] = useState(null);
  const [content, setContent] = useState('');
  const [activeChat, setActiveChat] = useState(null);

  const nav = user?.role === ROLES.FREELANCER ? FREELANCER_NAV : CLIENT_NAV;

  useEffect(() => {
    apiFetch('/messages/conversations', token).then(setConversations).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (jobId && toUserId) {
      setActiveChat({ jobId, userId: toUserId });
    }
  }, [jobId, toUserId]);

  useEffect(() => {
    if (activeChat) {
      apiFetch(`/messages/${activeChat.jobId}/${activeChat.userId}`, token)
        .then((data) => {
          setMessages(data.messages || []);
          setChatMeta(data);
        })
        .catch(() => {
          setMessages([]);
          setChatMeta(null);
        });
    }
  }, [activeChat, token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || !activeChat) return;
    try {
      await apiFetch('/messages/send', token, {
        method: 'POST',
        body: JSON.stringify({
          jobId: activeChat.jobId,
          receiverId: activeChat.userId,
          content,
        }),
      });
      setContent('');
      const data = await apiFetch(`/messages/${activeChat.jobId}/${activeChat.userId}`, token);
      setMessages(data.messages || []);
      setChatMeta(data);
      const convos = await apiFetch('/messages/conversations', token);
      setConversations(convos);
    } catch (err) {
      console.error(err);
    }
  };

  const openChat = (chat) => {
    setActiveChat({ jobId: chat.jobId, userId: chat.userId });
  };

  return (
    <DashboardLayout navItems={nav} title="Messages" subtitle="Chat with clients or freelancers about specific jobs">
      <div className="grid lg:grid-cols-3 gap-4 h-[520px]">
        <div className="card overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border text-sm font-medium">Conversations</div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="p-4 text-xs text-muted-foreground">No messages yet. Start from a job or applicant list.</p>
            ) : (
              conversations.map((chat) => (
                <button
                  key={`${chat.jobId}-${chat.userId}`}
                  type="button"
                  onClick={() => openChat(chat)}
                  className={`w-full text-left p-3 border-b border-border hover:bg-muted text-sm ${
                    activeChat?.jobId === chat.jobId && activeChat?.userId === chat.userId ? 'bg-muted' : ''
                  }`}
                >
                  <p className="font-medium">{chat.userName} <span className="text-xs text-muted-foreground">({chat.userRole})</span></p>
                  <p className="text-xs text-muted-foreground">{chat.jobTitle}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 card flex flex-col">
          {activeChat ? (
            <>
              <div className="p-3 border-b border-border">
                <p className="text-sm font-medium">{chatMeta?.otherUser?.name || 'Chat'}</p>
                <p className="text-xs text-muted-foreground">{chatMeta?.jobTitle} · {chatMeta?.otherUser?.role}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No messages yet. Say hello!</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.messageId} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                        m.senderId === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={sendMessage} className="p-3 border-t border-border flex gap-2">
                <input
                  className="input-field flex-1"
                  placeholder="Type a message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit" className="btn-primary px-4">Send</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Select a conversation or open from a job listing
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
