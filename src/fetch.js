// @ts-check

import {
  RPCDataResponse,
  RPCPagedResponse,
  RPCErrorResponse,
} from "./response.js";

import { extractRPCResponse } from "./api.js";
import { RPC_PARSE_ERROR } from "./constants.js";

/**
 * Fetches a resource and returns a response message in RPC format.
 * @template T
 * @param {string | URL | Request} input - The URL of the resource to fetch.
 * @param {RequestInit} [fetchOptions] - Options for the fetch call.
 * @param {Object} [rpcOptions = {}] - Options for the RPC protocol.
 * @param {string} [rpcOptions.id] - The default ID of the response.
 * @param {boolean} [rpcOptions.notify] - Whether to notify the response event handler.
 * @param {(input: string | URL | Request, init?: RequestInit)=>Promise<Response>} [rpcOptions.fetch] - The fetch function to use.
 * @returns {Promise<RPCErrorResponse | RPCDataResponse<T> | RPCPagedResponse<T>>}
 */
export async function rpcFetch(input, fetchOptions, rpcOptions = {}) {
  try {
    const f = rpcOptions.fetch || fetch;
    const fetchResponse = await f(input, fetchOptions);
    let object = await fetchResponse.json();
    let rpcResponse = extractRPCResponse(
      object,
      rpcOptions
    );
    return rpcResponse;
  } catch (e) {
    console.error(e);
    return new RPCErrorResponse(e, rpcOptions.id);
  }
}

/**
 * Fetches data using the RPC protocol and returns a response message.
 * This function acts as a wrapper around the `rpcFetch` function.
 * @template T
 * @param {string | URL | Request} input - The URL of the resource to fetch.
 * @param {RequestInit} [fetchOptions] - Options for the fetch call.
 * @param {Object} [rpcOptions = {}] - Options for the RPC protocol.
 * @param {string} [rpcOptions.id] - The default ID of the response.
 * @param {boolean} [rpcOptions.notify] - Whether to notify the response event handler.
 * @param {(input: string | URL | Request, init?: RequestInit)=>Promise<Response>} [rpcOptions.fetch] - The fetch function to use.
 * @returns {Promise<RPCErrorResponse | RPCDataResponse<T>>}
 *   A promise that resolves to an RPC response message.
 */
export async function rpcFetchData(input, fetchOptions, rpcOptions = {}) {
  let response = await rpcFetch(input, fetchOptions, rpcOptions);
  if (response instanceof RPCPagedResponse) {
    return /** @type {RPCDataResponse<T>} */ (
      new RPCDataResponse(response.result, response.id)
    );
  }
  return response;
}

/**
 * Fetches a resource and returns a response message in RPC format, with pagination properties.
 * This function acts as a wrapper around the `rpcFetch` function.
 * @template T
 * @param {string | URL | Request} input - The URL of the resource to fetch.
 * @param {RequestInit} [fetchOptions] - Options for the fetch call.
 * @param {Object} [rpcOptions = {}] - Options for the RPC protocol.
 * @param {string} [rpcOptions.id] - The default ID of the response.
 * @param {boolean} [rpcOptions.notify] - Whether to notify the response event handler.
 * @param {(input: string | URL | Request, init?: RequestInit)=>Promise<Response>} [rpcOptions.fetch] - The fetch function to use.
 * @returns {Promise<RPCErrorResponse | RPCPagedResponse<T>>}
 *   A promise that resolves to an RPC response message with pagination properties.
 */
export async function rpcFetchPageData(input, fetchOptions, rpcOptions = {}) {
  let response = await rpcFetch(input, fetchOptions, rpcOptions);
  if (response instanceof RPCDataResponse) {
    return new RPCErrorResponse(RPC_PARSE_ERROR, response.id);
  }
  return response;
}
