# useHttpClient

React hook library that allows us to perform centralized http requests within React's ecosystem.


## Installation
```bash
# Using npm
$ npm install use-http-client

# Using yarn
$ yarn add use-http-client
```

## Usage
### Context
The context `HttpClientConfig` provides a global http request/ response handlers for all `useHttpClient` hooks.


#### Global Configuration
```js
// config.js
import { HttpClientResponse } from 'use-http-client';

const config = {

    requestHandler: async (path: string, options: RequestInit) => {
      
      // Include authorization in every request
      const res = await fetch(`https://api.test.xyz${path}`, {
          ...options,
          headers: {
            ...(options.headers || {}),
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ABC123' 
          }
        }
      });

      // HttpClientResponse
      let data = null;
      let error = null;
      let status = null;

      data = await res.json();
      status = res.status;

      if(!res.ok) {

        // Handle and structure the error response object. (HttpErrorResponse)
        error = {
          code: data?.error_code || null,
          message: data?.message || null,
          errors: data?.errors || []
        };
        data = null;
      }

      return { status, data, error }; 

    },

    responseHandler: async (response: HttpClientResponse) => {

      // Add default response behavior based
      // on the http status.
      const { status } = response;
      switch (status) {
        case 401:
        // Redirect to login page
        case 500:
        // Show error warning notification
        default:
          return response;
      }
    }
  };
}

export default config;

```
### Implementation
This example, provides the default implementation of the hook using the global configuration.
```js
import React for 'react';
import { HttpClientConfig, useHttpClient } from 'use-http-client';
import config from './config';

function UserComponent() {

  const userClient = useHttpClient('/users');
  const [userId, setUserId] = React.useState(null);

  const handleInputChange = (event) => setUserId(event.target.value);

  const handleClick = async () => {
    // It will perform an http request to the https://api.test.xyz/users/${userId}
    const { data } = await userClient({
      path: `/${userId}`,
      options: {
        method: 'GET',
      }
    });
    
    alert(`Hi! ${data.firstName} ${data.lastName}`);
  }

  return (
    <div>
      <input type="text" onChange={handleInputChange}>
      <button onClick={handleClick}>
        Show user
      </button>
    </div>
  );

}

function App() {
  return (
    <HttpClientConfig value={config}>
      <UserComponent />
    </HttpClientConfig>
  )
}
```

### Re-using hook instance
There are some cases that you want to reuse the hook instance, when they are sharing the same prefix path.

``` js
function App() {
   const userClient = useHttpClient('/users');

   const handleLogin = async (email: string, password: string) => {
     const response = await userClient({
       path: '/login',
       options: {
          method: 'POST',
          body: JSON.stringify({
            email,
            password
          })
        }
     });
     // ...
   }

   const getUserDetails = async (userId: string) => {
     const response = await userClient({
       path: `/${userId}`,
     });
     // ...
   }

  // ...
}

```
### Overriding global configuration
You can override the global configuration for a specific request.

#### Custom handlers
You can override the global request and response handler by providing it in the caller function.
``` js
function App() {
   const userClient = useHttpClient('/users');

   const handleLogin = async (email: string, password: string) => {
     const response = await userClient({
       path: '/login',
       options: {
          method: 'POST',
          body: JSON.stringify({
            email,
            password
          })
        },
       requestHandler: (path: string, options: RequestInit)=> fetch(`https://apiv2.test.xyz${path}`, options),
       responseHandler: (response: HttpClientResponse) => {
         // Custom response handling here.
       }
     });
     // ...
   }

  // ...
}

```
#### Custom response handling
Response handling can be done outside the hook's caller function, by setting the `ignoreResponseHandler` flag to `true`. This will not execute the global response handler callback.
``` js
function App() {
   const userClient = useHttpClient('/users');

   const handleLogin = async (email: string, password: string) => {
     const response = await userClient({
       path: '/login',
       options: {
          method: 'POST',
          body: JSON.stringify({
            email,
            password
          })
        },
        ignoreResponseHandler: true,
     });


     // Handle the response here.
     const { data, error } = response;
   
   }

  // ...
}
```

## API
### **`Context Configuration`**
|Name|Type|Description
|:--:|:-----|:-----|
|**`requestHandler`**| ``` (path: string, options: RequestInit) => Promise<HttpClientResponse>``` |A Promise that handles and performs the http request.  You can apply different http libraries since it only requires url path and options.
|**`responseHandler`**| ``` (response: HttpClientResponse) => Promise<HttpClientResponse>``` |A Promise that handles default http responses such as handling 4xx & 5xx errors.

### **`useHttpClient`**

#### Hook parameters
|Name|Type|Description
|:--:|:---:|:-----|
|**`url`**| string | Can be http request url, prefix or base path.
#### Caller function object parameters
```js
const response = caller({ .... })
```
|Name|Type|Default|Description
|:--:|:-----|:-----|:-----|
|**`path`** (optional)| string || Append url path in the main request.
|**`options`** (optional)| Generic | RequestInit| Request options to be consumed by the ``requestHandler``.
|**`requestHandler`** (optional)| ```(path: string, options: RequestInit) => Promise<HttpClientResponse>``` | | Overrides the global ``requestHandler``.
|**`responseHandler`** (optional)| ```(response: HttpClientResponse) => Promise<HttpClientResponse>``` | | Overrides the global ``responseHandler``.
|**`ignoreResponseHandler`** (optional)| boolean | false | Flag to skip the context's ``responseHandler`` execution.

### **`HttpClientResponse`**
The standard response format object.
|Name|Type|Description
|:--:|:-----|:-----|
| **`status`**| number | The http request status
| **`data`**| Generic | The response data
| **`errors`** | HttpErrorResponse \| null | Error response data when the request fails. Must be null when the request succeeds.

### **`HttpErrorResponse`**
The data object included in the response when the HTTP request fails.
|Name|Type|Description
|:--:|:-----|:-----|
| **`code`**| string \| number | Unique code of the error. It can be custom or using the default HTTP codes.
| **`message`**| string | Descriptive information about the error.
| **`errors`** | Array<Record<any, any>> | List of additional information about the error.


## Authors
- Julius Vasquez (juvsqz@gmail.com)
## License
The MIT License.
