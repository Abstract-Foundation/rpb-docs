import { createConfig, multicall } from "@wagmi/core";
import { http, parseAbi } from "viem";
import { abstract } from "viem/chains";

export const SEASON4_ID = 4n;

const DEFAULT_COOKIES_BAKED = 500000n;

const contracts = {
  seasonManager: "0x327E83B8517f60973473B2f2cA0eC3a0FEBB5676",
  playerRegistry: "0x663D69eCFF14b4dbD245cdac03f2e1DEb68Ed250",
  prizePool: "0x7FDF300dbe9588faB6787C2875376C8a0521Eb72",
};

const config = createConfig({
  chains: [abstract],
  transports: {
    [abstract.id]: http(),
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
  const [currentSeasonIdResult, prizePoolResult, cookiesBakedResult] = await multicall(config, {
    allowFailure: true,
    chainId: abstract.id,
    contracts: [
      {
        address: contracts.seasonManager,
        abi: seasonManagerAbi,
        functionName: "currentSeasonId",
      },
      {
        address: contracts.prizePool,
        abi: prizePoolAbi,
        functionName: "getSeasonPool",
        args: [SEASON4_ID],
      },
      {
        address: contracts.playerRegistry,
        abi: playerRegistryAbi,
        functionName: "getSeasonCookiesBaked",
        args: [SEASON4_ID],
      },
    ],
  });

  const currentSeasonId = currentSeasonIdResult.status === "success" ? currentSeasonIdResult.result : 0n;
  const rawPrizePoolWei = prizePoolResult.status === "success" ? prizePoolResult.result : 0n;
  const rawCookiesBaked = cookiesBakedResult.status === "success" ? cookiesBakedResult.result : 0n;
  const seasonStarted = currentSeasonId === SEASON4_ID;

  return {
    seasonId: SEASON4_ID,
    currentSeasonId,
    seasonStarted,
    prizePoolWei: seasonStarted ? rawPrizePoolWei : 0n,
    cookiesBaked: seasonStarted ? rawCookiesBaked : DEFAULT_COOKIES_BAKED,
  };
}
