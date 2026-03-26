/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Bell, 
  LayoutDashboard, 
  MessageSquare, 
  Menu, 
  X, 
  Plus, 
  Search, 
  ChevronRight,
  Info,
  Send,
  Wallet,
  Smartphone,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  joinedDate: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

interface PaymentMethod {
  name: string;
  color: string;
  logo: string;
}

// --- Mock Data ---
const initialMembers: Member[] = [
  { id: '1', name: 'আরিফ হোসেন', role: 'সভাপতি', email: 'arif@example.com', phone: '01711111111', joinedDate: '২০২৩-০১-১৫' },
  { id: '2', name: 'সাদিয়া সুলতানা', role: 'সাধারণ সম্পাদক', email: 'sadia@example.com', phone: '01822222222', joinedDate: '২০২৩-০২-১০' },
  { id: '3', name: 'তানভীর আহমেদ', role: 'কোষাধ্যক্ষ', email: 'tanvir@example.com', phone: '01933333333', joinedDate: '২০২৩-০৩-০৫' },
  { id: '4', name: 'রাকিবুল ইসলাম', role: 'সদস্য', email: 'rakib@example.com', phone: '01644444444', joinedDate: '২০২৩-০৫-২০' },
];

const initialEvents: Event[] = [
  { id: '1', title: 'বার্ষিক সাধারণ সভা', date: '২০২৬-০৪-১০', location: 'অডিটোরিয়াম', description: 'সংগঠনের বার্ষিক কার্যক্রম পর্যালোচনা এবং নতুন কমিটি গঠন।' },
  { id: '2', title: 'রক্তদান কর্মসূচি', date: '২০২৬-০৪-২৫', location: 'পাবলিক লাইব্রেরি', description: 'জরুরি প্রয়োজনে মুমূর্ষু রোগীদের জন্য রক্ত সংগ্রহ।' },
];

const initialNotices: Notice[] = [
  { id: '1', title: 'নতুন সদস্য ভর্তি চলছে', date: '২০২৬-০৩-২০', content: 'আগ্রহী ব্যক্তিরা আগামী ১০ এপ্রিলের মধ্যে আবেদন করতে পারবেন।', priority: 'medium' },
  { id: '2', title: 'জরুরি সভা স্থগিত', date: '২০২৬-০৩-২৫', content: 'অনিবার্য কারণে আগামীকালের সভা স্থগিত করা হলো।', priority: 'high' },
];

const paymentMethods: PaymentMethod[] = [
  { name: 'bKash', color: 'bg-[#E2136E]', logo: 'বিকাশ' },
  { name: 'Nagad', color: 'bg-[#F7941D]', logo: 'নগদ' },
  { name: 'Rocket', color: 'bg-[#8C3494]', logo: 'রকেট' },
  { name: 'Upay', color: 'bg-[#005DAA]', logo: 'উপায়' },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const Card = ({ children, title, icon: Icon, ...props }: { children: React.ReactNode, title?: string, icon?: any } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" {...props}>
    {(title || Icon) && (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {Icon && <Icon className="mr-2 text-blue-600" size={20} />}
          {title}
        </h3>
      </div>
    )}
    {children}
  </div>
);

const BottomNavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
      active ? 'text-blue-600' : 'text-gray-400'
    }`}
  >
    <Icon size={20} />
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const balance = "৫,৪৫০.০০";

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg mb-6 relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-xs opacity-80 mb-1">সংগঠনের মোট ব্যালেন্স</p>
        <div 
          onClick={() => setShowBalance(!showBalance)}
          className="flex items-center space-x-3 cursor-pointer select-none"
        >
          <div className="text-2xl font-bold tracking-wider">
            {showBalance ? `৳ ${balance}` : '৳ ••••••••'}
          </div>
          <div className="bg-white/20 p-1 rounded-full">
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          </div>
        </div>
        <p className="text-[10px] mt-2 opacity-60">ব্যালেন্স দেখতে ট্যাপ করুন</p>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members] = useState<Member[]>(initialMembers);
  const [events] = useState<Event[]>(initialEvents);
  const [notices] = useState<Notice[]>(initialNotices);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'স্বাগতম! আমি আপনার সংগঠনের সহকারী। আমি আপনাকে কীভাবে সাহায্য করতে পারি?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [hadiyaAmount, setHadiyaAmount] = useState('');
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Initialize Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an assistant for a Bengali organization management app. Answer in Bengali. The user says: ${userMsg}`,
      });
      
      const aiResponse = response.text || "দুঃখিত, আমি বুঝতে পারিনি। আবার চেষ্টা করুন।";
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatMessages(prev => [...prev, { role: 'ai', text: "দুঃখিত, এআই সার্ভারে সমস্যা হচ্ছে।" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 pb-20 lg:pb-0">
            <BalanceCard />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <Card title="মোট সদস্য" icon={Users}>
                <div className="text-3xl font-bold text-blue-600">{members.length} জন</div>
                <p className="text-sm text-gray-500 mt-1">বর্তমানে সক্রিয় সদস্য</p>
              </Card>
              <Card title="আসন্ন ইভেন্ট" icon={Calendar}>
                <div className="text-3xl font-bold text-green-600">{events.length} টি</div>
                <p className="text-sm text-gray-500 mt-1">পরবর্তী ৩০ দিনের মধ্যে</p>
              </Card>
              <Card title="নোটিশ" icon={Bell}>
                <div className="text-3xl font-bold text-orange-600">{notices.length} টি</div>
                <p className="text-sm text-gray-500 mt-1">আজকের নতুন নোটিশ</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <Card title="সাম্প্রতিক নোটিশ" icon={Bell}>
                <div className="space-y-4">
                  {notices.map(notice => (
                    <div key={notice.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border-l-4 border-orange-500">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{notice.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{notice.content}</p>
                        <span className="text-[10px] sm:text-xs text-gray-400">{notice.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="আসন্ন ইভেন্টসমূহ" icon={Calendar}>
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{event.title}</h4>
                        <p className="text-[10px] sm:text-xs text-gray-500">{event.date} • {event.location}</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );
      case 'members':
        return (
          <div className="pb-20 lg:pb-0">
            <Card title="সদস্য তালিকা" icon={Users}>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-3 font-semibold text-gray-600 text-sm">নাম</th>
                      <th className="pb-3 font-semibold text-gray-600 text-sm">পদবী</th>
                      <th className="pb-3 font-semibold text-gray-600 text-sm">যোগাযোগ</th>
                      <th className="pb-3 font-semibold text-gray-600 text-sm">যোগদান</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {members.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-medium text-gray-800 text-sm">{member.name}</td>
                        <td className="py-4">
                          <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">
                            {member.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="text-xs text-gray-600">{member.email}</div>
                          <div className="text-[10px] text-gray-400">{member.phone}</div>
                        </td>
                        <td className="py-4 text-xs text-gray-500">{member.joinedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );
      case 'events':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 pb-20 lg:pb-0">
            {events.map(event => (
              <Card key={event.id} title={event.title} icon={Calendar}>
                <div className="space-y-3">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Calendar size={16} className="mr-2 text-blue-500" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Info size={16} className="mr-2 text-blue-500" />
                    {event.location}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mt-2">{event.description}</p>
                  <button className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm">
                    বিস্তারিত দেখুন
                  </button>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'notices':
        return (
          <div className="space-y-4 pb-20 lg:pb-0">
            {notices.map(notice => (
              <Card key={notice.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">{notice.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[8px] sm:text-[10px] uppercase font-bold ${
                        notice.priority === 'high' ? 'bg-red-100 text-red-600' : 
                        notice.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {notice.priority === 'high' ? 'জরুরি' : notice.priority === 'medium' ? 'মাঝারি' : 'সাধারণ'}
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-sm text-gray-400 mt-1">{notice.date}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                  {notice.content}
                </div>
              </Card>
            ))}
          </div>
        );
      case 'hadiya':
        return (
          <div className="space-y-6 pb-20 lg:pb-0">
            <Card title="হাদিয়া প্রদান করুন" icon={Wallet}>
              <div className="py-4">
                <p className="text-gray-600 mb-6 text-center">সংগঠনের কার্যক্রম সচল রাখতে প্রতি মাসে আপনার নির্ধারিত হাদিয়া প্রদান করুন।</p>
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-300 mb-8 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">পেমেন্ট নাম্বার (পার্সোনাল)</p>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tighter">01625166279</div>
                  <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    <Smartphone size={14} className="mr-1" /> সেন্ড মানি (Send Money)
                  </div>
                </div>

                <div className="max-w-sm mx-auto space-y-4 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">হাদিয়ার পরিমাণ (টাকা)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                      <input 
                        type="number" 
                        value={hadiyaAmount}
                        onChange={(e) => setHadiyaAmount(e.target.value)}
                        placeholder="পরিমাণ লিখুন"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => hadiyaAmount && setIsConfirmDialogOpen(true)}
                    disabled={!hadiyaAmount}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                  >
                    পরবর্তী
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.name} className="flex flex-col items-center">
                      <div className={`${method.color} w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md mb-2`}>
                        {method.logo}
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="পেমেন্ট করার নিয়ম" icon={Info}>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">১</div>
                  <p className="text-sm text-gray-700">আপনার বিকাশ, নগদ, রকেট বা উপায় অ্যাপে যান।</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">২</div>
                  <p className="text-sm text-gray-700">"সেন্ড মানি" অপশনটি সিলেক্ট করুন।</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">৩</div>
                  <p className="text-sm text-gray-700">নাম্বার হিসেবে <span className="font-bold text-blue-600">01625166279</span> লিখুন।</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">৪</div>
                  <p className="text-sm text-gray-700">আপনার হাদিয়ার পরিমাণ লিখে পিন দিয়ে কনফার্ম করুন।</p>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">৫</div>
                  <p className="text-sm text-gray-700">পেমেন্ট সফল হলে ট্রানজেকশন আইডিটি কোষাধ্যক্ষকে জানান।</p>
                </li>
              </ul>
            </Card>
          </div>
        );
      case 'ai':
        return (
          <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden pb-16 sm:pb-0">
            <div className="p-4 border-b border-gray-100 bg-blue-600 text-white flex items-center space-x-2">
              <MessageSquare size={20} />
              <h3 className="font-semibold">এআই সহকারী</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm sm:text-base ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-gray-100 flex space-x-2 bg-white">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="আপনার প্রশ্ন লিখুন..."
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isTyping}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 overflow-hidden">
      {/* Sidebar (Desktop only) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              স
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">সংগঠন</h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="ড্যাশবোর্ড" 
              active={activeTab === 'dashboard'} 
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Users} 
              label="সদস্যবৃন্দ" 
              active={activeTab === 'members'} 
              onClick={() => { setActiveTab('members'); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Calendar} 
              label="ইভেন্টসমূহ" 
              active={activeTab === 'events'} 
              onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Bell} 
              label="নোটিশ বোর্ড" 
              active={activeTab === 'notices'} 
              onClick={() => { setActiveTab('notices'); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={Wallet} 
              label="হাদিয়া প্রদান" 
              active={activeTab === 'hadiya'} 
              onClick={() => { setActiveTab('hadiya'); setIsSidebarOpen(false); }} 
            />
            <SidebarItem 
              icon={MessageSquare} 
              label="এআই সহকারী" 
              active={activeTab === 'ai'} 
              onClick={() => { setActiveTab('ai'); setIsSidebarOpen(false); }} 
            />
          </nav>

          <div className="p-4 border-t border-gray-50">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1">প্রোফাইল</p>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
                  আ
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-gray-800 truncate">আরিফ হোসেন</p>
                  <p className="text-[10px] text-gray-500 truncate">সভাপতি</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {activeTab === 'dashboard' ? 'ড্যাশবোর্ড' : 
               activeTab === 'members' ? 'সদস্যবৃন্দ' : 
               activeTab === 'events' ? 'ইভেন্টসমূহ' : 
               activeTab === 'notices' ? 'নোটিশ বোর্ড' : 
               activeTab === 'hadiya' ? 'হাদিয়া প্রদান' : 'এআই সহকারী'}
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="খুঁজুন..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64"
              />
            </div>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={18} />
              <span className="hidden sm:inline ml-2 font-medium text-sm">নতুন</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Nav (Mobile only) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around h-16 px-2 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
          <BottomNavItem 
            icon={LayoutDashboard} 
            label="হোম" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <BottomNavItem 
            icon={Users} 
            label="সদস্য" 
            active={activeTab === 'members'} 
            onClick={() => setActiveTab('members')} 
          />
          <BottomNavItem 
            icon={Wallet} 
            label="হাদিয়া" 
            active={activeTab === 'hadiya'} 
            onClick={() => setActiveTab('hadiya')} 
          />
          <BottomNavItem 
            icon={Bell} 
            label="নোটিশ" 
            active={activeTab === 'notices'} 
            onClick={() => setActiveTab('notices')} 
          />
          <BottomNavItem 
            icon={MessageSquare} 
            label="এআই" 
            active={activeTab === 'ai'} 
            onClick={() => setActiveTab('ai')} 
          />
        </nav>
      </main>

      {/* Dialogs */}
      <AnimatePresence>
        {isConfirmDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center space-x-3 text-blue-600 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Info size={24} />
                </div>
                <h3 className="text-xl font-bold">পেমেন্ট নিশ্চিত করুন</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">প্রাপক নাম্বার (পার্সোনাল)</p>
                  <p className="text-lg font-bold text-gray-800">01625166279</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">হাদিয়ার পরিমাণ</p>
                  <p className="text-2xl font-bold text-blue-600">৳ {hadiyaAmount || '০.০০'}</p>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  নিশ্চিত করার পর আপনার মোবাইল অ্যাপ (বিকাশ/নগদ/রকেট) থেকে এই নাম্বারে "সেন্ড মানি" সম্পন্ন করুন।
                </p>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsConfirmDialogOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  বাতিল করুন
                </button>
                <button 
                  onClick={() => {
                    setIsConfirmDialogOpen(false);
                    setIsPaymentSuccess(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  নিশ্চিত করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isPaymentSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">ধন্যবাদ!</h3>
              <p className="text-gray-600 mb-8">
                আপনার পেমেন্ট তথ্য রেকর্ড করা হয়েছে। অনুগ্রহ করে আপনার মোবাইল অ্যাপ থেকে পেমেন্ট সম্পন্ন করে ট্রানজেকশন আইডিটি কোষাধ্যক্ষকে জানান।
              </p>

              <button 
                onClick={() => {
                  setIsPaymentSuccess(false);
                  setHadiyaAmount('');
                }}
                className="w-full py-3 px-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
              >
                ঠিক আছে
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
