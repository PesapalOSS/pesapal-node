import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testSequencer: './tests/custom-sequencer.js',
  testEnvironment: "node"
};

export default jestConfig;
