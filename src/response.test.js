// @ts-check

import test from "ava";
import { RPCErrorData, PagedData } from "./response.js";

test("RPCErrorData", (t)=>{
    let customError = new Error("foo");
    let err = new RPCErrorData(customError);
    t.is(err.message == customError.message, true);
});

test("RPCErrorData as string", (t)=>{
    let customError = "foo";
    let err = new RPCErrorData(customError);
    t.is(err.message == customError, true);
});

test("PagedData", (t)=>{
    let data = { data: [], total: 1, page_size: 1, current_page: 1, total_pages: 1 };
    t.notThrows(() => {
        new PagedData(data);
    });
});

test("PagedData (not valid data)", (t)=>{
    let data = { data: {}, total: 1, page_size: 1, current_page: 1, total_pages: 1 };

    t.throws(() => {
        // @ts-ignore
        new PagedData(data);
    })
});

test("PagedData (not valid total)", (t)=>{
    let data = { data: [], total: null, page_size: 1, current_page: 1, total_pages: 1 };

    t.throws(() => {
        // @ts-ignore
        new PagedData(data);
    })
});

test("PagedData (not valid page_size)", (t)=>{
    let data = { data: [], total: 1, page_size: null, current_page: 1, total_pages: 1 };

    t.throws(() => {
        // @ts-ignore
        new PagedData(data);
    })
});

test("PagedData (not valid current_page)", (t)=>{
    let data = { data: [], total: 1, page_size: 1, current_page: null, total_pages: 1 };

    t.throws(() => {
        // @ts-ignore
        new PagedData(data);
    })
});

test("PagedData (not valid total_pages)", (t)=>{
    let data = { data: [], total: 1, page_size: 1, current_page: 1, total_pages: null };

    t.throws(() => {
        // @ts-ignore
        new PagedData(data);
    })
});