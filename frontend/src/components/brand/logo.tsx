import { cn } from '@/lib/utils';

export const MyLogo = ({ alt = 'MyLogo', className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src="/images/logo_sq_light.png"
      alt={alt}
      className={cn('size-8 min-w-8 dark:hidden', className)} // Light 모드일 때
      {...props}
    />
  );
};

export const MyLogoDark = ({ alt = 'MyLogo Dark', className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src="/images/logo_sq_dark.png"
      alt={alt}
      className={cn('size-8 min-w-8 hidden dark:block', className)} // Dark 모드일 때
      {...props}
    />
  );
};


// import { cn } from '@/lib/utils';
// import * as React from 'react';

// interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
//   color?: 'light' | 'dark'; // light 또는 dark 선택
// }

// const MyLogo = ({
//   color,
//   alt = 'MyLogo',
//   width = '1024',
//   height = '1024',
//   className,
//   ...props
// }: LogoProps) => {
//   // 다크 모드 감지
//   const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

//   const src =
//     color === 'dark' || (color === undefined && prefersDarkMode)
//       ? '/images/logo_sq_dark.png'
//       : '/images/logo_sq_light.png';

//   return (
//     <img
//       src={src}
//       alt={alt}
//       width={width}
//       height={height}
//       className={cn('size-8 min-w-8', className)}
//       {...props}
//     />

//   );
// };

