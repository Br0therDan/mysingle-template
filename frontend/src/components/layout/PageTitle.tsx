// src/components/layout/PageTitle.tsx
import React from 'react';
import usePageTitle from '@/hooks/usePageTitle'; // 훅 경로는 프로젝트 구조에 맞게 조정하세요.

const PageTitle: React.FC = () => {
  const title = usePageTitle();

  return (
    <div className="relative flex justify">
      <h1 className="scroll-m-20 text-3xl py-2 font-bold tracking-tight">
        {title || 'Home'} 
      </h1>
    </div>
  );
};

export default PageTitle;
