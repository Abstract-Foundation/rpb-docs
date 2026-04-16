import { useState, useEffect } from "react";
import { Badge } from "./components";
import General, { meta as generalMeta } from "./seasons/general";
import Season1, { meta as season1Meta } from "./seasons/season1";
import Season2, { meta as season2Meta } from "./seasons/season2";
import Season3, { meta as season3Meta } from "./seasons/season3";

const seasons = [
  { meta: season3Meta, Component: Season3 },
  { meta: season2Meta, Component: Season2 },
  { meta: season1Meta, Component: Season1 },
];

const generalEntry = { meta: generalMeta, Component: General };
const allEntries = [generalEntry, ...seasons];

function resolveFromHash(hash) {
  const id = hash.replace("#", "");
  if (!id) return { page: "general", section: generalMeta.sections[0].id };
  for (const entry of allEntries) {
    const match = entry.meta.sections.find((s) => s.id === id);
    if (match) return { page: entry.meta.id, section: id };
  }
  return { page: "general", section: generalMeta.sections[0].id };
}

export default function App() {
  const initial = resolveFromHash(window.location.hash);
  const [activePage, setActivePage] = useState(initial.page);
  const [activeSection, setActiveSection] = useState(initial.section);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      const { page, section } = resolveFromHash(window.location.hash);
      setActivePage(page);
      setActiveSection(section);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const isGeneral = activePage === "general";
  const current = isGeneral
    ? generalEntry
    : seasons.find((s) => s.meta.id === activePage) || seasons[0];
  const { meta, Component } = current;

  const switchPage = (pageId) => {
    const entry = pageId === "general"
      ? generalEntry
      : seasons.find((s) => s.meta.id === pageId) || seasons[0];
    const sectionId = entry.meta.sections[0].id;
    window.location.hash = sectionId;
    setActivePage(pageId);
    setActiveSection(sectionId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  const switchSection = (sectionId) => {
    window.location.hash = sectionId;
    setActiveSection(sectionId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff8f5", fontFamily: "'Balsamiq Sans', 'Comic Sans MS', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@400;700&display=swap" rel="stylesheet" />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 40 }}
        />
      )}

      <aside
        style={{
          width: 272,
          background: "#ffffff",
          borderRight: "1px solid #e8e4e0",
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-272px",
          bottom: 0,
          zIndex: 50,
          overflowY: "auto",
          transition: "left 0.2s ease",
          display: "flex",
          flexDirection: "column",
        }}
        className="sidebar-desktop"
      >
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid #f0ece8" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#484646", letterSpacing: "-0.5px" }}>
            🍪 Rugpull Bakery
          </div>
          <div style={{ fontSize: "12px", color: "#9a918a", marginTop: 4 }}>Game Guide</div>
        </div>

        {/* General */}
        <div style={{ padding: "12px 8px 4px" }}>
          <button
            onClick={() => switchPage("general")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 12px",
              border: "none",
              borderRadius: "10px",
              background: isGeneral ? "#e0f2fe" : "transparent",
              color: isGeneral ? "#1b96ca" : "#7a726b",
              fontSize: "13px",
              fontWeight: isGeneral ? 700 : 400,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: "14px" }}>📖</span>
            General
          </button>
        </div>

        {/* Seasons */}
        <div style={{ padding: "8px 8px 4px" }}>
          <div style={{ fontSize: "11px", color: "#b0a89f", textTransform: "uppercase", letterSpacing: "0.5px", padding: "8px 12px 6px", fontWeight: 700 }}>
            Seasons
          </div>
          {seasons.map((s) => (
            <button
              key={s.meta.id}
              onClick={() => switchPage(s.meta.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 12px",
                border: "none",
                borderRadius: "10px",
                background: activePage === s.meta.id ? "#e0f2fe" : "transparent",
                color: activePage === s.meta.id ? "#1b96ca" : "#7a726b",
                fontSize: "13px",
                fontWeight: activePage === s.meta.id ? 700 : 400,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              <span>{s.meta.title}</span>
              {s.meta.status === "active" && <Badge variant="success">Live</Badge>}
              {s.meta.status === "ended" && <Badge variant="default">Ended</Badge>}
              {s.meta.status === "upcoming" && <Badge variant="warning">Soon</Badge>}
            </button>
          ))}
        </div>

        <div style={{ height: 1, background: "#f0ece8", margin: "4px 16px" }} />

        {/* Section nav */}
        <nav style={{ padding: "8px 8px 16px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: "11px", color: "#b0a89f", textTransform: "uppercase", letterSpacing: "0.5px", padding: "8px 12px 6px", fontWeight: 700 }}>
            {meta.title}
          </div>
          {meta.sections.map((s) => (
            <button
              key={s.id}
              onClick={() => switchSection(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "7px 12px",
                border: "none",
                borderRadius: "10px",
                background: activeSection === s.id ? "#fff8f5" : "transparent",
                color: activeSection === s.id ? "#484646" : "#9a918a",
                fontSize: "13px",
                fontWeight: activeSection === s.id ? 600 : 400,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "14px" }}>{s.icon}</span>
              {s.title}
            </button>
          ))}
        </nav>
      </aside>

      <style>{`
        @media (min-width: 800px) {
          .sidebar-desktop { left: 0 !important; }
          .main-content { margin-left: 272px !important; }
          .mobile-header { display: none !important; }
        }
      `}</style>

      <div
        className="mobile-header"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 30,
          background: "#ffffff", borderBottom: "1px solid #e8e4e0",
          padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: "none", border: "none", color: "#484646", fontSize: "20px", cursor: "pointer", padding: 0 }}
        >
          ☰
        </button>
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#484646" }}>🍪 Rugpull Bakery</span>
        <span style={{ fontSize: "12px", color: "#9a918a", marginLeft: "auto" }}>{meta.title}</span>
      </div>

      <main className="main-content" style={{ flex: 1, maxWidth: 780, padding: "40px 32px 80px", margin: "0 auto" }}>
        <Component activeSection={activeSection} />

        <div style={{ marginTop: 64, padding: "24px 0", borderTop: "1px solid #e8e4e0", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "#b0a89f" }}>
            Rugpull Bakery on Abstract · <a href="https://www.rugpullbakery.com" style={{ color: "#35b0e4", textDecoration: "none" }}>rugpullbakery.com</a>
          </p>
        </div>
      </main>
    </div>
  );
}
