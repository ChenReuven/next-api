/// <reference types="jest" />

declare module '@jest/globals' {
  export const describe: jest.Describe;
  export const it: jest.It;
  export const expect: jest.Expect;
  export const beforeAll: jest.BeforeAll;
  export const afterAll: jest.AfterAll;
  export const beforeEach: jest.BeforeEach;
  export const afterEach: jest.AfterEach;
  export const test: jest.It;
  export const jest: typeof jest;
} 