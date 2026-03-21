import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 

// 관리자 권한으로 클라이언트 생성 (RLS를 무시함)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(req: Request) {
  try {
    const { userId, amount, description } = await req.json();

    if (!userId || amount === undefined) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 1. 유저 현재 포인트 확인 (supabaseAdmin 사용)
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      console.error("프로필 조회 실패:", fetchError);
      return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    const cost = Math.abs(amount);
    if (profile.points < cost) {
      return NextResponse.json({ error: "포인트가 부족합니다." }, { status: 403 });
    }

    const newBalance = profile.points - cost;

    // 2. 포인트 업데이트 (supabaseAdmin 사용)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ points: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error("포인트 업데이트 실패:", updateError);
      throw updateError;
    }

    // 3. 포인트 로그 기록 (supabaseAdmin 사용 - RLS 무시하고 무조건 성공)
    const { error: logError } = await supabaseAdmin
      .from('point_logs')
      .insert({
        user_id: userId,
        amount: -cost,
        balance: newBalance,
        description: description || "포인트 차감",
      });

    if (logError) {
      console.error("로그 기록 실패:", logError);
      throw logError;
    }

    return NextResponse.json({ success: true, balance: newBalance });

  } catch (error: any) {
    console.error("포인트 차감 API 최종 에러:", error);
    return NextResponse.json({ error: error.message || "처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}