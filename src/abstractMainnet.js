import { createConfig, readContract } from "@wagmi/core";
import { defineChain, http, parseAbi } from "viem";

export const SEASON4_ID = 4n;

const DEFAULT_COOKIES_BAKED = 500000n;
const ABSTRACT_MAINNET_RPC_URL = "https://api.mainnet.abs.xyz";

const abstractMainnet = defineChain({
  id: 2741,
  name: "Abstract",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [ABSTRACT_MAINNET_RPC_URL] },
    public: { http: [ABSTRACT_MAINNET_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "Abstract Explorer",
      url: "https://abscan.org",
    },
  },
});

const contracts = {
  seasonManager: "0x327E83B8517f60973473B2f2cA0eC3a0FEBB5676",
  playerRegistry: "0x663D69eCFF14b4dbD245cdac03f2e1DEb68Ed250",
  prizePool: "0x7FDF300dbe9588faB6787C2875376C8a0521Eb72",
};

const config = createConfig({
  chains: [abstractMainnet],
  transports: {
    [abstractMainnet.id]: http(ABSTRACT_MAINNET_RPC_URL),
  },
});

const seasonManagerAbi = parseAbi([
  "function currentSeasonId() view returns (uint256)",
]);

const playerRegistryAbi = parseAbi([
  "function getSeasonCookiesBaked(uint256 seasonId) view returns (uint256)",
]);

const prizePoolAbi = parseAbi([
  "function getSeasonPool(uint256 seasonId) view returns (uint256)",
]);

export const DEFAULT_SEASON4_SNAPSHOT = {
  seasonId: SEASON4_ID,
  currentSeasonId: 0n,
  seasonStarted: false,
  prizePoolWei: 0n,
  cookiesBaked: DEFAULT_COOKIES_BAKED,
};

export async function fetchSeason4Snapshot() {
  const [currentSeasonIdResult, prizePoolResult, cookiesBakedResult] = await Promise.allSettled([
    readContract(config, {
      address: contracts.seasonManager,
      abi: seasonManagerAbi,
      functionName: "currentSeasonId",
      chainId: abstractMainnet.id,
    }),
    readContract(config, {
      address: contracts.prizePool,
      abi: prizePoolAbi,
      functionName: "getSeasonPool",
      args: [SEASON4_ID],
      chainId: abstractMainnet.id,
    }),
    readContract(config, {
      address: contracts.playerRegistry,
      abi: playerRegistryAbi,
      functionName: "getSeasonCookiesBaked",
      args: [SEASON4_ID],
      chainId: abstractMainnet.id,
    }),
  ]);

  const currentSeasonId = currentSeasonIdResult.status === "fulfilled" ? currentSeasonIdResult.value : 0n;
  const rawPrizePoolWei = prizePoolResult.status === "fulfilled" ? prizePoolResult.value : 0n;
  const rawCookiesBaked = cookiesBakedResult.status === "fulfilled" ? cookiesBakedResult.value : 0n;
  const seasonStarted = currentSeasonId === SEASON4_ID;

  return {
    seasonId: SEASON4_ID,
    currentSeasonId,
    seasonStarted,
    prizePoolWei: seasonStarted ? rawPrizePoolWei : 0n,
    cookiesBaked: seasonStarted ? rawCookiesBaked : DEFAULT_COOKIES_BAKED,
  };
}
