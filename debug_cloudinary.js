require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('--- CLOUDINARY DEBUG TEST ---');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'MISSING');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'MISSING');
console.log('Upload Preset:', process.env.CLOUDINARY_UPLOAD_PRESET);

async function testUpload() {
  try {
    const options = {
      folder: 'test_preset',
      resource_type: 'auto'
    };

    if (process.env.CLOUDINARY_UPLOAD_PRESET) {
      options.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET.trim();
    }

    console.log('Options being sent:', options);

    const result = await cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', options);
    console.log('✅ Upload Success:', result.secure_url);
  } catch (error) {
    console.error('❌ Upload Failed:', error.message);
    if (error.http_code) console.error('HTTP Code:', error.http_code);
  }
}

testUpload();
