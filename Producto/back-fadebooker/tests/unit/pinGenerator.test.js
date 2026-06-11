const PinGenerator = require('../../src/infraestructure/security/PinGenerator');

describe('PinGenerator', () => {
  test('genera PIN de 6 dígitos', () => {
    const pin = PinGenerator.generate(6);
    expect(typeof pin).toBe('string');
    expect(pin).toHaveLength(6);
    expect(/^[0-9]{6}$/.test(pin)).toBeTruthy();
  });

  test('valida formato PIN', () => {
    expect(PinGenerator.isValidFormat('123456', 6)).toBeTruthy();
    expect(PinGenerator.isValidFormat('abc123', 6)).toBeFalsy();
  });
});
