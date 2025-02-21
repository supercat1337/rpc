export type IErrorResponseMessage = {
    code?: number;
    message?: string;
    data?: any;
};
/**
 * @template T
 */
export class RPCDataResponseMessage<T> {
    /**
     * Constructs a new instance of RPCDataResponseMessage.
     * @param {T} data - The result data for the response.
     * @param {string|null} [id] - The optional identifier for the response.
     */
    constructor(data: T, id?: string | null);
    /** @type {T} */
    result: T;
    /** @type {null|string} */
    id: null | string;
}
export class RPCErrorResponseMessage {
    /**
     * Constructs a new RPCErrorResponseMessage instance.
     * @param {string|Error|IErrorResponseMessage} error - The error information to be used.
     * @param {string|null} [id] - The optional identifier associated with the error.
     */
    constructor(error: string | Error | IErrorResponseMessage, id?: string | null);
    /** @type {RpcErrorResult} */
    error: RpcErrorResult;
    /** @type {null|string} */
    id: null | string;
}
/**
 * @template T
 */
export class RPCPagedResponseMessage<T> {
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
    constructor(data: {
        data: T[];
        total: number;
        page_size: number;
        current_page: number;
        total_pages: number;
    }, id?: string | null);
    /** @type {PagedData<T>} */
    result: PagedData<T>;
    /** @type {null|string} */
    id: null | string;
}
export namespace RPC_INTERNAL_ERROR {
    let code: number;
    let message: string;
}
export namespace RPC_INVALID_PARAMS {
    let code_1: number;
    export { code_1 as code };
    let message_1: string;
    export { message_1 as message };
}
export namespace RPC_INVALID_REQUEST {
    let code_2: number;
    export { code_2 as code };
    let message_2: string;
    export { message_2 as message };
}
export namespace RPC_METHOD_NOT_FOUND {
    let code_3: number;
    export { code_3 as code };
    let message_3: string;
    export { message_3 as message };
}
export namespace RPC_PARSE_ERROR {
    let code_4: number;
    export { code_4 as code };
    let message_4: string;
    export { message_4 as message };
}
export class RequestMessage {
    /**
     * Constructs a new RPCRequest instance.
     * @param {string} method - The name of the method to be invoked.
     * @param {{[key: string]: string|number|Blob}} [params] - The parameters for the method.
     * @param {string|null} [id] - The optional identifier for the request.
     */
    constructor(method: string, params?: {
        [key: string]: string | number | Blob;
    }, id?: string | null);
    jsonrpc: string;
    id: string;
    method: string;
    params: {
        [key: string]: string | number | Blob;
    };
    /**
     * Converts the RPCRequest to a plain object.
     * @returns {{jsonrpc: string, id: string|null, method: string, params: object}} a plain object representing the RPCRequest.
     */
    toJSON(): {
        jsonrpc: string;
        id: string | null;
        method: string;
        params: object;
    };
    /**
     * Converts the RPCRequest to a JSON string.
     * @returns {string} A string representing the RPCRequest in JSON format.
     */
    toString(): string;
    /**
     * Converts the RPCRequest to a FormData object.
     * @returns {FormData} a FormData object representing the RPCRequest.
     */
    toFormData(): FormData;
}
/**
 * Extracts a response message from a JSON response object.
 * @param {any} object - The JSON response object to be extracted.
 * @param {string} [id] - The ID of the response.
 * @param {boolean} [notify] - Whether to notify the response event handler.
 * @returns {RPCDataResponseMessage|RPCErrorResponseMessage|RPCPagedResponseMessage}
 *   The extracted response message, or an array of extracted response messages.
 */
export function extractRPCResponse(object: any, id?: string, notify?: boolean): RPCDataResponseMessage<any> | RPCErrorResponseMessage | RPCPagedResponseMessage<any>;
export const responseEventHandler: ResponseEventHandler;
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
export function rpcFetchData<T>(input: string | URL | Request, options?: RequestInit, id?: string, notify?: boolean): Promise<RPCErrorResponseMessage | RPCDataResponseMessage<T>>;
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
export function rpcFetchPageData<T>(input: string | URL | Request, options?: RequestInit, id?: string, notify?: boolean): Promise<RPCErrorResponseMessage | RPCPagedResponseMessage<T>>;
/** @typedef {{code?:number, message?:string, data?:Object}} IErrorResponseMessage */
declare class RpcErrorResult {
    /**
     * @param {IErrorResponseMessage|string|Error} data
     */
    constructor(data: IErrorResponseMessage | string | Error);
    code: number;
    message: string;
    data: {};
}
/**
 * @template T
 */
declare class PagedData<T> {
    /**
     * Constructs an instance of PagedData.
     * @param {Object} param0 - An object containing data list properties.
     * @param {T[]} param0.data - The array of data items.
     * @param {number} param0.total - The total count of all data.
     * @param {number} param0.page_size - The size of each page.
     * @param {number} param0.current_page - The current page number.
     * @param {number} param0.total_pages - The total number of pages.
     */
    constructor(param0: {
        data: T[];
        total: number;
        page_size: number;
        current_page: number;
        total_pages: number;
    });
    /** @type {T[]} */
    data: T[];
    total: number;
    page_size: number;
    current_page: number;
    total_pages: number;
}
declare class ResponseEventHandler {
    /**
     * Subscribes to the response event with the given response_id and runs the
     * callback when the response is received.
     * @param {string} response_id - The id of the response to subscribe to.
     * @param {Function} callback - The callback to run when the response is
     * received. The callback will be given the response as an argument.
     * @returns {void}
     */
    on(response_id: string, callback: Function): void;
    /**
     * Notify all subscribers of the given response.
     * @param {Object} response - The response to notify subscribers of.
     * @returns {void}
     */
    notify(response: any): void;
    #private;
}
export {};
