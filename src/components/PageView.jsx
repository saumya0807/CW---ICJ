import { resolvePage } from '../nav.js';
import MediaViewer from './MediaViewer.jsx';

// The main panel: page title, body text, a row of CTA buttons, and the media.
// A CTA whose target isn't in the sheet yet renders disabled ("coming soon").
export default function PageView({ page, pages, onCta }) {
  return (
    <article className="page">
      <h1 className="page__title">{page.eventName}</h1>
      {page.details && <p className="page__details">{page.details}</p>}

      <div className="page__ctas">
        {page.ctas.map((cta, idx) => {
          const target = resolvePage(pages, cta.ref);
          const label = cta.copy || (target ? target.eventName : cta.ref);
          return target ? (
            <button
              key={idx}
              type="button"
              className="cta"
              onClick={() => onCta(target.id)}
            >
              {label}
            </button>
          ) : (
            <button
              key={idx}
              type="button"
              className="cta cta--pending"
              disabled
              title={`"${cta.ref}" isn't in the sheet yet`}
            >
              {label} · coming soon
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
