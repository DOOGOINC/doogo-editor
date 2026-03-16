import PolicyLayout from '@/components/policy/PolicyLayout';

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-bold text-gray-900">개인정보 처리방침</h1>
      </div>

      <div className="space-y-8 text-[16px] text-gray-700 leading-[1.8]">
        <p>
          주식회사 doogo (이하 &quot;회사&quot;)는 개인정보를 소중하게 생각하고 개인정보를 보호하기 위하여 최선을 다하고 있습니다. &quot;회사&quot;는 본 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드리고자 합니다. 본 개인정보처리방침은 정부의 법률 및 지침 변경이나 &quot;회사&quot;의 내부 방침 변경 등으로 인하여 수시로 변경될 수 있으며, 변경될 경우 변경된 개인정보처리방침을 &quot;회사&quot;가 제공하는 서비스 페이지에 공지하도록 하겠습니다.
        </p>

        <p>
          &quot;회사&quot;의 개인정보처리방침은 다음과 같은 내용을 포함하고 있습니다.
        </p>

        <ol className="list-decimal list-inside space-y-4 font-medium">
          <li>개인정보의 수집 및 이용 목적, 항목 및 수집방법</li>
          <li>개인정보 제 3자 제공 동의</li>
          <li>개인정보의 제공 및 처리위탁</li>
          <li>개인정보 수집·이용의 거부 시 불이익</li>
          <li>개인정보 보유 및 이용기간</li>
          <li>개인정보의 파기절차 및 방법</li>
          <li>회원의 권리와 행사 방법</li>
          <li>개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항</li>
          <li>개인정보 보호를 위한 기술적/관리적 대책</li>
          <li>개인정보 관리 책임자의 성명, 연락처, 부서</li>
          <li>권익침해 구제방법</li>
          <li>고지의 의무</li>
          <li>부칙</li>
        </ol>
      </div>
    </PolicyLayout>
  );
}
