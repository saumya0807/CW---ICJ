import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultPageId, resolvePage } from './nav.js';

// Journey state: which page is showing, and the visited path that led there.
// Kept in sync with the address bar (?page=<id>) and browser history so a screen
// is bookmarkable and Back / Forward work naturally.
//
// - jumpTo(id):  teleport into a flow (nav click) -> trail resets to [id]
// - go(id):      follow a CTA                     -> id appended to the trail
// - truncateTo(i): click a breadcrumb crumb       -> trail trimmed to that point
// - startOver():  back to the default entry page  -> fresh trail

// pushState / replaceState throw in some restricted contexts (notably a
// standalone file:// page). Fall back to just updating the query string so the
// app keeps working; Back/Forward degrade but navigation still functions.
function syncUrl(method, next) {
  const url = `?page=${encodeURIComponent(next.page)}`;
  try {
    window.history[method](next, '', url);
  } catch {
    try {
      window.history[method](next, '');
    } catch {
      /* give up on history sync */
    }
  }
}

function readInitial(pages, validIds, fallback) {
  const hs = window.history.state;
  if (hs && hs.page && validIds.has(hs.page) && Array.isArray(hs.trail)) {
    return { page: hs.page, trail: hs.trail };
  }
  const requested = new URLSearchParams(window.location.search).get('page');
  const match = requested ? resolvePage(pages, requested) : null;
  const start = match ? match.id : fallback;
  return { page: start, trail: [start] };
}

export function useJourney(pages) {
  const validIds = useMemo(() => new Set(pages.map((p) => p.id)), [pages]);
  const fallback = useMemo(() => defaultPageId(pages), [pages]);

  const [state, setState] = useState(() =>
    readInitial(pages, validIds, fallback),
  );

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const push = useCallback((next) => {
    syncUrl('pushState', next);
    setState(next);
  }, []);

  // Normalise the address bar on first mount without adding a history entry.
  useEffect(() => {
    syncUrl('replaceState', stateRef.current);
  }, []);

  // Back / Forward.
  useEffect(() => {
    const onPop = (e) => {
      if (e.state && e.state.page && validIds.has(e.state.page)) {
        setState({ page: e.state.page, trail: e.state.trail || [e.state.page] });
      } else {
        setState(readInitial(pages, validIds, fallback));
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [pages, validIds, fallback]);

  const go = useCallback(
    (id) => push({ page: id, trail: [...stateRef.current.trail, id] }),
    [push],
  );

  const jumpTo = useCallback((id) => push({ page: id, trail: [id] }), [push]);

  const truncateTo = useCallback(
    (index) => {
      const trail = stateRef.current.trail.slice(0, index + 1);
      push({ page: trail[trail.length - 1], trail });
    },
    [push],
  );

  const startOver = useCallback(() => jumpTo(fallback), [jumpTo, fallback]);

  return {
    currentId: state.page,
    trail: state.trail,
    go,
    jumpTo,
    truncateTo,
    startOver,
  };
}
