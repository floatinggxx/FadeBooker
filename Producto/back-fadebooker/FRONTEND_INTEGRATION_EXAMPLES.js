/**
 * CLOUDINARY HAIRSTYLE INTEGRATION - FRONTEND EXAMPLES
 * 
 * Este archivo contiene ejemplos de código para integrar la funcionalidad
 * de simulación de cortes con el backend de FadeBooker.
 * 
 * Tecnologías: Vanilla JavaScript, React, Vue (ejemplos incluidos)
 */

// ============================================================================
// 1. VANILLA JAVASCRIPT - FORMA MÁS SIMPLE
// ============================================================================

// *** OPCIÓN 1A: Usando Fetch API (Recomendado) ***

class HairstyleSimulator {
  constructor(apiBaseUrl = 'http://localhost:3000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Obtiene la firma para subida segura a Cloudinary
   * @param {string} folder - Carpeta en Cloudinary
   * @returns {Promise<Object>} - Datos de firma y configuración
   */
  async getUploadSignature(folder = 'user_photos') {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/api/hairstyle/signature`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ folder })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error getting signature');
      }

      return data;
    } catch (error) {
      console.error('Error obteniendo firma:', error);
      throw error;
    }
  }

  /**
   * Sube una imagen a Cloudinary usando firma segura
   * @param {File} file - Archivo de imagen
   * @param {string} folder - Carpeta destino
   * @returns {Promise<string>} - public_id de la imagen subida
   */
  async uploadToCloudinary(file, folder = 'user_photos') {
    try {
      // Paso 1: Obtener firma
      const signatureData = await this.getUploadSignature(folder);

      // Paso 2: Preparar FormData para Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', signatureData.uploadPreset);
      formData.append('signature', signatureData.signature);
      formData.append('timestamp', signatureData.timestamp);
      formData.append('api_key', signatureData.apiKey);
      formData.append('folder', signatureData.folder);

      // Paso 3: Subir a Cloudinary (directo, sin pasar por backend)
      const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed! status: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      
      // Devolver el public_id para usar en simulación
      return uploadResult.public_id;
    } catch (error) {
      console.error('Error subiendo a Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Genera una simulación de corte sobre una imagen
   * @param {string} publicId - Public ID de la imagen en Cloudinary
   * @param {string} styleId - ID del estilo (degradado, clasico, moderno, etc)
   * @returns {Promise<Object>} - Datos con URL simulada y detalles
   */
  async simulateHairstyle(publicId, styleId) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/api/hairstyle/simulate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            publicId,
            styleId
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error simulating hairstyle');
      }

      return data;
    } catch (error) {
      console.error('Error simulando corte:', error);
      throw error;
    }
  }
}

// --- USO EN HTML VANILLA ---

/*
HTML:
<div id="hairstyle-app">
  <input type="file" id="fileInput" accept="image/*" />
  <button id="uploadBtn">Subir Foto</button>
  
  <div id="styles">
    <button data-style="degradado">Ver Degradado</button>
    <button data-style="clasico">Ver Clásico</button>
    <button data-style="moderno">Ver Moderno</button>
    <button data-style="mohicano">Ver Mohicano</button>
    <button data-style="buzzcut">Ver Buzzcut</button>
  </div>
  
  <div id="preview">
    <img id="simulatedImage" src="" alt="Simulación" style="display:none;" />
  </div>
</div>

JavaScript:
*/

const simulator = new HairstyleSimulator('http://localhost:3000');
let uploadedPublicId = null;

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const file = document.getElementById('fileInput').files[0];
  
  if (!file) {
    alert('Por favor selecciona una imagen');
    return;
  }

  try {
    uploadedPublicId = await simulator.uploadToCloudinary(file);
    alert('Imagen subida exitosamente! Ahora puedes ver los cortes.');
  } catch (error) {
    alert('Error subiendo imagen: ' + error.message);
  }
});

// Simular cortes al hacer click en los botones
document.querySelectorAll('[data-style]').forEach(button => {
  button.addEventListener('click', async () => {
    if (!uploadedPublicId) {
      alert('Por favor sube una imagen primero');
      return;
    }

    const styleId = button.dataset.style;

    try {
      const result = await simulator.simulateHairstyle(uploadedPublicId, styleId);
      
      const img = document.getElementById('simulatedImage');
      img.src = result.simulatedImageUrl;
      img.style.display = 'block';
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
});

// ============================================================================
// 2. REACT - COMPONENTE FUNCIONAL CON HOOKS
// ============================================================================

import React, { useState, useRef } from 'react';

const HairstyleSimulatorReact = ({ apiBaseUrl = 'http://localhost:3000' }) => {
  const [uploadedPublicId, setUploadedPublicId] = useState(null);
  const [simulatedImageUrl, setSimulatedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const API = {
    getSignature: async (folder = 'user_photos') => {
      const response = await fetch(`${apiBaseUrl}/api/hairstyle/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder })
      });
      if (!response.ok) throw new Error('Failed to get signature');
      return response.json();
    },

    uploadToCloudinary: async (file, folder = 'user_photos') => {
      const signatureData = await API.getSignature(folder);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', signatureData.uploadPreset);
      formData.append('signature', signatureData.signature);
      formData.append('timestamp', signatureData.timestamp);
      formData.append('api_key', signatureData.apiKey);
      formData.append('folder', signatureData.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      return result.public_id;
    },

    simulateHairstyle: async (publicId, styleId) => {
      const response = await fetch(`${apiBaseUrl}/api/hairstyle/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId, styleId })
      });
      if (!response.ok) throw new Error('Simulation failed');
      return response.json();
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setError('Por favor selecciona una imagen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const publicId = await API.uploadToCloudinary(file);
      setUploadedPublicId(publicId);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStyleSelect = async (styleId) => {
    if (!uploadedPublicId) {
      setError('Por favor sube una imagen primero');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await API.simulateHairstyle(uploadedPublicId, styleId);
      setSimulatedImageUrl(result.simulatedImageUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = ['degradado', 'clasico', 'moderno', 'mohicano', 'buzzcut'];

  return (
    <div className="hairstyle-simulator">
      <h1>Simulador de Cortes</h1>

      {error && <div className="error">{error}</div>}

      <div className="upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          disabled={loading}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir Foto'}
        </button>
      </div>

      {uploadedPublicId && (
        <div className="styles-section">
          <p>Elige un estilo para ver la simulación:</p>
          {styles.map(style => (
            <button
              key={style}
              onClick={() => handleStyleSelect(style)}
              disabled={loading}
              className="style-button"
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      )}

      {simulatedImageUrl && (
        <div className="preview-section">
          <h2>Simulación:</h2>
          <img src={simulatedImageUrl} alt="Simulación de corte" />
        </div>
      )}
    </div>
  );
};

export default HairstyleSimulatorReact;

// ============================================================================
// 3. VUE 3 - COMPOSABLE Y COMPONENT
// ============================================================================

// composables/useHairstyleSimulator.js

import { ref } from 'vue';

export function useHairstyleSimulator(apiBaseUrl = 'http://localhost:3000') {
  const uploadedPublicId = ref(null);
  const simulatedImageUrl = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const getSignature = async (folder = 'user_photos') => {
    const response = await fetch(`${apiBaseUrl}/api/hairstyle/signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder })
    });
    if (!response.ok) throw new Error('Failed to get signature');
    return response.json();
  };

  const uploadToCloudinary = async (file, folder = 'user_photos') => {
    const signatureData = await getSignature(folder);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', signatureData.uploadPreset);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('api_key', signatureData.apiKey);
    formData.append('folder', signatureData.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
    const response = await fetch(uploadUrl, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  };

  const simulateHairstyle = async (publicId, styleId) => {
    const response = await fetch(`${apiBaseUrl}/api/hairstyle/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId, styleId })
    });
    if (!response.ok) throw new Error('Simulation failed');
    return response.json();
  };

  const handleUpload = async (file) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await uploadToCloudinary(file);
      uploadedPublicId.value = result.public_id;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const handleStyleSelect = async (styleId) => {
    if (!uploadedPublicId.value) {
      error.value = 'Por favor sube una imagen primero';
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const result = await simulateHairstyle(uploadedPublicId.value, styleId);
      simulatedImageUrl.value = result.simulatedImageUrl;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    uploadedPublicId,
    simulatedImageUrl,
    loading,
    error,
    handleUpload,
    handleStyleSelect
  };
}

// components/HairstyleSimulator.vue

<template>
  <div class="hairstyle-simulator">
    <h1>Simulador de Cortes</h1>

    <div v-if="error" class="error">{{ error }}</div>

    <div class="upload-section">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        :disabled="loading"
      />
      <button @click="uploadFile" :disabled="loading">
        {{ loading ? 'Subiendo...' : 'Subir Foto' }}
      </button>
    </div>

    <div v-if="uploadedPublicId" class="styles-section">
      <p>Elige un estilo:</p>
      <button
        v-for="style in styles"
        :key="style"
        @click="handleStyleSelect(style)"
        :disabled="loading"
        class="style-button"
      >
        {{ capitalizeFirstLetter(style) }}
      </button>
    </div>

    <div v-if="simulatedImageUrl" class="preview-section">
      <h2>Simulación:</h2>
      <img :src="simulatedImageUrl" alt="Simulación de corte" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useHairstyleSimulator } from '@/composables/useHairstyleSimulator';

const fileInput = ref(null);
const styles = ['degradado', 'clasico', 'moderno', 'mohicano', 'buzzcut'];
const { uploadedPublicId, simulatedImageUrl, loading, error, handleUpload, handleStyleSelect } = useHairstyleSimulator();

const uploadFile = async () => {
  const file = fileInput.value?.files[0];
  if (file) {
    await handleUpload(file);
  }
};

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>

<style scoped>
.hairstyle-simulator {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.upload-section,
.styles-section {
  margin-bottom: 20px;
}

button {
  padding: 10px 15px;
  margin-right: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #1565c0;
}

.preview-section {
  margin-top: 20px;
}

img {
  max-width: 100%;
  border-radius: 4px;
}
</style>

// ============================================================================
// 4. JQUERY (Legacy Support)
// ============================================================================

$(document).ready(function() {
  const API_BASE = 'http://localhost:3000';

  $('#uploadBtn').on('click', async function() {
    const file = $('#fileInput')[0].files[0];
    
    if (!file) {
      alert('Por favor selecciona una imagen');
      return;
    }

    try {
      // Obtener firma
      const signatureData = await $.ajax({
        url: `${API_BASE}/api/hairstyle/signature`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ folder: 'user_photos' })
      });

      // Subir a Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', signatureData.uploadPreset);
      formData.append('signature', signatureData.signature);
      formData.append('timestamp', signatureData.timestamp);
      formData.append('api_key', signatureData.apiKey);
      formData.append('folder', signatureData.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
      const uploadResult = await $.ajax({
        url: uploadUrl,
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false
      });

      // Guardar public_id
      $('#uploadedImageId').val(uploadResult.public_id);
      alert('Imagen subida exitosamente!');
    } catch (error) {
      alert('Error: ' + error.toString());
    }
  });

  $('[data-style]').on('click', async function() {
    const publicId = $('#uploadedImageId').val();
    
    if (!publicId) {
      alert('Por favor sube una imagen primero');
      return;
    }

    const styleId = $(this).data('style');

    try {
      const result = await $.ajax({
        url: `${API_BASE}/api/hairstyle/simulate`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ publicId, styleId })
      });

      $('#simulatedImage').attr('src', result.simulatedImageUrl).show();
    } catch (error) {
      alert('Error: ' + error.toString());
    }
  });
});

// ============================================================================
// 5. AXIOS (ALTERNATIVA A FETCH)
// ============================================================================

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api'
});

class HairstyleService {
  static async getSignature(folder = 'user_photos') {
    const response = await API.post('/hairstyle/signature', { folder });
    return response.data;
  }

  static async uploadToCloudinary(file, folder = 'user_photos') {
    const signatureData = await this.getSignature(folder);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', signatureData.uploadPreset);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp);
    formData.append('api_key', signatureData.apiKey);
    formData.append('folder', signatureData.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
    const response = await axios.post(uploadUrl, formData);
    return response.data.public_id;
  }

  static async simulateHairstyle(publicId, styleId) {
    const response = await API.post('/hairstyle/simulate', { publicId, styleId });
    return response.data;
  }
}

export default HairstyleService;

// ============================================================================
// 6. TYPESCRIPT - TIPOS E INTERFACES
// ============================================================================

interface SignatureResponse {
  success: boolean;
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
  folder: string;
}

interface SimulationResponse {
  success: boolean;
  simulatedImageUrl: string;
  styleId: string;
  publicId: string;
  overlay: string;
  message: string;
}

interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  [key: string]: any;
}

type HairstyleStyle = 'degradado' | 'clasico' | 'moderno' | 'mohicano' | 'buzzcut';

class HairstyleSimulatorTS {
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = 'http://localhost:3000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  async getUploadSignature(folder: string = 'user_photos'): Promise<SignatureResponse> {
    const response = await fetch(`${this.apiBaseUrl}/api/hairstyle/signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SignatureResponse = await response.json();
    return data;
  }

  async uploadToCloudinary(file: File, folder: string = 'user_photos'): Promise<string> {
    const signatureData = await this.getUploadSignature(folder);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', signatureData.uploadPreset);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('api_key', signatureData.apiKey);
    formData.append('folder', signatureData.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`;
    const response = await fetch(uploadUrl, { method: 'POST', body: formData });

    const result: CloudinaryUploadResult = await response.json();
    return result.public_id;
  }

  async simulateHairstyle(publicId: string, styleId: HairstyleStyle): Promise<SimulationResponse> {
    const response = await fetch(`${this.apiBaseUrl}/api/hairstyle/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId, styleId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SimulationResponse = await response.json();
    return data;
  }
}

export { HairstyleSimulatorTS, SignatureResponse, SimulationResponse, HairstyleStyle };

// ============================================================================
// SUMMARY
// ============================================================================

/*
RESUMEN DE EJEMPLOS:

1. VANILLA JS - La forma más simple, sin dependencias
2. REACT - Usando hooks (useState, useRef) y patrón moderno
3. VUE 3 - Con composables y composition API
4. JQUERY - Legacy support para proyectos antiguos
5. AXIOS - Alternativa a Fetch API
6. TYPESCRIPT - Tipos e interfaces seguras

FLUJO GENERAL EN TODOS LOS EJEMPLOS:

1. Usuario selecciona archivo de imagen
2. Código frontend llama: POST /api/hairstyle/signature
3. Backend devuelve firma SHA-1 + datos Cloudinary
4. Frontend sube imagen directo a Cloudinary (sin pasar por backend)
5. Cloudinary devuelve public_id
6. Usuario elige estilo de corte
7. Frontend llama: POST /api/hairstyle/simulate
   { publicId: "...", styleId: "degradado" }
8. Backend devuelve URL transformada con overlay
9. Frontend renderiza la imagen simulada

NOTAS DE SEGURIDAD:

✅ El API_SECRET nunca llega al frontend
✅ Se usa firma SHA-1 + timestamp para validación
✅ El frontend sube directo a Cloudinary (ahorro de bandwidth)
✅ Los estilos se validan en el backend

*/
