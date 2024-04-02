import { useState } from 'react';
import DICOMViewer from './components/dicom-viewer';
import { Button } from './components/ui/button';

function App() {
  // 현재 페이지 인덱스 상태
  const [currentPage, setCurrentPage] = useState(0);
  // 한 페이지에 표시할 이미지 수
  const imagesPerPage = 2;
  // 총 페이지 수 계산
  const totalPages = Math.ceil(DCM_NAME.length / imagesPerPage);

  // 이전 페이지로 이동하는 함수
  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
  };
  // 다음 페이지로 이동하는 함수
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  // 현재 페이지에 표시할 이미지 배열 계산
  const currentImages = DCM_NAME.slice(currentPage * imagesPerPage, (currentPage + 1) * imagesPerPage);

  return (
    <main className='h-screen w-full'>
      <header className='flex h-20 items-center justify-between px-8'>
        <h1 className='text-lg font-medium text-gray-700'>Dicom Viewer(with Cornerstone.js)</h1>
        <div className='flex gap-2'>
          <Button onClick={goToPreviousPage} disabled={currentPage === 0} className=''>
            Previous Image
          </Button>
          <Button onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
            Next Image
          </Button>
        </div>
      </header>
      <section className='container mx-auto h-[calc(100%-6rem)] w-full'>
        <div className='flex h-full flex-row items-center justify-between gap-10'>
          {currentImages.map((item, idx) => (
            <div key={idx} className='h-full w-1/2'>
              <DICOMViewer dicomFileName={item.dicomFileName} />
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
