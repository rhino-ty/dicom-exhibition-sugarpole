// cornerstone-wado-image-loader.d.ts
declare module 'cornerstone-wado-image-loader' {
  import { CornerstoneImage, CornerstoneImageLoader } from 'cornerstone-core';
  import { DicomParser } from 'dicom-parser';

  // external 객체와 속성들에 대한 타입 정의
  export const external: {
    cornerstone: typeof cornerstone;
    dicomParser: typeof dicomParser;
  };

  // loadImage 함수의 타입 정의 (임시)
  export function loadImage(imageId: string): Promise<CornerstoneImage>;
}
