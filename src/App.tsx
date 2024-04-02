import DICOMViewer from './components/dicom-viewer';

function App() {
  localStorage.setItem('debug', 'cornerstoneTools');
  const dicomSourceArr: any = [
    {
      dicomFileName: 'dicom1.dcm',
    },
    {
      dicomFileName: 'dicom2.dcm',
    },
    {
      dicomFileName: 'dicom3.dcm',
    },
    {
      dicomFileName: 'dicom4.dcm',
    },
    {
      dicomFileName: 'dicom5.dcm',
    },
    {
      dicomFileName: 'dicom6.dcm',
    },
  ];
  return (
    <main className='container mx-auto h-screen'>
      <h1>DICOM Viewer</h1>
      {dicomSourceArr.map((item: any, idx: number) => (
        <DICOMViewer key={idx} dicomFileName={item.dicomFileName} />
      ))}
    </main>
  );
}

export default App;
