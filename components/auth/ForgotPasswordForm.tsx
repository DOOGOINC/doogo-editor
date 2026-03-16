'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert(error.message);
    } else {
      setMessage('비밀번호 변경 링크가 이메일로 전송되었습니다.');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 text-center">
      <div className="w-full max-w-[400px] relative">
        {/* Title & Desc */}
        <h1 className="text-[28px] font-bold text-gray-800 mb-4 tracking-tight">비밀번호 찾기</h1>
        <p className="text-[15px] text-gray-600 leading-relaxed mb-10">
          가입한 이메일을 입력해 주세요.<br />
          이메일을 통해 비밀번호 변경 링크가 전송됩니다
        </p>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <input
            type="email"
            placeholder="이메일 입력"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-4 text-[15px] outline-none focus:border-[#155dfc] transition-all placeholder:text-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#155dfc] py-4 text-[16px] font-bold text-white hover:bg-[#158dfc] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? '전송 중...' : '변경 링크 전송하기'}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <div className="mt-6 p-4 rounded-lg bg-[#155dfc]/10 text-[#158dfc] text-[13px] font-bold border border-[#155dfc]/20">
            {message}
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-8">
          <Link href="/login" className="text-[13px] text-gray-400 hover:text-gray-600 underline underline-offset-4">
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
