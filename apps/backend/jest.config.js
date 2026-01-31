/** @type {import('jest').Config} */
module.exports = {
  displayName: 'backend',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: false }],
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@analytics-dashboard/shared-types$': '<rootDir>/../../packages/shared-types/src/index.ts',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
};
