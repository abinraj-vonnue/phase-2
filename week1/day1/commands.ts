import os from "os";
import process, { argv } from "process";

export function getOsVersion(): string {
    return os.version();
}
export function getOsType(): string {
    return os.type();
}

export function getEnv(): string {
    return process.env.NODE_ENV ?? "DEV";
}

export function getCwd(): string {
    return process.cwd();
}
export function getMemory(): number {
    return os.totalmem();
}

export function logger() {
    const args: string[] = process.argv.slice(2);
    for (let arg of args) {
        if (arg === "--version") {
            console.log(`${"osVersion".padEnd(21)} : ${getOsVersion()}`);
        }
        if (arg === "--type") {
            console.log(`${"osType".padEnd(21)} : ${getOsType()}`);
        }
        if (arg === "--env") {
            console.log(`${"Env".padEnd(21)} : ${getEnv()}`);
        }
        if (arg === "--cwd") {
            console.log(`${"Current Workind dir".padEnd(21)} : ${getCwd()}`);
        }
        if (arg === "--memory") {
            console.log(`${"Memory".padEnd(21)} : ${getMemory()}`);
        }
        if (arg === "--json") {
            const details = {
                osType: getOsType(),
                version: getOsVersion(),
                env: getEnv(),
                cwd: getCwd(),
                memory: getMemory(),
            };
            console.log(details);
        }
    }
}
logger();
