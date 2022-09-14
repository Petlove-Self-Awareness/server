module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/presentation/controllers/*Controller.ts',
    '<rootDir>/src/presentation/utils/*.ts',
    '<rootDir>/src/data/useCases/**/*UseCase.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
