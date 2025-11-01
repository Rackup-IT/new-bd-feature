import imageCompression from "browser-image-compression";

export async function optimizeImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  const compressedBlob = await imageCompression(file, options);
  return new File([compressedBlob], file.name, {
    type: compressedBlob.type,
    lastModified: Date.now(),
  });
}
