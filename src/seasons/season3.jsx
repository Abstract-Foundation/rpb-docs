import { useState } from "react";
import {
  ActionCard,
  Badge,
  StatCard,
  TableWrapper,
  Th,
  Td,
  Callout,
  SectionTitle,
  SubTitle,
  P,
  Code,
  Changelog,
} from "../components";
export const meta = {
  id: "season-3",
  number: 3,
  title: "Season 3",
  subtitle: "Solo bakeries, split payouts, and tighter rugging rules",
  status: "upcoming",
  sections: [
    { id: "s3-overview", title: "Overview", icon: "🍪" },
    { id: "s3-payouts", title: "Payouts & Scoring", icon: "🏆" },
    { id: "s3-combat", title: "Boosts, Rugs & Caps", icon: "⚔️" },
    { id: "s3-calculator", title: "Cost Calculator", icon: "🧮" },
  ],
};

const changelog = [
  {
    type: "changed",
    description: "Bakery member cap reduced to 1 (solo bakeries)",
  },
  {
    type: "changed",
    description: "Prize pool now splits 70% leaderboard / 30% activity",
  },
  {
    type: "changed",
    description: "Leaderboard payouts expand to the top 100 bakeries",
  },
  {
    type: "changed",
    description: "Activity payouts are based on continued meaningful activity",
  },
  {
    type: "changed",
    description:
      "Only one boost and one rug can be active on a bakery at a time",
  },
  {
    type: "changed",
    description:
      "Rugs and Boosts have had their costs, durations, cooldowns, and success rate adjusted ",
  },
  {
    type: "added",
    description: "Parity scaling reduces rug success when attacking too far up",
  },
  {
    type: "added",
    description:
      "Congestion cooldown adds a temporary rug cost premium after expiry",
  },
];

const leaderboardTopTen = [
  { place: "1st", share: "7.5%" },
  { place: "2nd", share: "5.5%" },
  { place: "3rd", share: "4.5%" },
  { place: "4th", share: "3.5%" },
  { place: "5th", share: "3.0%" },
  { place: "6th", share: "2.7%" },
  { place: "7th", share: "2.4%" },
  { place: "8th", share: "2.1%" },
  { place: "9th", share: "1.9%" },
  { place: "10th", share: "1.7%" },
];

const leaderboardRanges = [
  { places: "11-25", share: "22.0%", split: "15 players", perPlayer: "1.47%" },
  { places: "26-50", share: "22.0%", split: "25 players", perPlayer: "0.88%" },
  {
    places: "51-100",
    share: "21.21%",
    split: "50 players",
    perPlayer: "0.424%",
  },
];

const parityScaling = [
  {
    balance: "<25%",
    scaler: "25%",
    interpretation: "Very underpowered attacker",
  },
  { balance: "25-40%", scaler: "50%", interpretation: "Punching up hard" },
  { balance: "40-50%", scaler: "75%", interpretation: "Punching up" },
  {
    balance: ">=50%",
    scaler: "100%",
    interpretation: "At least half the target's balance",
  },
];

const parityBreakpoints = [
  { x: 0, y: 25 },
  { x: 25, y: 50 },
  { x: 40, y: 75 },
  { x: 50, y: 100 },
  { x: 100, y: 100 },
];

const CONGESTION_WINDOW_SECONDS = 1800;
const CONGESTION_EXPONENT = 3;
const DEFAULT_SEASON3_SNAPSHOT = {
  seasonStarted: false,
  cookiesBaked: 500000n,
};

const congestionCurve = Array.from({ length: 31 }, (_, minute) => {
  const seconds = minute * 60;
  const extraCostMultiplier =
    1 - (seconds / CONGESTION_WINDOW_SECONDS) ** CONGESTION_EXPONENT;
  return { x: minute, y: Math.max(0, extraCostMultiplier) * 100 };
});

export default function Season3({ activeSection }) {
  return (
    <>
      {activeSection === "s3-overview" && (
        <>
          <SectionTitle>Overview</SectionTitle>
          <P>
            Season 3 shifts Rugpull Bakery into effectively single-player mode.
            Every bakery is capped at one member, so leaderboard position and
            payout outcomes are driven by individual execution rather than team
            aggregation.
          </P>
          <P>
            Rewards are now split across two tracks: leaderboard placement and
            sustained activity. At the same time, rugging gets stricter through
            single-slot effect caps, parity-based hit-rate scaling, and a
            temporary congestion premium after rugs expire.
          </P>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <StatCard label="Bakery Cap" value="1" sub="single player" />
            <StatCard
              label="Prize Split"
              value="70 / 30"
              sub="leaderboard / activity"
            />
            <StatCard
              label="Active Effects"
              value="1 + 1"
              sub="one boost, one rug"
            />
            <StatCard
              label="Cleanup Crew"
              value="Uncapped"
              sub="does not use an effect slot"
            />
          </div>
          <SubTitle>Changelog</SubTitle>
          <Changelog entries={changelog} />
        </>
      )}

      {activeSection === "s3-payouts" && (
        <>
          <SectionTitle>Payouts & Scoring</SectionTitle>

          <SubTitle>Prize Pool Split</SubTitle>
          <P>
            Season 3 divides the prize pool into two buckets. The leaderboard
            bucket rewards final placement, while the activity bucket rewards
            players who stay active and engaged throughout the season.
          </P>

          <SubTitle>Leaderboard Bucket</SubTitle>
          <P>
            The top 100 players on the season leaderboard share the leaderboard
            bucket. The percentages below are percentages of the leaderboard
            bucket, not of the total prize pool.
          </P>
          <TableWrapper>
            <thead>
              <tr>
                <Th>Place</Th>
                <Th align="right">Share</Th>
              </tr>
            </thead>
            <tbody>
              {leaderboardTopTen.map((row) => (
                <tr key={row.place}>
                  <Td highlight>{row.place}</Td>
                  <Td align="right">{row.share}</Td>
                </tr>
              ))}
              <tr>
                <Td highlight>Top 10 total</Td>
                <Td align="right">34.8%</Td>
              </tr>
            </tbody>
          </TableWrapper>

          <TableWrapper>
            <thead>
              <tr>
                <Th>Places</Th>
                <Th align="right">Range Share</Th>
                <Th align="right">Split</Th>
                <Th align="right">Each Player</Th>
              </tr>
            </thead>
            <tbody>
              {leaderboardRanges.map((row) => (
                <tr key={row.places}>
                  <Td highlight>{row.places}</Td>
                  <Td align="right">{row.share}</Td>
                  <Td align="right">{row.split}</Td>
                  <Td align="right">{row.perPlayer}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>

          <SubTitle>Activity Bucket</SubTitle>
          <P>
            The activity bucket is a separate reward track for players who stay
            engaged throughout the season. It is designed to reward consistent
            participation, not just final leaderboard position.
          </P>

          <SubTitle>Activity Score Formula</SubTitle>
          <P>
            Eligible players are scored on a mix of baking and non-bake
            participation across the season. Baking is still the foundation, but
            players also earn activity credit for successful boosts, successful
            rugs, and Cleanup Crew usage.
          </P>
          <P>
            Activity score is not meant to scale linearly with raw size, spend,
            or one-time volume. Extra activity still helps, but the marginal
            benefit tapers off, which creates diminishing returns and makes the
            activity bucket less of a pure whale game.
          </P>
          <P>
            The system is designed to reward players who show up consistently
            and use the full toolset, not just players who brute-force one
            action type. In general terms, activity scoring favors players who
            bake regularly, stay active across multiple days, and mix in
            meaningful interactions rather than relying on pure baking
            volume alone.
          </P>

          <SubTitle>Activity Tiers</SubTitle>
          <P>
            Qualified players are grouped into three payout tiers. The share of
            the activity bucket assigned to each tier is public, but the number
            of players inside each tier is not.
          </P>
          <TableWrapper>
            <thead>
              <tr>
                <Th>Tier</Th>
                <Th align="right">Share of Activity Bucket</Th>
                <Th>Published Detail</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td highlight>Tier 1</Td>
                <Td align="right">50%</Td>
                <Td>Bucket size not disclosed</Td>
              </tr>
              <tr>
                <Td highlight>Tier 2</Td>
                <Td align="right">30%</Td>
                <Td>Bucket size not disclosed</Td>
              </tr>
              <tr>
                <Td highlight>Tier 3</Td>
                <Td align="right">20%</Td>
                <Td>Bucket size not disclosed</Td>
              </tr>
            </tbody>
          </TableWrapper>
        </>
      )}

      {activeSection === "s3-combat" && (
        <>
          <SectionTitle>Boosts, Rugs & Caps</SectionTitle>

          <SubTitle>Boosts</SubTitle>
          <P>
            Season 3 keeps a three-boost shop, but the season 3 values are tuned
            specifically for this season. A bakery can have only{" "}
            <strong>one active boost at a time</strong>, so every boost choice
            competes for the same single slot.
          </P>
          <ActionCard
            name="Ad Campaign"
            type="boost"
            effect="+25% baking"
            duration="25 minutes"
            cost=".28 cookies"
            success="85%"
            cooldown="20 minutes"
            img="https://www.rugpullbakery.com/assets/images/stores/ad-campaign.png"
          />
          <ActionCard
            name="Secret Recipe"
            type="boost"
            effect="+50% baking"
            duration="30 minutes"
            cost=".7 cookies"
            success="55%"
            cooldown="30 minutes"
            img="https://www.rugpullbakery.com/assets/images/stores/secret-recipe.png"
          />
          <ActionCard
            name="Chef's Help"
            type="boost"
            effect="+100% baking"
            duration="20 minutes"
            cost="1.35 cookies"
            success="32%"
            cooldown="45 minutes"
            img="https://www.rugpullbakery.com/assets/images/stores/chefs-help.png"
          />
          <Callout type="info" title="Boost Slot">
            Only one boost can be active on a bakery at a time. If you want
            stronger output later, timing the slot matters as much as choosing
            the effect.
          </Callout>

          <SubTitle>Attacks</SubTitle>
          <P>
            Season 3 has a three-rug attack shop with retuned costs, durations,
            cooldown behavior, and success rates. A bakery can have only{" "}
            <strong>one active rug at a time</strong>, and every rug is further
            shaped by matchup multipliers, parity scaling, and congestion
            cooldown.
          </P>
          <ActionCard
            name="Recipe Sabotage"
            type="rug"
            effect="-20% baking"
            duration="20 minutes"
            cost=".48 cookies"
            success="65%"
            cooldown="None"
            img="https://www.rugpullbakery.com/assets/images/stores/recipe-sabotage.png"
          />
          <ActionCard
            name="Supplier Strike"
            type="rug"
            effect="-35% baking"
            duration="25 minutes"
            cost=".85 cookies"
            success="40%"
            cooldown="None"
            img="https://www.rugpullbakery.com/assets/images/stores/supplier-strike.png"
          />
          <ActionCard
            name="Kitchen Fire"
            type="rug"
            effect="-60% baking"
            duration="12 minutes"
            cost="1.05 cookies"
            success="22%"
            cooldown="None"
            img="https://www.rugpullbakery.com/assets/images/stores/kitchen-fire.png"
          />
          <Callout type="warning" title="Rug Slot">
            Only one rug can be active on a bakery at a time. That makes target
            selection and timing more important, because a fresh rug attempt
            cannot stack on top of another active rug.
          </Callout>

          <SubTitle>Rug Mechanics</SubTitle>
          <P>
            Season 3 rugs are affected by three separate systems. Two of them
            change cost, and one changes hit chance:
          </P>
          <TableWrapper>
            <thead>
              <tr>
                <Th>Mechanic</Th>
                <Th>Affects</Th>
                <Th>How It Changes Play</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td highlight>Matchup multiplier</Td>
                <Td>Cost</Td>
                <Td>
                  Changes the baseline rug price based on the attacker/target
                  matchup
                </Td>
              </tr>
              <tr>
                <Td highlight>Parity scaling</Td>
                <Td>Chance to land</Td>
                <Td>
                  Reduces effective success odds when a much weaker bakery
                  attacks far up the board
                </Td>
              </tr>
              <tr>
                <Td highlight>Congestion cooldown</Td>
                <Td>Cost</Td>
                <Td>
                  Adds a temporary extra price premium after a rug expires on
                  that bakery
                </Td>
              </tr>
            </tbody>
          </TableWrapper>
          <P>
            The key distinction is simple: <strong>matchup multiplier</strong>{" "}
            and <strong>congestion cooldown</strong> change what you pay, while{" "}
            <strong>parity scaling</strong> changes how likely the rug is to
            connect. Those mechanics can stack, so a bad setup can be both
            expensive and low-odds.
          </P>

          <SubTitle>Defense</SubTitle>
          <ActionCard
            name="Cleanup Crew"
            type="defense"
            effect="Remove active rug"
            duration="Instant"
            cost=".6 cookies"
            success="100%"
            cooldown="30 minutes"
            img="https://www.rugpullbakery.com/assets/images/stores/cleanup-crew.png"
          />

          <SubTitle>Active Effect Limits</SubTitle>
          <P>
            Bakeries can only hold one active boost and one active rug at the
            same time. Cleanup Crew is still available on top of those limits
            and does not consume either slot.
          </P>
          <Callout type="warning" title="Single-Slot Meta">
            You can no longer layer multiple boosts or multiple rugs onto the
            same bakery. Timing matters more because every new effect competes
            for a single active slot.
          </Callout>

          <SubTitle>Parity Scaling</SubTitle>
          <P>
            Rug success rate is now scaled by the attacker's baked cookies
            relative to the target's baked cookies. This is designed to stop
            very weak wallets from attacking far up the board at full
            effectiveness.
          </P>
          <TableWrapper>
            <thead>
              <tr>
                <Th>Attacker Balance as % of Target</Th>
                <Th align="right">Hit-Rate Scaler</Th>
                <Th>Interpretation</Th>
              </tr>
            </thead>
            <tbody>
              {parityScaling.map((row) => (
                <tr key={row.balance}>
                  <Td highlight>{row.balance}</Td>
                  <Td align="right">{row.scaler}</Td>
                  <Td>{row.interpretation}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrapper>
          <MechanicCurveChart
            title="Parity Hit-Rate Curve"
            subtitle="Attacker strength relative to target vs. effective rug chance"
            xLabel="Attacker strength as % of target"
            yLabel="Chance scaler"
            maxX={100}
            maxY={100}
            xTicks={[0, 25, 40, 50, 75, 100]}
            yTicks={[0, 25, 50, 75, 100]}
            color="#e5719a"
            step
            points={parityBreakpoints}
            markers={[
              { x: 25, label: "25%" },
              { x: 40, label: "40%" },
              { x: 50, label: "50%" },
            ]}
            formatX={(value) => `${value}%`}
            formatY={(value) => `${value}%`}
          />
          <P>
            This mechanic changes <strong>how likely a rug is to land</strong>,
            not the base rug effect. If you are attacking with less than a
            quarter of your target's baked-cookie total, you only get 25% of the
            rug's stated success chance. Once you reach at least half of the
            target's baked total, you get full listed odds again.
          </P>
          <Callout type="info" title="What It Changes In Practice">
            Parity scaling makes low-balance punch-ups much less reliable.
            Smaller players can still attack up, but they should expect sharply
            lower conversion unless they first close the gap.
          </Callout>

          <SubTitle>Congestion Cooldown</SubTitle>
          <P>
            Rugs also get more expensive when they are launched immediately
            after another rug expires on the same bakery. That premium decays
            back to normal over time, discouraging nonstop chain-rugging on the
            same target.
          </P>
          <TableWrapper>
            <thead>
              <tr>
                <Th>Timing Since Last Rug Expired</Th>
                <Th align="right">Extra Rug Cost</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td highlight>Immediately after expiry</Td>
                <Td align="right">+100%</Td>
                <Td>Next rug starts at double cost</Td>
              </tr>
              <tr>
                <Td highlight>Over the next 30 minutes</Td>
                <Td align="right">Decays to 0%</Td>
                <Td>
                  Stays elevated, then drops off sharply toward the end of the
                  window
                </Td>
              </tr>
            </tbody>
          </TableWrapper>
          <MechanicCurveChart
            title="Congestion Cost Curve"
            subtitle="Extra rug cost after the last rug on that bakery expires"
            xLabel="Minutes since rug expiry"
            yLabel="Extra cost"
            maxX={30}
            maxY={100}
            xTicks={[0, 5, 10, 15, 20, 25, 30]}
            yTicks={[0, 25, 50, 75, 100]}
            color="#f59e0b"
            points={congestionCurve}
            formatX={(value) => `${value}m`}
            formatY={(value) => `+${value}%`}
          />
          <P>
            This mechanic changes <strong>how much the next rug costs</strong>.
            Right after a rug expires, the next rug on that bakery starts at
            double price. The surcharge stays relatively high for most of the
            30-minute window, then falls off more sharply as the cooldown
            finishes.
          </P>
          <Callout type="tip" title="Cost Stacking">
            The congestion premium is an extra cost layer on top of the rug's
            normal live price. Parity scaling affects hit rate, while congestion
            cooldown affects price.
          </Callout>
          <Callout type="warning" title="What It Changes In Practice">
            Congestion cooldown punishes immediate re-rugs on the same bakery.
            If you want efficient spend, waiting is better; if you want pressure
            right now, you pay a premium for it.
          </Callout>
        </>
      )}

      {activeSection === "s3-calculator" && (
        <CostCalculator
          defaultCookiesBaked={DEFAULT_SEASON3_SNAPSHOT.cookiesBaked}
          seasonStarted={false}
        />
      )}
    </>
  );
}

const actions = [
  { name: "Ad Campaign", baseCost: 0.28, type: "boost" },
  { name: "Secret Recipe", baseCost: 0.7, type: "boost" },
  { name: "Chef's Help", baseCost: 1.35, type: "boost" },
  { name: "Cleanup Crew", baseCost: 0.6, type: "defense" },
  { name: "Recipe Sabotage", baseCost: 0.5, type: "rug" },
  { name: "Supplier Strike", baseCost: 0.85, type: "rug" },
  { name: "Kitchen Fire", baseCost: 1.05, type: "rug" },
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

function getCongestionMultiplier(minutesSinceLastRug) {
  const seconds = Math.max(
    0,
    Math.min(CONGESTION_WINDOW_SECONDS, minutesSinceLastRug * 60),
  );
  return (
    1 +
    (1 - (seconds / CONGESTION_WINDOW_SECONDS) ** CONGESTION_EXPONENT)
  );
}

function getMatchupMultiplierFromRelativeStrength(relativeStrengthPercent) {
  if (relativeStrengthPercent <= 50) return 0.8;
  if (relativeStrengthPercent <= 80) return 0.9;
  if (relativeStrengthPercent < 125) return 1.0;
  if (relativeStrengthPercent < 200) return 1.2;
  if (relativeStrengthPercent < 400) return 1.5;
  if (relativeStrengthPercent < 800) return 1.8;
  return 2.0;
}

function getParityScalerFromRelativeStrength(relativeStrengthPercent) {
  if (relativeStrengthPercent < 25) return 0.25;
  if (relativeStrengthPercent < 40) return 0.5;
  if (relativeStrengthPercent < 50) return 0.75;
  return 1.0;
}

function getActionCost(
  action,
  totalCookies,
  matchupMultiplier = 1,
  minutesSinceLastRug = 30,
) {
  const supplyMultiplier = getSupplyMultiplier(totalCookies);
  if (action.type !== "rug") {
    return action.baseCost * supplyMultiplier;
  }

  return (
    action.baseCost *
    supplyMultiplier *
    matchupMultiplier *
    getCongestionMultiplier(minutesSinceLastRug)
  );
}

function formatCookieCost(value) {
  if (value < 100) return value.toFixed(2);
  if (value < 1000) return value.toFixed(1);
  return Math.round(value).toLocaleString();
}

function formatCompactNumber(value) {
  const numericValue = typeof value === "bigint" ? toSafeNumber(value) : value;
  if (numericValue >= 1000000)
    return `${(numericValue / 1000000).toFixed(numericValue % 1000000 === 0 ? 0 : 1)}M`;
  if (numericValue >= 1000)
    return `${(numericValue / 1000).toFixed(numericValue % 1000 === 0 ? 0 : 1)}k`;
  return `${Math.round(numericValue)}`;
}

const MAX_SUPPLY = 20000000;

function clampSupply(value) {
  return Math.max(0, Math.min(MAX_SUPPLY, value));
}

function getChartMax(currentCookies) {
  const padded =
    Math.ceil(Math.max(1000000, currentCookies * 1.2) / 100000) * 100000;
  return Math.min(MAX_SUPPLY, Math.max(1000000, padded));
}

function getMatchupColor(multiplier) {
  if (multiplier < 1) return "#166534";
  if (multiplier > 1) return "#9f1239";
  return "#e5719a";
}

function toSafeNumber(value) {
  const maxSafeInteger = BigInt(Number.MAX_SAFE_INTEGER);
  return Number(value > maxSafeInteger ? maxSafeInteger : value);
}

function CostCalculator({ defaultCookiesBaked, seasonStarted }) {
  const [customSupply, setCustomSupply] = useState(null);
  const [relativeStrength, setRelativeStrength] = useState(100);
  const [minutesSinceLastRug, setMinutesSinceLastRug] = useState(30);
  const supply = clampSupply(customSupply ?? toSafeNumber(defaultCookiesBaked));
  const chartMax = getChartMax(supply);
  const matchup = getMatchupMultiplierFromRelativeStrength(relativeStrength);
  const parityScaler = getParityScalerFromRelativeStrength(relativeStrength);
  const congestionMultiplier = getCongestionMultiplier(minutesSinceLastRug);

  return (
    <>
      <SectionTitle>Cost Calculator</SectionTitle>
      <P>
        This calculator estimates season 3 action pricing as total cookies
        supply changes. It defaults to `500k` before season 3 starts, then
        switches to the live baked-cookie total from Abstract mainnet once the
        season is active.
      </P>
      {seasonStarted && (
        <P>
          Current live default:{" "}
          <strong>{formatCompactNumber(defaultCookiesBaked)}</strong> total
          cookies baked.
        </P>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              color: "#9a918a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Total Cookies Supply
          </label>
          <input
            type="number"
            value={supply}
            onChange={(e) =>
              setCustomSupply(clampSupply(Number(e.target.value)))
            }
            style={inputStyle}
          />
          <input
            type="range"
            min="0"
            max={MAX_SUPPLY}
            step="10000"
            value={Math.min(supply, MAX_SUPPLY)}
            onChange={(e) =>
              setCustomSupply(clampSupply(Number(e.target.value)))
            }
            style={{ width: "100%", marginTop: 12, accentColor: "#35b0e4" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: "12px",
              color: "#9a918a",
            }}
          >
            <span>0</span>
            <span>10x floor ends at 100k</span>
            <span>{formatCompactNumber(MAX_SUPPLY)}</span>
          </div>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              color: "#9a918a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Attacker Strength vs Target
          </label>
          <input
            type="number"
            value={relativeStrength}
            step="1"
            min="0"
            max="1000"
            onChange={(e) =>
              setRelativeStrength(Math.max(0, Math.min(1000, Number(e.target.value))))
            }
            style={inputStyle}
          />
          <div
            style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}
          >
            {[25, 40, 50, 80, 100, 125, 200, 400, 800].map((value) => (
              <button
                key={value}
                onClick={() => setRelativeStrength(value)}
                style={{
                  padding: "4px 10px",
                  border: "1px solid",
                  borderColor:
                    relativeStrength === value ? "#35b0e4" : "#e8e4e0",
                  borderRadius: "70px",
                  background:
                    relativeStrength === value ? "#e0f2fe" : "#ffffff",
                  color: relativeStrength === value ? "#1b96ca" : "#7a726b",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {value}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="5"
            value={relativeStrength}
            onChange={(e) => setRelativeStrength(Number(e.target.value))}
            style={{ width: "100%", marginTop: 12, accentColor: "#e5719a" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: "12px",
              color: "#9a918a",
            }}
          >
            <span>0%</span>
            <span>Attacker balance as % of target balance</span>
            <span>1000%</span>
          </div>
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              color: "#9a918a",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Minutes Since Last Rug
          </label>
          <input
            type="number"
            value={minutesSinceLastRug}
            min="0"
            max="30"
            step="1"
            onChange={(e) =>
              setMinutesSinceLastRug(
                Math.max(0, Math.min(30, Number(e.target.value))),
              )
            }
            style={inputStyle}
          />
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={minutesSinceLastRug}
            onChange={(e) => setMinutesSinceLastRug(Number(e.target.value))}
            style={{ width: "100%", marginTop: 12, accentColor: "#f59e0b" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontSize: "12px",
              color: "#9a918a",
            }}
          >
            <span>0m</span>
            <span>Congestion premium fades by 30m</span>
            <span>30m</span>
          </div>
        </div>
      </div>

      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}
      >
        <StatCard
          label="Supply Multiplier"
          value={`${getSupplyMultiplier(supply).toFixed(1)}×`}
          sub={supply < 100000 ? "floor active" : "scaling live"}
        />
        <StatCard label="Boost Floor" value="10× base" sub="until 100k baked" />
        <StatCard
          label="Relative Strength"
          value={`${relativeStrength.toFixed(0)}%`}
          sub="attacker vs target"
        />
        <StatCard
          label="Rug Matchup"
          value={`${matchup.toFixed(1)}×`}
          sub="derived cost multiplier"
        />
        <StatCard
          label="Parity Chance"
          value={`${(parityScaler * 100).toFixed(0)}%`}
          sub="derived hit-rate scaler"
        />
        <StatCard
          label="Congestion"
          value={`${congestionMultiplier.toFixed(2)}×`}
          sub={`${minutesSinceLastRug}m since last rug`}
        />
      </div>

      <SubTitle>Boost Price Growth</SubTitle>
      <P>
        All three boosts follow the same curve. They sit flat at 10x base cost
        until the season crosses 100,000 total cookies, then rise linearly with
        supply.
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
        Rug prices below include the derived matchup multiplier from the
        selected attacker/target strength ratio plus the selected congestion
        state. The shaded cone shows the full 80%-200% matchup range at the
        current minutes-since-last-rug input.
      </P>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <div
                style={{ fontSize: "15px", fontWeight: 700, color: "#484646" }}
              >
                {action.name}
              </div>
              <Badge variant="danger">rug</Badge>
            </div>
            <div
              style={{ fontSize: "12px", color: "#9a918a", marginBottom: 12 }}
            >
              Base cost {action.baseCost.toFixed(2)}. Current selected price:{" "}
              {formatCookieCost(
                getActionCost(action, supply, matchup, minutesSinceLastRug),
              )}{" "}
              cookies at {relativeStrength.toFixed(0)}% strength,{" "}
              {matchup.toFixed(1)}× matchup, and{" "}
              {congestionMultiplier.toFixed(2)}× congestion.
            </div>
            <PriceChart
              area={{
                label: "Possible range",
                color: "#e5719a",
                lowLabel: rugMultipliers[0].shortLabel,
                highLabel: rugMultipliers[1].shortLabel,
                lowAt: (cookies) =>
                  getActionCost(
                    action,
                    cookies,
                    rugMultipliers[0].value,
                    minutesSinceLastRug,
                  ),
                highAt: (cookies) =>
                  getActionCost(
                    action,
                    cookies,
                    rugMultipliers[1].value,
                    minutesSinceLastRug,
                  ),
                currentLow: getActionCost(
                  action,
                  supply,
                  rugMultipliers[0].value,
                  minutesSinceLastRug,
                ),
                currentHigh: getActionCost(
                  action,
                  supply,
                  rugMultipliers[1].value,
                  minutesSinceLastRug,
                ),
              }}
              lines={[
                {
                  label: `Selected ${relativeStrength.toFixed(0)}%`,
                  color: getMatchupColor(matchup),
                  valueAt: (cookies) =>
                    getActionCost(action, cookies, matchup, minutesSinceLastRug),
                  currentValue: getActionCost(
                    action,
                    supply,
                    matchup,
                    minutesSinceLastRug,
                  ),
                },
              ]}
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
            const cost = getActionCost(
              a,
              supply,
              matchup,
              minutesSinceLastRug,
            );
            return (
              <tr key={a.name}>
                <Td highlight>{a.name}</Td>
                <Td align="right">{a.baseCost.toFixed(2)}</Td>
                <Td align="right">
                  {a.type === "rug" ? (
                    <span
                      style={{
                        color:
                          matchup > 1
                            ? "#c03d6d"
                            : matchup < 1
                              ? "#166534"
                              : "#5f5f5f",
                      }}
                    >
                      {(matchup * congestionMultiplier).toFixed(2)}×
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
        Boost prices use the 10x base-cost floor and supply scaling only. Rug
        prices in this calculator derive matchup from attacker-vs-target
        strength, then apply congestion cooldown on top of that same supply
        curve.
      </Callout>

      <Callout type="warning" title="Chance vs Cost">
        The relative-strength control now drives both derived outputs: matchup
        multiplier for rug cost and parity scaler for rug chance. The
        calculator prices cost directly, and also shows the parity hit-rate
        scaler so you can judge whether the setup is efficient.
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
    if (area) values.push(area.lowAt(x), area.highAt(x));
  }
  const currentAreaValues = area ? [area.currentLow, area.currentHigh] : [];
  const maxValue = Math.max(
    ...values,
    ...lines.map((line) => line.currentValue),
    ...currentAreaValues,
  );
  const yMax = maxValue === 0 ? 1 : maxValue * 1.08;

  const getX = (value) => padding.left + (value / maxX) * plotWidth;
  const getY = (value) =>
    padding.top + plotHeight - (value / yMax) * plotHeight;
  const xTicks = [0, maxX * 0.25, maxX * 0.5, maxX * 0.75, maxX];
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];
  const floorThreshold = Math.min(100000, maxX);
  const buildPath = (valueAt) =>
    Array.from({ length: sampleCount + 1 }, (_, index) => {
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
          return `L ${getX(x).toFixed(2)} ${getY(area.highAt(x)).toFixed(2)}`;
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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label="Action price chart"
      >
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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          marginTop: compact ? 10 : 12,
        }}
      >
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
            <span style={{ fontWeight: 600, color: "#484646" }}>
              {area.label}
            </span>
            <span>
              {area.lowLabel} to {area.highLabel}
            </span>
            <span>
              {formatCookieCost(area.currentLow)}-
              {formatCookieCost(area.currentHigh)} cookies
            </span>
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
            <span style={{ fontWeight: 600, color: "#484646" }}>
              {line.label}
            </span>
            <span>{formatCookieCost(line.currentValue)} cookies</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MechanicCurveChart({
  title,
  subtitle,
  xLabel,
  yLabel,
  maxX,
  maxY,
  xTicks,
  yTicks,
  points,
  color,
  formatX = (value) => `${value}`,
  formatY = (value) => `${value}`,
  markers = [],
  step = false,
}) {
  const width = 640;
  const height = 320;
  const padding = { top: 20, right: 20, bottom: 50, left: 62 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const getX = (value) => padding.left + (value / maxX) * plotWidth;
  const getY = (value) =>
    padding.top + plotHeight - (value / maxY) * plotHeight;

  const path = points
    .map((point, index) => {
      if (index === 0)
        return `M ${getX(point.x).toFixed(2)} ${getY(point.y).toFixed(2)}`;

      const previous = points[index - 1];
      if (step) {
        return `L ${getX(point.x).toFixed(2)} ${getY(previous.y).toFixed(2)} L ${getX(point.x).toFixed(2)} ${getY(point.y).toFixed(2)}`;
      }

      return `L ${getX(point.x).toFixed(2)} ${getY(point.y).toFixed(2)}`;
    })
    .join(" ");

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e8e4e0",
        borderRadius: "18px",
        padding: "16px 16px 12px",
        marginBottom: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#484646",
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "12px", color: "#9a918a", marginBottom: 12 }}>
        {subtitle}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={title}
      >
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
              {formatY(tick)}
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
              {formatX(tick)}
            </text>
          </g>
        ))}

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

        {markers.map((marker) => (
          <g key={`${marker.x}-${marker.label}`}>
            <line
              x1={getX(marker.x)}
              x2={getX(marker.x)}
              y1={padding.top}
              y2={height - padding.bottom}
              stroke="#b2aaa3"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={getX(marker.x) + 6}
              y={padding.top + 14}
              fontSize="11"
              fill="#7a726b"
              fontFamily="inherit"
            >
              {marker.label}
            </text>
          </g>
        ))}

        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point) => (
          <circle
            key={`${point.x}-${point.y}`}
            cx={getX(point.x)}
            cy={getY(point.y)}
            r="5"
            fill="#ffffff"
            stroke={color}
            strokeWidth="3"
          />
        ))}

        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="12"
          fill="#7a726b"
          fontFamily="inherit"
        >
          {xLabel}
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
          {yLabel}
        </text>
      </svg>
    </div>
  );
}
