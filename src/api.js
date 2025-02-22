// @ts-check

import { RPC_PARSE_ERROR } from "./constants.js";

import {
  RPCDataResponse,
  RPCPagedResponse,
  RPCErrorResponse,
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
 * Determines if the provided response contains an error and returns an appropriate RPCErrorResponse.
 * Logs and returns a parse error if the response is null or undefined.
 * If the response contains an error, a RPCErrorResponse is returned with the provided error and id.
 * If the response contains a result, it returns false indicating no error.
 * @param {Object} response - The response object to be checked for errors.
 * @param {string} [id]
 * @returns {RPCErrorResponse|false} - A RPCErrorResponse object if an error exists, or false if no error is found.
 */

export function extractErrorResponse(response, id = null) {
  if (!isResponse(response)) {
    console.error(response);
    return new RPCErrorResponse(RPC_PARSE_ERROR, id);
  }

  if (response.error) {
    return new RPCErrorResponse(response.error, response.id || id);
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
 * @returns {RPCPagedResponse<T> | RPCErrorResponse}
 */
export function extractPagedResponse(response, id = null) {
  if (!isResponse(response)) {
    console.error(response);
    return new RPCErrorResponse(RPC_PARSE_ERROR, id);
  }

  let errorResponse = extractErrorResponse(response);

  if (errorResponse) {
    return errorResponse;
  }

  try {
    return new RPCPagedResponse(response.result, response.id);
  } catch (e) {
    console.error(e);
    return new RPCErrorResponse(e, response.id || id);
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
 * @returns {RPCDataResponse<T> | RPCErrorResponse}
 */
export function extractDataResponse(response, id) {
  if (!isResponse(response)) {
    console.error(response);
    return new RPCErrorResponse(RPC_PARSE_ERROR, id);
  }

  let errorResponse = extractErrorResponse(response);

  if (errorResponse) {
    return errorResponse;
  }

  return new RPCDataResponse(response.result, response.id || id);
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
 * @template T
 * @param {any} object - The JSON response object to be extracted.
 * @param {Object} [rpcOptions = {}] - Options for the RPC protocol.
 * @param {string} [rpcOptions.id] - The ID of the response.
 * @param {boolean} [rpcOptions.notify] - Whether to notify the response event handler.
 * @returns {RPCDataResponse<T>|RPCErrorResponse|RPCPagedResponse<T>}
 *   The extracted response message, or an array of extracted response messages.
 */
export function extractRPCResponse(object = {}, rpcOptions = {}) {

  rpcOptions.notify = rpcOptions.hasOwnProperty("notify")? rpcOptions.notify : true;

  if (!isResponse(object)) {
    return new RPCErrorResponse(RPC_PARSE_ERROR, rpcOptions.id);
  }
  const responseType = getResponseType(object);

  let response;

  if (responseType === "error") {
    // Create an error response message
    response = new RPCErrorResponse(object.error, object.id || rpcOptions.id);
  } else if (responseType === "data") {
    // Extract the response message from the JSON
    response = extractDataResponse(object, object.id || rpcOptions.id);
  } else if (responseType === "pagedData") {
    // Extract the response message from the JSON
    response = extractPagedResponse(object, object.id || rpcOptions.id);
  }

  if (rpcOptions.notify) {
    responseEventHandler.notify(response);
  }

  return response;
}

