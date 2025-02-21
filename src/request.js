// @ts-check

export class RPCRequestMessage {
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
