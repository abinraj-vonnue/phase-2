// const { createDefaultPreset } = require("ts-jest");
import { createDefaultEsmPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} **/
export default {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
    clearMocks: true,
    moduleNameMapper: {
        //to strip .js extension
        "(.+)\\.js": "$1",
    },
};
