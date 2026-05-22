// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';

describe('auth validators', () => {
  // Using any-typed locals to avoid complex zod v4 type inference in tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let login: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let signup: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resetComplete: any;

  beforeEach(async () => {
    const mod = await import('@everyone-web/lib/validators/auth');
    login = mod.loginSchema;
    signup = mod.signupSchema;
    resetComplete = mod.passwordResetCompleteSchema;
  });

  describe('loginSchema', () => {
    it('rejects a malformed email', () => {
      expect(() => login.parse({ email: 'not-an-email', password: 'password123' })).toThrow();
    });

    it('rejects a password shorter than 8 chars', () => {
      expect(() => login.parse({ email: 'valid@email.com', password: 'short' })).toThrow();
    });

    it('accepts valid email + password', () => {
      expect(() =>
        login.parse({ email: 'valid@email.com', password: 'password123' })
      ).not.toThrow();
    });
  });

  describe('signupSchema', () => {
    it('rejects a password shorter than 8 chars', () => {
      expect(() =>
        signup.parse({
          email: 'user@example.com',
          password: 'short',
          confirmPassword: 'short',
        })
      ).toThrow();
    });

    it('rejects when password and confirmPassword do not match', () => {
      expect(() =>
        signup.parse({
          email: 'user@example.com',
          password: 'password123',
          confirmPassword: 'different',
        })
      ).toThrow();
    });

    it('accepts valid matching passwords', () => {
      expect(() =>
        signup.parse({
          email: 'user@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      ).not.toThrow();
    });
  });

  describe('passwordResetCompleteSchema', () => {
    it('rejects when password and confirmPassword do not match', () => {
      expect(() =>
        resetComplete.parse({
          password: 'newpassword',
          confirmPassword: 'different',
        })
      ).toThrow();
    });

    it('accepts matching passwords >= 8 chars', () => {
      expect(() =>
        resetComplete.parse({
          password: 'newpassword',
          confirmPassword: 'newpassword',
        })
      ).not.toThrow();
    });
  });
});
