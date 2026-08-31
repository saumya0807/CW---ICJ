import { useEffect, useMemo, useState } from 'react';
import { getPages } from './data.js';
import { buildNav, getPage } from './nav.js';
import { useJourney } from './useJourney.js';
import Sidebar from './components/Sidebar.jsx';
import Breadcrumb from './components/Breadcrumb.jsx';
import PageView from './components/PageView.jsx';
import './App.css';

export default function App() {
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

  const page =
    getPage(pages, currentId) || getPage(pages, trail[0]) || pages[0];

  return (
    <div className="app">
      <Sidebar
        nav={nav}
        currentId={page.id}
        currentSection={page.metaSection}
        onJump={jumpTo}
      />
      <main className="main">
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
