import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { CarFront, Settings, LogOut, LayoutDashboard, BarChart3, Target, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../firebase';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsLocalAuth(true);
      setLoading(false);
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!localStorage.getItem('admin_auth')) {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Auth credentials check
    const userClean = username.trim().toLowerCase();
    if ((userClean === 'admin' && password === 'admin') || (userClean === 'mehdi' && password === 'mehdi4008')) {
      localStorage.setItem('admin_auth', 'true');
      setIsLocalAuth(true);
      return;
    }

    try {
      const emailToUse = username.trim().toLowerCase() + '@admin.com';
      await signInWithEmailAndPassword(auth, emailToUse, password);
    } catch (err) {
      setError('بيانات الدخول غير صحيحة.');
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('admin_auth');
    setIsLocalAuth(false);
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user && !isLocalAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
        {/* Ambient background blur */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-70"></div>
        
        <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h2>
          <p className="text-white/50 mb-8">لوحة تحكم مدير النظام</p>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all backdrop-blur-md" 
              dir="ltr" 
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور" 
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all backdrop-blur-md" 
              dir="ltr" 
            />
            <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'لوحة القيادة', path: '/admin', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { name: 'إحصائيات وتحليلات', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5 shrink-0" /> },
    { name: 'إدارة السيارات', path: '/admin/inventory', icon: <CarFront className="w-5 h-5 shrink-0" /> },
    { name: 'مكتبة الوسائط', path: '/admin/media', icon: <ImageIcon className="w-5 h-5 shrink-0" /> },
    { name: 'تتبع وحملات', path: '/admin/pixels', icon: <Target className="w-5 h-5 shrink-0" /> },
    { name: 'الإعدادات العامة', path: '/admin/settings', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row font-sans relative overflow-hidden" dir="rtl">
      {/* Ambient background glows for liquid glass effect */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'md:w-20' : 'md:w-72'} w-full bg-white/[0.02] backdrop-blur-xl border-l border-white/10 shrink-0 flex flex-col relative z-20 shadow-2xl transition-all duration-300`}>
        <div className={`p-6 border-b border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 w-full">
              <div className="font-signature text-2xl text-red-500 font-bold leading-none tracking-wider" dir="ltr">
                <span className="text-white">Speed</span> Auto
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="font-signature text-2xl text-red-500 font-bold leading-none" dir="ltr">
              <span className="text-white">H</span>A
            </div>
          )}
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 border-none group ${
                  isActive 
                    ? 'bg-white/10 text-white border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white/90 bg-transparent'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className={`${isActive ? 'text-red-400' : 'text-white/40 group-hover:text-white/70'} transition-colors`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="font-medium text-[15px] whitespace-nowrap">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:flex items-center gap-3.5 px-3 py-3 w-full rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 border-none group ${isCollapsed ? 'justify-center' : ''}`}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-5 h-5 shrink-0 transition-transform" />
            ) : (
              <>
                <ChevronRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
                <span className="font-medium text-[15px] whitespace-nowrap">تصغير القائمة</span>
              </>
            )}
          </button>
          <button 
            onClick={() => window.open('/', '_blank')}
            className={`flex items-center gap-3.5 px-3 py-3 w-full rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 border-none group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0 group-hover:-translate-y-1 transition-transform" />
            {!isCollapsed && <span className="font-medium text-[14px] whitespace-nowrap">زيارة الموقع</span>}
          </button>
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3.5 px-3 py-3 w-full rounded-xl text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 border-none group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="font-medium text-[15px] whitespace-nowrap">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
