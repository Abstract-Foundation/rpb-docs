import { useState } from "react";
import {
  Badge, StatCard, ActionCard, TableWrapper, Th, Td,
  Callout, SectionTitle, SubTitle, P, Code, Changelog,
} from "../components";

export const meta = {
  id: "season-2",
  number: 2,
  title: "Season 2",
  subtitle: "Balance-based scoring, matchup multipliers, and a trimmed action catalog",
  status: "upcoming",
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

export default function Season2({ activeSection }) {
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
            <tr><Th>Place</Th><Th align="right">Share</Th></tr>
          </thead>
          <tbody>
            <tr><Td highlight>1st</Td><Td align="right">50%</Td></tr>
            <tr><Td highlight>2nd</Td><Td align="right">20%</Td></tr>
            <tr><Td highlight>3rd</Td><Td align="right">15%</Td></tr>
            <tr><Td highlight>4th</Td><Td align="right">10%</Td></tr>
            <tr><Td highlight>5th</Td><Td align="right">5%</Td></tr>
          </tbody>
        </TableWrapper>

        <SubTitle>Dynamic Pricing</SubTitle>
        <P>
          All action costs scale with total cookie supply. As more cookies are baked globally, prices go up — but so do balances, keeping costs proportionally consistent. Boosts and Cleanup Crew use a flat supply-scaled formula. Rugs add a matchup multiplier based on the balance ratio between attacker and target.
        </P>
        <Callout type="info" title="Cost Formulas">
          <strong>Boosts & Cleanup:</strong> baseCost × (totalCookieSupply / 10,000)<br/>
          <strong>Rugs:</strong> baseCost × (totalCookieSupply / 10,000) × matchupMultiplier
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
            <tr><Td>A ≤ 0.50 × T</Td><Td align="right">0.80×</Td><Td>Punching well up — discounted</Td></tr>
            <tr><Td>0.50 × T {"<"} A ≤ 0.80 × T</Td><Td align="right">0.90×</Td><Td>Punching up — slight discount</Td></tr>
            <tr><Td>0.80 × T {"<"} A {"<"} 1.25 × T</Td><Td align="right">1.00×</Td><Td>Even matchup — standard rate</Td></tr>
            <tr><Td>1.25 × T ≤ A {"<"} 2.00 × T</Td><Td align="right">1.20×</Td><Td>Slightly punching down</Td></tr>
            <tr><Td>2.00 × T ≤ A {"<"} 4.00 × T</Td><Td align="right">1.50×</Td><Td>Punching down — expensive</Td></tr>
            <tr><Td>4.00 × T ≤ A {"<"} 8.00 × T</Td><Td align="right">1.80×</Td><Td>Hard bullying — very expensive</Td></tr>
            <tr><Td>A ≥ 8.00 × T</Td><Td align="right">2.00×</Td><Td>Extreme bullying — maximum penalty</Td></tr>
          </tbody>
        </TableWrapper>

        <SubTitle>Defense</SubTitle>
        <ActionCard name="Cleanup Crew" type="defense" effect="Remove strongest rug" duration="Instant" cost="0.60" success="100%" cooldown="30 min" notes="Guaranteed success, no matchup multiplier. Removes the single strongest active rug on your bakery." img="https://www.rugpullbakery.com/assets/images/stores/cleanup-crew.png" />
      </>}

      {activeSection === "s2-calculator" && <CostCalculator />}
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

function CostCalculator() {
  const [supply, setSupply] = useState(5000000);
  const [matchup, setMatchup] = useState(1.0);

  const fmt = (n) => n < 1 ? n.toFixed(2) : Math.round(n).toLocaleString();

  return (
    <>
      <SectionTitle>Cost Calculator</SectionTitle>
      <P>
        Enter the total cookie supply and matchup multiplier to see what each action costs. The matchup multiplier only applies to rugs.
      </P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", color: "#9a918a", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600, marginBottom: 6 }}>
            Total Cookie Supply
          </label>
          <input
            type="number"
            value={supply}
            onChange={(e) => setSupply(Math.max(0, Number(e.target.value)))}
            style={inputStyle}
          />
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
            const cost = a.baseCost * (supply / 10000) * mult;
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
                    <span style={{ color: "#9a918a" }}>—</span>
                  )}
                </Td>
                <Td align="right" highlight>
                  {fmt(cost)} cookies
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableWrapper>

      <Callout type="info" title="How to read this">
        Actual cost = baseCost × (totalCookieSupply / 10,000) for boosts and defense. For rugs, multiply by the matchup multiplier too. As the season progresses and more cookies are baked, costs go up — but so does everyone's balance.
      </Callout>
    </>
  );
}
