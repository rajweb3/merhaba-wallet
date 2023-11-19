export const keyStoreAbi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "guardianHash",
        type: "bytes32",
      },
    ],
    name: "cancelGuardianRemoval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelRecovery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "oldGuardianHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "newGuardianHash",
        type: "bytes32",
      },
    ],
    name: "executeGuardianRemoval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newVerificationKey",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "guardianList",
        type: "address[]",
      },
    ],
    name: "executeRecovery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "guardianAddrHashes",
        type: "bytes32[]",
      },
      {
        internalType: "uint256",
        name: "_threshold",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "guardianHash",
        type: "bytes32",
      },
    ],
    name: "GuardianRemovalQueued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "oldGuardianHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newGuardianHash",
        type: "bytes32",
      },
    ],
    name: "GuardianRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "guardianHash",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "guardianAddr",
        type: "address",
      },
    ],
    name: "GuardianRevealed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newGuardianHash",
        type: "bytes32",
      },
    ],
    name: "GuardinshipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "guardianHash",
        type: "bytes32",
      },
    ],
    name: "initiateGuardianRemoval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_proposedVerificationKey",
        type: "address",
      },
    ],
    name: "initiateRecovery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "NewWalletRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "by",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "round",
        type: "uint256",
      },
    ],
    name: "RecoveryCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldVerificationKey",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newVerificationKey",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "round",
        type: "uint256",
      },
    ],
    name: "RecoveryExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "by",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newProposedVerificationKey",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "round",
        type: "uint256",
      },
    ],
    name: "RecoveryInitiated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "by",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newProposedVerificationKey",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "round",
        type: "uint256",
      },
    ],
    name: "RecoverySupported",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_walletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
    ],
    name: "registerWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "revealGuardianIdentity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_proposedVerificationKey",
        type: "address",
      },
    ],
    name: "supportRecovery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "newGuardianHash",
        type: "bytes32",
      },
    ],
    name: "transferGuardianship",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_headerReporter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_adapter",
        type: "address",
      },
    ],
    name: "triggerHashRelay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentVerificationKeyRecoveryRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "guardianHashToRemovalTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "guardianToRecovery",
    outputs: [
      {
        internalType: "address",
        name: "proposedOwner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "recoveryRound",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "usedInExecuteRecovery",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "isGuardian",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isVerificationKeyInRecovery",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isWalletManaged",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "keyUpdateBlockNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "threshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalWalletsManaged",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "verificationKey",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "walletManagedNetworks",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
