# Saunter

A very lightweight Swagger client, with no data validation or much of
anything else.

## Usage

```js
var saunter = require("saunter");
var swagger = saunter("http://my.swagger.server/my-swagger-endpoint");
swagger.then(api => api.thing.getThing({ thingId: 31337 }))
       .then(thing => console.log("Look at this thing:", thing),
             error => console.error("No thing to be had:", error));
```

## License

Copyright Adludio Ltd

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License. You may
obtain a copy of the License at
[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
