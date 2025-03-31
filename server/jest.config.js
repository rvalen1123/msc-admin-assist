module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 30000,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/modules/customers/**/*.ts',
    '<rootDir>/src/modules/products/**/*.ts',
    '<rootDir>/src/modules/forms/**/*.ts',
    '<rootDir>/src/modules/orders/**/*.ts',
    '<rootDir>/src/common/testing/**/*.ts',
    '<rootDir>/src/modules/auth/decorators/**/*.ts',
    '<rootDir>/src/modules/auth/guards/**/*.ts',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/*.dto.ts',
    '!<rootDir>/src/**/*.entity.ts',
    '!<rootDir>/src/**/*.mock.ts',
    '!<rootDir>/src/**/*-test.ts',
    '!<rootDir>/src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 40,
      functions: 70,
      lines: 80,
    },
    './src/modules/customers/': {
      statements: 90,
      branches: 70,
      functions: 90,
      lines: 90,
    },
    './src/modules/products/': {
      statements: 90,
      branches: 70,
      functions: 90,
      lines: 90,
    },
    './src/modules/forms/': {
      statements: 90,
      branches: 20,
      functions: 90,
      lines: 90,
    },
    './src/modules/orders/': {
      statements: 85,
      branches: 50,
      functions: 90,
      lines: 85,
    },
  },
}; 