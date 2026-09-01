import { useEffect, useMemo, useState } from 'react';
import { getPages } from './data.js';
import { ACCESS_PASSWORD } from './config.js';
import { buildNav, getPage } from './nav.js';
import { useJourney } from './useJourney.js';
import Sidebar from './components/Sidebar.jsx';
import Breadcrumb from './components/Breadcrumb.jsx';
import PageView from './components/PageView.jsx';
import './App.css';

const UNLOCK_KEY = 'icj-unlocked';

export default function App() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return localStorage.getItem(UNLOCK_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <Loader />;
}

function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (value === ACCESS_PASSWORD) {
      try {
        localStorage.setItem(UNLOCK_KEY, '1');
      } catch {
        /* private mode — unlock for this session only */
      }
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <main className="shell">
      <form className="card gate" onSubmit={submit}>
        <p className="eyebrow">Cambridge Wealth</p>
        <h1>ICJ Interactive Walkthrough</h1>
        <p className="lede">Enter the access password to continue.</p>
        <input
          type="password"
          className="gate__input"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          aria-label="Access password"
          autoFocus
        />
        {error && <p className="gate__error">Incorrect password.</p>}
        <button type="submit" className="gate__submit">
          Enter
        </button>
      </form>
    </main>
  );
}

function Loader() {
  const [load, setLoad] = useState({ state: 'loading' });

  useEffect(() => {
    let alive = true;
    getPages()
      .then((pages) => {
        if (!alive) return;
        setLoad(
          pages.length
            ? { state: 'ok', pages }
            : { state: 'error', message: 'The sheet has no rows.' },
        );
      })
      .catch((err) => alive && setLoad({ state: 'error', message: err.message }));
    return () => {
      alive = false;
    };
  }, []);

  if (load.state === 'loading') return <Splash>Loading the walkthrough…</Splash>;
  if (load.state === 'error') {
    return <Splash tone="error">Couldn’t load the walkthrough: {load.message}</Splash>;
  }
  return <Walkthrough pages={load.pages} />;
}

function Walkthrough({ pages }) {
  const nav = useMemo(() => buildNav(pages), [pages]);
  const { currentId, trail, go, jumpTo, truncateTo, startOver } = useJourney(pages);
  const [navOpen, setNavOpen] = useState(false);

  const page =
    getPage(pages, currentId) || getPage(pages, trail[0]) || pages[0];

  // Close the mobile nav drawer on Escape, and lock body scroll while it's open.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e) => e.key === 'Escape' && setNavOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  const navigateAndClose = (id) => {
    jumpTo(id);
    setNavOpen(false);
  };

  return (
    <div className="app">
      <Sidebar
        nav={nav}
        currentId={page.id}
        currentSection={page.metaSection}
        onJump={navigateAndClose}
        open={navOpen}
      />
      {navOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}
      <main className="main">
        <button
          type="button"
          className="nav-toggle"
          aria-label="Open navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button type="button" className="startover" onClick={startOver}>
          Start over
        </button>
        <Breadcrumb trail={trail} pages={pages} onCrumb={truncateTo} />
        <PageView page={page} pages={pages} onCta={go} />
      </main>
    </div>
  );
}

function Splash({ children, tone }) {
  return (
    <main className="shell">
      <div className={'card' + (tone === 'error' ? ' card--error' : '')}>
        <p className="eyebrow">Cambridge Wealth</p>
        <h1>ICJ Interactive Walkthrough</h1>
        <p className="lede">{children}</p>
      </div>
    </main>
  );
}
