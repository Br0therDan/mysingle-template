// src/hooks/usePageTitle.ts
import { useMemo } from 'react';
import { useRouter } from '@tanstack/react-router';

const usePageTitle = (): string => {
  const router = useRouter();

  // TypeScript가 정확히 인식하지 못할 수 있으므로, 일단 any로 단언
  const pathname = useMemo(() => {
    const state = router.state as any;
    console.log('Router State:', state);
    // 만약 currentLocation 속성이 있다면
    if (state.currentLocation && state.currentLocation.pathname) {
      return state.currentLocation.pathname as string;
    }

    // 어떤 이유로 없으면, window.location.pathname을 fallback으로
    return window.location.pathname;
  }, [router.state]);

  const title = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    return pathSegments
      .map((segment: string) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }, [pathname]);

  return title;
};

export default usePageTitle;
