import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  loading?: boolean;
}

export const StatsCard = ({ label, value, icon, loading }: StatsCardProps) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow cursor-default">
    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#155dfc] shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-[12px] font-black text-[#333] uppercase tracking-[0.15em] mb-1">{label}</p>
      <h3 className="text-[22px] font-black text-[#333] tracking-tight">
        {loading ? '...' : value}
      </h3>
    </div>
  </div>
);