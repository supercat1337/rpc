<h1 align="center">
    @supercat1337/rpc
</h1>

This library is a JavaScript implementation of a Remote Procedure Call (RPC) system.

The purpose of this library is to enable communication between different parts of an application, or between different applications, using a standardized RPC protocol. This allows developers to write code that can be executed remotely, and receive responses from the remote execution.

## Installation

To install the library, run the following command:

```bash
npm install @supercat1337/rpc
```

## Usage

```js
import { 
  RPCRequestBody, 
  RPCErrorResponse, 
  rpcFetchData 
} from '@supercat1337/rpc';

async function rpcCall() {
  let requestMessage = new RPCRequestBody(
    "method", // The name of the method to be invoked
    { foo: "bar" }, // The parameters for the method
    "request_id" // The optional identifier for the request
  );

  let rpcResponse = await rpcFetchData("http://localhost:8545", { // The URL of the RPC server
    method: "POST", // The HTTP method
    body: requestMessage.toFormData(), // The body of the request
  });

  if (rpcResponse instanceof RPCErrorResponse) { // Check if the response is an error
    console.error(rpcResponse.error.message);
  } else {
    console.log(rpcResponse.result);
  }
}

rpcCall();
```

## The library consists of the following classes and functions:

- `extractRPCResponse`(object, response_id = null, notify = true) - This function takes a JSON response object and extracts a response message from it. It checks the response type (error, data, or paged data) and creates a corresponding response message object (RPCErrorResponse, RPCDataResponse, or RPCPagedResponse). If notification is enabled, it notifies the response event handler with the extracted response message. The function returns the extracted response message. 
- `rpcFetchData`(input, options, id = null, notify = true) - This function fetches data using the RPC protocol and returns a response message. This function acts as a wrapper around the `rpcFetch` function.
- `rpcFetchPageData`(input, options, id = null, notify = true) - This function fetches paged data using the RPC protocol and returns a response message. This function acts as a wrapper around the `rpcFetch` function.

- `RPCRequestBody` class: This class is used to create RPC requests.
- `RPCDataResponse` class: This class is used to create RPC responses.
- `RPCErrorResponse` class: This class is used to create RPC error responses.
- `RPCPagedResponse` class: This class is used to create RPC paged responses.

- `responseEventHandler`: This service is used to handle RPC responses and events.

## ResponseEventHandler Service

The ResponseEventHandler Service acts as a central hub for response events, allowing different components to listen for and react to specific responses without having to know about each other's implementation details.

Components can subscribe to specific response events using the on method, providing a callback function that will be executed when the response is received. When a response is received, the responseEventHandler instance can notify all subscribed components by emitting the response event, and the subscribed components can react accordingly.

The responseEventHandler service is designed to decouple the components that send and receive responses, making it easier to manage complex workflows and interactions between different parts of the application.

The responseEventHandler service is used to handle responses from remote procedure calls (RPCs), given the presence of RPC-related constants and classes in the surrounding code.

### Usage

```js
import {
  RPCDataResponse,
  RPCErrorResponse,
  RPCRequestBody,
  responseEventHandler,
  rpcFetchData,
} from '@supercat1337/rpc';

async function rpcCall() {
  let requestMessage = new RPCRequestBody(
    "method", // The name of the method to be invoked
    { foo: "bar" }, // The parameters for the method
    "request_id" // The optional identifier for the request
  );

  let rpcResponse = await rpcFetchData("http://localhost:8545", { // The URL of the RPC server
    method: "POST", // The HTTP method to use
    body: requestMessage.toFormData(), // The FormData object representing the RPCRequestBody
  });

  return rpcResponse;
}

responseEventHandler.on( // Subscribe to the response event
  "request_id", // The ID of the response
  (
  /** @type {RPCDataResponse<{foo: string, bar: number}>|RPCErrorResponse} */ rpcResponse // The response message
  ) => {
    if (rpcResponse instanceof RPCErrorResponse) { // Check if the response is an error
      console.error(rpcResponse.error.message);
    } else {
      console.log(rpcResponse.result);
    }
  }
);

rpcCall();
```