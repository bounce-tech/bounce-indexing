# Bounce Indexing

A [Ponder](https://ponder.sh) indexing project for tracking [Bounce Tech](https://bounce.tech/) leveraged tokens and trades on HyperEVM.

## Overview

This project indexes the **Bounce Tech leveraged token protocol**, a decentralized finance (DeFi) platform that enables leveraged trading through tokenized assets. The indexer tracks leveraged token contracts created by the Bounce Tech factory contract, monitoring:

- **Leveraged Tokens**: Token metadata including address, creator, market ID, leverage settings, and ERC-20 properties (symbol, name, decimals)
- **Trades**: All mint and redeem operations for leveraged tokens

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in `.env.local`:

Create a `.env.local` file in the root directory with:

```bash
HYPER_EVM_RPC_URL=your_rpc_url_here
```

3. Start the development server:

```bash
npm run dev
```

The dev server will:

- Connect to the database
- Start indexing from the configured start block
- Serve the GraphQL API at `http://localhost:42069/graphql`
- Serve SQL over HTTP at `http://localhost:42069/sql`

## Schema

### `leveragedToken`

Stores metadata for each leveraged token created by the factory.

- `address` (primary key): Token contract address
- `creator`: Address that created the token
- `marketId`: Market identifier
- `targetLeverage`: Target leverage amount
- `isLong`: Whether the token is a long position
- `symbol`: ERC-20 symbol
- `name`: ERC-20 name
- `decimals`: ERC-20 decimals

### `trade`

Stores all mint and redeem operations.

- `id` (primary key): Unique trade identifier
- `isBuy`: `true` for mints, `false` for redeems
- `leveragedToken`: Address of the leveraged token (references `leveragedToken.address`)
- `timestamp`: Block timestamp
- `sender`: Address initiating the trade
- `recipient`: Address receiving the tokens
- `baseAssetAmount`: Amount of base asset
- `leveragedTokenAmount`: Amount of leveraged tokens

### Relations

- Each `leveragedToken` can have many `trade` records
- Each `trade` belongs to one `leveragedToken`

## Indexing

The project indexes events from the Bounce Tech protocol:

1. **Bounce Tech Factory Contract** (`0xaBD5D943b4Bb1D25C6639dD264243b246CC3aA51`)

   - `CreateLeveragedToken`: Creates a new leveraged token record and reads token metadata (symbol, name, decimals) from the contract

2. **Bounce Tech LeveragedToken Contracts** (factory pattern)
   - `Mint`: Records buy trades
   - `Redeem`: Records sell trades
   - `ExecuteRedeem`: Records executed redemption trades

## Querying

### GraphQL

Visit `http://localhost:42069/graphql` to explore the auto-generated GraphQL API.

Example query:

```graphql
query MyQuery {
  trades {
    items {
      isBuy
      leveragedTokenAmount
      timestamp
      baseAssetAmount
      leveragedToken {
        address
        marketId
        isLong
        name
        symbol
      }
    }
  }
}
```

### SQL over HTTP

Query tables directly using SQL over HTTP at `http://localhost:42069/sql`.

## Scripts

- `npm run dev`: Start development server with hot reload
- `npm run start`: Start production server
- `npm run serve`: Serve API only (no indexing)
- `npm run db`: Database management commands
- `npm run codegen`: Generate TypeScript types
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript type checking

## Learn More

- [Bounce Tech](https://bounce.tech/) - The leveraged token protocol being indexed
- [Ponder Documentation](https://ponder.sh/docs)
- [Ponder GitHub](https://github.com/ponder-sh/ponder)
