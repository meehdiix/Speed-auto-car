import React, { useState, useEffect } from 'react';
import { CarFront, MousePointerClick, TrendingUp, Users, ArrowUpRight, PhoneCall, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminDashboard() {
  const [carCount, setCarCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      setCarCount(snapshot.size);
    });
    return unsubscribe;
  }, []);

  const stats = [
    { label: 'إجمالي السيارات', value: carCount.toString(), icon: <CarFront className="w-7 h-7 text-red-400" />, change: 'مباشر', positive: true },
    { label: 'زوار الموقع', value: '0', icon: <Users className="w-7 h-7 text-purple-400" />, change: 'اليوم', positive: true },
    { label: 'نقرات اتصال مباشر', value: '0', icon: <PhoneCall className="w-7 h-7 text-green-400" />, change: 'اليوم', positive: true },
    { label: 'إجمالي Pixels النشطة', value: '0', icon: <MousePointerClick className="w-7 h-7 text-orange-400" />, change: 'نشط', positive: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">نظرة عامة على النشاط</h1>
        <p className="text-white/50 text-lg">مرحباً بك في لوحة تحكم النظام الإداري، إليك ملخص الأداء.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                {stat.icon}
              </div>
              <div className={`text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 ${stat.positive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                {stat.change} <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</h3>
              <p className="text-white/50 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-purple-500/5"></div>
        <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
          <div className="w-2 h-6 bg-red-500 rounded-full"></div>
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
          <Link to="/admin/inventory" className="flex flex-col gap-4 p-6 bg-black/20 hover:bg-black/40 rounded-2xl transition-all duration-300 border border-white/5 hover:border-red-500/30 group">
            <div className="p-4 bg-red-500/10 rounded-xl w-max group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
              <CarFront className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">إضافة سيارة جديدة</h3>
              <p className="text-white/40 text-sm leading-relaxed">رفع صور ومواصفات سيارة جديدة للمخزون بكل سهولة.</p>
            </div>
          </Link>
          
          <Link to="/admin/pixels" className="flex flex-col gap-4 p-6 bg-black/20 hover:bg-black/40 rounded-2xl transition-all duration-300 border border-white/5 hover:border-purple-500/30 group">
            <div className="p-4 bg-purple-500/10 rounded-xl w-max group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">إدارة البيكسل (Pixels)</h3>
              <p className="text-white/40 text-sm leading-relaxed">تتبع الحملات وإضافة Pixel مخصص لكل سيارة معروضة.</p>
            </div>
          </Link>

          <Link to="/admin/analytics" className="flex flex-col gap-4 p-6 bg-black/20 hover:bg-black/40 rounded-2xl transition-all duration-300 border border-white/5 hover:border-green-500/30 group">
            <div className="p-4 bg-green-500/10 rounded-xl w-max group-hover:bg-green-500/20 group-hover:scale-110 transition-all">
              <PhoneCall className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">تحليل الاتصالات (Leads)</h3>
              <p className="text-white/40 text-sm leading-relaxed">شاهد من قام بالضغط على زر الاتصال ومن أي منطقة.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
