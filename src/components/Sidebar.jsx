import { useState } from 'react';

// Left nav. One collapsible group per Meta Section (order from the sheet).
// Clicking a section name teleports to its entry page; the +/- toggle just
// opens/closes the group. The active page's group auto-opens.
export default function Sidebar({
  nav,
  currentId,
  currentSection,
  onJump,
  open: drawerOpen = false,
}) {
  const [open, setOpen] = useState(currentSection);

  // When navigation lands in a different section, open that one. Adjusting
  // state during render (rather than in an effect) avoids a wasted paint.
  const [seenSection, setSeenSection] = useState(currentSection);
  if (currentSection !== seenSection) {
    setSeenSection(currentSection);
    setOpen(currentSection);
  }

  return (
    <nav className={'sidebar' + (drawerOpen ? ' is-open' : '')}>
      <p className="sidebar__brand">Cambridge Wealth</p>
      <p className="sidebar__title">Ideal Customer Journey</p>

      <ul className="sidebar__list">
        {nav.map((group) => {
          const isOpen = open === group.section;
          return (
            <li
              key={group.section}
              className={'navgroup' + (isOpen ? ' is-open' : '')}
            >
              <div
                className={
                  'navgroup__head' +
                  (group.section === currentSection ? ' is-current' : '')
                }
              >
                <button
                  type="button"
                  className="navgroup__name"
                  onClick={() => onJump(group.entryId)}
                >
                  {group.section}
                </button>
                <button
                  type="button"
                  className="navgroup__toggle"
                  aria-label={isOpen ? 'Collapse section' : 'Expand section'}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : group.section)}
                >
                  {isOpen ? '–' : '+'}
                </button>
              </div>

              {isOpen && (
                <ul className="navgroup__pages">
                  {group.pages.map((page) => (
                    <li key={page.id}>
                      <button
                        type="button"
                        className={
                          'navgroup__page' +
                          (page.id === currentId ? ' is-active' : '')
                        }
                        onClick={() => onJump(page.id)}
                      >
                        <span>{page.eventName}</span>
                        {page.entryPoint && (
                          <span className="navgroup__entry">entry</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
