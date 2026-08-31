import MediaViewer from './MediaViewer.jsx';

// The main panel: page title, body text, a row of CTA buttons, and the media.
// A CTA whose target id isn't in the sheet yet renders disabled ("coming soon").
export default function PageView({ page, pages, onCta }) {
  return (
    <article className="page">
      <h1 className="page__title">{page.eventName}</h1>
      {page.details && <p className="page__details">{page.details}</p>}

      <div className="page__ctas">
        {page.ctas.map((id, idx) => {
          const target = pages.find((p) => p.id === id);
          return target ? (
            <button
              key={idx}
              type="button"
              className="cta"
              onClick={() => onCta(id)}
            >
              {target.eventName}
            </button>
          ) : (
            <button
              key={idx}
              type="button"
              className="cta cta--pending"
              disabled
              title={`"${id}" isn't in the sheet yet`}
            >
              {id} · coming soon
            </button>
          );
        })}
        {page.ctas.length === 0 && (
          <p className="page__end">
            End of this path — pick another flow from the nav, or start over.
          </p>
        )}
      </div>

      <MediaViewer key={page.id} images={page.media} />
    </article>
  );
}
