import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultPageId } from './nav.js';

// Journey state: which page is showing, and the visited path that led there.
// Kept in sync with the address bar (?page=<id>) and browser history so a screen
// is bookmarkable and Back / Forward work naturally.
//
// - jumpTo(id):  teleport into a flow (nav click) -> trail resets to [id]
// - go(id):      follow a CTA                     -> id appended to the trail
// - truncateTo(i): click a breadcrumb crumb       -> trail trimmed to that point
// - startOver():  back to the default entry page  -> fresh trail

function readInitial(validIds, fallback) {
  const hs = window.history.state;
  if (hs && hs.page && validIds.has(hs.page) && Array.isArray(hs.trail)) {
    return { page: hs.page, trail: hs.trail };
  }
  const requested = new URLSearchParams(window.location.search).get('page');
  const start = requested && validIds.has(requested) ? requested : fallback;
  return { page: start, trail: [start] };
}

export function useJourney(pages) {
  const validIds = useMemo(() => new Set(pages.map((p) => p.id)), [pages]);
  const fallback = useMemo(() => defaultPageId(pages), [pages]);

  const [state, setState] = useState(() => readInitial(validIds, fallback));

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const push = useCallback((next) => {
    window.history.pushState(next, '', `?page=${encodeURIComponent(next.page)}`);
    setState(next);
  }, []);

  // Normalise the address bar on first mount without adding a history entry.
  useEffect(() => {
    const s = stateRef.current;
    window.history.replaceState(s, '', `?page=${encodeURIComponent(s.page)}`);
  }, []);

  // Back / Forward.
  useEffect(() => {
    const onPop = (e) => {
      if (e.state && e.state.page && validIds.has(e.state.page)) {
        setState({ page: e.state.page, trail: e.state.trail || [e.state.page] });
      } else {
        setState(readInitial(validIds, fallback));
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [validIds, fallback]);

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
