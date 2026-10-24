import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpDown, CarFront, Check, ChevronRight, CircleDot, Compass, Globe2, HeartHandshake, Home, Leaf, MapPin, Navigation, Plus, Search, ShieldCheck, UserRound, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cities, cityLabels, copy, type Locale } from "@/lib/carpool-content";
import road from "@/assets/carpool-road.jpg";
import skopje from "@/assets/skopje.jpg";
import bitola from "@/assets/bitola.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Carpool — Go together across North Macedonia" },
    { name: "description", content: "Find your next shared journey across North Macedonia. Meet good people, share the cost and enjoy the road with Carpool." },
    { property: "og:title", content: "Carpool — Go together" },
    { property: "og:description", content: "A little company. A better journey. Shared rides across North Macedonia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const [locale, setLocale] = useState<Locale>("en");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("1");
  const [minDate, setMinDate] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"find" | "offer">("find");
  const [dialog, setDialog] = useState<"account" | "search" | "offer" | "about" | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const t = copy[locale];
  const city = (name: string) => locale === "mk" ? cityLabels[name] || name : name;

  useEffect(() => {
    const now = new Date();
    setMinDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
    document.documentElement.lang = locale;
  }, [locale]);

  function goToSearch(nextMode: "find" | "offer" = "find") {
    setMode(nextMode);
    setDialog(null);
    searchRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (from === to) { setError(t.sameCity); return; }
    setError("");
    setDialog(mode === "find" ? "search" : "offer");
  }
  function chooseRoute(origin: string, destination: string) {
    setFrom(origin); setTo(destination); setError(""); goToSearch();
    window.setTimeout(() => document.getElementById("departure-date")?.focus({ preventScroll: true }), 350);
  }

  const destinations = [
    { from: "Skopje", to: "Ohrid", image: road, subtitle: t.ohrid, tag: t.duration1 },
    { from: "Kumanovo", to: "Skopje", image: skopje, subtitle: t.skopje, tag: t.duration2 },
    { from: "Skopje", to: "Bitola", image: bitola, subtitle: t.bitola, tag: t.duration3 },
  ];

  return (
    <div className="carpool-app">
      <a className="skip-link" href="#ride-search">{t.skip}</a>
      <header className="site-header">
        <a href="/" className="brand" aria-label="Carpool home"><span className="brand-icon"><CarFront size={23} strokeWidth={2.3} /></span><span>carpool<span className="brand-dot">.</span></span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Button variant="ghost" onClick={() => goToSearch()} className="nav-active">{t.find}</Button>
          <Button variant="ghost" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>{t.how}</Button>
        </nav>
        <div className="header-actions">
          <label className="language-control"><Globe2 size={16} /><select value={locale} onChange={e => setLocale(e.target.value as Locale)} aria-label={t.language}><option value="en">EN</option><option value="mk">МК</option></select></label>
          <Button variant="ghost" className="login-button" onClick={() => setDialog("account")}>{t.login}</Button>
          <Button className="header-offer" onClick={() => goToSearch("offer")}><Plus size={17} />{t.offer}</Button>
          <Button variant="ghost" size="icon" className="mobile-account" aria-label={t.account} onClick={() => setDialog("account")}><UserRound /></Button>
        </div>
      </header>

      <main>
        <section className="journey-hero">
          <img src={road} alt="A car following the scenic road above Lake Ohrid" className="hero-image" width={1920} height={1024} fetchPriority="high" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="hero-eyebrow"><span />{t.eyebrow}</p>
            <h1>{t.headline}<br /><span>{t.headline2}</span></h1>
            <p className="hero-intro">{t.intro}</p>
            <a href="#ride-search" className="hero-link">{t.anywhere}<ArrowDown size={17} /></a>
          </div>
          <span className="hero-location"><MapPin size={14} />{t.location}</span>
          <div className="journey-note"><Navigation size={18} /><span>Skopje <span className="note-dash">—</span> Ohrid</span><span className="note-line" /></div>
        </section>

        <div className="search-area" id="ride-search" ref={searchRef}>
          <div className="search-tool">
            <div className="search-tabs" role="tablist" aria-label={t.searchLabel}>
              <Button role="tab" aria-selected={mode === "find"} variant="ghost" className={mode === "find" ? "search-tab active" : "search-tab"} onClick={() => { setMode("find"); setError(""); }}><Search size={17} />{t.find}</Button>
              <Button role="tab" aria-selected={mode === "offer"} variant="ghost" className={mode === "offer" ? "search-tab active" : "search-tab"} onClick={() => { setMode("offer"); setError(""); }}><CarFront size={18} />{t.offer}</Button>
            </div>
            <form onSubmit={submit} className="ride-form">
              <div className="city-fields">
                <label className="search-field"><CircleDot size={19} className="field-icon origin-icon" /><span><span className="field-label">{t.from}</span><select required aria-label={t.from} value={from} onChange={e => { setFrom(e.target.value); setError(""); }}><option value="">{t.chooseCity}</option>{cities.map(c => <option key={c} value={c}>{city(c)}</option>)}</select></span></label>
                <Button type="button" variant="outline" size="icon" className="swap-button" aria-label={t.swap} title={t.swap} onClick={() => { setFrom(to); setTo(from); setError(""); }}><ArrowUpDown size={17} /></Button>
                <label className="search-field"><MapPin size={20} className="field-icon" /><span><span className="field-label">{t.to}</span><select required aria-label={t.to} value={to} onChange={e => { setTo(e.target.value); setError(""); }}><option value="">{t.chooseCity}</option>{cities.map(c => <option key={c} value={c}>{city(c)}</option>)}</select></span></label>
              </div>
              <div className="date-seats">
                <label className="search-field date-field"><span className="calendar-icon" aria-hidden="true">▦</span><span><span className="field-label">{t.date}</span><input id="departure-date" aria-label={t.date} type="date" required min={minDate} value={date} onChange={e => setDate(e.target.value)} /></span></label>
                <label className="search-field seats-field"><Users size={19} className="field-icon" /><span><span className="field-label">{t.passengers}</span><select aria-label={t.passengers} value={seats} onChange={e => setSeats(e.target.value)}>{[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option value={n} key={n}>{n} {n === 1 ? t.passenger : t.passengers.toLowerCase()}</option>)}</select></span></label>
              </div>
              <Button className="search-submit" type="submit"><Search size={19} />{mode === "find" ? t.search : t.review}<ArrowRight size={18} /></Button>
            </form>
            {error && <p className="form-error" role="alert">{error}</p>}
          </div>
        </div>

        <div className="trust-strip"><span><Wallet size={17} />{t.trust1}</span><span><ShieldCheck size={18} />{t.trust2}</span><span><HeartHandshake size={18} />{t.trust3}</span></div>

        <section className="destinations content-width" aria-labelledby="explore-heading">
          <div className="section-heading"><div><p className="section-eyebrow">{t.popular}</p><h2 id="explore-heading">{t.explore}</h2><p className="section-subtitle">{t.exploreSub}</p></div><Button variant="ghost" className="explore-button" onClick={() => goToSearch()}>{t.routes}<ArrowRight size={17} /></Button></div>
          <div className="destination-grid">
            {destinations.map((route, i) => <article className="destination-card" key={route.to}>
              <Button variant="ghost" className="destination-image-button" onClick={() => chooseRoute(route.from, route.to)} aria-label={`${t.routeAction}: ${city(route.from)} — ${city(route.to)}`}><img src={route.image} alt={`${city(route.to)}, North Macedonia`} width={1024} height={768} loading="lazy" className={i === 0 ? "ohrid-image" : ""} /><span className="destination-tag">{route.tag}</span><span className="destination-arrow"><ArrowRight size={19} /></span></Button>
              <div className="destination-info"><h3>{city(route.from)}<ArrowRight size={16} />{city(route.to)}</h3><p>{route.subtitle}</p></div>
            </article>)}
          </div>
        </section>

        <section className="how-section" id="how-it-works"><div className="content-width"><div className="section-heading"><div><p className="section-eyebrow">CARPOOL, SIMPLY.</p><h2>{t.stepsTitle}</h2><p className="section-subtitle">{t.stepsSub}</p></div><span className="how-mark"><HeartHandshake size={34} /></span></div><div className="steps-grid">{[{ icon: Search, title: t.step1, text: t.step1Text }, { icon: Check, title: t.step2, text: t.step2Text }, { icon: CarFront, title: t.step3, text: t.step3Text }].map((step, i) => <div className="step" key={i}><div className="step-top"><span className="step-icon"><step.icon size={23} /></span><span className="step-number">0{i + 1}</span></div><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></div></section>
        <section className="driver-section content-width"><div className="driver-icon"><CarFront size={36} /><Leaf size={20} /></div><div><h2>{t.driverTitle}</h2><p>{t.driverText}</p></div><Button onClick={() => goToSearch("offer")}><Plus size={18} />{t.offer}<ArrowRight size={18} /></Button></section>
      </main>

      <footer className="site-footer content-width"><div><a href="/" className="brand footer-brand"><CarFront size={24} /><span>carpool.</span></a><p>{t.footer}</p></div><div className="footer-right"><span><MapPin size={14} />{t.country}</span><Button variant="link" onClick={() => setDialog("about")}>{t.help}<ChevronRight size={14} /></Button></div></footer>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation"><Button variant="ghost" className="bottom-active" onClick={() => { setDialog(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Home size={20} /><span>{t.home}</span></Button><Button variant="ghost" onClick={() => goToSearch()}><Search size={20} /><span>{t.find}</span></Button><Button variant="ghost" onClick={() => goToSearch("offer")}><Plus size={21} /><span>{t.offer}</span></Button><Button variant="ghost" onClick={() => setDialog("account")}><UserRound size={20} /><span>{t.account}</span></Button></nav>

      <Dialog open={dialog !== null} onOpenChange={open => { if (!open) setDialog(null); }}><DialogContent className="carpool-dialog"><DialogHeader><span className="dialog-icon">{dialog === "account" ? <UserRound /> : dialog === "about" ? <HeartHandshake /> : <Compass />}</span><DialogTitle>{dialog === "account" ? t.accountTitle : dialog === "about" ? t.help : dialog === "offer" ? t.draft : t.results}</DialogTitle><DialogDescription>{dialog === "account" ? t.accountText : dialog === "about" ? t.aboutText : dialog === "offer" ? t.draftText : t.emptyText}</DialogDescription></DialogHeader>{(dialog === "search" || dialog === "offer") && <div className="journey-summary"><strong>{city(from)}<ArrowRight size={18} />{city(to)}</strong><span>{date ? new Intl.DateTimeFormat(locale === "mk" ? "mk-MK" : "en-GB", { dateStyle: "medium" }).format(new Date(`${date}T12:00:00`)) : ""} · {seats} {Number(seats) === 1 ? t.passenger : t.passengers.toLowerCase()}</span><small>{t.preview}</small></div>}<Button onClick={() => dialog === "search" || dialog === "offer" ? goToSearch(mode) : setDialog(null)}>{dialog === "search" || dialog === "offer" ? t.edit : t.close}<ArrowRight size={16} /></Button></DialogContent></Dialog>
    </div>
  );
}
