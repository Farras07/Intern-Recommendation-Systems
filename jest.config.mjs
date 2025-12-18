const jestConfig = {
  testEnvironment: "node",
  verbose: true,
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: false,
        tsconfig: {
          module: "ESNext",
          jsx: "react-jsx",
        }
      }
    ],
  },

  extensionsToTreatAsEsm: [".ts", ".tsx"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^nanoid$": "<rootDir>/__mocks__/nanoid.js",
  },

  transformIgnorePatterns: ["node_modules/"],

  setupFiles: ["<rootDir>/__mocks__/setupEnv.ts"],   // <---- IMPORTANT
  setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],

  testPathIgnorePatterns: ["<rootDir>/.next/"],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],

};

export default jestConfig;
