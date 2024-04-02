/** core
 * https://docs.cornerstonejs.org/
 */
/** cornerstoneWADOImageLoader
 * https://docs.cornerstonejs.org/concepts/image-loaders.html
 * https://github.com/cornerstonejs/cornerstoneWADOImageLoader
 */

import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
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
    // Init cornerstone tools
    cornerstoneTools.init();

    // 파일 경로 설정 (예: 'dicomFileName' prop은 'yourfile.dcm'과 같은 값이어야 함)
    const imageId = `wadouri:${window.location.origin}/dicom/${dicomFileName}`;

    cornerstone.loadImage(imageId).then((image) => {
      cornerstone.displayImage(element, image);
    });

    // cornerstoneTools의 줌 기능
    const ZoomTool = cornerstoneTools.ZoomTool;

    cornerstoneTools.addTool(cornerstoneTools.ZoomTool, {
      // Optional configuration
      configuration: {
        invert: false,
        preventZoomOutsideImage: false,
        minScale: 0.1,
        maxScale: 20.0,
      },
    });

    cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 });

    return () => {
      cornerstone.disable(element);
    };
  }, [dicomFileName]);

  return <div ref={elementRef} style={{ width: '512px', height: '512px' }}></div>;
};

export default DICOMViewer;
