
// import { API_URL } from '../config';

const API_URL = "https://mask-canvas-production.up.railway.app/";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  return response.json();
};

export const uploadMask = async (imageId, maskBlob) => {
  const formData = new FormData();
  formData.append('file', maskBlob);

  const response = await fetch(`${API_URL}/upload/${imageId}/mask`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const getImage = async (imageId) => {
  const response = await fetch(`${API_URL}/images/${imageId}`);
  return response.json();
};