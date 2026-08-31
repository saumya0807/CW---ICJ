import { useEffect, useState } from 'react';
import { getPages } from './data.js';
import './App.css';

// Scaffold pass: this screen only proves the data pipeline reaches the published
// sheet. The walkthrough itself (left nav, entry-page render, CTA navigation,
// media cycling, breadcrumb, ?page= URL state) is not built yet.
export default function App() {
  const [status, setStatus] = useState({ state: 'loading' });

  useEffect(() => {
    getPages()
      .then((pages) => setStatus({ state: 'ok', pages }))
      .catch((err) => setStatus({ state: 'error', message: err.message }));
  }, []);

  return (
    <main className="shell">
      <div className="card">
        <p className="eyebrow">Cambridge Wealth</p>
        <h1>ICJ Interactive Walkthrough</h1>
        <p className="lede">
          Scaffold in place. This screen only verifies that the app can reach the
          published Google Sheet and parse it &mdash; the interactive walkthrough
          is the next build pass.
        </p>

        <div className={`probe probe--${status.state}`}>
          {status.state === 'loading' && 'Contacting the published Google Sheet…'}
          {status.state === 'ok' && (
            <>
              Connected. <strong>{status.pages.length}</strong> pages loaded across{' '}
              <strong>
                {new Set(status.pages.map((p) => p.metaSection)).size}
              </strong>{' '}
              Meta Sections (
              {[...new Set(status.pages.map((p) => p.metaSection))].join(', ')}).
            </>
          )}
          {status.state === 'error' && `Data pipeline error: ${status.message}`}
        </div>
      </div>
    </main>
  );
}
