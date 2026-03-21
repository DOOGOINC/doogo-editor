import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { userId, amount, description } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // 1. 유저 현재 포인트 확인
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) {
      return NextResponse.json({ error: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    const cost = Math.abs(amount);
    if (profile.points < cost) {
      return NextResponse.json({ error: "포인트가 부족합니다." }, { status: 403 });
    }

    const newBalance = profile.points - cost;

    // 2. 포인트 업데이트
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newBalance })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 3. 포인트 로그 기록
    const { error: logError } = await supabase
      .from('point_logs')
      .insert({
        user_id: userId,
        amount: -cost,
        balance: newBalance,
        description: description || "포인트 차감",
      });

    if (logError) throw logError;

    return NextResponse.json({ success: true, balance: newBalance });

  } catch (error: any) {
    console.error("포인트 차감 API 에러:", error);
    return NextResponse.json({ error: "처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
