import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';

interface DICOMViewerProps {
  dicomFileName: string; // DICOM 파일 경로를 받기 위한 prop
}

const DICOMViewer: React.FC<DICOMViewerProps> = ({ dicomFileName }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element: HTMLDivElement = elementRef.current;

    cornerstone.enable(element);

    // prop으로 받은 DICOM 파일 경로를 사용하여 이미지 로드
    cornerstone.loadImage(`wadouri:${import.meta.env.BASE_URL}/dicom/${dicomFileName}`).then((image) => {
      cornerstone.displayImage(element, image);

      let zoom = 1; // 기본 Zoom 레벨 설정

      const onWheel = (e: WheelEvent) => {
        // 마우스 휠 이벤트로 Zoom 조절
        e.preventDefault();
        const viewport = cornerstone.getViewport(element);

        // viewport가 undefined일 수도 있으므로 조건 설정
        if (viewport) {
          zoom += e.deltaY * -0.001; // Wheel 이벤트에 따라 zoom 값 조정
          zoom = Math.min(Math.max(0.125, zoom), 4); // Zoom 값 제한

          viewport.scale = zoom; // viewport에 zoom 적용
          cornerstone.setViewport(element, viewport);
        }
      };

      element.addEventListener('wheel', onWheel);

      return () => {
        element.removeEventListener('wheel', onWheel);
      };
    });

    return () => {
      cornerstone.disable(element);
    };
  }, [dicomFileName]);

  return <div ref={elementRef} style={{ width: '512px', height: '512px' }}></div>;
};

export default DICOMViewer;
