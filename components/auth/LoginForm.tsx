'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, X } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      } else if (error.message.includes('missing email')) {
        alert('이메일 주소를 입력해 주세요.');
      } else {
        alert('로그인 중 오류가 발생했습니다: ' + error.message);
      }
    } else {
      window.location.href = '/';
    }
  
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-[400px] relative">
{/* Logo Area */}
<div className="mb-10 text-center">
  <Link href="/" className="inline-block group transition-transform active:scale-95">
    <h1 className="text-[32px] font-bold tracking-tight flex items-center justify-center gap-1">
      <img 
        src="/image/logo.png" 
        alt="Logo" 
        className="w-64 object-contain cursor-pointer" 
      />
    </h1>
  </Link>
</div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-4 text-[15px] outline-none focus:border-[#155dfc] transition-all placeholder:text-gray-400"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-4 text-[15px] outline-none focus:border-[#155dfc] transition-all placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-[#155dfc] py-4 text-[16px] font-bold text-white hover:bg-[#158dfc] transition-all disabled:opacity-50 cursor-pointer"
          >
            로그인
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 flex justify-center gap-4 text-[13px] text-gray-500">
          <Link href="/forgot-password" className="hover:underline underline-offset-4">비밀번호 찾기</Link>
          <span className="text-gray-200">|</span>
          <Link href="/signup" className="hover:underline underline-offset-4">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
