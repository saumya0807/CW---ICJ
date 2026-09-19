// Pure helpers over the flat page list that getPages() returns.

// Turns the sheet's flat rows into a 3-tier nav tree — State (Meta Section) >
// Event Name > Event Sub Section — and, for each State, a synthetic "menu"
// page (not a sheet row) whose CTAs are that State's Event Names, so a State
// has somewhere real to land when it's clicked.
//
// Returns { states, pages }:
//   - states: [{ id, title, statement, entryId, eventNames: [{ name, entryId, subSections }] }]
//       id / entryId on a state are the same value: its own hub page id.
//       statement is the State's intro line, from the first row of its
//       rows that has a non-empty "State Statement" cell (blank if none do).
//       eventNames[].entryId is the id of its first Sub Section.
//   - pages: the sheet rows PLUS one synthetic hub page per state, appended
//       at the end. Everything downstream (routing, CTA resolution, the
//       breadcrumb) should use this array, not the raw getPages() result —
//       a hub page needs to be a normal, addressable page everywhere else.
export function buildNav(pages) {
  const states = [];
  const byState = new Map();

  pages.forEach((page) => {
    let state = byState.get(page.metaSection);
    if (!state) {
      state = {
        title: page.metaSection,
        statement: '',
        eventNames: [],
        byEventName: new Map(),
      };
      byState.set(page.metaSection, state);
      states.push(state);
    }
    // Filled on whichever row happens to carry it — a State has no row of
    // its own, so the statement rides along on any of its member rows.
    if (!state.statement && page.stateStatement) {
      state.statement = page.stateStatement;
    }
    let evt = state.byEventName.get(page.eventName);
    if (!evt) {
      evt = { name: page.eventName, subSections: [] };
      state.byEventName.set(page.eventName, evt);
      state.eventNames.push(evt);
    }
    evt.subSections.push(page);
  });

  const hubPages = states.map((state, index) => {
    const id = `state:${index}-${slugify(state.title)}`;
    state.id = id;
    state.entryId = id;
    delete state.byEventName;

    state.eventNames.forEach((evt) => {
      evt.entryId = evt.subSections[0].id;
    });

    return {
      id,
      metaSection: state.title,
      eventName: '',
      eventSubSection: '',
      title: state.title,
      entryPoint: false,
      details: state.statement,
      media: [],
      isHub: true,
      // Each button is one Event Name; clicking it jumps to that name's
      // first Sub Section (there is no separate Event Name page).
      ctas: state.eventNames.map((evt) => ({ copy: evt.name, ref: evt.entryId })),
    };
  });

  return { states, pages: [...pages, ...hubPages] };
}

function slugify(s) {
  return (
    String(s)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'state'
  );
}

// The page shown on first load when the URL names no (valid) page: the first
// State's menu page.
export function defaultPageId(states) {
  return states[0].id;
}

export function getPage(pages, id) {
  return pages.find((p) => p.id === id) || null;
}

// Resolve a CTA / nav reference to a page: by row ID first, then by Event
// Sub Section text, then by Event Name (for rows with no sub-section split).
// Match is case-insensitive and trims surrounding whitespace. Returns null
// if nothing matches (the CTA then renders as "coming soon").
export function resolvePage(pages, ref) {
  if (ref == null) return null;
  const needle = String(ref).trim().toLowerCase();
  if (!needle) return null;
  return (
    pages.find((p) => p.id.toLowerCase() === needle) ||
    pages.find((p) => p.eventSubSection && p.eventSubSection.toLowerCase() === needle) ||
    pages.find((p) => p.eventName.toLowerCase() === needle) ||
    null
  );
}
