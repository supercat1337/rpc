<h1 align="center">
    @supercat1337/rpc
</h1>

This library is a JavaScript implementation of a Remote Procedure Call (RPC) system.

The purpose of this library is to enable communication between different parts of an application, or between different applications, using a standardized RPC protocol. This allows developers to write code that can be executed remotely, and receive responses from the remote execution.

Here are some specific features and purposes of this library:
- RPC protocol implementation: The library provides an implementation of the RPC protocol, which defines the format and structure of RPC requests and responses.
- Request and response handling: The library provides classes and functions for creating, sending, and receiving RPC requests and responses.
- Error handling: The library provides mechanisms for handling errors that occur during RPC communication, such as parsing errors, invalid requests, and internal server errors.
- Event-driven architecture: The library uses an event-driven architecture, which allows developers to write code that responds to specific events, such as receiving an RPC response.
- Decoupling: The library helps to decouple different parts of an application, or different applications, by providing a standardized way of communicating between them.

Some possible use cases for this library include:
- Microservices architecture: This library could be used to implement communication between microservices in a distributed system.
- Client-server architecture: This library could be used to implement communication between a client and a server in a client-server architecture.
- Distributed computing: This library could be used to implement distributed computing systems, where tasks are executed remotely and results are returned to the client.
- Overall, the purpose of this library is to provide a standardized way of implementing RPC communication in JavaScript applications, and to enable developers to write code that can be executed remotely and receive responses from the remote execution.

### The library consists of the following classes and functions:
- responseEventHandler class: This class is used to handle RPC responses and events.
- RequestMessage class: This class is used to create RPC requests.
- RPCDataResponseMessage class: This class is used to create RPC responses.
- RPCErrorResponseMessage class: This class is used to create RPC error responses.
- RPCPagedResponseMessage class: This class is used to create RPC paged responses.
- extractRPCResponse(object, response_id = null, notify = true) - This function takes a JSON response object and extracts a response message from it. It checks the response type (error, data, or paged data) and creates a corresponding response message object (RPCErrorResponseMessage, RPCDataResponseMessage, or RPCPagedResponseMessage). If notification is enabled, it notifies the response event handler with the extracted response message. The function returns the extracted response message. 
- rpcFetch(input, options, id = null, notify = true) - This function fetches a resource using the RPC protocol and returns a response message.
- rpcFetchData(input, options, id = null, notify = true) - This function fetches data using the RPC protocol and returns a response message. This function acts as a wrapper around the `rpcFetch` function.
- rpcFetchPageData(input, options, id = null, notify = true) - This function fetches paged data using the RPC protocol and returns a response message. This function acts as a wrapper around the `rpcFetch` function.

## Installation

To install the library, run the following command:

```bash
npm install @supercat1337/rpc
```

### Usage

```js
import { RequestMessage, RPCErrorResponseMessage, rpcFetchData } from '@supercat1337/rpc';

async function rpcCall() {
  let requestMessage = new RequestMessage(
    "method", // The name of the method to be invoked
    { foo: "bar" }, // The parameters for the method
    "request_id" // The optional identifier for the request
  );

  let rpcResponse = await rpcFetchData("http://localhost:8545", { // The URL of the RPC server
    method: "POST", // The HTTP method
    body: requestMessage.toFormData(), // The body of the request
  });

  if (rpcResponse instanceof RPCErrorResponseMessage) { // Check if the response is an error
    console.error(rpcResponse.error.message);
  } else {
    console.log(rpcResponse.result);
  }
}

rpcCall();
```

## responseEventHandler

The responseEventHandler class acts as a central hub for response events, allowing different components to listen for and react to specific responses without having to know about each other's implementation details.

Components can subscribe to specific response events using the on method, providing a callback function that will be executed when the response is received. When a response is received, the responseEventHandler instance can notify all subscribed components by emitting the response event, and the subscribed components can react accordingly.

The responseEventHandler class seems to be designed to decouple the components that send and receive responses, making it easier to manage complex workflows and interactions between different parts of the application.

The responseEventHandler class is likely used to handle responses from remote procedure calls (RPCs), given the presence of RPC-related constants and classes in the surrounding code.

### Usage

```js
import {
  RPCDataResponseMessage,
  RPCErrorResponseMessage,
  RequestMessage,
  responseEventHandler,
  rpcFetchData,
} from '@supercat1337/rpc';

async function rpcCall() {
  let requestMessage = new RequestMessage(
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
    /** @type {RPCDataResponseMessage|RPCErrorResponseMessage} */ rpcResponse // The response message
  ) => {
    if (rpcResponse instanceof RPCErrorResponseMessage) { // Check if the response is an error
      console.error(rpcResponse.error.message);
    } else {
      console.log(rpcResponse.result);
    }
  }
);

rpcCall();
```