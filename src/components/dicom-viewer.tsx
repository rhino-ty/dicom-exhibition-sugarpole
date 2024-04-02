/** core
 * https://docs.cornerstonejs.org/
 */
/** cornerstoneWADOImageLoader
 * https://docs.cornerstonejs.org/concepts/image-loaders.html
 * https://github.com/cornerstonejs/cornerstoneWADOImageLoader
 */

import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

interface DICOMViewerProps {
  dicomFileName: string;
  isSelected: boolean;
  operation: string | null;
  setOperation: React.Dispatch<React.SetStateAction<string | null>>;
}

const DICOMViewer: React.FC<DICOMViewerProps> = ({ dicomFileName, isSelected, operation, setOperation }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  /// 이미지 로딩과 기본 설정을 위한 useEffect
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // cornerstone 설정, cornerstoneWADOImageLoader 구성
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstone.enable(element);

    // 파일 경로 설정 (예: 'dicomFileName' prop은 'yourfile.dcm'과 같은 값이어야 함)
    const imageId = `wadouri:${window.location.origin}/dicom/${dicomFileName}`;

    // display
    cornerstone.loadImage(imageId).then((image) => {
      cornerstone.displayImage(element, image);

      /// 윈도우 크기가 변경될 때마다 호출될 콜백 함수.
      const handleResize = () => {
        // 뷰포트의 크기를 조정하는 로직.
        if (elementRef.current) {
          const element = elementRef.current;
          cornerstone.resize(element, true); // Cornerstone에게 엘리먼트 크기가 변경되었음을 알리는 로직.
        }
      };

      /// 마우스 휠 이벤트로 Zoom 조절
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();

        // 현재 엘리먼트의 위치와 크기 정보를 가져옴. https://kyounghwan01.github.io/blog/JS/JSbasic/getBoundingClientRect/#%E1%84%8B%E1%85%A8%E1%84%89%E1%85%B5
        const rect = element.getBoundingClientRect();
        // 현재 뷰포트(이미지를 보여주는 영역)의 설정을 가져옴.
        const viewport = cornerstone.getViewport(element);

        if (viewport) {
          // 마우스 커서의 위치를 계산. 이 위치는 이미지 상에서의 실제 위치가 아닌, 브라우저 화면 기준(엘리먼트의 중앙을 기준으로한) 좌표.
          const deltaX = e.clientX - rect.left - rect.width / 2;
          const deltaY = e.clientY - rect.top - rect.height / 2;

          // 확대/축소 비율을 조정. 마우스 휠의 방향에 따라 스케일을 조정하며,
          // e.deltaY * -0.001는 휠을 내릴 때 확대하고 올릴 때 축소.
          let newScale = viewport.scale + e.deltaY * -0.001;
          // 확대/축소 비율의 최소값과 최대값을 설정해, 너무 많이 확대하거나 축소하는 것을 방지.
          newScale = Math.min(Math.max(0.5, newScale), 4);

          // 이미지를 확대/축소할 때, 커서 기준으로 확대/축소되도록 translation을 조정.
          const newTranslation = {
            x: viewport.translation.x - deltaX / viewport.scale + deltaX / newScale,
            y: viewport.translation.y - deltaY / viewport.scale + deltaY / newScale,
          };

          // 뷰포트 설정을 업데이트.
          cornerstone.setViewport(element, {
            ...viewport,
            scale: newScale,
            translation: newTranslation,
          });
        }
      };

      // 조작 명령에 따라 Cornerstone 뷰포트 설정 변경
      if (isSelected && operation) {
        switch (operation) {
          case 'FlipH':
            // Flip H 조작 구현
            const viewport = cornerstone.getViewport(element);
            if (viewport) {
              viewport.hflip = !viewport.hflip; // hflip 값을 반전시킵니다.
              cornerstone.setViewport(element, viewport); // 변경된 뷰포트 설정을 적용합니다.
            }
            setOperation(null); // 조작 완료 후 콜백 호출
            break;
        }
      }

      // 정의한 마우스 휠 이벤트 핸들러를 엘리먼트에 추가.
      element.addEventListener('wheel', onWheel);
      // 윈도우 리사이즈 이벤트 리스너를 추가.
      window.addEventListener('resize', handleResize);

      // 컴포넌트가 언마운트 및 DICOM 파일이 변경되어 useEffect가 다시 실행될 때, 이전에 추가한 이벤트 리스너를 제거.
      return () => {
        element.removeEventListener('wheel', onWheel);
        window.removeEventListener('resize', handleResize);
      };
    });

    // 컴포넌트가 언마운트될 때, cornerstone을 통해 활성화된 엘리먼트를 비활성화
    return () => {
      cornerstone.disable(element);
    };
  }, [dicomFileName]);

  return <div ref={elementRef} className={'h-full w-full'} />;
};

export default DICOMViewer;
