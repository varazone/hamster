## Deploy to Testnet
1. Deploy [program](https://github.com/gear-foundation/Simple-Counter-pingv2/blob/master/frontend/src/assets/meta/hamster.opt.wasm) to the Testnet, please refer to the [documentation](https://wiki.gear-tech.io/docs/getting-started-in-5-minutes/#deploy-your-smart-contract-to-the-testnet).

## Declare Environment Variables:
Create a `.env` file; `.env.example` will let you know what variables are expected.

- `VITE_NODE_ADDRESS`: The network address used by the contract.
- `VITE_CONTRACT_ADDRESS`: The program ID of the deployed contract within your application.

## Using Yarn

1. Install [Yarn](https://classic.yarnpkg.com/en/docs/install)

2. Install dependencies the project
   ```bash
   yarn install
   yarn build
   ```
3. How to run
* `yarn dev` - starts app in dev mode
* `yarn build` - creates production build
* `yarn start` - runs local server with production build
