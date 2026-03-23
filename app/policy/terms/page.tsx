import PolicyLayout from '@/components/policy/PolicyLayout';

export default function TermsPage() {
  return (
    <PolicyLayout>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-bold text-gray-900">doogo 이용약관</h1>
      </div>

      <div className="space-y-12 text-[15px] text-gray-700 leading-[1.8]">
        {/* 제 1 조 */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 1 조 (목적)</h2>
          <p>
            본 약관은 주식회사 doogo(이하 &quot;회사&quot;)가 운영하는 &quot;doogo&quot; 웹사이트 및 관련 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        {/* 제 2 조 */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 2 조 (용어의 정의)</h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li><strong>회원:</strong> 본 약관에 동의하고 서비스 이용계약을 체결한 이용자</li>
            <li><strong>포인트:</strong> 서비스 내 유료 기능을 이용하기 위해 사용하는 사이버머니</li>
            <li><strong>결제:</strong> 포인트 충전을 위해 현금 또는 이에 상응하는 결제 수단을 회사에 제공하는 행위</li>
          </ul>
        </section>

        {/* 제 3 조 */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 3 조 (약관의 명시와 개정)</h2>
          <p>
            1. 회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.<br />
            2. 회사는 관련 법령을 위반하지 않는 범위 내에서 본 약관을 개정할 수 있으며, 개정 시 적용 일자 7일 전부터 공지합니다. 이용자에게 불리한 변경의 경우 30일 전부터 공지합니다.
          </p>
        </section>

        {/* 제 4 조 - 결제 및 부가세 (심사 필수) */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 4 조 (포인트의 충전 및 사용)</h2>
          <div className="bg-gray-50 p-6 rounded-xl space-y-3">
            <p>1. 서비스에서 제공하는 모든 유료 포인트 및 이용권의 결제 금액에는 <strong>부가가치세(VAT) 10%가 포함</strong>되어 있습니다.</p>
            <p>2. 포인트의 <strong>유효기간은 구매일로부터 1년</strong>입니다. 기간 경과 시 상법상 소멸시효에 따라 포인트는 자동 소멸됩니다.</p>
            <p>3. 포인트 충전 환금성 업종으로 카드결제로만 포인트 충전이 가능합니다 ( 계좌이체 및 다른 결제수단 이용 불가)</p>
          </div>
        </section>

        {/* 제 5 조 - 환불 및 청약철회 (심사 필수) */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 5 조 (청약철회 및 환불 정책)</h2>
          <p>1. 회원은 포인트 구매 후 7일 이내에 사용 내역이 없는 경우 청약철회(환불)를 요청할 수 있습니다.</p>
          <p>2. 다음의 경우 환불이 제한될 수 있습니다.</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>구매한 포인트를 이미 일부라도 사용한 경우</li>
            <li>무상으로 지급받은 이벤트 포인트의 경우</li>
            <li>회원 탈퇴 시 잔여 포인트에 대한 보상을 포기한 경우</li>
          </ul>
          <p>3. 환불 시 PG사 결제 수수료 등 제반 비용을 제외한 금액이 환급될 수 있습니다.</p>
        </section>

        {/* 제 6 조 */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 6 조 (회사의 의무)</h2>
          <p>
            1. 회사는 관련 법령과 본 약관이 금지하거나 미풍양속에 어긋나는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다합니다.<br />
            2. 회사는 이용자의 개인정보보호를 위해 보안 시스템을 갖추며 개인정보처리방침을 준수합니다.
          </p>
        </section>

        {/* 제 7 조 */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 7 조 (이용자의 의무)</h2>
          <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>타인의 정보 도용 또는 허위 정보 등록</li>
            <li>서비스의 시스템을 해킹하거나 정상적인 운영을 방해하는 행위</li>
            <li>AI 생성 기능을 악용하여 음란물, 사행성 콘텐츠 등 불법 결과물을 제작하는 행위</li>
          </ul>
        </section>

        {/* 제 8 조 */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 8 조 (저작권 및 책임 제한)</h2>
          <p>
            1. 서비스에서 제공하는 AI 모델을 통해 생성된 상세페이지 결과물의 저작권 귀속은 관련 법령에 따르며, 최종적인 사용 책임은 회원 본인에게 있습니다.<br />
            2. 회사는 AI 기술의 특성상 생성 결과물의 정확성, 객관성, 저작권 침해 여부에 대해 어떠한 보증도 하지 않습니다.
          </p>
        </section>

        {/* 제 9 조 */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-bold text-gray-900">제 9 조 (서비스 중단 및 손해배상)</h2>
          <p>
            1. 회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장 등으로 인한 경우 서비스 제공을 일시적으로 중단할 수 있습니다.<br />
            2. 회사의 고의 또는 중과실이 없는 한, 서비스 이용과 관련하여 발생한 간접적, 특별한 손해에 대해서는 책임을 지지 않습니다.
          </p>
        </section>

        {/* 제 10 조 */}
        <section className="space-y-4 border-t border-gray-100 pt-10">
          <h2 className="text-[18px] font-bold text-gray-900">제 10 조 (준거법 및 재판관할)</h2>
          <p>
            서비스 이용과 관련하여 회사와 회원 사이에 분쟁이 발생한 경우, 대한민국 법령에 따르며 회사의 본점 소재지 관할 법원을 합의 관할 법원으로 합니다.
          </p>
        </section>

        {/* 부칙 */}
        <div className="pt-10 text-[13px] text-gray-500 space-y-1">
          <p>공고일자: 2026년 03월 16일</p>
          <p>시행일자: 2026년 03월 16일</p>
          <p>주식회사 두고 (대표자: 문원오)</p>
        </div>
      </div>
    </PolicyLayout>
  );
}