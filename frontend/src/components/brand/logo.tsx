import { cn } from '@/lib/utils';
import * as React from 'react';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  color?: 'light' | 'dark'; // light 또는 dark 선택
}

const MyLogo = ({
  color,
  alt = 'MyLogo',
  width = '1024',
  height = '1024',
  className,
  ...props
}: LogoProps) => {
  // 다크 모드 감지
  const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const src =
    color === 'dark' || (color === undefined && prefersDarkMode)
      ? '/images/logo_sq_dark.png'
      : '/images/logo_sq_light.png';

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn('size-8 min-w-8', className)}
      {...props}
    />
  );
};


export { MyLogo, type LogoProps };
