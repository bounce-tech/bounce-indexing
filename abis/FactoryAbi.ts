export const FactoryAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "globalStorage_",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createLt",
    inputs: [
      {
        name: "marketId_",
        type: "uint32",
        internalType: "uint32",
      },
      {
        name: "targetLeverage_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "isLong_",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "lt",
    inputs: [
      {
        name: "",
        type: "uint32",
        internalType: "uint32",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ltExists",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lts",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "redeployLt",
    inputs: [
      {
        name: "ltAddress_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CreateLeveragedToken",
    inputs: [
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "marketId",
        type: "uint32",
        indexed: true,
        internalType: "uint32",
      },
      {
        name: "targetLeverage",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "isLong",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AlreadyCreated",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidLeverage",
    inputs: [],
  },
  {
    type: "error",
    name: "NotLeveragedToken",
    inputs: [],
  },
  {
    type: "error",
    name: "NotOwner",
    inputs: [],
  },
  {
    type: "error",
    name: "PrecompileLib__PerpAssetInfoPrecompileFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "StillHasMargin",
    inputs: [],
  },
] as const;
