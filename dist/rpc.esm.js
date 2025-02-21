import { EventEmitter } from '@supercat1337/event-emitter';

//@ts-check

const RPC_PARSE_ERROR = {
    code: -32700,
    message: "Parse error",
  };
  
  const RPC_INVALID_REQUEST = {
    code: -32600,
    message: "Invalid Request",
  };
  
  const RPC_METHOD_NOT_FOUND = {
    code: -32601,
    message: "Method not found",
  };
  
  const RPC_INVALID_PARAMS = {
    code: -32602,
    message: "Invalid params",
  };
  
  const RPC_INTERNAL_ERROR = {
    code: -32603,
    message: "Internal error",
  };

// @ts-check

/** @typedef {{code?:number, message?:string, data?:Object}} IErrorResponseMessage */

class RpcErrorResult {
  code = 0;
  message = "";
  data = {};

  /**
   * @param {IErrorResponseMessage|string|Error} data
   */
  constructor(data) {
    if (data instanceof Error) {
      this.message = data.message;
      this.data = data;
    } else if (typeof data == "string") {
      this.message = data;
    } else {
      this.code = data.code || 0;
      this.message = data.message || "";
      this.data = data.data || {};
    }
  }
}

class RPCErrorResponseMessage {
  /** @type {RpcErrorResult} */
  error;
  /** @type {null|string} */
  id;

  /**
   * Constructs a new RPCErrorResponseMessage instance.
   * @param {string|Error|IErrorResponseMessage} error - The error information to be used.
   * @param {string|null} [id] - The optional identifier associated with the error.
   */
  constructor(error, id) {
    this.error = new RpcErrorResult(error);
    this.id = id || null;
  }

}

/**
 * @template T
 */
class RPCDataResponseMessage {
  /** @type {T} */
  result;
  /** @type {null|string} */
  id;

  /**
   * Constructs a new instance of RPCDataResponseMessage.
   * @param {T} data - The result data for the response.
   * @param {string|null} [id] - The optional identifier for the response.
   */
  constructor(data, id) {
    this.result = data;
    this.id = id || null;
  }

}

/**
 * @template T
 */
class PagedData {
  /** @type {T[]} */
  data = [];

  // total count of all data
  total = 0;
  page_size = 0;
  current_page = 0;
  total_pages = 0;

  /**
   * Constructs an instance of PagedData.
   * @param {Object} param0 - An object containing data list properties.
   * @param {T[]} param0.data - The array of data items.
   * @param {number} param0.total - The total count of all data.
   * @param {number} param0.page_size - The size of each page.
   * @param {number} param0.current_page - The current page number.
   * @param {number} param0.total_pages - The total number of pages.
   */
  constructor(param0) {
    if (!Array.isArray(param0.data)) {
      console.error(param0);
      throw new Error("data must be an array");
    }

    let total =
      typeof param0.total == "number" ? param0.total : parseInt(param0.total);
    let page_size =
      typeof param0.page_size == "number"
        ? param0.page_size
        : parseInt(param0.page_size);
    let current_page =
      typeof param0.current_page == "number"
        ? param0.current_page
        : parseInt(param0.current_page);
    let total_pages =
      typeof param0.total_pages == "number"
        ? param0.total_pages
        : parseInt(param0.total_pages);

    if (isNaN(total)) {
      console.error(param0);
      throw new Error("total must be a number");
    }

    if (isNaN(page_size)) {
      console.error(param0);
      throw new Error("page_size must be a number");
    }

    if (isNaN(current_page)) {
      console.error(param0);
      throw new Error("current_page must be a number");
    }

    if (isNaN(total_pages)) {
      console.error(param0);
      throw new Error("total_pages must be a number");
    }

    this.data = param0.data;
    this.total = param0.total;
    this.page_size = param0.page_size;
    this.current_page = param0.current_page;
    this.total_pages = param0.total_pages;
  }
}

/**
 * @template T
 */
class RPCPagedResponseMessage {
  /** @type {PagedData<T>} */
  result;

  /** @type {null|string} */
  id;

  /**
   * Constructs an instance of RPCPagedResponseMessage.
   * @param {Object} data - An object containing data list properties.
   * @param {T[]} data.data - The array of data items.
   * @param {number} data.total - The total count of all data.
   * @param {number} data.page_size - The size of each page.
   * @param {number} data.current_page - The current page number.
   * @param {number} data.total_pages - The total number of pages.
   * @param {string|null} [id] - An optional identifier for the response.
   */
  constructor(data, id) {
    this.result = new PagedData(data);
    this.id = id || null;
  }

}

// @ts-check


class ResponseEventHandler {
  #eventEmitter = new EventEmitter();

  /**
   * Subscribes to the response event with the given response_id and runs the
   * callback when the response is received.
   * @param {string} response_id - The id of the response to subscribe to.
   * @param {Function} callback - The callback to run when the response is
   * received. The callback will be given the response as an argument.
   * @returns {void}
   */
  on(response_id, callback) {
    this.#eventEmitter.on(response_id, callback);
  }

  /**
   * Notify all subscribers of the given response.
   * @param {Object} response - The response to notify subscribers of.
   * @returns {void}
   */
  notify(response) {
    if (response && response.id && typeof response.id == "string") {
      if (
        response.hasOwnProperty("error") ||
        response.hasOwnProperty("result")
      ) {
        setTimeout(() => this.#eventEmitter.emit(response.id, response), 0);
      }
    }
  }
}

const responseEventHandler = new ResponseEventHandler();

// @ts-check


/**
 * Checks if the given response object is a valid response.
 * A valid response object is an object that contains either an error or a result.
 * @param {Object} response - The response object to be checked.
 * @returns {boolean} - true if the response is valid, false otherwise.
 */
function isResponse(response) {
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

function extractErrorResponse(response, id = null) {
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
function extractPagedResponse(response, id = null) {
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
function isPagedResponse(response) {
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
function extractDataResponse(response, id) {
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
function getResponseType(response) {
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
function extractRPCResponse(object, id = null, notify = true) {
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
async function rpcFetch(input, options, id = null, notify = true) {
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
async function rpcFetchData(input, options, id = null, notify = true) {
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
async function rpcFetchPageData(input, options, id = null, notify = true) {
  let response = await rpcFetch(input, options, id, notify);
  if (response instanceof RPCDataResponseMessage) {
    return new RPCErrorResponseMessage(RPC_PARSE_ERROR, response.id);
  }
  return response;
}

// @ts-check

class RPCRequestMessage {
  /**
   * Constructs a new RPCRequest instance.
   * @param {string} method - The name of the method to be invoked.
   * @param {{[key: string]: string|number|Blob}} [params] - The parameters for the method.
   * @param {string|null} [id] - The optional identifier for the request.
   */
  constructor(method, params, id) {
    this.jsonrpc = "2.0";
    this.id = id || null;
    this.method = method;
    this.params = params || {};
  }

  /**
   * Converts the RPCRequest to a plain object.
   * @returns {{jsonrpc: string, id: string|null, method: string, params: object}} a plain object representing the RPCRequest.
   */
  toJSON() {
    return {
      jsonrpc: this.jsonrpc,
      id: this.id,
      method: this.method,
      params: this.params,
    };
  }

  /**
   * Converts the RPCRequest to a JSON string.
   * @returns {string} A string representing the RPCRequest in JSON format.
   */
  toString() {
    return JSON.stringify({
      jsonrpc: this.jsonrpc,
      id: this.id,
      method: this.method,
      params: this.params,
    });
  }

  /**
   * Converts the RPCRequest to a FormData object.
   * @returns {FormData} a FormData object representing the RPCRequest.
   */
  toFormData() {
    const formData = new FormData();
    formData.append("jsonrpc", this.jsonrpc);

    if (this.id) {
      formData.append("id", this.id);
    }

    formData.append("method", this.method);
    //formData.append("api", this.method);

    let paramEntries = Object.entries(this.params);

    if (paramEntries.length == 0) paramEntries = [["value", 1]];

    for (const [key, value] of paramEntries) {
      let fieldValue = value instanceof Blob ? value : String(value);
      formData.append(`params[${key}]`, fieldValue);
    }

    return formData;
  }
}

export { RPCDataResponseMessage, RPCErrorResponseMessage, RPCPagedResponseMessage, RPCRequestMessage, RPC_INTERNAL_ERROR, RPC_INVALID_PARAMS, RPC_INVALID_REQUEST, RPC_METHOD_NOT_FOUND, RPC_PARSE_ERROR, extractRPCResponse, responseEventHandler, rpcFetchData, rpcFetchPageData };
