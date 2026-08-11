import "node:http";

declare module "node:http" {
    interface ServerResponse {
        json(data: any, statusCode: number): void;
        ok(data: any): void;
        error(message: any, statusCode?: number): void;
    }
}
