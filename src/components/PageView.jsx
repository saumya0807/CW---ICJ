import { resolvePage } from '../nav.js';
import MediaViewer from './MediaViewer.jsx';

// The main panel: page title, body text, a row of CTA buttons, and the media.
// A CTA whose target isn't in the sheet yet renders disabled ("coming soon").
// Hub pages (a State's menu of its Event Names) skip the media area entirely
// rather than showing an empty placeholder — they never have media.
export default function PageView({ page, pages, onCta }) {
  return (
    <article className="page">
      <h1 className="page__title">{page.title}</h1>
      {page.details && <p className="page__details">{page.details}</p>}

      {!page.isHub && <MediaViewer key={page.id} images={page.media} />}

      <div className="page__ctas">
        {page.ctas.map((cta, idx) => {
          const target = resolvePage(pages, cta.ref);
          const label = cta.copy || (target ? target.title : cta.ref);
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
    </article>
  );
}
