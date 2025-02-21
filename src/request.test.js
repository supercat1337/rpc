// @ts-check

import test from "ava";
import { RPCRequestMessage } from "./request.js";

test("RPCRequestMessage", (t) => {
    let request = new RPCRequestMessage("foo", { bar: "baz" });
    t.is(request.method, "foo");
    t.deepEqual(request.params, { bar: "baz" });
});

test("RPCRequestMessage (no params)", (t) => {
    let request = new RPCRequestMessage("foo");
    t.is(request.method, "foo");
    t.deepEqual(request.params, {});
});

test("RPCRequestMessage.toString()", (t) => {
    let request = new RPCRequestMessage("foo", { bar: "baz" }, "1");
    t.is(request.toString(), '{"jsonrpc":"2.0","id":"1","method":"foo","params":{"bar":"baz"}}');
});

test("RPCRequestMessage.toJSON()", (t) => {
    let request = new RPCRequestMessage("foo", { bar: "baz" }, "1");
    t.deepEqual(request.toJSON(), { jsonrpc: "2.0", id: "1", method: "foo", params: { bar: "baz" } });
});

test("RPCRequestMessage.toFormData()", (t) => {
    let file = new Blob();
    let request = new RPCRequestMessage("foo", { bar: "baz", file: file }, "1");
    let formData = request.toFormData();
    t.is(formData.get("jsonrpc"), "2.0");
    t.is(formData.get("id"), "1");
    t.is(formData.get("method"), "foo");
    t.is(formData.get("params[bar]"), "baz");
    t.is(formData.get("params[file]") instanceof Blob, true);
});

test("RPCRequestMessage.toFormData() (no params)", (t) => {
    let request = new RPCRequestMessage("foo", {}, "1");
    let formData = request.toFormData();
    t.is(formData.get("jsonrpc"), "2.0");
    t.is(formData.get("id"), "1");
    t.is(formData.get("method"), "foo");
    t.is(formData.get("params[value]"), "1");
});