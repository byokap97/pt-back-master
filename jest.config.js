module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/libs/api/src'],
    moduleNameMapper: {
        '@api/(.*)': '<rootDir>/libs/api/src/$1',
        '@api': '<rootDir>/libs/api/src',
        '@backend/(.*)': '<rootDir>/src/backend/$1',
        '@backend': '<rootDir>/src/backend',
    },
};
