module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  modulePaths: ['packages'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '@expresso-(.*)': '<rootDir>/packages$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  testTimeout: 30000,
}
