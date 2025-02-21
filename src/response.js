// @ts-check

/** @typedef {{code?:number, message?:string, data?:Object}} IErrorResponseMessage */

export class RpcErrorResult {
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

export class RPCErrorResponseMessage {
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
export class RPCDataResponseMessage {
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
export class PagedData {
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
export class RPCPagedResponseMessage {
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
