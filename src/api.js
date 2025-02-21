// @ts-check

import { RPC_PARSE_ERROR } from "./constants.js";

import {
  RPCDataResponseMessage,
  RPCPagedResponseMessage,
  RPCErrorResponseMessage,
} from "./response.js";
import { responseEventHandler } from "./responseEventHandler.js";

/**
 * Checks if the given response object is a valid response.
 * A valid response object is an object that contains either an error or a result.
 * @param {Object} response - The response object to be checked.
 * @returns {boolean} - true if the response is valid, false otherwise.
 */
export function isResponse(response) {
  return (
    response &&
    (response.hasOwnProperty("error") || response.hasOwnProperty("result"))
  );
}

/**
 * Determines if the provided response contains an error and returns an appropriate RPCErrorResponseMessage.
 * Logs and returns a parse error if the response is null or undefined.
 * If the response contains an error, a RPCErrorResponseMessage is returned with the provided error and id.
 * If the response contains a result, it returns false indicating no error.
 * @param {Object} response - The response object to be checked for errors.
 * @param {string} [id]
 * @returns {RPCErrorResponseMessage|false} - A RPCErrorResponseMessage object if an error exists, or false if no error is found.
 */

export function extractErrorResponse(response, id = null) {
  if (!isResponse(response)) {
    console.error(response);
    return new RPCErrorResponseMessage(RPC_PARSE_ERROR, id);
  }

  if (response.error) {
    return new RPCErrorResponseMessage(response.error, response.id || id);
  }

  if (response.result) {
    return false;
  }
}

/**
 * Extracts the response from the given response object.
 * @template T
 * @param {any} response
 * @param {string} [id]
 * @returns {RPCPagedResponseMessage<T> | RPCErrorResponseMessage}
 */
export function extractPagedResponse(response, id = null) {
  if (!isResponse(response)) {
    console.error(response);
    return new RPCErrorResponseMessage(RPC_PARSE_ERROR, id);
  }

  let errorResponse = extractErrorResponse(response);

  if (errorResponse) {
    return errorResponse;
  }

  try {
    return new RPCPagedResponseMessage(response.result, response.id);
  } catch (e) {
    console.error(e);
    return new RPCErrorResponseMessage(e, response.id || id);
  }
}

/**
 * Checks if the given response object is a list response.
 * A list response is an object that contains the properties total_pages, current_page, page_size, and total.
 * @param {Object} response - The response object to be checked.
 * @returns {boolean} - true if the response is a list response, false otherwise.
 */
export function isPagedResponse(response) {
  if (!isResponse(response)) {
    console.error(response);
    return false;
  }

  if (response.error) {
    return false;
  }

  if (response.result) {
    return (
      response.result.hasOwnProperty("total_pages") &&
      response.result.hasOwnProperty("current_page") &&
      response.result.hasOwnProperty("page_size") &&
      response.result.hasOwnProperty("total") &&
      response.result.hasOwnProperty("data")
    );
  }
}

/**
 * Extracts the response from the given response object.
 * @template T
 * @param {any} response
 * @param {string} [id]
 * @returns {RPCDataResponseMessage<T> | RPCErrorResponseMessage}
 */
export function extractDataResponse(response, id) {
  if (!isResponse(response)) {
    console.error(response);
    return new RPCErrorResponseMessage(RPC_PARSE_ERROR, id);
  }

  let errorResponse = extractErrorResponse(response);

  if (errorResponse) {
    return errorResponse;
  }

  return new RPCDataResponseMessage(response.result, response.id || id);
}

/**
 * Determines the type of the given response.
 * Returns "pagedData" if the result has pagination properties: total_pages, current_page, page_size, and total.
 * Returns "data" if the response contains a result but lacks pagination properties.
 * Returns "error" if none of the above conditions are met.
 * @param {any} response - The response object to determine the type of.
 * @returns {"pagedData"|"data"|"error"} - The type of response: "pagedData", "data", or "error".
 */
export function getResponseType(response) {
  if (response.error) {
    return "error";
  }

  if (response.result) {
    if (isPagedResponse(response)) {
      return "pagedData";
    }

    return "data";
  }

  return "error";
}

/**
 * Extracts a response message from a JSON response object.
 * @param {any} object - The JSON response object to be extracted.
 * @param {string} [id] - The ID of the response.
 * @param {boolean} [notify] - Whether to notify the response event handler.
 * @returns {RPCDataResponseMessage|RPCErrorResponseMessage|RPCPagedResponseMessage}
 *   The extracted response message, or an array of extracted response messages.
 */
export function extractRPCResponse(object, id = null, notify = true) {
  if (!isResponse(object)) {
    return new RPCErrorResponseMessage(RPC_PARSE_ERROR, id);
  }
  const responseType = getResponseType(object);

  let response;

  if (responseType === "error") {
    // Create an error response message
    response = new RPCErrorResponseMessage(object.error, id);
  } else if (responseType === "data") {
    // Extract the response message from the JSON
    response = extractDataResponse(object, id);
  } else if (responseType === "pagedData") {
    // Extract the response message from the JSON
    response = extractPagedResponse(object, id);
  }

  if (notify) {
    responseEventHandler.notify(response);
  }

  return response;
}

/**
 * Fetches a resource and returns a response message in RPC format.
 * @template T
 * @param {string | URL | Request} input - The URL of the resource to fetch.
 * @param {RequestInit} [options] - Options for the fetch call.
 * @param {string} [id] - The ID of the response.
 * @param {boolean} [notify] - Whether to notify the response event handler.
 * @returns {Promise<RPCErrorResponseMessage | RPCDataResponseMessage<T> | RPCPagedResponseMessage<T>>}
 */
export async function rpcFetch(input, options, id = null, notify = true) {
  try {
    const fetchResponse = await fetch(input, options);
    let object = await fetchResponse.json();
    let rpcResponse = extractRPCResponse(object, id, notify);
    return rpcResponse;
  } catch (e) {
    console.error(e);
    return new RPCErrorResponseMessage(e, id);
  }
}


/**
 * Fetches data using the RPC protocol and returns a response message.
 * This function acts as a wrapper around the `rpcFetch` function.
 * @template T
 * @param {string | URL | Request} input - The URL of the resource to fetch.
 * @param {RequestInit} [options] - Options for the fetch call.
 * @param {string} [id] - The ID of the response.
 * @param {boolean} [notify] - Whether to notify the response event handler.
 * @returns {Promise<RPCErrorResponseMessage | RPCDataResponseMessage<T>>}
 *   A promise that resolves to an RPC response message.
 */
export async function rpcFetchData(input, options, id = null, notify = true) {
  let response = await rpcFetch(input, options, id, notify);
  if (response instanceof RPCPagedResponseMessage) {
    return /** @type {RPCDataResponseMessage<T>} */ (new RPCDataResponseMessage(response.result, response.id));
  }
  return response;
}

/**
 * Fetches a resource and returns a response message in RPC format, with pagination properties.
 * This function acts as a wrapper around the `rpcFetch` function.
 * @template T
 * @param {string | URL | Request} input - The URL of the resource to fetch.
 * @param {RequestInit} [options] - Options for the fetch call.
 * @param {string} [id] - The ID of the response.
 * @param {boolean} [notify] - Whether to notify the response event handler.
 * @returns {Promise<RPCErrorResponseMessage | RPCPagedResponseMessage<T>>}
 *   A promise that resolves to an RPC response message with pagination properties.
 */
export async function rpcFetchPageData(input, options, id = null, notify = true) {
  let response = await rpcFetch(input, options, id, notify);
  if (response instanceof RPCDataResponseMessage) {
    return new RPCErrorResponseMessage(RPC_PARSE_ERROR, response.id);
  }
  return response;
}
