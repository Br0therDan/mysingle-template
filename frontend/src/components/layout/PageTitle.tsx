import { useRouter } from '@tanstack/react-router';

const PageTitle = () => {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);

  // 각 경로 세그먼트의 첫 글자를 대문자로 변환
  const PagePath = pathSegments.map(segment => 
    segment.charAt(0).toUpperCase() + segment.slice(1)
  );

  // Title 생성
  const title = PagePath.join(' > '); // 원하는 구분자 사용 가능 (예: ' > ')

  return (
    <div className="relative flex justify">
      <h1 className="scroll-m-20 text-3xl py-2 font-bold tracking-tight">
        {title || "Home"}
      </h1>
    </div>
  );
};

export default PageTitle;
