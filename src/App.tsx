import DICOMViewer from './components/dicom-viewer';

function App() {
  return (
    <main className='container mx-auto h-screen'>
      <h1>DICOM Viewer</h1>
      <DICOMViewer dicomFileName='dicom1.dcm' />
    </main>
  );
}

export default App;
