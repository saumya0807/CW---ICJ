import { useState } from 'react';
import { MEDIA_BASE } from '../config.js';

// One or more screenshots. Clicking the frame (or the side arrows) advances to
// the next image and loops back to the first after the last. Parent passes a
// key={page.id} so the index resets on every page change.
export default function MediaViewer({ images }) {
  const [i, setI] = useState(0);
  const [broken, setBroken] = useState(false);
  const n = images.length;

  if (n === 0) {
    return (
      <div className="media media--empty">
        <span>No media for this step yet</span>
      </div>
    );
  }

  const file = images[i];
  const show = (idx) => {
    setBroken(false);
    setI(((idx % n) + n) % n);
  };

  return (
    <div className="media">
      <button
        type="button"
        className="media__frame"
        onClick={() => show(i + 1)}
        aria-label="Next image"
      >
        {broken ? (
          <span className="media__fallback">
            <strong>{file}</strong>
            <span>not found in /public/media/</span>
          </span>
        ) : (
          <img
            src={MEDIA_BASE + file}
            alt={file}
            onError={() => setBroken(true)}
          />
        )}
      </button>

      {n > 1 && (
        <>
          <button
            type="button"
            className="media__arrow media__arrow--left"
            onClick={() => show(i - 1)}
            aria-label="Previous image"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            className="media__arrow media__arrow--right"
            onClick={() => show(i + 1)}
            aria-label="Next image"
          >
            <Chevron dir="right" />
          </button>
          <div className="media__count">
            {i + 1} / {n}
          </div>
        </>
      )}
    </div>
  );
}

function Chevron({ dir }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={dir === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  );
}
