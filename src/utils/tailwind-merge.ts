// 이 유틸함수는 tailwindcss를 사용할 때 발생할 수 있는 클래스 충돌 문제를 해결, shadcn/ui에선 필수
// https://xionwcfm.tistory.com/328
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
