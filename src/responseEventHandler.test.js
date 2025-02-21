// @ts-check

import test from "ava";
import { responseEventHandler } from "./responseEventHandler.js";

/**
 * Sleeps for the given number of milliseconds.
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

test("responseEventHandler", async (t) => {
    let response = {id: "foo", result: 100};
    let response_1 = {result: 100};

    let foo = 0;

    responseEventHandler.on("foo", (response) => {
        foo++;
    });

    responseEventHandler.notify(response);
    responseEventHandler.notify(response_1);
    responseEventHandler.notify(response);

    await sleep(1);
    t.is(foo, 2);
});

