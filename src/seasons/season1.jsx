import {
  ActionCard, TableWrapper, Th, Td, StatCard,
  SectionTitle, SubTitle, P,
} from "../components";

export const meta = {
  id: "season-1",
  number: 1,
  title: "Season 1",
  subtitle: "March 26 – April 9, 2026 · ~35 ETH prize pool",
  status: "active",
  sections: [
    { id: "s1-overview", title: "Overview", icon: "🍪" },
    { id: "s1-scoring", title: "Scoring & Actions", icon: "🏆" },
  ],
};

export default function Season1({ activeSection }) {
  return (
    <>
      {activeSection === "s1-overview" && <>
        <SectionTitle>Overview</SectionTitle>
        <P>
          Season 1 is the first live season of Rugpull Bakery. All costs are flat cookie amounts. No bakery member cap. No matchup-based pricing.
        </P>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <StatCard label="Prize Pool" value="~35 ETH" sub="from buy-ins + seed" />
          <StatCard label="Duration" value="14 days" sub="Mar 26 – Apr 9" />
          <StatCard label="Boosts" value="5" sub="incl. Cleanup Crew" />
          <StatCard label="Attacks" value="4" sub="flat cookie costs" />
        </div>
      </>}

      {activeSection === "s1-scoring" && <>
        <SectionTitle>Scoring & Actions</SectionTitle>

        <SubTitle>Scoring</SubTitle>
        <P>
          Bakeries are ranked by <strong>total cookies baked</strong> (rawCookiesBaked). Spending cookies on boosts or attacks does not reduce your leaderboard score. Top 3 bakeries split the prize pool.
        </P>
        <TableWrapper>
          <thead>
            <tr><Th>Place</Th><Th align="right">Share</Th></tr>
          </thead>
          <tbody>
            <tr><Td highlight>1st</Td><Td align="right">70%</Td></tr>
            <tr><Td highlight>2nd</Td><Td align="right">20%</Td></tr>
            <tr><Td highlight>3rd</Td><Td align="right">10%</Td></tr>
          </tbody>
        </TableWrapper>

        <SubTitle>Boosts</SubTitle>
        <P>
          All boosts cost a flat amount of cookies. Max 5 active boosts at once per bakery. All cooldowns are 1 hour.
        </P>
        <ActionCard name="Ad Campaign" type="boost" effect="+25% baking" duration="4 hours" cost="120 cookies" success="60%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/ad-campaign.png" />
        <ActionCard name="Motivational Speech" type="boost" effect="+25% baking" duration="4 hours" cost="80 cookies" success="40%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/motivational-speech.png" />
        <ActionCard name="Secret Recipe" type="boost" effect="+50% baking" duration="8 hours" cost="250 cookies" success="35%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/secret-recipe.png" />
        <ActionCard name="Chef's Help" type="boost" effect="+100% baking" duration="8 hours" cost="450 cookies" success="50%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/chefs-help.png" />

        <SubTitle>Attacks</SubTitle>
        <P>
          All attacks cost flat cookie amounts with no matchup multiplier. Max 5 active debuffs on a bakery at once. All cooldowns are 1 hour. Recipe Sabotage is stackable — multiple can be active on the same target. Kitchen Fire is non-stackable.
        </P>
        <ActionCard name="Recipe Sabotage" type="rug" effect="-75% baking" duration="4 hours" cost="120 cookies" success="60%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/recipe-sabotage.png" />
        <ActionCard name="Fake Partnership" type="rug" effect="-75% baking" duration="4 hours" cost="60 cookies" success="35%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/fake-partnership.png" />
        <ActionCard name="Kitchen Fire" type="rug" effect="-25% baking" duration="30 min" cost="220 cookies" success="25%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/kitchen-fire.png" />
        <ActionCard name="Supplier Strike" type="rug" effect="-50% baking" duration="4 hours" cost="220 cookies" success="30%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/supplier-strike.png" />

        <SubTitle>Defense</SubTitle>
        <ActionCard name="Cleanup Crew" type="defense" effect="Remove strongest rug" duration="Instant" cost="600 cookies" success="100%" cooldown="1 hour" img="https://www.rugpullbakery.com/assets/images/stores/cleanup-crew.png" />
      </>}
    </>
  );
}
