# RobertHood

![screenshot](https://raw.githubusercontent.com/felipecsl/roberthood/master/screenshot.png)

A simple Web UI that you can use to manage your Robinhood account.

**Disclaimer**: This is in no way affiliated with Robinhood nor is an official
product.

The server is a simple Node.js proxy that redirects all calls to api.robinhood.com
Your username or password are never stored and are sent directly to Robinhood.
Your API token is used to authenticate the API calls and is stored in local storage.

Current functionality includes only logging in and viewing your portfolio.
Coming soon: buy, sell, search for stocks, graphs and much more!

The frontend is a [Cycle.js](https://github.com/cyclejs/core) application using
[Polymer](https://www.polymer-project.org/1.0/) components.

## License

```
Copyright 2016 Felipe Lima

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
