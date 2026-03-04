import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "#" },
  { label: "Browse", href: "#", hasDropdown: true },
  { label: "News", href: "#" },
  { label: "Store", href: "#" },
  { label: "Premium", href: "#" },
];

const BROWSE_DROPDOWN = [
  "Anime", "Manga", "Drama", "Music", "Games", "Popular This Season",
];

 function sosom() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const navRef = useRef(null);
  const searchRef = useRef(null);

  // Handle scroll for shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Responsive: calculate how many nav items to show based on width
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w >= 1200) setVisibleCount(5);
      else if (w >= 960) setVisibleCount(4);
      else if (w >= 768) setVisibleCount(2);
      else setVisibleCount(0);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setBrowseOpen(false);
        setSettingsOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const visibleItems = NAV_ITEMS.slice(0, visibleCount);
  const hiddenItems = NAV_ITEMS.slice(visibleCount);

  return (
    <>
      <nav className={`cr-nav${scrolled ? " cr-nav--scrolled" : ""}`} ref={navRef}>
        <div className="cr-nav__inner">

          {/* Logo */}
          <a href="#" className="cr-nav__logo" aria-label="Crunchyroll">
            <svg className="cr-logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="19" stroke="#F47521" strokeWidth="2" />
              <circle cx="20" cy="20" r="10" fill="#F47521" />
              <circle cx="20" cy="20" r="5" fill="#141519" />
            </svg>
            <span className="cr-logo-text">crunchyroll</span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="cr-nav__links">
            {visibleItems.map((item) =>
              item.hasDropdown ? (
                <li key={item.label} className="cr-nav__item cr-nav__item--dropdown">
                  <button
                    className={`cr-nav__link cr-nav__link--btn${browseOpen ? " active" : ""}`}
                    onClick={() => setBrowseOpen((v) => !v)}
                    aria-expanded={browseOpen}
                  >
                    {item.label}
                    <span className={`cr-chevron${browseOpen ? " open" : ""}`}>▾</span>
                  </button>
                  {browseOpen && (
                    <div className="cr-dropdown cr-dropdown--browse">
                      {BROWSE_DROPDOWN.map((cat) => (
                        <a key={cat} href="#" className="cr-dropdown__item">{cat}</a>
                      ))}
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.label} className="cr-nav__item">
                  <a href={item.href} className="cr-nav__link">{item.label}</a>
                </li>
              )
            )}
          </ul>

          {/* Right Controls */}
          <div className="cr-nav__controls">

            {/* Search */}
            <div className={`cr-search${searchOpen ? " cr-search--open" : ""}`}>
              <input
                ref={searchRef}
                className="cr-search__input"
                type="text"
                placeholder="Search anime, manga, creators…"
                aria-label="Search"
              />
              <button
                className="cr-icon-btn"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <SearchIcon />
              </button>
            </div>

            {/* Notification Bell */}
            <button className="cr-icon-btn cr-hide-mobile" aria-label="Notifications">
              <BellIcon />
              <span className="cr-badge">3</span>
            </button>

            {/* Queue */}
            <button className="cr-icon-btn cr-hide-mobile" aria-label="My Queue">
              <QueueIcon />
            </button>

            {/* Settings / More */}
            <div className="cr-settings-wrap">
              <button
                className="cr-icon-btn"
                aria-label="Settings"
                onClick={() => setSettingsOpen((v) => !v)}
              >
                <SettingsIcon />
              </button>
              {settingsOpen && (
                <div className="cr-dropdown cr-dropdown--settings">
                  {hiddenItems.length > 0 && (
                    <>
                      <div className="cr-dropdown__section-label">More</div>
                      {hiddenItems.map((item) => (
                        <a key={item.label} href={item.href} className="cr-dropdown__item">{item.label}</a>
                      ))}
                      <div className="cr-dropdown__divider" />
                    </>
                  )}
                  <div className="cr-dropdown__section-label">Account</div>
                  <a href="#" className="cr-dropdown__item">Profile</a>
                  <a href="#" className="cr-dropdown__item">Settings</a>
                  <a href="#" className="cr-dropdown__item">Switch Profile</a>
                  <div className="cr-dropdown__divider" />
                  <a href="#" className="cr-dropdown__item cr-dropdown__item--danger">Log Out</a>
                </div>
              )}
            </div>

            {/* Premium CTA */}
            <a href="#" className="cr-premium-btn cr-hide-mobile">
              <span>Try Premium</span>
            </a>

            {/* Hamburger for mobile */}
            <button
              className="cr-hamburger"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className={`cr-hamburger__bar${mobileOpen ? " open" : ""}`} />
              <span className={`cr-hamburger__bar${mobileOpen ? " open" : ""}`} />
              <span className={`cr-hamburger__bar${mobileOpen ? " open" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div className={`cr-mobile-drawer${mobileOpen ? " open" : ""}`}>
          <a href="#" className="cr-mobile-link">Home</a>
          <button
            className="cr-mobile-link cr-mobile-link--btn"
            onClick={() => setBrowseOpen((v) => !v)}
          >
            Browse <span className={`cr-chevron${browseOpen ? " open" : ""}`}>▾</span>
          </button>
          {browseOpen && (
            <div className="cr-mobile-sub">
              {BROWSE_DROPDOWN.map((cat) => (
                <a key={cat} href="#" className="cr-mobile-sublink">{cat}</a>
              ))}
            </div>
          )}
          <a href="#" className="cr-mobile-link">News</a>
          <a href="#" className="cr-mobile-link">Store</a>
          <a href="#" className="cr-mobile-link cr-mobile-link--premium">Try Premium</a>
          <div className="cr-mobile-divider" />
          <a href="#" className="cr-mobile-link">Profile</a>
          <a href="#" className="cr-mobile-link">Settings</a>
          <a href="#" className="cr-mobile-link cr-mobile-link--danger">Log Out</a>
        </div>
      </nav>

      {/* Demo page content */}
      <div className="cr-demo-page">
        <div className="cr-hero">
          <div className="cr-hero__badge">POPULAR</div>
          <h1 className="cr-hero__title">Solo Leveling</h1>
          <p className="cr-hero__sub">Season 2 • Episode 6 • Now Streaming</p>
          <div className="cr-hero__actions">
            <button className="cr-hero__play">▶ Watch Now</button>
            <button className="cr-hero__add">+ My List</button>
          </div>
        </div>
        <p className="cr-demo-hint">↑ Resize the window to see the navbar adapt — items collapse into the settings menu on smaller screens.</p>
      </div>
    </>
  );
}

// ─── Icon Components ────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function QueueIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default sosom ;