import JSZip from 'jszip';
import { VirtualFile } from '../types';

/**
 * Creates and downloads a zip archive containing all virtual files in their correct folder structure.
 */
export async function downloadProjectAsZip(files: VirtualFile[], projectName: string = 'devforge-project') {
  const zip = new JSZip();

  // Add non-folder files
  for (const file of files) {
    if (!file.isFolder) {
      // Remove leading slash for zip paths
      const relativePath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
      zip.file(relativePath, file.content);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${projectName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Downloads a single virtual file.
 */
export function downloadSingleFile(file: VirtualFile) {
  const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
