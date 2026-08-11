import {
    getCwd,
    getEnv,
    getMemory,
    getOsType,
    getOsVersion,
    logger,
} from "../commands.js";
import os from "os";
import { describe, expect } from "@jest/globals";

describe("utility functions", () => {
    test("get os type", () => {
        expect(getOsType()).toBe(os.type());
    });
    test("get env", () => {
        expect(getEnv()).toBe(process.env.NODE_ENV);
    });
    test("get version ", () => {
        expect(getOsVersion()).toContain(os.version());
    });
    test("get cwd ", () => {
        expect(getCwd()).toBe(process.cwd());
    });
    test("get memory", () => {
        expect(getMemory()).toBe(os.totalmem());
    });
});

describe("command line arguments", () => {
    test("--json", () => {
        process.argv[2] = "--json";
        const logSpy = jest.spyOn(console, "log");
        logger();
        expect(logSpy).toHaveBeenCalled();
    });
});
