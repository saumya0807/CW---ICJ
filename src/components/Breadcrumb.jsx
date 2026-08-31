// The visited path that led to the current page. Every crumb but the last is
// clickable and trims the trail back to that point.
export default function Breadcrumb({ trail, pages, onCrumb }) {
  const nameOf = (id) => {
    const page = pages.find((p) => p.id === id);
    return page ? page.eventName : id;
  };

  return (
    <nav className="crumbs" aria-label="Path so far">
      {trail.map((id, i) => {
        const last = i === trail.length - 1;
        return (
          <span key={i} className="crumbs__item">
            {i > 0 && <span className="crumbs__sep" aria-hidden="true">›</span>}
            {last ? (
              <span className="crumbs__here">{nameOf(id)}</span>
            ) : (
              <button
                type="button"
                className="crumbs__link"
                onClick={() => onCrumb(i)}
              >
                {nameOf(id)}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
