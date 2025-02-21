// @ts-check

import {
  RPCErrorResponseMessage,
  RequestMessage,
  rpcFetchData,
} from "../dist/rpc.esm.js";

async function rpcCall() {
  let requestMessage = new RequestMessage(
    "method", // The name of the method to be invoked
    { foo: "bar" }, // The parameters for the method
    "request_id" // The optional identifier for the request
  );

  let rpcResponse = await rpcFetchData("http://localhost:8545", {
    method: "POST",
    body: requestMessage.toFormData(),
  });

  if (rpcResponse instanceof RPCErrorResponseMessage) {
    console.error(rpcResponse.error.message);
  } else {
    console.log(rpcResponse.result);
  }
}

rpcCall();
