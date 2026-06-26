import { JSX, useState } from 'react';
import JSZip from 'jszip';

export const Zipdownload = (): JSX.Element => {
  const [pdfUrl1, setPdfUrl1] = useState('');
  const [pdfUrl2, setPdfUrl2] = useState('');

  const handleDownload = async () => {
    try {
      const zip = new JSZip();

      const files = [pdfUrl1, pdfUrl2].filter(Boolean);
      for (const url of files) {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}`);
        }

        const blob = await response.blob();

        const fileName = url.split('/').pop()?.split('?')[0] ?? 'file.pdf';

        zip.file(fileName, blob);
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
      });

      const downloadUrl = URL.createObjectURL(zipBlob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'documents.zip';
      a.click();

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      alert('ダウンロードに失敗しました');
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={pdfUrl1}
          onChange={(e) => setPdfUrl1(e.target.value)}
          placeholder="PDF URL 1"
          style={{ width: '600px' }}
        />
      </div>

      <div style={{ marginTop: '8px' }}>
        <input
          type="text"
          value={pdfUrl2}
          onChange={(e) => setPdfUrl2(e.target.value)}
          placeholder="PDF URL 2"
          style={{ width: '600px' }}
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        <button onClick={handleDownload}>Download ZIP</button>
      </div>
    </div>
  );
};

export default Zipdownload;
