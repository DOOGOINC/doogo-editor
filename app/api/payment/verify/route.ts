import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET;

export async function POST(req: Request) {
  try {
    const { paymentId, points, bonus } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ message: '결제 ID가 누락되었습니다.' }, { status: 400 });
    }

    // 1. 포트원 API로 결제 정보 조회 (서버 측 검증)
    const paymentResponse = await fetch(`https://api.portone.io/payments/${paymentId}`, {
      headers: {
        Authorization: `PortOne ${PORTONE_API_SECRET}`,
      },
    });

    if (!paymentResponse.ok) {
      const errorMsg = await paymentResponse.text();
      return NextResponse.json({ message: `결제 조회 실패: ${errorMsg}` }, { status: 500 });
    }

    const paymentData = await paymentResponse.json();

    // 2. 결제 상태 확인
    if (paymentData.status !== 'PAID') {
      return NextResponse.json({ message: `결제가 완료되지 않았습니다. (상태: ${paymentData.status})` }, { status: 400 });
    }

    // 3. 유저 ID 가져오기
    const userId = paymentData.customer?.id || paymentData.customData?.userId;
    // (참고: 프론트엔드에서 requestPayment 시 customer.id에 유저 ID를 넣어주면 좋습니다.)
    
    // 만약 customer id가 없다면, 현재 로그인한 유저 세션 확인 (서버 사이드)
    // 여기서는 프론트엔드에서 넘겨받은 유저 정보를 신뢰하지 않고 DB 기반으로 처리하는 것이 안전합니다.
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(paymentData.customer?.id || '');
    
    if (!user) {
       // 실제 운영 환경에서는 paymentData.customer.id에 Supabase userId를 심어야 합니다.
       // 여기서는 테스트를 위해 유연하게 처리하거나 로깅합니다.
    }

    // 4. DB 포인트 지급 로직 (트랜잭션 대신 순차 처리)
    const totalPointsToAdd = points + bonus;
    
    // 유저의 현재 포인트 조회
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points, id')
      .eq('id', paymentData.customer?.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ message: '사용자 프로필을 찾을 수 없습니다.' }, { status: 404 });
    }

    const newBalance = (profile.points || 0) + totalPointsToAdd;

    // 포인트 업데이트 및 로그 기록
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newBalance, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    // 결제 내역 저장
    await supabase.from('payments').insert({
      user_id: profile.id,
      payment_id: paymentId,
      order_name: paymentData.orderName,
      amount: paymentData.amount.total,
      points: points, // 충전 포인트 저장
      bonus: bonus,   // 보너스 포인트 저장
      status: 'PAID',
      receipt_url: paymentData.receiptUrl,
    });

    // 포인트 로그 저장
    await supabase.from('point_logs').insert({
      user_id: profile.id,
      amount: totalPointsToAdd,
      balance: newBalance,
      description: `포인트 충전: ${points.toLocaleString()}P (+보너스 ${bonus.toLocaleString()}P)`,
    });

    return NextResponse.json({ success: true, balance: newBalance });

  } catch (error: any) {
    console.error('결제 검증 오류:', error);
    return NextResponse.json({ message: error.message || '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
