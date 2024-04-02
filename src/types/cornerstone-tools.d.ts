declare module 'cornerstone-tools' {
  import { Image } from 'cornerstone-core';

  // cornerstone-tools 라이브러리 내의 모듈에 대한 타입 정의
  export function init(): void;
  export function addTool(tool: any, options?: any): void;
  export function setToolActive(toolName: string, options: { mouseButtonMask: number }): void;

  // ZoomTool에 대한 타입 정의
  export const ZoomTool: any;
}
