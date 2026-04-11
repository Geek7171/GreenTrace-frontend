import { useState, useRef } from 'react';

export function useCamera() {
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const result = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    setPhoto(result);
    return result;
  };
  const clearPhoto = () => setPhoto(null);
  return { photo, takePhoto, clearPhoto, cameraRef };
}