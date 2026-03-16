'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();

  // 입력 필드 상태
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI 및 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // 인증 관련 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 1. 닉네임 중복 확인
  const checkNickname = async () => {
    if (!nickname) return alert("닉네임을 입력해주세요.");
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('nickname', nickname)
      .maybeSingle();

    if (error) {
      alert("중복 확인 중 오류가 발생했습니다.");
    } else if (data) {
      alert("이미 사용 중인 닉네임입니다.");
      setIsNicknameChecked(false);
    } else {
      alert("사용 가능한 닉네임입니다.");
      setIsNicknameChecked(true);
    }
    setLoading(false);
  };

  // 2. 이메일 인증번호 발송
  const sendVerificationCode = async () => {
    if (!email) return alert("이메일을 입력해주세요.");
    if (!isNicknameChecked) return alert("먼저 닉네임 중복 확인을 해주세요.");
    
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname } }
    });

    if (error) {
      if (error.message.includes("already registered")) alert("이미 가입된 이메일입니다.");
      else alert(error.message);
    } else {
      alert("인증 코드가 메일로 발송되었습니다.");
      setIsEmailSent(true);
    }
    setLoading(false);
  };

  // 3. 인증번호 확인
  const verifyCode = async () => {
    if (!verificationCode) return alert("인증번호를 입력해주세요.");
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: verificationCode,
      type: 'signup'
    });

    if (error) alert("인증번호가 일치하지 않거나 만료되었습니다.");
    else {
      alert("이메일 인증이 완료되었습니다.");
      setIsEmailVerified(true);
    }
    setLoading(false);
  };

  // 4. 최종 회원가입 제출
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNicknameChecked) return alert("닉네임 중복 확인이 필요합니다.");
    if (!isEmailVerified) return alert("이메일 인증이 필요합니다.");
    if (password !== confirmPassword) return alert("비밀번호가 일치하지 않습니다.");
    if (!privacyAgreed) return alert("개인정보 처리방침에 동의해주세요.");

    alert("회원가입이 완료되었습니다!");
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-[400px] text-center">
        {/* Header Area */}
        <div className="mb-10 flex flex-col items-center">
          <h1 className="text-[28px] font-bold text-gray-800 mb-2 tracking-tight">회원가입</h1>
        </div>

        {/* Form Area */}
        <form onSubmit={handleSignup} className="space-y-3">
          {/* 닉네임 입력 */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="닉네임 입력"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setIsNicknameChecked(false); }}
              disabled={isNicknameChecked}
              className="flex-1 rounded-lg border border-gray-200 p-4 text-[15px] outline-none focus:border-[#155dfc] transition-all placeholder:text-gray-400 disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={checkNickname}
              disabled={isNicknameChecked || loading}
              className="px-4 bg-gray-900 text-white rounded-lg text-[13px] font-bold hover:bg-black transition-all disabled:bg-gray-200"
            >
              {isNicknameChecked ? '확인됨' : '중복 확인'}
            </button>
          </div>

          {/* 이메일 입력 */}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isEmailSent}
              className="flex-1 rounded-lg border border-gray-200 p-4 text-[15px] outline-none focus:border-[#155dfc] transition-all placeholder:text-gray-400 disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={sendVerificationCode}
              disabled={!isNicknameChecked || isEmailSent || loading}
              className="px-4 bg-[#155dfc] text-white rounded-lg text-[13px] font-bold hover:bg-[#158dfc] transition-all disabled:bg-gray-200"
            >
              인증 발송
            </button>
          </div>

          {/* 인증 코드 입력 (발송 후 노출) */}
          {isEmailSent && !isEmailVerified && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="인증 코드 6자리"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 rounded-lg border border-blue-200 bg-blue-50/30 p-4 text-[15px] outline-none focus:border-[#155dfc] transition-all"
              />
              <button
                type="button"
                onClick={verifyCode}
                className="px-4 bg-blue-600 text-white rounded-lg text-[13px] font-bold hover:bg-blue-700 transition-all"
              >
                확인
              </button>
            </div>
          )}

          {/* 비밀번호 입력 */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호 입력 (8자 이상)"
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

          {/* 비밀번호 확인 */}
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-4 text-[15px] outline-none focus:border-[#155dfc] transition-all placeholder:text-gray-400"
          />

          <button
            type="submit"
            disabled={loading || !isEmailVerified}
            className="mt-4 w-full rounded-lg bg-[#155dfc] py-4 text-[16px] font-bold text-white hover:bg-[#158dfc] transition-all disabled:opacity-50 cursor-pointer"
          >
            새 계정으로 계속
          </button>
        </form>

        {/* Policy Text Area */}
        <div className="mt-10 text-[11px] text-gray-400 leading-relaxed text-center px-4">
          해당 계정은 doogo에서 제공하는 서비스를 모두 이용하실 수 있습니다. 가입 시, 통합 계정 및 서비스 <Link href="/policy/terms" target='_blank'><span className="underline">이용약관</span></Link>, <Link href="/policy/privacy" target='_blank'><span className="underline">개인정보 처리방침</span></Link>에 동의하는 것으로 간주합니다.
        </div>

        {/* 개인정보 처리방침 체크박스 */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <input 
            type="checkbox" 
            id="privacy" 
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="accent-[#155dfc] w-4 h-4" 
          />
          <label htmlFor="privacy" className="text-[12px] font-medium text-gray-700 cursor-pointer">
            개인정보 처리방침에 동의합니다.
          </label>
        </div>

        <div className="mt-8 text-[13px] text-gray-500">
          이미 회원이신가요? <Link href="/login" className="text-[#155dfc] font-bold hover:underline">로그인하기</Link>
        </div>
      </div>
    </div>
  );
}
