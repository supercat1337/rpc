// @ts-check

import test from "ava";
import { RequestMessage } from "./request.js";

test("RequestMessage", (t) => {
    let request = new RequestMessage("foo", { bar: "baz" });
    t.is(request.method, "foo");
    t.deepEqual(request.params, { bar: "baz" });
});

test("RequestMessage (no params)", (t) => {
    let request = new RequestMessage("foo");
    t.is(request.method, "foo");
    t.deepEqual(request.params, {});
});

test("RequestMessage.toString()", (t) => {
    let request = new RequestMessage("foo", { bar: "baz" }, "1");
    t.is(request.toString(), '{"jsonrpc":"2.0","id":"1","method":"foo","params":{"bar":"baz"}}');
});

test("RequestMessage.toJSON()", (t) => {
    let request = new RequestMessage("foo", { bar: "baz" }, "1");
    t.deepEqual(request.toJSON(), { jsonrpc: "2.0", id: "1", method: "foo", params: { bar: "baz" } });
});

test("RequestMessage.toFormData()", (t) => {
    let file = new Blob();
    let request = new RequestMessage("foo", { bar: "baz", file: file }, "1");
    let formData = request.toFormData();
    t.is(formData.get("jsonrpc"), "2.0");
    t.is(formData.get("id"), "1");
    t.is(formData.get("method"), "foo");
    t.is(formData.get("params[bar]"), "baz");
    t.is(formData.get("params[file]") instanceof Blob, true);
});

test("RequestMessage.toFormData() (no params)", (t) => {
    let request = new RequestMessage("foo", {}, "1");
    let formData = request.toFormData();
    t.is(formData.get("jsonrpc"), "2.0");
    t.is(formData.get("id"), "1");
    t.is(formData.get("method"), "foo");
    t.is(formData.get("params[value]"), "1");
});