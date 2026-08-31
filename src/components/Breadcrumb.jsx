// The visited path that led here, shown as the ancestors of the current page
// (the page itself is already the heading, so it isn't repeated as a crumb).
// Each crumb trims the trail back to that point. Hidden on an entry page.
export default function Breadcrumb({ trail, pages, onCrumb }) {
  const ancestors = trail.slice(0, -1);
  if (ancestors.length === 0) return null;

  const nameOf = (id) => {
    const page = pages.find((p) => p.id === id);
    return page ? page.eventName : id;
  };

  return (
    <nav className="crumbs" aria-label="Path so far">
      {ancestors.map((id, i) => (
        <span key={i} className="crumbs__item">
          {i > 0 && (
            <span className="crumbs__sep" aria-hidden="true">
              ›
            </span>
          )}
          <button
            type="button"
            className="crumbs__link"
            onClick={() => onCrumb(i)}
          >
            {nameOf(id)}
          </button>
        </span>
      ))}
      <span className="crumbs__sep" aria-hidden="true">
        ›
      </span>
    </nav>
  );
}
