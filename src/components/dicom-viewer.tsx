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

// DICOM 파일 경로를 받기 위한 prop
interface DICOMViewerProps {
  dicomFileName: string;
}

const DICOMViewer: React.FC<DICOMViewerProps> = ({ dicomFileName }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // cornerstoneWADOImageLoader 구성
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstone.enable(element);

    // 파일 경로 변경 (예: 'dicomFileName' prop은 'yourfile.dcm'과 같은 값이어야 함)
    const imageId = `wadouri:${window.location.origin}/dicom/${dicomFileName}`;

    cornerstone.loadImage(imageId).then((image) => {
      cornerstone.displayImage(element, image);

      let zoom = 1; // 기본 Zoom 레벨 설정

      // 마우스 휠 이벤트로 Zoom 조절
      const onWheel = (e: WheelEvent) => {
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
