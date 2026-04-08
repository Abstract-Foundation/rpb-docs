export function Badge({ children, variant = "default" }) {
  const styles = {
    default: { background: "#e8e8e8", color: "#5f5f5f" },
    success: { background: "#dcfce7", color: "#166534" },
    danger: { background: "#fce7ef", color: "#9f1239" },
    warning: { background: "#fef3c7", color: "#92400e" },
    info: { background: "#dbeafe", color: "#1e40af" },
    blue: { background: "#e0f2fe", color: "#1b96ca" },
    peach: { background: "#ffdbcc", color: "#a0522d" },
  };
  return (
    <span
      style={{
        ...styles[variant],
        padding: "2px 10px",
        borderRadius: "70px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

export function StatCard({ label, value, sub }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e8e4e0",
        borderRadius: "16px",
        padding: "16px 20px",
        flex: "1 1 140px",
        minWidth: 140,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ fontSize: "12px", color: "#9a918a", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: "24px", fontWeight: 700, color: "#484646" }}>{value}</div>
      {sub && <div style={{ fontSize: "12px", color: "#a89f98", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export function ActionCard({ name, effect, duration, cost, success, cooldown, type, notes, img }) {
  const colors = {
    boost: { border: "#35b0e4", bg: "#f0f9ff" },
    rug: { border: "#e5719a", bg: "#fff5f8" },
    defense: { border: "#DC8360", bg: "#fff8f5" },
  };
  const c = colors[type] || colors.boost;
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e8e4e0",
        borderLeft: `4px solid ${c.border}`,
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {img && <img src={img} alt={name} style={{ width: 40, height: 40, borderRadius: "8px", objectFit: "cover" }} />}
          <h4 style={{ margin: 0, color: "#484646", fontSize: "16px", fontWeight: 700 }}>{name}</h4>
        </div>
        <Badge variant={type === "boost" ? "blue" : type === "rug" ? "danger" : "peach"}>
          {type}
        </Badge>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px", marginBottom: notes ? 12 : 0 }}>
        <div>
          <div style={{ fontSize: "11px", color: "#9a918a", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Effect</div>
          <div style={{ fontSize: "14px", color: "#484646", fontWeight: 600 }}>{effect}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#9a918a", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Duration</div>
          <div style={{ fontSize: "14px", color: "#484646" }}>{duration}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#9a918a", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Base Cost</div>
          <div style={{ fontSize: "14px", color: "#484646" }}>{cost}</div>
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#9a918a", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Success Rate</div>
          <div style={{ fontSize: "14px", color: "#484646" }}>{success}</div>
        </div>
        {cooldown && (
          <div>
            <div style={{ fontSize: "11px", color: "#9a918a", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Cooldown</div>
            <div style={{ fontSize: "14px", color: "#484646" }}>{cooldown}</div>
          </div>
        )}
      </div>
      {notes && <div style={{ fontSize: "13px", color: "#7a726b", lineHeight: 1.5, borderTop: "1px solid #f0ece8", paddingTop: 12 }}>{notes}</div>}
    </div>
  );
}

export function TableWrapper({ children }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 20, background: "#ffffff", border: "1px solid #e8e4e0", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
        }}
      >
        {children}
      </table>
    </div>
  );
}

export function Th({ children, align = "left" }) {
  return (
    <th
      style={{
        textAlign: align,
        padding: "12px 16px",
        borderBottom: "2px solid #f0ece8",
        color: "#9a918a",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        fontWeight: 600,
        background: "#faf8f6",
      }}
    >
      {children}
    </th>
  );
}

export function Td({ children, align = "left", highlight }) {
  return (
    <td
      style={{
        textAlign: align,
        padding: "12px 16px",
        borderBottom: "1px solid #f0ece8",
        color: highlight ? "#484646" : "#5f5f5f",
        fontWeight: highlight ? 600 : 400,
        fontFamily: align === "right" ? "monospace" : "inherit",
      }}
    >
      {children}
    </td>
  );
}

export function Callout({ type = "info", title, children }) {
  const config = {
    info: { bg: "#e0f2fe", border: "#35b0e4", icon: "ℹ️" },
    warning: { bg: "#fef3c7", border: "#f59e0b", icon: "⚠️" },
    tip: { bg: "#dcfce7", border: "#4ade80", icon: "💡" },
    danger: { bg: "#fce7ef", border: "#e5719a", icon: "🔥" },
  };
  const c = config[type];
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "16px", padding: "16px 20px", marginBottom: 20 }}>
      <div style={{ fontWeight: 700, color: "#484646", marginBottom: 6, fontSize: "14px" }}>
        {c.icon} {title}
      </div>
      <div style={{ fontSize: "13px", color: "#5f5f5f", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

export function SectionTitle({ id, children }) {
  return (
    <h2 id={id} style={{ fontSize: "22px", fontWeight: 800, color: "#484646", marginTop: 48, marginBottom: 16, paddingBottom: 8, borderBottom: "2px solid #f0ece8" }}>
      {children}
    </h2>
  );
}

export function SubTitle({ children }) {
  return <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#484646", marginTop: 28, marginBottom: 12 }}>{children}</h3>;
}

export function P({ children }) {
  return <p style={{ fontSize: "14px", color: "#5f5f5f", lineHeight: 1.7, marginBottom: 16 }}>{children}</p>;
}

export function Code({ children }) {
  return (
    <div style={{ background: "#faf8f6", border: "1px solid #e8e4e0", borderRadius: "12px", padding: "16px 20px", marginBottom: 20, fontFamily: "monospace", fontSize: "13px", color: "#484646", lineHeight: 1.6, overflowX: "auto" }}>
      {children}
    </div>
  );
}

export function Changelog({ entries }) {
  const order = ["added", "changed", "fixed", "removed"];
  const grouped = order
    .map((type) => ({ type, items: entries.filter((e) => e.type === type) }))
    .filter((g) => g.items.length > 0);

  return (
    <div style={{ marginBottom: 32 }}>
      {grouped.map((group) => (
        <div key={group.type} style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 6 }}>
            <Badge variant={group.type === "added" ? "success" : group.type === "removed" ? "danger" : group.type === "fixed" ? "info" : "warning"}>
              {group.type}
            </Badge>
          </div>
          {group.items.map((entry, i) => (
            <div key={i} style={{ fontSize: "13px", color: "#5f5f5f", lineHeight: 1.4, padding: "3px 0 3px 12px", borderLeft: "2px solid #f0ece8" }}>
              {entry.description}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
