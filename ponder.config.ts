import { createConfig, factory } from "ponder";

import { LeveragedTokenAbi } from "./abis/LeveragedTokenAbi";
import { parseAbiItem } from "viem";
import { FactoryAbi } from "./abis/FactoryAbi";
import { ReferralsAbi } from "./abis/ReferralsAbi";

export const LT_HELPER_ADDRESS = "0x560149730F1cb1594F15cF2186b4A86eC761c64D";
export const FACTORY_ADDRESS = "0xaBD5D943b4Bb1D25C6639dD264243b246CC3aA51";
export const REFERRALS_ADDRESS = "0x82A4063f4d05bb7BF18DF314DC5B63b655E86cBD";

const startBlock = 16730182;

export default createConfig({
  chains: {
    hyperEvm: {
      id: 999,
      rpc: process.env.HYPER_EVM_RPC_URL,
    },
  },
  contracts: {
    LeveragedToken: {
      chain: "hyperEvm",
      abi: LeveragedTokenAbi,
      address: [
        "0x0fe5c3fbb6bfa8d70f63032d38c07e5d795bd6bf",
        "0x10f609845076907bf9deefe11b59ab3bc04d52d7",
        "0x12daca370e66f9f20fd97aa7d5e193a58c8d520a",
        "0x1eefbacfea06d786ce012c6fc861bec6c7a828c1",
        "0x22a7a4a38a97ca44473548036f22a7bcd2c25457",
        "0x2525f0794a927df477292bee1bc1fd57b8a82614",
        "0x2608dd88a4e743cdcd8c1ddddcf006b17adafc29",
        "0x2754ba1cf5d4620427c42d521994088bc4578e1c",
        "0x3fafa8113e69b22f1b00e48306c25f0e978d2d20",
        "0x4607a05a56e21adb3f0c975f7fc7b8437cb44322",
        "0x53bec7b96d2d89b0ae270c9e6da62388a1738afe",
        "0x53c08fe027c4f62e39309a8b5508eb4c7258a0d1",
        "0x62fff9a958223fc141f2555f4432f47ba9e7ab80",
        "0x67fcda11170f302938743c8e5f1051d2a806bce2",
        "0x697e04652764ea0553e4827386e6b515bec490d8",
        "0x6c7b7765a410dd6ea4c64df4992fb60fb80f4f76",
        "0x73b8523109e2d570978c008916bcb1d7f752a0fe",
        "0x751c913d758a590b89acbc3084a9d40b46dc7257",
        "0x7fe29b27737b20180f828743148d02d66a8abee4",
        "0x81b64020df6e50f862833dd9f0894444fd586e60",
        "0x82f0edb2c710e1c3de43e13d97d902b4cbebc1d2",
        "0x8d0921192a540e7f5d6aa2b5f7d30fa9d24acb94",
        "0x90b5192c0b216e872130b46ec328151b1bc4fac7",
        "0x90cf4d94010d685eb95cbebecbf71aefa4b71ed1",
        "0x920cc3aacc065b4ee90bb1e1e42c8686be622e8a",
        "0x995a1b96c5340444a3aa6833ed08f0d284d40d90",
        "0xb9a1e94d434e57a70d161087e66e224bb132c141",
        "0xc3591a6289e68e02ddc55b102f2b1910d2c12614",
        "0xd1c4be331b6d84d3733de79cec9a82c063aaceaa",
        "0xd362fe5e49a4727c6ac8798602f9d7ec0c461d89",
        "0xdcc42ca760b502f89cc53e543322f30b78a68898",
        "0xe0cc48e64192d98d5f34e003f039959609e070a2",
        "0xf4f7b2f34a6e1adffae8335e44ab632c2156b35d",
      ],
      startBlock,
    },
    Factory: {
      chain: "hyperEvm",
      abi: FactoryAbi,
      address: FACTORY_ADDRESS,
      startBlock,
    },
    Referrals: {
      chain: "hyperEvm",
      abi: ReferralsAbi,
      address: REFERRALS_ADDRESS,
      startBlock,
    },
  },
});
