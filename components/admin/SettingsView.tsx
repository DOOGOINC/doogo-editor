'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Zap, RotateCcw, Loader2, FileText } from 'lucide-react';
import { POINT_PACKAGES as INITIAL_PACKAGES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export const SettingsView = () => {
  const [packages, setPackages] = useState(INITIAL_PACKAGES);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // 0. 서비스 이용 비용 설정 상태 추가
  const [serviceCosts, setServiceCosts] = useState({
    png_save_cost: 100,
    ai_generate_cost: 1000
  });
  const [isSavingCosts, setIsSavingCosts] = useState(false);

  // 1. 초기 데이터 불러오기 (DB에 저장된 설정이 있으면 가져옴)
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        // 패키지 설정 로드
        const { data: pkgData, error: pkgError } = await supabase
          .from('package_settings')
          .select('*')
          .order('id', { ascending: true });

        if (pkgError) throw pkgError;
        
        if (pkgData && pkgData.length > 0) {
          setPackages(pkgData);
        }

        // 서비스 비용 설정 로드
        const { data: costData, error: costError } = await supabase
          .from('system_settings')
          .select('*');
        
        if (!costError && costData && costData.length > 0) {
          const costs: any = {};
          costData.forEach(item => {
            costs[item.key] = parseInt(item.value);
          });
          if (costs.png_save_cost !== undefined || costs.ai_generate_cost !== undefined) {
            setServiceCosts({
              png_save_cost: costs.png_save_cost !== undefined ? costs.png_save_cost : 100,
              ai_generate_cost: costs.ai_generate_cost !== undefined ? costs.ai_generate_cost : 1000
            });
          }
        }
      } catch (error) {
        console.error('설정 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 입력값 변경 핸들러 (패키지용)
  const handleChange = (id: number, field: string, value: any) => {
    setPackages(prev => prev.map(pkg => 
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    ));
  };

  // 서비스 비용 변경 핸들러
  const handleCostChange = (field: string, value: number) => {
    setServiceCosts(prev => ({ ...prev, [field]: value }));
  };

  // 서비스 비용 저장
  const handleSaveCosts = async () => {
    setIsSavingCosts(true);
    try {
      const settingsToSave = [
        { key: 'png_save_cost', value: serviceCosts.png_save_cost.toString(), updated_at: new Date().toISOString() },
        { key: 'ai_generate_cost', value: serviceCosts.ai_generate_cost.toString(), updated_at: new Date().toISOString() }
      ];

      const { error } = await supabase
        .from('system_settings')
        .upsert(settingsToSave, { onConflict: 'key' });

      if (error) throw error;
      alert('서비스 이용 비용 설정이 저장되었습니다!');
    } catch (error: any) {
      console.error('저장 에러:', error);
      alert('비용 설정 저장 중 오류가 발생했습니다. (테이블 생성 확인 필요)');
    } finally {
      setIsSavingCosts(false);
    }
  };

  // 패키지 삭제
  const removePackage = (id: number) => {
    if (confirm('이 패키지를 삭제하시겠습니까?')) {
      setPackages(prev => prev.filter(pkg => pkg.id !== id));
    }
  };

  // 패키지 추가
  const addPackage = () => {
    const newId = packages.length > 0 ? Math.max(...packages.map(p => p.id), 0) + 1 : 1;
    setPackages([...packages, { 
      id: newId, 
      points: 0, 
      price: 0, 
      bonus: 0, 
      tag: '신규', 
      popular: false 
    }]);
  };

  // DB에 설정 저장 (Upsert 로직)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. 기존 데이터를 모두 지우고 새로 넣거나, upsert를 사용합니다.
      // 여기서는 id 기반으로 upsert를 진행합니다.
      const { error } = await supabase
        .from('package_settings')
        .upsert(
          packages.map(pkg => ({
            id: pkg.id,
            points: pkg.points,
            price: pkg.price,
            bonus: pkg.bonus,
            tag: pkg.tag,
            popular: pkg.popular,
            updated_at: new Date().toISOString()
          }))
        );

      if (error) throw error;
      
      alert('포인트 패키지 설정이 DB에 성공적으로 저장되었습니다!');
    } catch (error: any) {
      console.error('저장 에러:', error);
      alert('설정 저장 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-[#155dfc]" size={40} />
        <p className="text-gray-500 font-bold">설정 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h3 className="text-[24px] font-black text-gray-900 tracking-tighter">포인트 패키지 설정</h3>
            <p className="text-[13px] text-gray-400 font-medium mt-1">결제 페이지에 노출될 포인트 상품 정보를 관리합니다.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={addPackage} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold text-[13px] transition-all"
            >
              <Plus size={18} /> 패키지 추가
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#155dfc] hover:bg-[#158dfc] text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-[#155dfc]/20 transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? '저장 중...' : '설정 저장하기'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {packages.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">등록된 패키지가 없습니다. 추가 버튼을 눌러주세요.</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-wrap items-center gap-6 ${
                  pkg.popular ? 'border-[#155dfc]/20 bg-[#155dfc]/5' : 'border-gray-50 bg-gray-50/30'
                }`}
              >
                <div className="flex-1 min-w-[280px] grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-black text-gray-400 ml-2 mb-1 block uppercase">태그</label>
                    <input 
                      type="text" 
                      value={pkg.tag} 
                      onChange={(e) => handleChange(pkg.id, 'tag', e.target.value)}
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#155dfc] transition-colors"
                      placeholder="예: 인기, 추천"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-gray-400 ml-2 mb-1 block uppercase">포인트(P)</label>
                    <input 
                      type="number" 
                      value={pkg.points} 
                      onChange={(e) => handleChange(pkg.id, 'points', parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#155dfc] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-gray-400 ml-2 mb-1 block uppercase">가격(원)</label>
                    <input 
                      type="number" 
                      value={pkg.price} 
                      onChange={(e) => handleChange(pkg.id, 'price', parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[14px] font-bold focus:outline-none focus:border-[#155dfc] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-[#FF6467] ml-2 mb-1 block uppercase">보너스(P)</label>
                    <input 
                      type="number" 
                      value={pkg.bonus} 
                      onChange={(e) => handleChange(pkg.id, 'bonus', parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[14px] font-bold text-[#FF6467] focus:outline-none focus:border-[#FF6467] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 border-l border-gray-200 pl-6 ml-auto md:ml-0">
                  <button 
                    onClick={() => handleChange(pkg.id, 'popular', !pkg.popular)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black transition-all ${
                      pkg.popular 
                        ? 'bg-[#155dfc] text-white shadow-md shadow-[#155dfc]/20' 
                        : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {pkg.popular ? 'POPULAR 활성' : '일반'}
                  </button>
                  <button 
                    onClick={() => removePackage(pkg.id)} 
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    title="패키지 삭제"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 💡 서비스 이용 비용 설정 섹션 추가 */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h3 className="text-[24px] font-black text-gray-900 tracking-tighter">서비스 이용 비용 설정</h3>
            <p className="text-[13px] text-gray-400 font-medium mt-1">PNG 저장 및 AI 문구 생성 시 차감될 포인트를 설정합니다.</p>
          </div>
          <button 
            onClick={handleSaveCosts} 
            disabled={isSavingCosts}
            className={`flex items-center justify-center gap-2 px-6 py-3 bg-[#155dfc] hover:bg-[#158dfc] text-white rounded-2xl font-bold text-[13px] shadow-lg shadow-[#155dfc]/20 transition-all ${isSavingCosts ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSavingCosts ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSavingCosts ? '저장 중...' : '비용 설정 저장하기'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-50 flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-[#155dfc]">
              <FileText size={28} />
            </div>
            <div className="flex-1">
              <label className="text-[12px] font-black text-gray-400 mb-2 block uppercase">PNG 저장 비용 (P)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={serviceCosts.png_save_cost} 
                  onChange={(e) => handleCostChange('png_save_cost', parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-[18px] font-black text-[#333] focus:outline-none focus:border-[#155dfc] transition-colors pr-12"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">P</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-50 flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-[#155dfc]">
              <Zap size={28} />
            </div>
            <div className="flex-1">
              <label className="text-[12px] font-black text-gray-400 mb-2 block uppercase">AI 문구 생성 비용 (P)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={serviceCosts.ai_generate_cost} 
                  onChange={(e) => handleCostChange('ai_generate_cost', parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-[18px] font-black text-[#333] focus:outline-none focus:border-[#155dfc] transition-colors pr-12"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">P</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};