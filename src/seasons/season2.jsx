import { useEffect, useState } from "react";
import { formatEther } from "viem";
import {
  Badge, StatCard, ActionCard, TableWrapper, Th, Td,
  Callout, SectionTitle, SubTitle, P, Code, Changelog,
} from "../components";
import { DEFAULT_SEASON4_SNAPSHOT, fetchSeason4Snapshot } from "../abstractMainnet";

export const meta = {
  id: "season-2",
  number: 2,
  title: "Season 2",
  subtitle: "Balance-based scoring, matchup multipliers, and a trimmed action catalog",
  status: "ended",
  sections: [
    { id: "s2-overview", title: "Overview", icon: "🍪" },
    { id: "s2-scoring", title: "Scoring & Actions", icon: "🏆" },
    { id: "s2-calculator", title: "Cost Calculator", icon: "🧮" },
  ],
};

const changelog = [
  { type: "added", description: "100-member bakery cap" },
  { type: "added", description: "Public/private bakery toggle with password protection" },
  { type: "added", description: "Matchup multiplier on rug pricing (0.80×–2.00×)" },
  { type: "changed", description: "Season length shortened from 14 days to 7 days" },
  { type: "changed", description: "Scoring changed from total cookies baked to cookie balance (baked minus spent)" },
  { type: "changed", description: "Payouts expanded from top 3 to top 5 (50/20/15/10/5)" },
  { type: "changed", description: "Dynamic cost formula replaces flat cookie costs" },
  { type: "changed", description: "Durations shortened across the board (15min–60min)" },
  { type: "changed", description: "Per-action cooldowns replace the flat 1-hour cooldown" },
  { type: "changed", description: "All boosts and rugs are now non-stackable (max 3 of each active)" },
  { type: "removed", description: "Motivational Speech and Fake Partnership retired" },
];

const payoutShares = [
  { place: "1st", share: 50 },
  { place: "2nd", share: 20 },
  { place: "3rd", share: 15 },
  { place: "4th", share: 10 },
  { place: "5th", share: 5 },
];

export default function Season2({ activeSection }) {
  const [season4Snapshot, setSeason4Snapshot] = useState(DEFAULT_SEASON4_SNAPSHOT);

  useEffect(() => {
    let cancelled = false;

    fetchSeason4Snapshot()
      .then((snapshot) => {
        if (!cancelled) setSeason4Snapshot(snapshot);
      })
      .catch(() => {
        if (!cancelled) setSeason4Snapshot(DEFAULT_SEASON4_SNAPSHOT);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const payoutRows = payoutShares.map(({ place, share }) => ({
    place,
    share,
    payoutWei: season4Snapshot.prizePoolWei * BigInt(share) / 100n,
  }));
  const showLivePayouts = season4Snapshot.seasonStarted && season4Snapshot.prizePoolWei > 0n;

  return (
    <>
      {activeSection === "s2-overview" && <>
        <SectionTitle>Overview</SectionTitle>
        <P>
          Season 2 rebalances the game based on patterns observed in Season 1. The changes address bakery concentration at the top of the leaderboard, low shop participation across most players, and an offense-heavy meta where attacks significantly outpaced both boosts and defense. The goal is more competitive bakeries, more meaningful spending decisions, and a healthier balance between offense and defense.
        </P>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <StatCard label="Bakery Cap" value="100" sub="members max" />
          <StatCard label="Payouts" value="Top 5" sub="50/20/15/10/5" />
          <StatCard label="Boosts" value="3" sub="+ Cleanup Crew" />
          <StatCard label="Rugs" value="3" sub="all non-stackable" />
        </div>
        <SubTitle>Changelog</SubTitle>
        <Changelog entries={changelog} />
      </>}

      {activeSection === "s2-scoring" && <>
        <SectionTitle>Scoring & Actions</SectionTitle>

        <SubTitle>Leaderboard Metric: Cookie Balance</SubTitle>
        <P>
          Bakery rank is determined by the sum of current cookie balances held by members. Balance = cookies baked minus cookies spent. Every cookie spent on boosts, rugs, or Cleanup Crew directly lowers leaderboard position.
        </P>

        <SubTitle>Payout Structure</SubTitle>
        <TableWrapper>
          <thead>
            <tr>
              <Th>Place</Th>
              <Th align="right">Share</Th>
              {showLivePayouts && <Th align="right">Current Payout</Th>}
            </tr>
          </thead>
          <tbody>
            {payoutRows.map((row) => (
              <tr key={row.place}>
                <Td highlight>{row.place}</Td>
                <Td align="right">{row.share}%</Td>
                {showLivePayouts && <Td align="right" highlight>{formatEthDisplay(row.payoutWei)} ETH</Td>}
              </tr>
            ))}
          </tbody>
        </TableWrapper>

        <SubTitle>Dynamic Pricing</SubTitle>
        <P>
          Boost and rug pricing now has a hard floor at 10x base cost. That floor holds until total cookie supply reaches 100,000, then normal supply scaling takes over. Rugs still apply the punch up/down matchup multiplier on top of the floored amount, so discounted and punitive matchups both remain in effect even at low supply.
        </P>
        <Callout type="info" title="Cost Formulas">
          <strong>Boosts:</strong> baseCost × max(10, totalCookieSupply / 10,000)<br/>
          <strong>Rugs:</strong> baseCost × max(10, totalCookieSupply / 10,000) × matchupMultiplier<br/>
          <strong>Cleanup Crew:</strong> baseCost × max(10, totalCookieSupply / 10,000)
        </Callout>

        <SubTitle>Boosts</SubTitle>
        <P>
          3 boosts, all non-stackable (one of each type at a time). Cooldowns start after the boost expires.
        </P>
        <ActionCard name="Ad Campaign" type="boost" effect="+25% baking" duration="30 min" cost="0.30" success="80%" cooldown="15 min after expiry" img="https://www.rugpullbakery.com/assets/images/stores/ad-campaign.png" />
        <ActionCard name="Secret Recipe" type="boost" effect="+50% baking" duration="60 min" cost="0.62" success="60%" cooldown="30 min after expiry" img="https://www.rugpullbakery.com/assets/images/stores/secret-recipe.png" />
        <ActionCard name="Chef's Help" type="boost" effect="+100% baking" duration="60 min" cost="1.23" success="45%" cooldown="45 min after expiry" img="https://www.rugpullbakery.com/assets/images/stores/chefs-help.png" />

        <SubTitle>Rugs</SubTitle>
        <P>
          3 rugs, all non-stackable (one of each type per target, max 3 active on a bakery). Costs include the matchup multiplier. Cooldowns start after on-chain resolution.
        </P>
        <ActionCard name="Recipe Sabotage" type="rug" effect="-25% baking" duration="25 min" cost="0.45" success="60%" cooldown="15 min after resolution" img="https://www.rugpullbakery.com/assets/images/stores/recipe-sabotage.png" />
        <ActionCard name="Supplier Strike" type="rug" effect="-50% baking" duration="40 min" cost="0.76" success="45%" cooldown="30 min after resolution" img="https://www.rugpullbakery.com/assets/images/stores/supplier-strike.png" />
        <ActionCard name="Kitchen Fire" type="rug" effect="-75% baking" duration="15 min" cost="0.98" success="20%" cooldown="45 min after resolution" img="https://www.rugpullbakery.com/assets/images/stores/kitchen-fire.png" />

        <SubTitle>Matchup Multiplier (Rugs Only)</SubTitle>
        <P>
          Compares attacker bakery balance (A) against target balance (T). Bigger bakeries pay more to attack smaller ones.
        </P>
        <TableWrapper>
          <thead>
            <tr><Th>Matchup</Th><Th align="right">Multiplier</Th><Th>Interpretation</Th></tr>
          </thead>
          <tbody>
            <tr><Td>A ≤ 0.50 × T</Td><Td align="right">0.80×</Td><Td>Punching well up - discounted</Td></tr>
            <tr><Td>0.50 × T {"<"} A ≤ 0.80 × T</Td><Td align="right">0.90×</Td><Td>Punching up - slight discount</Td></tr>
            <tr><Td>0.80 × T {"<"} A {"<"} 1.25 × T</Td><Td align="right">1.00×</Td><Td>Even matchup - standard rate</Td></tr>
            <tr><Td>1.25 × T ≤ A {"<"} 2.00 × T</Td><Td align="right">1.20×</Td><Td>Slightly punching down</Td></tr>
            <tr><Td>2.00 × T ≤ A {"<"} 4.00 × T</Td><Td align="right">1.50×</Td><Td>Punching down - expensive</Td></tr>
            <tr><Td>4.00 × T ≤ A {"<"} 8.00 × T</Td><Td align="right">1.80×</Td><Td>Hard bullying - very expensive</Td></tr>
            <tr><Td>A ≥ 8.00 × T</Td><Td align="right">2.00×</Td><Td>Extreme bullying - maximum penalty</Td></tr>
          </tbody>
        </TableWrapper>

        <SubTitle>Defense</SubTitle>
        <ActionCard name="Cleanup Crew" type="defense" effect="Remove strongest rug" duration="Instant" cost="0.60" success="100%" cooldown="30 min" notes="Guaranteed success, no matchup multiplier. Removes the single strongest active rug on your bakery." img="https://www.rugpullbakery.com/assets/images/stores/cleanup-crew.png" />
      </>}

      {activeSection === "s2-calculator" && (
        <CostCalculator
          defaultCookiesBaked={season4Snapshot.cookiesBaked}
          seasonStarted={season4Snapshot.seasonStarted}
        />
      )}
    </>
  );
}

const actions = [
  { name: "Ad Campaign", baseCost: 0.30, type: "boost" },
  { name: "Secret Recipe", baseCost: 0.62, type: "boost" },
  { name: "Chef's Help", baseCost: 1.23, type: "boost" },
  { name: "Cleanup Crew", baseCost: 0.60, type: "defense" },
  { name: "Recipe Sabotage", baseCost: 0.45, type: "rug" },
  { name: "Supplier Strike", baseCost: 0.76, type: "rug" },
  { name: "Kitchen Fire", baseCost: 0.98, type: "rug" },
];

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e8e4e0",
  borderRadius: "10px",
  fontSize: "14px",
  fontFamily: "inherit",
  color: "#484646",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const boostActions = actions.filter((action) => action.type === "boost");
const rugActions = actions.filter((action) => action.type === "rug");
const rugMultipliers = [
  { label: "80% matchup", shortLabel: "80%", value: 0.8, color: "#166534" },
  { label: "200% matchup", shortLabel: "200%", value: 2.0, color: "#9f1239" },
];
const boostPalette = ["#35b0e4", "#1d4ed8", "#f59e0b"];

function getSupplyMultiplier(totalCookies) {
  return Math.max(10, totalCookies / 10000);
}

function getActionCost(action, totalCookies, matchupMultiplier = 1) {
  const supplyMultiplier = getSupplyMultiplier(totalCookies);
  return action.baseCost * supplyMultiplier * (action.type === "rug" ? matchupMultiplier : 1);
}

function formatCookieCost(value) {
  if (value < 100) return value.toFixed(2);
  if (value < 1000) return value.toFixed(1);
  return Math.round(value).toLocaleString();
}

function formatCompactNumber(value) {
  const numericValue = typeof value === "bigint" ? toSafeNumber(value) : value;
  if (numericValue >= 1000000) return `${(numericValue / 1000000).toFixed(numericValue % 1000000 === 0 ? 0 : 1)}M`;
  if (numericValue >= 1000) return `${(numericValue / 1000).toFixed(numericValue % 1000 === 0 ? 0 : 1)}k`;
  return `${Math.round(numericValue)}`;
}

const MAX_SUPPLY = 20000000;

function clampSupply(value) {
  return Math.max(0, Math.min(MAX_SUPPLY, value));
}

function getChartMax(currentCookies) {
  const padded = Math.ceil(Math.max(1000000, currentCookies * 1.2) / 100000) * 100000;
  return Math.min(MAX_SUPPLY, Math.max(1000000, padded));
}

function getMatchupColor(multiplier) {
  if (multiplier < 1) return "#166534";
  if (multiplier > 1) return "#9f1239";
  return "#e5719a";
}

function formatEthDisplay(valueWei) {
  const value = Number(formatEther(valueWei));
  if (value >= 100) return Math.round(value).toString();
  if (value >= 10) return value.toFixed(2);
  if (value >= 1) return value.toFixed(3);
  return value.toFixed(4);
}

function toSafeNumber(value) {
  const maxSafeInteger = BigInt(Number.MAX_SAFE_INTEGER);
  return Number(value > maxSafeInteger ? maxSafeInteger : value);
}

function CostCalculator({ defaultCookiesBaked, seasonStarted }) {
  const [customSupply, setCustomSupply] = useState(null);
  const [matchup, setMatchup] = useState(1.0);
  const supply = clampSupply(customSupply ?? toSafeNumber(defaultCookiesBaked));
  const chartMax = getChartMax(supply);

  return (
    <>
      <SectionTitle>Cost Calculator</SectionTitle>
      <P>
        Use the slider to move through total cookies baked and see where the 10x floor ends. It defaults to `500k` before season 4 starts, then switches to the live baked-cookie total from Abstract mainnet once the season is active.
      </P>
      {seasonStarted && (
        <P>
          Current live default: <strong>{formatCompactNumber(defaultCookiesBaked)}</strong> total cookies baked.
        </P>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", color: "#9a918a", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600, marginBottom: 6 }}>
            Total Cookies Supply
          </label>
          <input
            type="number"
            value={supply}
            onChange={(e) => setCustomSupply(clampSupply(Number(e.target.value)))}
            style={inputStyle}
          />
          <input
            type="range"
            min="0"
            max={MAX_SUPPLY}
            step="10000"
            value={Math.min(supply, MAX_SUPPLY)}
            onChange={(e) => setCustomSupply(clampSupply(Number(e.target.value)))}
            style={{ width: "100%", marginTop: 12, accentColor: "#35b0e4" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "12px", color: "#9a918a" }}>
            <span>0</span>
            <span>10x floor ends at 100k</span>
            <span>{formatCompactNumber(MAX_SUPPLY)}</span>
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "12px", color: "#9a918a", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600, marginBottom: 6 }}>
            Matchup Multiplier (Rugs)
          </label>
          <input
            type="number"
            value={matchup}
            step="0.1"
            min="0.8"
            max="2.0"
            onChange={(e) => setMatchup(Math.max(0.1, Number(e.target.value)))}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {[0.8, 0.9, 1.0, 1.2, 1.5, 1.8, 2.0].map((m) => (
              <button
                key={m}
                onClick={() => setMatchup(m)}
                style={{
                  padding: "4px 10px",
                  border: "1px solid",
                  borderColor: matchup === m ? "#35b0e4" : "#e8e4e0",
                  borderRadius: "70px",
                  background: matchup === m ? "#e0f2fe" : "#ffffff",
                  color: matchup === m ? "#1b96ca" : "#7a726b",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {m.toFixed(1)}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <StatCard label="Supply Multiplier" value={`${getSupplyMultiplier(supply).toFixed(1)}×`} sub={supply < 100000 ? "floor active" : "scaling live"} />
        <StatCard label="Boost Floor" value="10× base" sub="until 100k baked" />
        <StatCard label="Rug Matchup" value={`${matchup.toFixed(1)}×`} sub="applied after the floor" />
      </div>

      <SubTitle>Boost Price Growth</SubTitle>
      <P>
        All three boosts follow the same curve. They sit flat at 10x base cost until the season crosses 100,000 total cookies, then rise linearly with supply.
      </P>
      <PriceChart
        lines={boostActions.map((action, index) => ({
          label: action.name,
          color: boostPalette[index % boostPalette.length],
          valueAt: (cookies) => getActionCost(action, cookies),
          currentValue: getActionCost(action, supply),
        }))}
        currentX={supply}
        maxX={chartMax}
      />

      <SubTitle>Rug Price Growth</SubTitle>
      <P>
        Each rug below uses the currently selected matchup multiplier as the main line. The shaded cone shows the full possible price range from the 80% punch-up discount to the 200% bully premium.
      </P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
        {rugActions.map((action) => (
          <div
            key={action.name}
            style={{
              background: "#ffffff",
              border: "1px solid #e8e4e0",
              borderRadius: "18px",
              padding: "16px 16px 12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#484646" }}>{action.name}</div>
              <Badge variant="danger">rug</Badge>
            </div>
            <div style={{ fontSize: "12px", color: "#9a918a", marginBottom: 12 }}>
              Base cost {action.baseCost.toFixed(2)}. Current selected price: {formatCookieCost(getActionCost(action, supply, matchup))} cookies at {matchup.toFixed(1)}×.
            </div>
            <PriceChart
              area={{
                label: "Possible range",
                color: "#e5719a",
                lowLabel: rugMultipliers[0].shortLabel,
                highLabel: rugMultipliers[1].shortLabel,
                lowAt: (cookies) => getActionCost(action, cookies, rugMultipliers[0].value),
                highAt: (cookies) => getActionCost(action, cookies, rugMultipliers[1].value),
                currentLow: getActionCost(action, supply, rugMultipliers[0].value),
                currentHigh: getActionCost(action, supply, rugMultipliers[1].value),
              }}
              lines={[{
                label: `Selected ${matchup.toFixed(1)}x`,
                color: getMatchupColor(matchup),
                valueAt: (cookies) => getActionCost(action, cookies, matchup),
                currentValue: getActionCost(action, supply, matchup),
              }]}
              currentX={supply}
              maxX={chartMax}
              compact
            />
          </div>
        ))}
      </div>

      <TableWrapper>
        <thead>
          <tr>
            <Th>Action</Th>
            <Th align="right">Base Cost</Th>
            <Th align="right">Multiplier</Th>
            <Th align="right">Actual Cost</Th>
          </tr>
        </thead>
        <tbody>
          {actions.map((a) => {
            const mult = a.type === "rug" ? matchup : 1;
            const cost = getActionCost(a, supply, matchup);
            return (
              <tr key={a.name}>
                <Td highlight>{a.name}</Td>
                <Td align="right">{a.baseCost.toFixed(2)}</Td>
                <Td align="right">
                  {a.type === "rug" ? (
                    <span style={{ color: matchup > 1 ? "#c03d6d" : matchup < 1 ? "#166534" : "#5f5f5f" }}>
                      {mult.toFixed(1)}×
                    </span>
                  ) : (
                    <span style={{ color: "#9a918a" }}>-</span>
                  )}
                </Td>
                <Td align="right" highlight>
                  {formatCookieCost(cost)} cookies
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableWrapper>

      <Callout type="info" title="How to read this">
        Boosts and rugs both sit at a 10x base-cost floor until 100,000 total cookies are in circulation. After that, every extra 10,000 cookies adds another 1x to the supply multiplier. Rug discounts and penalties are still applied after the floor or scaling multiplier is determined.
      </Callout>
    </>
  );
}

function PriceChart({ lines, currentX, maxX, compact = false, area }) {
  const width = 640;
  const height = compact ? 250 : 320;
  const padding = { top: 20, right: 20, bottom: 50, left: 62 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const sampleCount = 40;

  const values = [];
  for (let index = 0; index <= sampleCount; index += 1) {
    const x = (maxX * index) / sampleCount;
    for (const line of lines) values.push(line.valueAt(x));
    if (area) {
      values.push(area.lowAt(x), area.highAt(x));
    }
  }
  const currentAreaValues = area ? [area.currentLow, area.currentHigh] : [];
  const maxValue = Math.max(...values, ...lines.map((line) => line.currentValue), ...currentAreaValues);
  const yMax = maxValue === 0 ? 1 : maxValue * 1.08;

  const getX = (value) => padding.left + (value / maxX) * plotWidth;
  const getY = (value) => padding.top + plotHeight - (value / yMax) * plotHeight;
  const xTicks = [0, maxX * 0.25, maxX * 0.5, maxX * 0.75, maxX];
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];
  const floorThreshold = Math.min(100000, maxX);
  const buildPath = (valueAt) => Array.from({ length: sampleCount + 1 }, (_, index) => {
    const x = (maxX * index) / sampleCount;
    const command = index === 0 ? "M" : "L";
    return `${command} ${getX(x).toFixed(2)} ${getY(valueAt(x)).toFixed(2)}`;
  }).join(" ");

  const areaPath = area
    ? [
        buildPath(area.lowAt),
        ...Array.from({ length: sampleCount + 1 }, (_, index) => {
          const reverseIndex = sampleCount - index;
          const x = (maxX * reverseIndex) / sampleCount;
          const command = index === 0 ? "L" : "L";
          return `${command} ${getX(x).toFixed(2)} ${getY(area.highAt(x)).toFixed(2)}`;
        }),
        "Z",
      ].join(" ")
    : null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: compact ? "none" : "1px solid #e8e4e0",
        borderRadius: compact ? 0 : "18px",
        padding: compact ? 0 : "16px 16px 12px",
        marginBottom: compact ? 0 : 24,
        boxShadow: compact ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Action price chart">
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={getY(tick)}
              y2={getY(tick)}
              stroke="#f0ece8"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={getY(tick) + 4}
              textAnchor="end"
              fontSize="11"
              fill="#9a918a"
              fontFamily="inherit"
            >
              {formatCompactNumber(tick)}
            </text>
          </g>
        ))}

        {xTicks.map((tick) => (
          <g key={`x-${tick}`}>
            <line
              x1={getX(tick)}
              x2={getX(tick)}
              y1={padding.top}
              y2={height - padding.bottom}
              stroke="#f6f3f0"
              strokeWidth="1"
            />
            <text
              x={getX(tick)}
              y={height - padding.bottom + 18}
              textAnchor="middle"
              fontSize="11"
              fill="#9a918a"
              fontFamily="inherit"
            >
              {formatCompactNumber(tick)}
            </text>
          </g>
        ))}

        <line
          x1={getX(floorThreshold)}
          x2={getX(floorThreshold)}
          y1={padding.top}
          y2={height - padding.bottom}
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <text
          x={Math.min(getX(floorThreshold) + 8, width - padding.right - 36)}
          y={padding.top + 14}
          fontSize="11"
          fill="#92400e"
          fontFamily="inherit"
        >
          100k floor
        </text>

        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={height - padding.bottom}
          stroke="#d8d1cb"
          strokeWidth="1.5"
        />
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={height - padding.bottom}
          y2={height - padding.bottom}
          stroke="#d8d1cb"
          strokeWidth="1.5"
        />

        <line
          x1={getX(currentX)}
          x2={getX(currentX)}
          y1={padding.top}
          y2={height - padding.bottom}
          stroke="#b2aaa3"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {area && (
          <>
            <path
              d={areaPath}
              fill={area.color}
              fillOpacity="0.16"
              stroke="none"
            />
            <circle
              cx={getX(currentX)}
              cy={getY(area.currentLow)}
              r="4"
              fill="#ffffff"
              stroke={rugMultipliers[0].color}
              strokeWidth="2"
            />
            <circle
              cx={getX(currentX)}
              cy={getY(area.currentHigh)}
              r="4"
              fill="#ffffff"
              stroke={rugMultipliers[1].color}
              strokeWidth="2"
            />
          </>
        )}

        {lines.map((line) => {
          const path = buildPath(line.valueAt);

          return (
            <g key={line.label}>
              <path
                d={path}
                fill="none"
                stroke={line.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={line.dash}
              />
              <circle
                cx={getX(currentX)}
                cy={getY(line.currentValue)}
                r="5"
                fill="#ffffff"
                stroke={line.color}
                strokeWidth="3"
              />
            </g>
          );
        })}

        {!compact && (
          <>
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#7a726b"
              fontFamily="inherit"
            >
              Total cookies supply
            </text>
            <text
              x={18}
              y={height / 2}
              textAnchor="middle"
              transform={`rotate(-90 18 ${height / 2})`}
              fontSize="12"
              fill="#7a726b"
              fontFamily="inherit"
            >
              Price in cookies
            </text>
          </>
        )}
      </svg>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: compact ? 10 : 12 }}>
        {area && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              border: "1px solid #f0ece8",
              borderRadius: "999px",
              fontSize: "12px",
              color: "#5f5f5f",
              background: "#faf8f6",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "999px",
                background: area.color,
                opacity: 0.35,
                display: "inline-block",
              }}
            />
            <span style={{ fontWeight: 600, color: "#484646" }}>{area.label}</span>
            <span>{area.lowLabel} to {area.highLabel}</span>
            <span>{formatCookieCost(area.currentLow)}-{formatCookieCost(area.currentHigh)} cookies</span>
          </div>
        )}
        {lines.map((line) => (
          <div
            key={line.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              border: "1px solid #f0ece8",
              borderRadius: "999px",
              fontSize: "12px",
              color: "#5f5f5f",
              background: "#faf8f6",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "999px",
                background: line.color,
                display: "inline-block",
              }}
            />
            <span style={{ fontWeight: 600, color: "#484646" }}>{line.label}</span>
            <span>{formatCookieCost(line.currentValue)} cookies</span>
          </div>
        ))}
      </div>
    </div>
  );
}
