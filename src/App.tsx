import { useState } from 'react';
import DICOMViewer from './components/dicom-viewer';
import { Button } from './components/ui/button';
import DICOMOperationComp from './components/dicom-operation';

function App() {
  /// 각 이미지 페이지네이션 관련 로직
  // 현재 페이지 인덱스 상태
  const [currentPage, setCurrentPage] = useState(0);
  // 한 페이지에 표시할 이미지 수
  const imagesPerPage = 2;
  // 총 페이지 수 계산
  const totalPages = Math.ceil(DCM_NAME.length / imagesPerPage);
  // 이전 페이지로 이동하는 함수
  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
    setSelectedImgName(null);
  };
  // 다음 페이지로 이동하는 함수
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
    setSelectedImgName(null);
  };
  // 현재 페이지에 표시할 이미지 배열 계산
  const currentImages = DCM_NAME.slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage);

  /// 이미지 클릭 선택 로직
  // 이미지 클릭 선택 상태
  const [selectedImgName, setSelectedImgName] = useState<string | null>(null);
  // 이미지 클릭 핸들러
  const handleSelectImgName = (name: string) => {
    // selectedImgName가 null이 아니고, 클릭한 name와 상태가 같다면 다시 null로 초기화
    if (selectedImgName !== null && name === selectedImgName) {
      setSelectedImgName(null);
      setOperation(null);
      return;
    }
    setSelectedImgName(name);
    setOperation(null);
  };

  /// DICOM 명령어 관련 로직
  // 명령어 상태
  const [operation, setOperation] = useState<string | null>(null);
  // 명령어 조작 관련 핸들러
  const handleOperation = (operation: string) => {
    setOperation(operation);
  };

  console.log(operation);

  return (
    <main className='h-screen w-full'>
      <header className='flex h-20 items-center justify-between px-8 lg:mb-4'>
        <h1 className='text-base font-semibold xl:text-lg'>
          Dicom Viewer<span className='hidden xl:inline'>(with Cornerstone.js)</span>
        </h1>
        <div className='hidden gap-3 lg:flex'>
          <DICOMOperationComp handleOperation={handleOperation} disabled={selectedImgName === null} />
        </div>
        <div className='flex gap-2'>
          <Button onClick={goToPreviousPage} disabled={currentPage === 0} className=''>
            Previous Image
          </Button>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
            Next Image
          </Button>
        </div>
      </header>
      <section className='container mx-auto h-[calc(100%-10rem)] w-full'>
        <div className='mb-3 grid grid-cols-2 gap-1 sm:flex sm:justify-center md:gap-3 lg:hidden'>
          <DICOMOperationComp handleOperation={handleOperation} disabled={selectedImgName === null} />
        </div>
        <div className='flex h-full flex-col items-center justify-between gap-10 sm:flex-row'>
          {currentImages.map((item, idx) => (
            <div
              key={`${item.dicomFileName}-${idx}`}
              className={`h-full w-full overflow-hidden rounded shadow-lg shadow-zinc-600 transition-all sm:w-[45%] ${selectedImgName === item.dicomFileName ? 'scale-105 outline outline-4 outline-blue-500' : null}`}
              // 이미지 클릭 시 상태 수정
              onClick={() => handleSelectImgName(item.dicomFileName)}
            >
              <DICOMViewer
                dicomFileName={item.dicomFileName}
                isSelected={item.dicomFileName === selectedImgName}
                operation={operation}
                setOperation={setOperation}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;

// DICOM 파일 관련 상수
const DCM_NAME = [
  { dicomFileName: 'dicom1.dcm' },
  { dicomFileName: 'dicom2.dcm' },
  { dicomFileName: 'dicom3.dcm' },
  { dicomFileName: 'dicom4.dcm' },
  { dicomFileName: 'dicom5.dcm' },
  { dicomFileName: 'dicom6.dcm' },
];
