// @ts-check

import {
  RPCDataResponseMessage,
  RPCErrorResponseMessage,
  RPCRequestMessage,
  responseEventHandler,
  rpcFetchData,
} from "../dist/rpc.esm.js";

async function rpcCall() {
  let requestMessage = new RPCRequestMessage(
    "method", // The name of the method to be invoked
    { foo: "bar" }, // The parameters for the method
    "request_id" // The optional identifier for the request
  );

  let rpcResponse = await rpcFetchData("http://localhost:8545", { // The URL of the RPC server
    method: "POST", // The HTTP method to use
    body: requestMessage.toFormData(), // The FormData object representing the RPCRequest
  });

  return rpcResponse;
}

responseEventHandler.on( // Subscribe to the response event
  "request_id", // The ID of the response
  (
    /** @type {RPCDataResponseMessage<{foo: string, bar: number}>|RPCErrorResponseMessage} */ rpcResponse // The response message
  ) => {
    if (rpcResponse instanceof RPCErrorResponseMessage) { // Check if the response is an error
      console.error(rpcResponse.error.message);
    } else {
      console.log(rpcResponse.result);
    }
  }
);

rpcCall();
