import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testSequencer: './tests/custom-sequencer.ts',
  testEnvironment: "node"
};

export default jestConfig;
