describe('Basic Application Tests', () => {
  it('should pass basic math test', () => {
    expect(2 + 2).toBe(4);
  });

  it('should check environment is test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should have JWT secret set', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.JWT_SECRET.length).toBeGreaterThan(10);
  });

  it('should be able to create mongoose ObjectId', () => {
    const mongoose = require('mongoose');
    const id = new mongoose.Types.ObjectId();
    expect(id).toBeDefined();
    expect(typeof id.toString()).toBe('string');
  });
});
