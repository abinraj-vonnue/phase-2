import http from "node:http";

export function createHelpers(res: http.ServerResponse) {
    res.json = function (data: any, statusCode: number) {
        res.writeHead(statusCode, { "content-type": "applicaation/json" });
        res.end(JSON.stringify(data));
    };
    res.ok = function (data) {
        res.json({ status: "success", data }, 200);
    };
    res.error = function (message, statusCode = 500) {
        res.json({ status: "error", error: message }, statusCode);
    };
    return res;
}
