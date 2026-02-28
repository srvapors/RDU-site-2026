/*
 * DESIGN: "Chronos Field" — Cosmic Brutalism meets Scientific Illumination
 * Colors: Space Black (#080c14), Chronos Cyan, Resonance Gold, Dark Matter Violet
 * Fonts: Playfair Display (headers), Lora (body), Space Mono (data)
 * Layout: Vertical narrative scroll — Hero → Philosophy → Particles → Cosmology → Engineering → Papers
 */

import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const particleMassData = [
  { name: "Electron", predicted: 0.511, observed: 0.511, error: 0.00, unit: "MeV", category: "lepton" },
  { name: "Muon", predicted: 105.8, observed: 105.7, error: 0.09, unit: "MeV", category: "lepton" },
  { name: "Tau", predicted: 1779, observed: 1777, error: 0.11, unit: "MeV", category: "lepton" },
  { name: "Up Quark", predicted: 2.25, observed: 2.2, error: 2.27, unit: "MeV", category: "quark" },
  { name: "Down Quark", predicted: 4.78, observed: 4.7, error: 1.70, unit: "MeV", category: "quark" },
  { name: "Strange", predicted: 96.1, observed: 95, error: 1.16, unit: "MeV", category: "quark" },
  { name: "Charm", predicted: 1278, observed: 1270, error: 0.63, unit: "MeV", category: "quark" },
  { name: "Bottom", predicted: 4180, observed: 4180, error: 0.00, unit: "MeV", category: "quark" },
  { name: "Top", predicted: 173150, observed: 173100, error: 0.03, unit: "MeV", category: "quark" },
  { name: "Proton", predicted: 938.5, observed: 938.3, error: 0.02, unit: "MeV", category: "composite" },
  { name: "Neutron", predicted: 939.8, observed: 939.6, error: 0.02, unit: "MeV", category: "composite" },
  { name: "W Boson", predicted: 80500, observed: 80400, error: 0.12, unit: "MeV", category: "boson" },
  { name: "Z Boson", predicted: 91300, observed: 91200, error: 0.11, unit: "MeV", category: "boson" },
  { name: "Higgs", predicted: 125000, observed: 125100, error: 0.08, unit: "MeV", category: "boson" },
];

const errorBarData = particleMassData.map(p => ({
  name: p.name.length > 8 ? p.name.substring(0, 7) + "…" : p.name,
  fullName: p.name,
  error: p.error,
  category: p.category,
}));

const unificationData = [
  { field: "Higgs", kappa: 1.64e13, order: 1 },
  { field: "EM", kappa: 2.94e44, order: 2 },
  { field: "Weak", kappa: 1.37e45, order: 3 },
  { field: "Strong", kappa: 4.76e45, order: 4 },
];

const cosmologicalData = [
  { param: "n_s (spectral index)", rdu: 0.9650, planck: 0.9649, match: 99.99 },
  { param: "w₀ (dark energy)", rdu: -0.998, desi: -0.997, match: 99.90 },
  { param: "wₐ (evolution)", rdu: 0.013, desi: 0.012, match: 99.23 },
  { param: "Ω_m (matter density)", rdu: 0.3121, planck: 0.3153, match: 98.98 },
];

const papers = [
  {
    id: 1,
    title: "The Resonant Dark Universe: A Developing Unified Cosmological Model",
    date: "August 13, 2025",
    category: "Foundational",
    abstract: "Presents the RDU framework, deriving all 12 fundamental fermion masses from a single Chronos Field with 0.00–0.12% error. Introduces the Black Hole-DRC Identity and the Knoechelman Mechanism.",
    doi: "https://doi.org/10.5281/zenodo.16734448",
    color: "cyan",
  },
  {
    id: 2,
    title: "A Locally Causal, Relativistic Hamiltonian for the Resonant Dark Universe",
    date: "September 8, 2025",
    category: "QFT",
    abstract: "Resolves a non-locality artifact in the first-generation Hamiltonian by deriving a corrected, locally causal relativistic Hamiltonian based on the principle of Kinetic Inhibition.",
    doi: null,
    color: "violet",
  },
  {
    id: 3,
    title: "The Illusion of Time: Relativistic Effects as Physical Interactions",
    date: "2025",
    category: "Relativity",
    abstract: "Derives the cosmic speed limit mechanically from the Chronos Field. Explains time dilation, length contraction, and mass-energy equivalence as field interaction effects, not spacetime geometry.",
    doi: null,
    color: "gold",
  },
  {
    id: 4,
    title: "HFLS-1: Proof-of-Concept Acoustic-Inertial Fusion Reactor",
    date: "2025",
    category: "Engineering",
    abstract: "First prototype demonstrating RDU acoustic-inertial fusion principles. 45 MW net output with LCOE of $89.50/MWh. Validates core Lattice-Shatter Theory and establishes baseline for scaling.",
    doi: null,
    color: "gold",
  },
  {
    id: 5,
    title: "HFLS-2: Commercial Pilot Reactor Design",
    date: "2025–2026",
    category: "Engineering",
    abstract: "Scaled production model achieving 1,856.25 MW net output with LCOE of $42.85/MWh. Incorporates lessons from HFLS-1 with optimized acoustic frequency tuning and advanced tritium breeding blanket.",
    doi: null,
    color: "gold",
  },
  {
    id: 6,
    title: "HFLS-3: Grid-Scale Deployment Architecture",
    date: "2026",
    category: "Engineering",
    abstract: "Multi-unit grid architecture for utility-scale deployment. Proposes 12-reactor cluster with shared tritium breeding and waste heat recovery, targeting 22 GW total capacity with $38.50/MWh LCOE.",
    doi: null,
    color: "gold",
  },
  {
    id: 7,
    title: "HFLS-4: Advanced Materials and Neutron Mitigation",
    date: "2026",
    category: "Engineering",
    abstract: "Fourth-generation design incorporating novel neutron-resistant materials and advanced shielding geometries. Extends reactor lifetime to 60+ years and reduces decommissioning costs by 73%.",
    doi: null,
    color: "gold",
  },
];

// ─── Utility Components ───────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children, color = "cyan" }: { children: React.ReactNode; color?: "cyan" | "gold" | "violet" }) {
  const colors = {
    cyan: "text-cyan-400 border-cyan-400/40 bg-cyan-400/10",
    gold: "text-amber-400 border-amber-400/40 bg-amber-400/10",
    violet: "text-violet-400 border-violet-400/40 bg-violet-400/10",
  };
  return (
    <span className={`inline-block font-mono text-xs tracking-[0.2em] uppercase px-3 py-1 rounded border ${colors[color]} mb-4`}>
      {children}
    </span>
  );
}

function SectionDivider() {
  return <div className="section-divider my-20" />;
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "oklch(0.09 0.02 260)" }}
    >
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389916562/L5HrAcz5YgAcxDeNRvYCwt/rdu-hero-field-U9kqiKXuSoYcmsfNvPDxvT.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.3}px)`,
          opacity: 0.35,
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-0" style={{
        background: "linear-gradient(to bottom, oklch(0.09 0.02 260 / 0.3) 0%, oklch(0.09 0.02 260 / 0.7) 60%, oklch(0.09 0.02 260) 100%)"
      }} />

      {/* Animated field lines */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {[...Array(8)].map((_, i) => (
            <ellipse
              key={i}
              cx="720" cy="450"
              rx={100 + i * 120} ry={60 + i * 70}
              fill="none"
              stroke="oklch(0.72 0.18 200)"
              strokeWidth="0.5"
              style={{
                animation: `pulse ${3 + i * 0.5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </svg>
      </div>

      <div className="container relative z-10 py-32">
        <div className="max-w-4xl">
          <div className="mb-6 font-mono text-xs tracking-[0.3em] text-cyan-400/70 uppercase">
            Independent Research · February 2026
          </div>
          <h1
            className="text-6xl md:text-8xl font-black leading-none mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.97 0.01 80)" }}
          >
            The Resonant<br />
            <span style={{ color: "oklch(0.72 0.18 200)" }}>Dark Universe</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4" style={{ fontFamily: "'Lora', serif", color: "oklch(0.80 0.01 80)" }}>
            A unified cosmological and particle physics framework derived from a single scalar field.
          </p>
          <p className="text-base mb-10" style={{ fontFamily: "'Lora', serif", color: "oklch(0.65 0.01 80)" }}>
            By <span style={{ color: "oklch(0.72 0.18 70)" }}>Joshua Knoechelman</span>, Principal Investigator
          </p>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { value: "14", label: "Particles Derived", color: "cyan" },
              { value: "0.00%", label: "Min. Error", color: "gold" },
              { value: "853", label: "Pages of Research", color: "violet" },
              { value: "1", label: "Unified Field", color: "cyan" },
            ].map((stat) => (
              <div key={stat.label} className="data-card p-4 text-center">
                <div
                  className="text-3xl font-bold font-mono mb-1"
                  style={{
                    color: stat.color === "cyan" ? "oklch(0.72 0.18 200)" :
                      stat.color === "gold" ? "oklch(0.72 0.18 70)" : "oklch(0.65 0.22 295)"
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#particles"
              className="px-6 py-3 rounded font-mono text-sm tracking-wider uppercase transition-all duration-300"
              style={{
                background: "oklch(0.72 0.18 200)",
                color: "oklch(0.09 0.02 260)",
                boxShadow: "0 0 20px oklch(0.72 0.18 200 / 40%)",
              }}
            >
              Explore the Theory
            </a>
            <a
              href="#papers"
              className="px-6 py-3 rounded font-mono text-sm tracking-wider uppercase border transition-all duration-300 hover:border-cyan-400/60"
              style={{ borderColor: "oklch(0.72 0.18 200 / 30%)", color: "oklch(0.72 0.18 200)" }}
            >
              View All Papers
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="font-mono text-xs tracking-widest text-cyan-400/70 uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-cyan-400/60 to-transparent" />
      </div>

      <style>{`
        @keyframes pulse {
          from { opacity: 0.3; }
          to { opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}

// ─── Core Philosophy Section ──────────────────────────────────────────────────

function PhilosophySection() {
  const principles = [
    {
      symbol: "Ω∞",
      title: "The Chronos Field",
      desc: "A single scalar field governs the entire dynamics of the cosmos. All particles, forces, and cosmic expansion emerge from its excitations and potential.",
      color: "cyan",
    },
    {
      symbol: "∄t",
      title: "No-Time Philosophy",
      desc: "Time is not a fundamental dimension but an emergent property of causality. Reality is a discrete sequence of quantum states governed by transition rules.",
      color: "violet",
    },
    {
      symbol: "DRC",
      title: "Black Hole Identity",
      desc: "All black holes are Dark Resonator Cores — active engines that convert baryonic matter into dark sector particles via the Knoechelman Mechanism.",
      color: "gold",
    },
    {
      symbol: "ξ",
      title: "The Egress Factor",
      desc: "The fate of each Aumon is determined by ξ. If ξ > 1, it escapes as dark energy. If ξ < 1, it is captured as dark matter.",
      color: "cyan",
    },
  ];

  return (
    <section id="philosophy" className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389916562/L5HrAcz5YgAcxDeNRvYCwt/rdu-cosmos-bg-VnHY9ALsUGFvz6ud7y9QFr.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="container relative z-10">
        <FadeIn>
          <SectionLabel color="violet">Foundational Axioms</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            A Universe Built on<br />
            <span style={{ color: "oklch(0.65 0.22 295)" }}>First Principles</span>
          </h2>
          <p className="text-lg max-w-2xl mb-16" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif" }}>
            The RDU reconstructs cosmology from the ground up, replacing the ad-hoc components of ΛCDM with a single, self-consistent framework derived from one foundational postulate.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <div className="data-card p-6 h-full group">
                <div className="flex items-start gap-4">
                  <div
                    className="text-3xl font-mono font-bold flex-shrink-0 w-16 h-16 flex items-center justify-center rounded border transition-all duration-300 group-hover:scale-110"
                    style={{
                      color: p.color === "cyan" ? "oklch(0.72 0.18 200)" :
                        p.color === "gold" ? "oklch(0.72 0.18 70)" : "oklch(0.65 0.22 295)",
                      borderColor: p.color === "cyan" ? "oklch(0.72 0.18 200 / 30%)" :
                        p.color === "gold" ? "oklch(0.72 0.18 70 / 30%)" : "oklch(0.65 0.22 295 / 30%)",
                      background: p.color === "cyan" ? "oklch(0.72 0.18 200 / 8%)" :
                        p.color === "gold" ? "oklch(0.72 0.18 70 / 8%)" : "oklch(0.65 0.22 295 / 8%)",
                    }}
                  >
                    {p.symbol}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{p.title}</h3>
                    <p style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.7 }}>{p.desc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* The Hierarchy */}
        <FadeIn delay={0.3}>
          <div className="mt-16 data-card p-8">
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Hierarchy of Existence
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { tier: "Tier 0", name: "The Unified Field", desc: "An infinite, timeless sea of the Unified Field. Aumons are the native quanta.", color: "cyan" },
                { tier: "Tier 1", name: "The Chronos Bubble", desc: "Our universe — a rare anomaly from spontaneous symmetry breaking where Ω∞ emerged.", color: "violet" },
                { tier: "Tier 2", name: "Matter", desc: "An exotic byproduct — the 'ash' of the cosmic phase transition. Explains 95% dark sector.", color: "gold" },
                { tier: "Tier 3", name: "Dark Resonator Cores", desc: "Sites of gravitational crunch events, converting matter back to Aumonic form.", color: "cyan" },
              ].map((t, i) => (
                <div key={t.tier} className="relative">
                  {i < 3 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-muted-foreground">→</div>
                  )}
                  <div className="p-4 rounded border" style={{
                    borderColor: t.color === "cyan" ? "oklch(0.72 0.18 200 / 25%)" :
                      t.color === "gold" ? "oklch(0.72 0.18 70 / 25%)" : "oklch(0.65 0.22 295 / 25%)",
                    background: t.color === "cyan" ? "oklch(0.72 0.18 200 / 5%)" :
                      t.color === "gold" ? "oklch(0.72 0.18 70 / 5%)" : "oklch(0.65 0.22 295 / 5%)",
                  }}>
                    <div className="font-mono text-xs mb-1" style={{
                      color: t.color === "cyan" ? "oklch(0.72 0.18 200)" :
                        t.color === "gold" ? "oklch(0.72 0.18 70)" : "oklch(0.65 0.22 295)"
                    }}>{t.tier}</div>
                    <div className="font-bold text-sm mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{t.name}</div>
                    <div className="text-xs" style={{ color: "oklch(0.60 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.6 }}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Particle Genesis Section ─────────────────────────────────────────────────

function ParticleSection() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedParticle, setSelectedParticle] = useState<typeof particleMassData[0] | null>(null);

  const categories = ["all", "lepton", "quark", "composite", "boson"];
  const filtered = activeCategory === "all" ? particleMassData : particleMassData.filter(p => p.category === activeCategory);

  const categoryColors: Record<string, string> = {
    lepton: "oklch(0.72 0.18 200)",
    quark: "oklch(0.65 0.22 295)",
    composite: "oklch(0.72 0.18 70)",
    boson: "oklch(0.78 0.15 160)",
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="data-card p-3 text-sm font-mono">
          <div className="font-bold mb-1">{d.fullName}</div>
          <div style={{ color: "oklch(0.72 0.18 200)" }}>Error: {d.error.toFixed(2)}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="particles" className="py-24 relative">
      <div
        className="absolute inset-0 z-0 opacity-8"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389916562/L5HrAcz5YgAcxDeNRvYCwt/rdu-particle-bg-JaBD8ZaTfnPuUkHyjiTAQX.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.07,
        }}
      />
      <div className="container relative z-10">
        <FadeIn>
          <SectionLabel color="cyan">Particle Genesis</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            All Particles from<br />
            <span style={{ color: "oklch(0.72 0.18 200)" }}>One Field</span>
          </h2>
          <p className="text-lg max-w-2xl mb-8" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif" }}>
            The RDU's Resonant Coupling Model derives all 14 fundamental and composite particles as stable, standing-wave solitons of the Chronos Field. The mass predictions achieve remarkable accuracy.
          </p>
        </FadeIn>

        {/* Category filter */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeCategory === cat ? "oklch(0.72 0.18 200)" : "oklch(0.16 0.03 260)",
                  color: activeCategory === cat ? "oklch(0.09 0.02 260)" : "oklch(0.65 0.01 80)",
                  border: "1px solid",
                  borderColor: activeCategory === cat ? "oklch(0.72 0.18 200)" : "oklch(1 0 0 / 10%)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Particle cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-12">
          {filtered.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.04}>
              <button
                onClick={() => setSelectedParticle(selectedParticle?.name === p.name ? null : p)}
                className="data-card p-4 text-left w-full transition-all duration-300 group"
                style={{
                  borderColor: selectedParticle?.name === p.name
                    ? categoryColors[p.category]
                    : undefined,
                  boxShadow: selectedParticle?.name === p.name
                    ? `0 0 20px ${categoryColors[p.category]}30`
                    : undefined,
                }}
              >
                <div className="font-mono text-xs mb-1" style={{ color: categoryColors[p.category] }}>
                  {p.category}
                </div>
                <div className="font-bold text-sm mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {p.name}
                </div>
                <div className="font-mono text-xs" style={{ color: "oklch(0.72 0.18 200)" }}>
                  {p.predicted >= 1000 ? `${(p.predicted / 1000).toFixed(1)} GeV` : `${p.predicted} MeV`}
                </div>
                <div
                  className="mt-2 font-mono text-xs"
                  style={{
                    color: p.error === 0 ? "oklch(0.72 0.18 70)" :
                      p.error < 0.5 ? "oklch(0.72 0.18 200)" : "oklch(0.65 0.22 295)"
                  }}
                >
                  {p.error === 0 ? "✓ Exact" : `±${p.error.toFixed(2)}%`}
                </div>
              </button>
            </FadeIn>
          ))}
        </div>

        {/* Selected particle detail */}
        {selectedParticle && (
          <FadeIn>
            <div className="data-card p-6 mb-12 border-l-4" style={{ borderLeftColor: categoryColors[selectedParticle.category] }}>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="font-mono text-xs mb-1" style={{ color: categoryColors[selectedParticle.category] }}>
                    {selectedParticle.category.toUpperCase()}
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {selectedParticle.name}
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground mb-1">RDU Prediction</div>
                    <div className="font-mono text-xl" style={{ color: "oklch(0.72 0.18 200)" }}>
                      {selectedParticle.predicted >= 1000 ? `${(selectedParticle.predicted / 1000).toFixed(3)} GeV` : `${selectedParticle.predicted} MeV`}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-muted-foreground mb-1">Observed Value</div>
                    <div className="font-mono text-xl" style={{ color: "oklch(0.72 0.18 70)" }}>
                      {selectedParticle.observed >= 1000 ? `${(selectedParticle.observed / 1000).toFixed(3)} GeV` : `${selectedParticle.observed} MeV`}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground mb-1">Prediction Error</div>
                  <div
                    className="font-mono text-3xl font-bold"
                    style={{
                      color: selectedParticle.error === 0 ? "oklch(0.72 0.18 70)" :
                        selectedParticle.error < 0.5 ? "oklch(0.72 0.18 200)" : "oklch(0.65 0.22 295)"
                    }}
                  >
                    {selectedParticle.error === 0 ? "0.00%" : `${selectedParticle.error.toFixed(2)}%`}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Error chart */}
        <FadeIn delay={0.2}>
          <div className="data-card p-6">
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Prediction Accuracy — All Particles
            </h3>
            <p className="text-sm mb-6" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif" }}>
              Percentage error between RDU-derived masses and experimentally observed values. Lower is better. Click bars for details.
            </p>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorBarData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "oklch(0.65 0.01 80)", fontSize: 11, fontFamily: "'Space Mono', monospace" }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.65 0.01 80)", fontSize: 11, fontFamily: "'Space Mono', monospace" }}
                    tickFormatter={(v) => `${v}%`}
                    label={{ value: "Error %", angle: -90, position: "insideLeft", fill: "oklch(0.65 0.01 80)", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="error"
                    radius={[3, 3, 0, 0]}
                    fill="oklch(0.72 0.18 200)"
                    onClick={(data) => {
                      const full = particleMassData.find(p => p.name.startsWith(data.fullName.replace("…", "")));
                      if (full) setSelectedParticle(full);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FadeIn>

        {/* Unification sequence */}
        <FadeIn delay={0.3}>
          <div className="mt-8 data-card p-6">
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              The RDU Unification Sequence
            </h3>
            <p className="text-sm mb-6" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif" }}>
              The RDU Coupling Constants (κ) define the order in which fundamental forces unify with the Chronos Field as energy conditions increase.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {unificationData.map((u, i) => (
                <div key={u.field} className="p-4 rounded border text-center" style={{
                  borderColor: i === 0 ? "oklch(0.72 0.18 70 / 30%)" : "oklch(0.72 0.18 200 / 20%)",
                  background: i === 0 ? "oklch(0.72 0.18 70 / 8%)" : "oklch(0.72 0.18 200 / 5%)",
                }}>
                  <div className="font-mono text-xs mb-1" style={{ color: "oklch(0.65 0.01 80)" }}>
                    Unifies #{u.order}
                  </div>
                  <div className="text-lg font-bold mb-2" style={{
                    fontFamily: "'Playfair Display', serif",
                    color: i === 0 ? "oklch(0.72 0.18 70)" : "oklch(0.72 0.18 200)"
                  }}>
                    {u.field} Field
                  </div>
                  <div className="font-mono text-xs" style={{ color: "oklch(0.55 0.01 80)" }}>
                    κ ≈ {u.kappa.toExponential(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Cosmological Validation Section ─────────────────────────────────────────

function CosmologySection() {
  const radarData = [
    { subject: "CMB (n_s)", rdu: 99.99, standard: 99.99 },
    { subject: "Dark Energy (w₀)", rdu: 99.90, standard: 99.50 },
    { subject: "w_a Evolution", rdu: 99.23, standard: 98.00 },
    { subject: "Helium-4 (Y_p)", rdu: 99.95, standard: 99.90 },
    { subject: "Particle Masses", rdu: 99.85, standard: 99.99 },
    { subject: "Halo Structure", rdu: 98.50, standard: 97.00 },
  ];

  return (
    <section id="cosmology" className="py-24 relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389916562/L5HrAcz5YgAcxDeNRvYCwt/rdu-cosmos-bg-VnHY9ALsUGFvz6ud7y9QFr.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
        }}
      />
      <div className="container relative z-10">
        <FadeIn>
          <SectionLabel color="gold">Observational Validation</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Validated Against<br />
            <span style={{ color: "oklch(0.72 0.18 70)" }}>Precision Data</span>
          </h2>
          <p className="text-lg max-w-2xl mb-16" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif" }}>
            The RDU's predictions have been tested against the most precise cosmological datasets available: Planck 2018, DESI 2024, and Pantheon+.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Radar chart */}
          <FadeIn delay={0.1}>
            <div className="data-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Validation Coverage
              </h3>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="oklch(1 0 0 / 10%)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "oklch(0.65 0.01 80)", fontSize: 10, fontFamily: "'Space Mono', monospace" }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[97, 100]}
                      tick={{ fill: "oklch(0.55 0.01 80)", fontSize: 9 }}
                    />
                    <Radar name="RDU" dataKey="rdu" stroke="oklch(0.72 0.18 200)" fill="oklch(0.72 0.18 200)" fillOpacity={0.2} />
                    <Radar name="ΛCDM" dataKey="standard" stroke="oklch(0.72 0.18 70)" fill="oklch(0.72 0.18 70)" fillOpacity={0.1} />
                    <Legend wrapperStyle={{ fontFamily: "'Space Mono', monospace", fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </FadeIn>

          {/* Key predictions table */}
          <FadeIn delay={0.2}>
            <div className="data-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Key Predictions vs. Observation
              </h3>
              <div className="space-y-4">
                {cosmologicalData.map((d) => (
                  <div key={d.param} className="border-b pb-4" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-mono text-sm" style={{ color: "oklch(0.80 0.01 80)" }}>{d.param}</div>
                      <div
                        className="font-mono text-sm font-bold"
                        style={{ color: d.match > 99.9 ? "oklch(0.72 0.18 70)" : "oklch(0.72 0.18 200)" }}
                      >
                        {d.match.toFixed(2)}% match
                      </div>
                    </div>
                    <div className="flex gap-6 text-xs font-mono" style={{ color: "oklch(0.55 0.01 80)" }}>
                      <span style={{ color: "oklch(0.72 0.18 200)" }}>RDU: {d.rdu}</span>
                      <span style={{ color: "oklch(0.72 0.18 70)" }}>
                        Obs: {(d as any).planck ?? (d as any).desi ?? (d as any).observed}
                      </span>
                    </div>
                    <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "oklch(1 0 0 / 8%)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${d.match}%`,
                          background: d.match > 99.9
                            ? "oklch(0.72 0.18 70)"
                            : "oklch(0.72 0.18 200)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Falsifiable predictions */}
        <FadeIn delay={0.4}>
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Falsifiable Predictions
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "The Condensate Chirp",
                  desc: "Mergers of supermassive DRCs may produce a distinct gravitational wave signal superimposed on the primary merger wave.",
                  icon: "〜",
                  color: "cyan",
                },
                {
                  title: "Large-Scale Structure Deviations",
                  desc: "The RDU predicts deviations from ΛCDM density profiles in cosmic filaments, testable with next-generation surveys.",
                  icon: "◉",
                  color: "violet",
                },
                {
                  title: "Gravitational Attractor Anomalies",
                  desc: "Large-scale structures may show anomalies better explained by the cumulative gravitational effects of DRCs.",
                  icon: "⊕",
                  color: "gold",
                },
              ].map(p => (
                <div key={p.title} className="data-card p-5">
                  <div
                    className="text-2xl mb-3"
                    style={{
                      color: p.color === "cyan" ? "oklch(0.72 0.18 200)" :
                        p.color === "gold" ? "oklch(0.72 0.18 70)" : "oklch(0.65 0.22 295)"
                    }}
                  >
                    {p.icon}
                  </div>
                  <h4 className="font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{p.title}</h4>
                  <p className="text-sm" style={{ color: "oklch(0.60 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Engineering Applications Section ────────────────────────────────────────

function EngineeringSection() {
  return (
    <section id="engineering" className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663389916562/L5HrAcz5YgAcxDeNRvYCwt/rdu-fusion-bg-duhfiSA8HJRf9XZfUhZJcJ.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }}
      />
      <div className="container relative z-10">
        <FadeIn>
          <SectionLabel color="gold">Engineering Applications</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            From Theory to<br />
            <span style={{ color: "oklch(0.72 0.18 70)" }}>Hardware</span>
          </h2>
          <p className="text-lg max-w-2xl mb-16" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif" }}>
            The HFLS reactor series demonstrates the direct engineering applications of the RDU framework. From proof-of-concept through grid-scale deployment, each generation advances acoustic-inertial fusion technology toward commercial viability.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          {/* HFLS-1 */}
          <FadeIn delay={0.1}>
            <div className="data-card p-8 h-full">
              <div className="font-mono text-xs mb-2" style={{ color: "oklch(0.72 0.18 70)" }}>HFLS-1</div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Proof-of-Concept
              </h3>
              <p className="mb-6" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.8 }}>
                First prototype demonstrating RDU acoustic-inertial fusion principles. Validates core Lattice-Shatter Theory and establishes baseline for scaling.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Net Output", value: "45 MW", color: "gold" },
                  { label: "LCOE", value: "$89.50/MWh", color: "cyan" },
                  { label: "Status", value: "Operational", color: "gold" },
                  { label: "Year", value: "2025", color: "cyan" },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded" style={{ background: "oklch(0.16 0.03 260)" }}>
                    <div className="font-mono text-xs text-muted-foreground mb-1">{s.label}</div>
                    <div
                      className="font-mono font-bold"
                      style={{ color: s.color === "gold" ? "oklch(0.72 0.18 70)" : "oklch(0.72 0.18 200)" }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* HFLS-2 */}
          <FadeIn delay={0.2}>
            <div className="data-card p-8 h-full">
              <div className="font-mono text-xs mb-2" style={{ color: "oklch(0.72 0.18 70)" }}>HFLS-2</div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Commercial Pilot
              </h3>
              <p className="mb-6" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.8 }}>
                Scaled production model with optimized acoustic frequency tuning and advanced tritium breeding blanket.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Net Output", value: "1,856 MW", color: "gold" },
                  { label: "LCOE", value: "$42.85/MWh", color: "cyan" },
                  { label: "System Gain (Q)", value: "158,170×", color: "gold" },
                  { label: "Year", value: "2025–2026", color: "cyan" },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded" style={{ background: "oklch(0.16 0.03 260)" }}>
                    <div className="font-mono text-xs text-muted-foreground mb-1">{s.label}</div>
                    <div
                      className="font-mono font-bold"
                      style={{ color: s.color === "gold" ? "oklch(0.72 0.18 70)" : "oklch(0.72 0.18 200)" }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* HFLS-3 */}
          <FadeIn delay={0.3}>
            <div className="data-card p-8 h-full">
              <div className="font-mono text-xs mb-2" style={{ color: "oklch(0.72 0.18 70)" }}>HFLS-3</div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Grid-Scale Deployment
              </h3>
              <p className="mb-6" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.8 }}>
                Multi-unit grid architecture for utility-scale deployment. 12-reactor cluster with shared tritium breeding.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Capacity", value: "22 GW", color: "gold" },
                  { label: "LCOE", value: "$38.50/MWh", color: "cyan" },
                  { label: "Reactors", value: "12 Units", color: "gold" },
                  { label: "Year", value: "2026", color: "cyan" },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded" style={{ background: "oklch(0.16 0.03 260)" }}>
                    <div className="font-mono text-xs text-muted-foreground mb-1">{s.label}</div>
                    <div
                      className="font-mono font-bold"
                      style={{ color: s.color === "gold" ? "oklch(0.72 0.18 70)" : "oklch(0.72 0.18 200)" }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* HFLS-4 */}
          <FadeIn delay={0.4}>
            <div className="data-card p-8 h-full">
              <div className="font-mono text-xs mb-2" style={{ color: "oklch(0.72 0.18 70)" }}>HFLS-4</div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Advanced Materials
              </h3>
              <p className="mb-6" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.8 }}>
                Fourth-generation design with novel neutron-resistant materials and advanced shielding geometries.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Reactor Lifetime", value: "60+ Years", color: "gold" },
                  { label: "Decom. Cost ↓", value: "73%", color: "cyan" },
                  { label: "Neutron Mitigation", value: "Advanced", color: "gold" },
                  { label: "Year", value: "2026", color: "cyan" },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded" style={{ background: "oklch(0.16 0.03 260)" }}>
                    <div className="font-mono text-xs text-muted-foreground mb-1">{s.label}</div>
                    <div
                      className="font-mono font-bold"
                      style={{ color: s.color === "gold" ? "oklch(0.72 0.18 70)" : "oklch(0.72 0.18 200)" }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Papers Section ───────────────────────────────────────────────────────────

function PapersSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = ["All", "Foundational", "QFT", "Relativity", "Cosmology", "Engineering", "Advanced"];
  const filtered = activeFilter === "All" ? papers : papers.filter(p => p.category === activeFilter);

  const colorMap: Record<string, string> = {
    cyan: "oklch(0.72 0.18 200)",
    gold: "oklch(0.72 0.18 70)",
    violet: "oklch(0.65 0.22 295)",
  };

  return (
    <section id="papers" className="py-24">
      <div className="container">
        <FadeIn>
          <SectionLabel color="violet">Research Papers</SectionLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Complete<br />
            <span style={{ color: "oklch(0.65 0.22 295)" }}>Body of Work</span>
          </h2>
          <p className="text-lg max-w-2xl mb-8" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif" }}>
            Six major research documents spanning 853 pages, covering the full RDU framework from foundational axioms to experimental hardware design.
          </p>
        </FadeIn>

        {/* Filter */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="px-4 py-2 rounded font-mono text-xs uppercase tracking-wider transition-all duration-200"
                style={{
                  background: activeFilter === cat ? "oklch(0.65 0.22 295)" : "oklch(0.16 0.03 260)",
                  color: activeFilter === cat ? "oklch(0.97 0.01 80)" : "oklch(0.65 0.01 80)",
                  border: "1px solid",
                  borderColor: activeFilter === cat ? "oklch(0.65 0.22 295)" : "oklch(1 0 0 / 10%)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((paper, i) => (
            <FadeIn key={paper.id} delay={i * 0.1}>
              <div
                className="data-card p-6 h-full group transition-all duration-300 hover:border-opacity-60"
                style={{ borderLeftWidth: 3, borderLeftColor: colorMap[paper.color] }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span
                      className="inline-block font-mono text-xs px-2 py-1 rounded mb-2"
                      style={{
                        color: colorMap[paper.color],
                        background: `${colorMap[paper.color]}15`,
                      }}
                    >
                      {paper.category}
                    </span>
                    <div className="font-mono text-xs text-muted-foreground">{paper.date}</div>
                  </div>
                  <div
                    className="font-mono text-2xl font-bold flex-shrink-0"
                    style={{ color: `${colorMap[paper.color]}40` }}
                  >
                    {String(paper.id).padStart(2, "0")}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {paper.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: "oklch(0.60 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.7 }}>
                  {paper.abstract}
                </p>
                {paper.doi && (
                  <a
                    href={paper.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs transition-all duration-200 hover:opacity-80"
                    style={{ color: colorMap[paper.color] }}
                  >
                    <span>↗</span>
                    <span>View on Zenodo</span>
                  </a>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden" style={{ background: "oklch(0.12 0.02 260)" }}>
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <SectionLabel color="cyan">The Researcher</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Joshua Knoechelman
            </h2>
            <p className="text-lg mb-8" style={{ color: "oklch(0.65 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.9 }}>
              Independent researcher and Principal Investigator of the Resonant Dark Universe project. Working outside institutional frameworks, Joshua has developed a comprehensive unified theory spanning particle physics, cosmology, and engineering applications — all from first principles.
            </p>
            <p className="text-base mb-12" style={{ color: "oklch(0.55 0.01 80)", fontFamily: "'Lora', serif", lineHeight: 1.9 }}>
              The RDU represents a rare attempt to construct a complete, self-consistent, and falsifiable framework that addresses the deepest open questions in physics: the nature of dark matter and dark energy, the origin of particle masses, the incompatibility of General Relativity and quantum mechanics, and the physical meaning of time.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://doi.org/10.5281/zenodo.16734448"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded font-mono text-sm tracking-wider uppercase transition-all duration-300"
                style={{
                  background: "oklch(0.72 0.18 200)",
                  color: "oklch(0.09 0.02 260)",
                  boxShadow: "0 0 20px oklch(0.72 0.18 200 / 30%)",
                }}
              >
                Zenodo Repository
              </a>
              <a
                href="mailto:J.Knoechelman@chronoworx.com"
                className="px-6 py-3 rounded font-mono text-sm tracking-wider uppercase border transition-all duration-300 hover:border-cyan-400/60"
                style={{ borderColor: "oklch(0.72 0.18 200 / 30%)", color: "oklch(0.72 0.18 200)" }}
              >
                Contact
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#philosophy", label: "Philosophy" },
    { href: "#particles", label: "Particles" },
    { href: "#cosmology", label: "Cosmology" },
    { href: "#engineering", label: "Engineering" },
    { href: "#papers", label: "Papers" },
    { href: "#about", label: "About" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "oklch(0.09 0.02 260 / 95%)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid oklch(1 0 0 / 8%)" : "none",
      }}
    >
      <div className="container py-4 flex items-center justify-between">
        <a href="#" className="font-mono text-sm tracking-widest" style={{ color: "oklch(0.72 0.18 200)" }}>
          RDU
        </a>
        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs tracking-wider uppercase transition-all duration-200 hover:text-cyan-400"
              style={{ color: "oklch(0.65 0.01 80)" }}
            >
              {l.label}
            </a>
          ))}
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden font-mono text-xs"
          style={{ color: "oklch(0.72 0.18 200)" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden" style={{ background: "oklch(0.09 0.02 260 / 98%)", borderTop: "1px solid oklch(1 0 0 / 8%)" }}>
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="block px-6 py-3 font-mono text-xs tracking-wider uppercase"
              style={{ color: "oklch(0.65 0.01 80)", borderBottom: "1px solid oklch(1 0 0 / 5%)" }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 border-t" style={{ borderColor: "oklch(1 0 0 / 8%)" }}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-mono text-sm mb-1" style={{ color: "oklch(0.72 0.18 200)" }}>
              The Resonant Dark Universe
            </div>
            <div className="font-mono text-xs" style={{ color: "oklch(0.45 0.01 80)" }}>
              © 2025–2026 Joshua Knoechelman · Independent Research
            </div>
          </div>
          <div className="flex gap-6">
            <a
              href="https://doi.org/10.5281/zenodo.16734448"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs transition-all duration-200 hover:opacity-80"
              style={{ color: "oklch(0.55 0.01 80)" }}
            >
              Zenodo DOI
            </a>
            <a
              href="mailto:J.Knoechelman@chronoworx.com"
              className="font-mono text-xs transition-all duration-200 hover:opacity-80"
              style={{ color: "oklch(0.55 0.01 80)" }}
            >
              J.Knoechelman@chronoworx.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.09 0.02 260)" }}>
      <Navigation />
      <HeroSection />
      <SectionDivider />
      <PhilosophySection />
      <SectionDivider />
      <ParticleSection />
      <SectionDivider />
      <CosmologySection />
      <SectionDivider />
      <EngineeringSection />
      <SectionDivider />
      <PapersSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
