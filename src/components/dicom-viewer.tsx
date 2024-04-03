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

  // 파일 경로 설정 (예: 'dicomFileName' prop은 'yourfile.dcm'과 같은 값이어야 함)
  const imageId = `wadouri:${window.location.origin}/dicom/${dicomFileName}`;

  /// 이미지 로딩과 기본 설정을 위한 useEffect.
  // 또한 Operation 버튼이 아닌 이벤트리스너를 통해 일어나는 기능(Zoom, Resize)도 여기에 포함.
  useEffect(() => {
    if (!elementRef.current) return;
    const element = elementRef.current;

    // cornerstone 설정, cornerstoneWADOImageLoader 구성
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    // DICOM 이미지 활성화
    cornerstone.enable(element);

    // display 로직
    cornerstone.loadImage(imageId).then((image) => {
      cornerstone.displayImage(element, image);

      /// 윈도우 크기가 변경될 때마다 호출될 콜백 함수.
      const handleResize = () => {
        // 뷰포트의 크기를 조정하는 로직.
        if (elementRef.current) {
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

      // 정의한 마우스 휠 이벤트 핸들러를 엘리먼트에 추가.
      element.addEventListener('wheel', onWheel);
      // 윈도우 리사이즈 이벤트 리스너를 추가.
      window.addEventListener('resize', handleResize);

      // then이 끝났을 때, 이전에 추가한 이벤트 리스너를 제거.
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

  /// 사용자 조작(Operation)을 처리하기 위한 useEffect
  useEffect(() => {
    if (!elementRef.current || !isSelected || !operation) return;
    const element = elementRef.current;

    const viewport = cornerstone.getViewport(element);

    // https://docs.cornerstonejs.org/api.html#viewport
    if (viewport) {
      switch (operation) {
        // Flip H: 좌우 바꾸기
        case 'FlipH':
          viewport.hflip = !viewport.hflip;
          cornerstone.setViewport(element, viewport);
          break;
        // Flip V: 상하 바꾸기
        case 'FlipV':
          viewport.vflip = !viewport.vflip;
          cornerstone.setViewport(element, viewport);
          break;
        // Rotate Delta 30: 30도 우측으로 돌리기
        case 'RotateDelta30':
          viewport.rotation = (viewport.rotation + 30) % 360;
          cornerstone.setViewport(element, viewport);
          break;
        // Invert: 흑백 전환하기
        case 'Invert':
          viewport.invert = !viewport.invert;
          cornerstone.setViewport(element, viewport);
          break;
        // Apply Colormap: 이미지의 픽셀 값에 따라 색상(hotIron)을 지정하기
        case 'ApplyColormap':
          if (viewport.colormap) {
            viewport.colormap = undefined;
            cornerstone.setViewport(element, viewport);
            break;
          }
          viewport.colormap = 'hotIron';
          cornerstone.setViewport(element, viewport);
          break;
        // Reset: 초기화
        case 'Reset':
          resetRenderCanvase(element);
          cornerstone.reset(element);
          break;
      }
      // 조작 완료 후 operation 상태 초기화
      setOperation(null);
    }
  }, [isSelected, operation]); // 의존성 배열에 isSelected와 operation 포함

  return <div ref={elementRef} className={'h-full w-full'} />;
};

export default DICOMViewer;

// https://github.com/cornerstonejs/cornerstone/issues/317
// 이슈 #317에서 제안된 대로 renderCanvas를 리셋하는 함수. 이미지에서 colormap을 제거한 후 알파 채널의 흔적이 남겨지는 버그 수정 함수.
function resetRenderCanvase(element: HTMLElement) {
  // `cornerstone.getEnabledElement` 함수를 사용
  // 주어진 HTML 엘리먼트 및 도구들(renderingTools 등)을 포함한 enabledElement 객체
  const enabledElement: EnabledElementWithRenderingTools = cornerstone.getEnabledElement(element);

  // 타입 안정을 위한 조건
  if (!enabledElement.renderingTools || !enabledElement.renderingTools.renderCanvas) {
    console.error('Rendering tools or render canvas not found');
    return;
  }

  // colormapId와 colorLut 속성을 undefined로 설정해, 이전에 적용된 컬러맵 설정을 제거.
  enabledElement.renderingTools.colormapId = undefined;
  enabledElement.renderingTools.colorLut = undefined;

  // 렌더링 캔버스의 2D context를 가져옴. `willReadFrequently` 옵션은 getImageData 함수의 연산 성능을 최적화.
  const renderCanvas = enabledElement.renderingTools.renderCanvas;
  const canvasContext = renderCanvas.getContext('2d', { willReadFrequently: true });

  // 컨텍스트가 성공적으로 가져와진 경우.
  if (canvasContext) {
    // 컨텍스트의 fillStyle을 흰색으로 설정.
    canvasContext.fillStyle = 'white';
    // fillRect 함수를 사용하여 전체 캔버스를 흰색으로 설정. 이를 통해 루미넌스 조정
    canvasContext.fillRect(0, 0, renderCanvas.width, renderCanvas.height);

    // 캔버스의 현재 이미지 데이터. 이미지 처리를 위함.
    const renderCanvasData = canvasContext.getImageData(0, 0, renderCanvas.width, renderCanvas.height);

    // renderCanvasContext 및 renderCanvasData 속성 업데이트 후 렌더링 툴에 저장.
    enabledElement.renderingTools.renderCanvasContext = canvasContext;
    enabledElement.renderingTools.renderCanvasData = renderCanvasData;
  }
  // 컨텍스트를 가져오는데 실패한 경우.
  else {
    console.error('Fail to take Canvas Context');
    return;
  }
}

// function resetRenderCanvas(element: HTMLElement) {
//   const enabledElement = cornerstone.getEnabledElement(element);
//   // 'enabledElement'가 'undefined'인지 확인
//   if (!enabledElement || !enabledElement.canvas) {
//     return;
//   }

//   const canvas = enabledElement.canvas;
//   const context = canvas.getContext('2d');

//   // 렌더링 캔버스를 흰색으로 채움으로써 알파 채널 리셋
//   if (context) {
//     console.log(context);

//     context.fillStyle = 'white';
//     context.fillRect(0, 0, canvas.width, canvas.height);
//   } else {
//     console.error('Canvas context is not available');
//     return;
//   }

//   // viewport의 colormap을 명시적으로 undefined로 설정하여 리셋
//   const viewport = cornerstone.getViewport(element);
//   if (viewport) {
//     viewport.colormap = undefined;
//   }
//   cornerstone.setViewport(element, viewport);
//   cornerstone.reset(element);
// }
