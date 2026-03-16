'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, Home, Layout, 
  MoreVertical, Sparkles, Loader2,
  Trash, ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('프로젝트 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewProject = async () => {
    try {
      setIsCreating(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('로그인이 필요한 서비스입니다.');
        router.push('/login');
        return;
      }

      const newProject = {
        user_id: user.id,
        name: '제목 없는 상세페이지',
        content: [],
        main_color: '#3b82f6',
        font_family: 'Pretendard',
        title_font_family: 'Pretendard',
        body_font_family: 'Pretendard',
        font_size_step: 1,
        is_deleted: false
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select()
        .single();

      if (error) throw error;
      router.push(`/editor?id=${data.id}`);
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트를 생성하는 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('이 프로젝트를 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
      setActiveMenuId(null);
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col" onClick={() => setActiveMenuId(null)}>
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* 1. 사이드바: 마이페이지 스타일 메뉴 리스트 */}
            <aside className="w-full md:w-[240px] shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden py-2 sticky top-[100px]">
                <button 
                  onClick={() => setActiveTab('home')}
                  className={`w-full cursor-pointer flex items-center justify-between p-4 px-6 text-[14px] transition-all group ${
                    activeTab === 'home' ? 'bg-gray-50 text-[#155dfc]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home size={18} className={`${activeTab === 'home' ? 'text-[#155dfc]' : 'text-gray-300 group-hover:text-gray-500'}`} />
                    <span className="font-bold">홈</span>
                  </div>
                  <ChevronRight size={16} className={`${activeTab === 'home' ? 'text-[#155dfc]' : 'text-gray-200'}`} />
                </button>
                <button 
                  onClick={() => setActiveTab('projects')}
                  className={`w-full cursor-pointer flex items-center justify-between p-4 px-6 text-[14px] transition-all group ${
                    activeTab === 'projects' ? 'bg-gray-50 text-[#155dfc]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layout size={18} className={`${activeTab === 'projects' ? 'text-[#155dfc]' : 'text-gray-300 group-hover:text-gray-500'}`} />
                    <span className="font-bold">내 프로젝트</span>
                  </div>
                  <ChevronRight size={16} className={`${activeTab === 'projects' ? 'text-[#155dfc]' : 'text-gray-200'}`} />
                </button>
              </div>
            </aside>

            {/* 2. 메인 콘텐츠 영역 */}
            <div className="flex-1 min-w-0 space-y-8">
              {/* 상단 섹션: 마이페이지 스타일 헤더 및 버튼 */}
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h1 className="text-[28px] font-bold text-gray-900 flex items-center gap-2 tracking-tight">
                    {activeTab === 'home' ? (
                      <>반가워요! <Sparkles size={24} className="text-[#155dfc]" /></>
                    ) : (
                      <>내 프로젝트</>
                    )}
                  </h1>
                  <p className="text-[14px] text-gray-400 mt-2 font-bold uppercase tracking-wider">
                    {activeTab === 'home' ? '환영합니다. 멋진 상세페이지를 만들어보세요.' : `총 ${projects.length}개의 디자인이 있습니다.`}
                  </p>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCreateNewProject(); }}
                  disabled={isCreating}
                  className="bg-[#155dfc] text-white px-8 py-4 rounded-xl font-black text-[15px] hover:bg-[#158dfc] transition-all shadow-lg shadow-[#155dfc]/20 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isCreating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} strokeWidth={3} />}
                  <span>새 프로젝트 만들기</span>
                </button>
              </div>

              {/* 프로젝트 그리드 */}
              {loading ? (
                <div className="bg-white rounded-2xl p-20 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-gray-400">
                  <Loader2 size={40} className="animate-spin mb-4 text-[#155dfc]" />
                  <p className="font-bold text-[14px]">데이터를 가져오고 있어요</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Layout size={28} className="text-gray-200" />
                  </div>
                  <h4 className="text-[16px] font-bold text-gray-900 mb-2">아직 프로젝트가 없네요</h4>
                  <button 
                    onClick={handleCreateNewProject}
                    className="mt-8 text-[14px] font-bold text-[#155dfc] hover:underline underline-offset-4 transition-all"
                  >
                    첫 번째 상세페이지를 지금 바로 만들기 &gt;
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <div key={project.id} className="group flex flex-col">
                      <div className="aspect-[3/4] bg-white rounded-2xl overflow-hidden border border-gray-100 mb-4 relative shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#155dfc]/5 hover:-translate-y-1 hover:border-[#155dfc]/20 cursor-pointer">
                        {/* 💡 썸네일 이미지 표시 로직 추가 */}
                        <div className="w-full h-full bg-[#f8f9fa] transition-transform duration-700 group-hover:scale-105">
                          {project.thumbnail ? (
                            <img 
                              src={project.thumbnail} 
                              alt={project.name} 
                              className="w-full h-full object-cover object-top" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Layout size={48} className="text-gray-200" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center backdrop-blur-none group-hover:backdrop-blur-[1px]">
                          <Link 
                            href={`/editor?id=${project.id}`} 
                            className="bg-white text-gray-900 px-6 py-3 rounded-xl text-[14px] font-black opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-xl border border-gray-100"
                          >
                            편집하기
                          </Link>
                        </div>
                      </div>                      
                      <div className="flex justify-between items-start px-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[16px] font-bold text-gray-900 truncate group-hover:text-[#155dfc] transition-colors tracking-tight">{project.name}</h4>
                          <p className="text-[12px] text-gray-400 font-medium mt-1">
                            {new Date(project.updated_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                        
                        <div className="relative">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setActiveMenuId(activeMenuId === project.id ? null : project.id);
                            }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-300 hover:text-gray-500 cursor-pointer"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {activeMenuId === project.id && (
                            <div className="absolute right-0 top-10 w-36 bg-white border border-gray-100 shadow-2xl rounded-xl py-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
                                className="w-full text-left px-4 py-2 text-[13px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
                              >
                                <Trash size={14} />
                                <span>삭제하기</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}