const coveragePathIgnorePatterns = [
    'node_modules',
    'index.ts'
]

module.exports = {
    verbose: true,
    rootDir: '.',
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/test/*.test.ts'],
    transform: {
        '^.+\\.(ts)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js'],
    coveragePathIgnorePatterns,
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{ts}'
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: -500
        }
    }
}