module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
    'vue-select/dist/vue-select.css': 'vue/dist/vue.common.js',
    '\\.svg$': 'vue/dist/vue.common.js',
    '\\.xml$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: [
    'js',
    'vue',
    'json'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
}
