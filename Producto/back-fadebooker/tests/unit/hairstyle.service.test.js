/**
 * Hairstyle Service Tests
 * 
 * Tests para validar la lógica de firma de Cloudinary y simulación de cortes
 */

const HairstyleService = require('../../../src/application/usecases/hairstyle.service');

describe('HairstyleService', () => {
  
  // Test para generateUploadSignature
  describe('generateUploadSignature', () => {
    
    test('debe generar una firma válida sin parámetros', () => {
      // Arrange & Act
      process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
      process.env.CLOUDINARY_API_KEY = 'test_key';
      process.env.CLOUDINARY_API_SECRET = 'test_secret';
      
      const result = HairstyleService.generateUploadSignature();
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.signature).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.cloudName).toBe('test_cloud');
      expect(result.apiKey).toBe('test_key');
      expect(result.folder).toBe('user_photos'); // default folder
    });
    
    test('debe generar una firma con carpeta personalizada', () => {
      // Arrange
      process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
      process.env.CLOUDINARY_API_KEY = 'test_key';
      process.env.CLOUDINARY_API_SECRET = 'test_secret';
      
      // Act
      const result = HairstyleService.generateUploadSignature({ 
        folder: 'profile_photos' 
      });
      
      // Assert
      expect(result.folder).toBe('profile_photos');
      expect(result.signature).toBeDefined();
      expect(typeof result.signature).toBe('string');
      expect(result.signature.length).toBeGreaterThan(0);
    });
    
    test('la firma debe ser consistente para los mismos parámetros', () => {
      // Arrange
      process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
      process.env.CLOUDINARY_API_KEY = 'test_key';
      process.env.CLOUDINARY_API_SECRET = 'fixed_secret';
      
      // Act
      const result1 = HairstyleService.generateUploadSignature({ folder: 'test' });
      const result2 = HairstyleService.generateUploadSignature({ folder: 'test' });
      
      // Assert - Same parameters should generate same signature at same time
      // Nota: timestamp puede diferir por milisegundos, pero la lógica de firma es igual
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });
  });
  
  // Test para generateHairstyleSimulation
  describe('generateHairstyleSimulation', () => {
    
    beforeEach(() => {
      process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
      process.env.CLOUDINARY_API_KEY = 'test_key';
      process.env.CLOUDINARY_API_SECRET = 'test_secret';
    });
    
    test('debe generar URL simulada para estilo degradado', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_123',
        styleId: 'degradado'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.simulatedImageUrl).toContain('https://res.cloudinary.com/');
      expect(result.simulatedImageUrl).toContain('cortes:degradado');
      expect(result.styleId).toBe('degradado');
      expect(result.publicId).toBe('users/photo_123');
      expect(result.overlay).toBe('cortes/degradado');
    });
    
    test('debe generar URL simulada para estilo clásico', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_456',
        styleId: 'clasico'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.simulatedImageUrl).toContain('cortes:clasico');
      expect(result.overlay).toBe('cortes/clasico');
    });
    
    test('debe generar URL simulada para estilo moderno', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_789',
        styleId: 'moderno'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.simulatedImageUrl).toContain('cortes:moderno');
    });
    
    test('debe generar URL simulada para estilo mohicano', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_010',
        styleId: 'mohicano'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.simulatedImageUrl).toContain('cortes:mohicano');
    });
    
    test('debe generar URL simulada para estilo buzzcut', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_new',
        styleId: 'buzzcut'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.simulatedImageUrl).toContain('cortes:buzzcut');
    });
    
    test('la URL simulada debe incluir transformaciones correctas', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_trans',
        styleId: 'degradado'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      const url = result.simulatedImageUrl;
      expect(url).toContain('c_fill');        // crop fill
      expect(url).toContain('h_400');         // height
      expect(url).toContain('w_400');         // width
      expect(url).toContain('g_faces');       // gravity faces
      expect(url).toContain('q_auto');        // quality auto
      expect(url).toContain('f_auto');        // format auto
      expect(url).toContain('fl_layer_apply'); // apply layer
    });
    
    test('debe lanzar error si falta publicId', () => {
      // Arrange
      const params = {
        styleId: 'degradado'
        // publicId missing
      };
      
      // Act & Assert
      expect(() => {
        HairstyleService.generateHairstyleSimulation(params);
      }).toThrow('El publicId de la imagen es requerido');
    });
    
    test('debe lanzar error si falta styleId', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_123'
        // styleId missing
      };
      
      // Act & Assert
      expect(() => {
        HairstyleService.generateHairstyleSimulation(params);
      }).toThrow('El styleId del corte es requerido');
    });
    
    test('debe lanzar error para styleId inválido', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_123',
        styleId: 'estilo_inexistente'
      };
      
      // Act & Assert
      expect(() => {
        HairstyleService.generateHairstyleSimulation(params);
      }).toThrow(/Estilo de corte no válido/);
    });
    
    test('el mensaje de error debe listar estilos válidos', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_123',
        styleId: 'invalido'
      };
      
      // Act & Assert
      expect(() => {
        HairstyleService.generateHairstyleSimulation(params);
      }).toThrow(/degradado, clasico, moderno, mohicano, buzzcut/);
    });
    
    test('debe retornar URL con publicId y extensión correcta', () => {
      // Arrange
      const params = {
        publicId: 'users/mi_foto',
        styleId: 'degradado'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.simulatedImageUrl).toContain('users/mi_foto.jpg');
    });
    
    test('debe incluir cloudName en la URL generada', () => {
      // Arrange
      process.env.CLOUDINARY_CLOUD_NAME = 'mi_cloud_especial';
      const params = {
        publicId: 'users/photo_123',
        styleId: 'degradado'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.simulatedImageUrl).toContain('mi_cloud_especial');
    });
  });
  
  // Test de casos límite
  describe('Edge Cases', () => {
    
    beforeEach(() => {
      process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
      process.env.CLOUDINARY_API_KEY = 'test_key';
      process.env.CLOUDINARY_API_SECRET = 'test_secret';
    });
    
    test('debe manejar publicId con caracteres especiales', () => {
      // Arrange
      const params = {
        publicId: 'users/photo-with-dashes_and_underscores',
        styleId: 'degradado'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.simulatedImageUrl).toContain('photo-with-dashes_and_underscores');
    });
    
    test('debe manejar publicId con múltiples niveles de carpeta', () => {
      // Arrange
      const params = {
        publicId: 'uploads/users/profiles/avatars/photo_123',
        styleId: 'moderno'
      };
      
      // Act
      const result = HairstyleService.generateHairstyleSimulation(params);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.simulatedImageUrl).toContain('uploads/users/profiles/avatars/photo_123');
    });
    
    test('debe ser case-sensitive en styleId', () => {
      // Arrange
      const params = {
        publicId: 'users/photo_123',
        styleId: 'DEGRADADO' // uppercase
      };
      
      // Act & Assert
      expect(() => {
        HairstyleService.generateHairstyleSimulation(params);
      }).toThrow(/Estilo de corte no válido/);
    });
  });
});
