// @ts-check

import { EventEmitter } from "@supercat1337/event-emitter";

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
export { responseEventHandler };
