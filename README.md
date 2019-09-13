# Echo Explorer Server

REST API Server for [EchoExplorer](https://github.com/echoprotocol/explorer.git)

## Methods

### Accounts

#### Getting an account avatar:

    GET /api/accounts/:name/avatar.png


### Contracts

#### Fetching a contract:

    GET /api/contracts/:id

#### Updating the current contract:

    PUT /api/contracts/:id

| Field              | Description                                                       | Optional   |
| ------------------ | ----------------------------------------------------------------- | ---------- |
| `accountId`        | Account, who created contract                                     | no         |
| `signature`        | Encrypted message signed by account                               | no         |
| `message`          | Message, that was encrypted                                       | no         |
| `name`             | String                                                            | yes        |
| `description`      | String                                                            | yes        |
| `icon`             | File (jpg / jpeg / png / gif)                                     | yes        |

Returns the updated contract.

#### Like/unlike contract:

    POST /api/contracts/like

| Field              | Description                                                       | Optional   |
| ------------------ | ----------------------------------------------------------------- | ---------- |
| `accountId`        | Account, who created contract                                     | no         |
| `signature`        | Encrypted message signed by account                               | no         |
| `message`          | Message, that was encrypted                                       | no         |
| `contractId`       | Liked or unliked contract                                         | no         |

Returns the contract with updated list of likers.

#### Set contract ABI:

    POST /api/contracts/abi

| Field              | Description                                                       | Optional   |
| ------------------ | ----------------------------------------------------------------- | ---------- |
| `abi`              | Contract ABI                                                      | no         |
| `id`               | Contract ID                                                       | no         |

Returns the contract with updated ABI.

#### Verify contract:

    POST /api/contracts/verify

| Field              | Description                                                       | Optional   |
| ------------------ | ----------------------------------------------------------------- | ---------- |
| `id`               | Contract ID                                                       | no         |
| `name`             | Contract name in source code                                      | no         |
| `inputs`           | Constructor arguments                                             | yes        |
| `compiler_version` | Solidity compiler version                                         | no         |
| `source_code`      | Solidity source code                                              | no         |

Returns the verified contract.

#### Search contracts by name:

    POST /api/contracts/search

| Field              | Description                                                       | Optional   |
| ------------------ | ----------------------------------------------------------------- | ---------- |
| `name`             | Searched contract name                                            | yes        |
| `offset`           | The starting point of the results list                            | yes        |
| `limit`            | Maximum number of matching contracts to return                    | yes        |

Returns the contracts list.

## Installation Prerequisites

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 8.x.x or higher is required.
Also [install and run Mongo DB](https://docs.mongodb.com/manual/installation/).

## Install Echo Explorer Server from github source

Use the following steps to install the server from github source:

Clone the git repository:

```bash
git clone https://github.com/echoprotocol/explorer-server.git
```

Go into the repository:

```bash
cd explorer-server
```

Use the package manager [npm](https://www.npmjs.com/) to install dependencies:

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

This will launch the server at http://localhost:3000

## Development

To work locally, install the [EchoDB](https://github.com/echoprotocol/echodb.git) and configure enviroment.

Create `local.json` in `config` folder:

```bash
"echodb": {
    "http_url": "http://localhost:3000/graphql"
}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

The MIT License (MIT)

Copyright (c) 2017-2019 Kamil Myśliwiec <http://kamilmysliwiec.com>

Copyright (c) 2019 Echo Technological Solutions LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
