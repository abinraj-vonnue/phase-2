import app from "./app";

export function init() {
    app.listen(8080, () => {
        console.log(`server running`);
    });
}
init();
