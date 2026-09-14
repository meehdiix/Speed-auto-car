import React from 'react';
import { PhoneCall, MapPin, BarChart3, TrendingUp, Users } from 'lucide-react';

export default function AnalyticsManager() {
  const callLeads: any[] = [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">إحصائيات وتحليلات</h1>
        <p className="text-white/50 text-lg">تتبع النقرات، المكالمات، والمناطق الجغرافية للزوار.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Call Leads Activity */}
        <div className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent pointer-events-none"></div>
          <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
            <div className="w-2 h-6 bg-green-500 rounded-full"></div>
            سجل نقرات الاتصال المباشر (Leads)
          </h2>
          
          <div className="space-y-4 relative z-10">
            {callLeads.length === 0 ? (
              <div className="text-center py-8 text-white/40">
                لا توجد بيانات حتى الآن.
              </div>
            ) : (
              callLeads.map((lead) => (
                <div key={lead.id} className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-black/40 hover:border-green-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500/20 transition-all">
                      <PhoneCall className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{lead.carTitle}</h3>
                      <p className="text-white/50 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {lead.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-white font-bold dir-ltr">{lead.phone}</p>
                    <p className="text-green-400/70 text-xs font-medium">{lead.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none"></div>
          <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
            <div className="w-2 h-6 bg-red-500 rounded-full"></div>
            أكثر المناطق نشاطاً
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="text-center py-8 text-white/40">
              لا توجد بيانات حتى الآن.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
