import api from '../api';
import axios from 'axios';

export interface SignatureResponse {
  success: boolean;
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
  folder: string;
  error?: string;
}

export interface SimulationResponse {
  success: boolean;
  simulatedImageUrl: string;
  styleId: string;
  publicId: string;
  useAI: boolean;
  methodUsed: string;
  overlay: string | null;
  message: string;
  error?: string;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

export const hairstyleService = {
  /**
   * Obtiene la firma de subida segura del backend para Cloudinary
   */
  async getUploadSignature(folder?: string): Promise<SignatureResponse> {
    const response = await api.post<SignatureResponse>('/hairstyle/signature', { folder });
    return response.data;
  },

  /**
   * Genera la simulación del peinado en el backend
   */
  async simulateHairstyle(
    publicId: string,
    styleId: string,
    useAI?: boolean
  ): Promise<SimulationResponse> {
    const response = await api.post<SimulationResponse>('/hairstyle/simulate', {
      publicId,
      styleId,
      useAI,
    });
    return response.data;
  },

  /**
   * Sube una foto directamente a Cloudinary usando la firma segura generada por el backend.
   */
  async uploadPhoto(
    file: File | Blob,
    signatureData: SignatureResponse
  ): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', String(signatureData.timestamp));
    formData.append('signature', signatureData.signature);
    formData.append('upload_preset', signatureData.uploadPreset);
    formData.append('folder', signatureData.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
    
    const response = await axios.post<CloudinaryUploadResponse>(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
