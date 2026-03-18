'use client';

import React from 'react';
import { User, ShoppingBag, Settings, LogOut, ChevronRight } from 'lucide-react';

export default function MyPageSidebar({ user, isViewAll, setIsViewAll, onSignOut }: any) {
  const menuItems = [
    { icon: <User size={18} />, label: '홈' },
    { icon: <ShoppingBag size={18} />, label: '구매 내역' },
    // { icon: <Settings size={18} />, label: '설정' },
  ];

  return (
    <div className="md:col-span-1 space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
          <User size={40} className="text-gray-300" />
        </div>
        <h2 className="text-[18px] font-bold text-gray-900 mb-1">{user.nickname}</h2>
        <p className="text-[13px] text-gray-400 mb-6">{user.email}</p>
        {/* <button className="w-full cursor-pointer py-2.5 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all">
          프로필 수정
        </button> */}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden py-2">
        {menuItems.map((item, idx) => {
          const isActive = (item.label === '홈' && !isViewAll) || (item.label === '구매 내역' && isViewAll);
          return (
            <button
              key={idx}
              onClick={() => {
                if (item.label === '홈') setIsViewAll(false);
                if (item.label === '구매 내역') setIsViewAll(true);
              }}
              className={`w-full flex items-center justify-between p-4 px-6 text-[14px] cursor-pointer transition-all group ${
                isActive ? 'bg-gray-50 text-[#155dfc]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-[#155dfc]' : 'text-gray-300 group-hover:text-gray-500'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight size={16} className={isActive ? 'text-[#155dfc]' : 'text-gray-300'} />
            </button>
          );
        })}
        <div className="h-[1px] bg-gray-50 my-2 mx-4" />
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-3 p-4 px-6 text-[14px] text-red-400 hover:bg-red-50 transition-all font-medium cursor-pointer"
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </div>
  );
}