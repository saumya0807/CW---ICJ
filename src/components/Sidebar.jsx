import { useState } from 'react';

// Left nav, three tiers: State > Event Name > Event Sub Section.
// - State / Event Name: click the name to jump (State -> its menu page,
//   Event Name -> its first Sub Section); the +/- toggle only expands.
// - Event Sub Section: the leaf, click to go there directly.
// An Event Name with a single Sub Section has nothing to expand, so it
// renders with no toggle and no nested list — clicking it goes straight in.
// The path to whatever page is current auto-expands; only one branch is
// open per tier at a time (an accordion), and toggling one doesn't disturb
// where the user is unless they navigate.
export default function Sidebar({
  states,
  currentId,
  currentSection,
  currentEventName,
  onJump,
  open: drawerOpen = false,
  onCollapse,
}) {
  const [openState, setOpenState] = useState(currentSection);
  const [openEventName, setOpenEventName] = useState(currentEventName);

  // Adjusting state during render (rather than in an effect) avoids a
  // wasted paint. Only re-syncs when the user actually navigates — a plain
  // +/- toggle click doesn't touch currentId, so it's left alone.
  const [seenId, setSeenId] = useState(currentId);
  if (currentId !== seenId) {
    setSeenId(currentId);
    setOpenState(currentSection);
    setOpenEventName(currentEventName);
  }

  return (
    <nav className={'sidebar' + (drawerOpen ? ' is-open' : '')}>
      <div className="sidebar__head">
        <div>
          <p className="sidebar__brand">Cambridge Wealth</p>
          <p className="sidebar__title">Ideal Customer Journey</p>
        </div>
        <button
          type="button"
          className="sidebar__collapse"
          aria-label="Collapse navigation"
          title="Collapse navigation"
          onClick={onCollapse}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 6 9 12 15 18" />
          </svg>
        </button>
      </div>

      <ul className="sidebar__list">
        {states.map((state) => {
          const isStateOpen = openState === state.title;
          return (
            <li
              key={state.title}
              className={'navgroup' + (isStateOpen ? ' is-open' : '')}
            >
              <div
                className={
                  'navgroup__head' +
                  (state.title === currentSection ? ' is-current' : '')
                }
              >
                <button
                  type="button"
                  className="navgroup__name"
                  onClick={() => onJump(state.entryId)}
                >
                  {state.title}
                </button>
                <button
                  type="button"
                  className="navgroup__toggle"
                  aria-label={isStateOpen ? 'Collapse state' : 'Expand state'}
                  aria-expanded={isStateOpen}
                  onClick={() => setOpenState(isStateOpen ? null : state.title)}
                >
                  {isStateOpen ? '–' : '+'}
                </button>
              </div>

              {isStateOpen && (
                <ul className="navgroup__pages">
                  {state.eventNames.map((evt) => {
                    const isLeaf = evt.subSections.length <= 1;
                    const isEvtOpen = !isLeaf && openEventName === evt.name;
                    return (
                      <li key={evt.name}>
                        <div
                          className={
                            'eventgroup__head' +
                            (evt.name === currentEventName ? ' is-current' : '')
                          }
                        >
                          <button
                            type="button"
                            className={
                              'eventgroup__name' +
                              (isLeaf && evt.entryId === currentId
                                ? ' is-active'
                                : '')
                            }
                            onClick={() => onJump(evt.entryId)}
                          >
                            {evt.name}
                          </button>
                          {!isLeaf && (
                            <button
                              type="button"
                              className="eventgroup__toggle"
                              aria-label={
                                isEvtOpen ? 'Collapse event' : 'Expand event'
                              }
                              aria-expanded={isEvtOpen}
                              onClick={() =>
                                setOpenEventName(isEvtOpen ? null : evt.name)
                              }
                            >
                              {isEvtOpen ? '–' : '+'}
                            </button>
                          )}
                        </div>

                        {isEvtOpen && (
                          <ul className="eventgroup__subs">
                            {evt.subSections.map((page) => (
                              <li key={page.id}>
                                <button
                                  type="button"
                                  className={
                                    'eventgroup__sub' +
                                    (page.id === currentId ? ' is-active' : '')
                                  }
                                  onClick={() => onJump(page.id)}
                                >
                                  {page.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
