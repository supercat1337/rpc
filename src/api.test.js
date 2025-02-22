// @ts-check

import {
  getResponseType,
  extractErrorResponse,
  extractDataResponse,
  extractPagedResponse,
  isPagedResponse,
  extractRPCResponse,
} from "./api.js";
import test from "ava";
import { RPCDataResponse, RPCPagedResponse, RPCErrorResponse } from "./response.js";
import { error } from "console";

test("getResponseType", (t) => {
  t.is(getResponseType({}), "error");
  t.is(getResponseType({ result: {} }), "data");
  t.is(getResponseType({ error: {} }), "error");
  t.is(getResponseType({ result: {}, error: {} }), "error");
  t.is(getResponseType({ result: {}, id: "1" }), "data");
  t.is(getResponseType({ error: {}, id: "1" }), "error");
  t.is(getResponseType({ result: {}, id: "1", error: {} }), "error");
  t.is(
    getResponseType({
      result: { total_pages: 1, current_page: 1, page_size: 1, total: 1, data: [] },
    }),
    "pagedData"
  );
});

test("isPagedResponse", (t) => {
  t.is(isPagedResponse([]), false);
  t.is(isPagedResponse({}), false);
  t.is(isPagedResponse({ result: {} }), false);
  t.is(isPagedResponse({ error: {} }), false);
  t.is(isPagedResponse({ result: {}, error: {} }), false);
  t.is(isPagedResponse({ result: {}, id: "1" }), false);
  t.is(isPagedResponse({ error: {}, id: "1" }), false);
  t.is(isPagedResponse({ result: {}, id: "1", error: {} }), false);
  t.is(isPagedResponse(null), false);

  t.is(
    isPagedResponse({
      result: { total_pages: 1, current_page: 1, page_size: 1, total: 1, data:[] },
    }),
    true
  );
});

test("extractDataResponse", (t) => {
  t.is(extractDataResponse({ result: {} }) instanceof RPCDataResponse, true);
  t.is(extractDataResponse({ error: {} }) instanceof RPCErrorResponse, true);
  t.is(extractDataResponse({ result: {}, error: {} }) instanceof RPCErrorResponse, true);
  t.is(extractDataResponse({ result: {}, id: "1" }) instanceof RPCDataResponse, true);
  t.is(extractDataResponse({ error: {}, id: "1" }) instanceof RPCErrorResponse, true);
  t.is(
    extractDataResponse({ result: {}, id: "1", error: {} }) instanceof RPCErrorResponse,
    true
  );
  t.is(
    extractDataResponse(null) instanceof RPCErrorResponse,
    true
  );
});

test("extractPagedResponse", (t) => {
  t.is(extractPagedResponse({ result: {} }) instanceof RPCPagedResponse, false);
  t.is(extractPagedResponse({ error: {} }) instanceof RPCErrorResponse, true);
  t.is(
    extractPagedResponse({ result: {}, error: {} }) instanceof RPCErrorResponse,
    true
  );
  t.is(
    extractPagedResponse({ result: {data: [], total_pages: 1, current_page: 1, page_size: 1, total: 1}, id: "1" }) instanceof RPCPagedResponse,
    true
  );
  t.is(extractPagedResponse({ error: {}, id: "1" }) instanceof RPCErrorResponse, true);
  t.is(extractPagedResponse(null) instanceof RPCErrorResponse, true);

});

test("extractErrorResponse", (t) => {
  t.is(extractErrorResponse({ result: {} }), false);
  t.is(extractErrorResponse(null) instanceof RPCErrorResponse, true);
  t.is(extractErrorResponse({}) instanceof RPCErrorResponse, true);
  
});

test("extractRPCResponse", (t) => {
  t.is(extractRPCResponse({ result: {} }) instanceof RPCDataResponse, true);
  t.is(extractRPCResponse({ result: {}, error: false }) instanceof RPCDataResponse, true);
  t.is(extractRPCResponse({ error: {} }) instanceof RPCErrorResponse, true);
  t.is(extractRPCResponse({ result: {}, error: {} }) instanceof RPCErrorResponse, true);
  t.is(extractRPCResponse({ result: {}, id: "1" }) instanceof RPCDataResponse, true);
  t.is(extractRPCResponse({ error: {}, id: "1" }) instanceof RPCErrorResponse, true);
  t.is(extractRPCResponse({ result: {}, id: "1", error: {} }) instanceof RPCErrorResponse, true);
  t.is(extractRPCResponse(null) instanceof RPCErrorResponse, true);
  t.is(extractRPCResponse({ result: { total_pages: 1, current_page: 1, page_size: 1, total: 1, data: [] }, id: "1" }) instanceof RPCPagedResponse, true);
  t.is(extractRPCResponse({ error: { message: "foo" }, id: "1" }) instanceof RPCErrorResponse, true);

});