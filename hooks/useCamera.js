import { useState, useRef } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';

export function useCamera() {
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const rawPhoto = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    const manipulated = await ImageManipulator.manipulateAsync(
      rawPhoto.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    setPhoto(manipulated);
    return manipulated;
  };
  const clearPhoto = () => setPhoto(null);
  return { photo, takePhoto, clearPhoto, cameraRef };
}