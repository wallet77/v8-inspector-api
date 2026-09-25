module.exports = {
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js', 'index.js', '!src/types.js'],
    coverageDirectory: './coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
}
