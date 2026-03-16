import PolicyLayout from '@/components/policy/PolicyLayout';

export default function TermsPage() {
  return (
    <PolicyLayout>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-[32px] font-bold text-gray-900">doogo 이용약관</h1>
      </div>

      <div className="space-y-8 text-[16px] text-gray-700 leading-[1.8]">
        <h2 className="text-[20px] font-bold text-gray-900">제 1 조 (목적)</h2>
        <p>
          본 약관은 주식회사 doogo(이하 &quot;회사&quot;라 합니다)이 운영하는 온라인 강의 플랫폼 &apos;doogo&apos;에서 제공하는 서비스(이하 &quot;서비스&quot;라 합니다)를 이용함에 있어 &quot;회사&quot;와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
        
      </div>
    </PolicyLayout>
  );
}
