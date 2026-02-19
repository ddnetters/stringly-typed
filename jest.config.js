module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.m?[jt]sx?$': ['ts-jest', { useESM: false }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@langchain|langchain|ansi-styles)/)',
  ],
  moduleNameMapper: {
    '^@actions/github$': '<rootDir>/src/__mocks__/@actions/github.ts',
    '^@actions/core$': '<rootDir>/src/__mocks__/@actions/core.ts',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/__tests__/**',
    '!src/main.ts',
    '!src/action.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};