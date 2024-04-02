// Zoom, Flip H 등 DICOM를 조작할 수 있는 버튼 컴포넌트. 2개 이상 여러개를 쓰므로 일단 컴포넌트로 분리해 관리함.
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export default function DICOMCommandComp({ disabled }: { disabled: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button disabled={disabled} variant={'ghost'} size={'sm'}>
            Zoom
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>이미지에서 마우스 휠로 조정해 확대/축소시킵니다.</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button disabled={disabled} variant={'ghost'} size={'sm'}>
            Flip H
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>이미지를 좌우로 반전시킵니다.</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button disabled={disabled} variant={'ghost'} size={'sm'}>
            Flip V
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>이미지를 상하로 반전시킵니다.</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button disabled={disabled} variant={'ghost'} size={'sm'}>
            Rotate Delta 30
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>이미지를 시계 방향으로 30도 회전시킵니다.</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button disabled={disabled} variant={'ghost'} size={'sm'}>
            Invert
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>이미지 색상을 반전시킵니다.</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button disabled={disabled} variant={'ghost'} size={'sm'}>
            Apply Colormap
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>이미지의 픽셀 값에 따라 색상을 지정합니다.</p>
        </TooltipContent>
      </Tooltip>
      <Button disabled={disabled} variant={'ghost'} size={'sm'}>
        Reset
      </Button>
    </TooltipProvider>
  );
}
