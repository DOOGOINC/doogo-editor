import PolicyLayout from '@/components/policy/PolicyLayout';

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-bold text-gray-900">개인정보 처리방침</h1>
      </div>

      <div className="space-y-12 text-[15px] text-gray-700 leading-[1.8]">
        <section className="space-y-4">
          <p>
            주식회사 doogo (이하 &quot;회사&quot;)는 개인정보를 소중하게 생각하고 개인정보를 보호하기 위하여 최선을 다하고 있습니다. &quot;회사&quot;는 본 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드리고자 합니다.
          </p>
        </section>

        {/* 1. 수집 항목 및 목적 */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-gray-900">1. 개인정보의 수집 및 이용 목적, 항목 및 수집방법</h2>
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <p><strong>수집항목:</strong> 이메일, 비밀번호, 닉네임, 서비스 이용 기록, 접속 로그, 결제 기록(카드사명, 승인번호 등), 상품 정보(사용자가 입력한 텍스트 및 이미지)</p>
            <p><strong>이용목적:</strong> 회원 식별 및 관리, AI 상세페이지 생성 서비스 제공, 포인트 충전 및 결제 서비스 제공, 고객 상담 및 불만 처리</p>
          </div>
        </section>

        {/* 2. 제3자 제공 */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-gray-900">2. 개인정보 제 3자 제공 동의</h2>
          <p>&quot;회사&quot;는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만, 결제 처리를 위하여 아래와 같이 제공합니다.</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>제공받는 자:</strong> 토스페이먼츠(주)</li>
            <li><strong>제공 목적:</strong> 전자결제 및 대금 결제 서비스 제공</li>
            <li><strong>제공 항목:</strong> 주문정보, 결제금액, 결제수단 정보</li>
          </ul>
        </section>

        {/* 3. 처리위탁 */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-gray-900">3. 개인정보의 제공 및 처리위탁</h2>
          <p>&quot;회사&quot;는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁하고 있습니다.</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>위탁 대상:</strong> Supabase (데이터베이스 보관), Vercel (서버 호스팅), Google Gemini API (AI 분석 및 생성)</li>
            <li><strong>위탁 업무:</strong> 데이터 저장 및 관리, 인프라 운영, AI 콘텐츠 생성 처리</li>
          </ul>
        </section>

        {/* 5. 보유 및 이용기간 */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-gray-900">5. 개인정보 보유 및 이용기간</h2>
          <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령에 의해 보존할 필요가 있는 경우 아래와 같이 보관합니다.</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
            <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
            <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
          </ul>
        </section>

        {/* 10. 관리 책임자 */}
        <section className="space-y-4">
          <h2 className="text-[20px] font-bold text-gray-900">10. 개인정보 관리 책임자의 성명, 연락처, 부서</h2>
          <div className="border border-gray-100 p-6 rounded-xl">
            <p><strong>성명:</strong> 문원오</p>
            <p><strong>부서:</strong> 개인정보보호팀</p>
            <p><strong>연락처:</strong> 070-7174-2186 / doogobiz@gmail.com</p>
          </div>
        </section>

        {/* 13. 부칙 */}
        <section className="space-y-4 pt-10 border-t border-gray-100">
          <h2 className="text-[20px] font-bold text-gray-900">13. 부칙</h2>
          <p>본 방침은 2026년 3월 16일부터 시행됩니다.</p>
        </section>
      </div>
    </PolicyLayout>
  );
}