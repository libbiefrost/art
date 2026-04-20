import { useState, useEffect, useCallback } from "react";

const GOOGLE_FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=Karla:wght@300;400&display=swap');
`;

const artworks = [
  { id: 35, src: "/art/images/cornerbistro.png",                               medium: "", category: "" },
  { id: 1,  src: "/art/images/10ab6ec2-7358-4570-b0e7-99caaeabc9ec_orig.jpg", medium: "", category: "black-and-white" },
  { id: 2,  src: "/art/images/148982fb-7603-4628-a066-20e26db12c9c.jpg",       medium: "", category: "black-and-white" },
  { id: 3,  src: "/art/images/67924878-10219055726200244-3124103118837514240-n_orig.jpg", medium: "", category: "murals" },
  { id: 4,  src: "/art/images/a-libbie-x-watercolor.png",                      medium: "", category: "" },
  { id: 5,  src: "/art/images/a-maddie.jpeg",                                  medium: "", category: "water-collection" },
  { id: 6,  src: "/art/images/a-mizedmediariseup.jpg",                         medium: "", category: "" },
  { id: 7,  src: "/art/images/a-paddleboarders.jpeg",                          medium: "", category: "water-collection" },
  { id: 8,  src: "/art/images/a-summerbubbles.jpg",                            medium: "", category: "water-collection" },
  { id: 9,  src: "/art/images/ap-carosaul_orig.jpeg",                          medium: "", category: "" },
  { id: 10, src: "/art/images/ap-eyes_orig.jpeg",                              medium: "", category: "" },
  { id: 11, src: "/art/images/ap-mural.jpeg",                                  medium: "", category: "murals" },
  { id: 12, src: "/art/images/apfishii_orig.jpg",                              medium: "", category: "" },
  { id: 13, src: "/art/images/apkaty_orig.jpg",                                medium: "", category: "" },
  { id: 14, src: "/art/images/aplarsonwater.jpg",                              medium: "", category: "water-collection" },
  { id: 15, src: "/art/images/apmountains.jpg",                                medium: "", category: "" },
  { id: 16, src: "/art/images/apnyc_orig.jpeg",                                medium: "", category: "" },
  { id: 17, src: "/art/images/apselfchalk_orig.jpg",                           medium: "", category: "" },
  { id: 18, src: "/art/images/aptechpen.jpg",                                  medium: "", category: "black-and-white" },
  { id: 19, src: "/art/images/aptube_orig.jpg",                                medium: "", category: "" },
  { id: 20, src: "/art/images/butterflymom.jpg",                               medium: "", category: "" },
  { id: 21, src: "/art/images/ee790f0f-e808-4be1-97a3-d981f5055bab_orig.jpg",  medium: "", category: "black-and-white" },
  { id: 22, src: "/art/images/fb95c409-fa21-4bf6-a305-f0de18471cab_orig.jpg",  medium: "", category: "black-and-white" },
  { id: 23, src: "/art/images/fullsizeoutput-27b3-1.jpg",                      medium: "", category: "black-and-white" },
  { id: 24, src: "/art/images/fullsizeoutput-27b4_orig.jpeg",                  medium: "", category: "water-collection" },
  { id: 25, src: "/art/images/img-0925_orig.jpg",                              medium: "", category: "" },
  { id: 26, src: "/art/images/img-1386_orig.jpg",                              medium: "", category: "murals" },
  { id: 27, src: "/art/images/img-1387.jpg",                                   medium: "", category: "water-collection" },
  { id: 28, src: "/art/images/img-8123.jpg",                                   medium: "", category: "murals" },
  { id: 29, src: "/art/images/lfhorsenew.jpg",                                 medium: "", category: "" },
  { id: 30, src: "/art/images/lfleavesnew.jpg",                                medium: "", category: "water-collection" },
  { id: 31, src: "/art/images/lfmenew.jpg",                                    medium: "", category: "water-collection" },
  { id: 32, src: "/art/images/lfwavehandnew_orig.jpg",                         medium: "", category: "water-collection" },
  { id: 33, src: "/art/images/purplevail_orig.png",                            medium: "", category: "" },
  { id: 34, src: "/art/images/senior-show-collage.jpg",                        medium: "", category: "" },
];

const GAP = 24; // px — uniform spacing everywhere

export default function Portfolio() {
  const [cols, setCols]       = useState(3);
  const [lightbox, setLightbox] = useState(null);
  const [loaded, setLoaded]   = useState({});
  const [ratios, setRatios]   = useState({}); // id → h/w ratio
  const [filter, setFilter]   = useState("all");

  // close lightbox on Escape
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") setLightbox(null);
    if (e.key === "ArrowRight" && lightbox) {
      const idx = artworks.findIndex(a => a.id === lightbox.id);
      setLightbox(artworks[(idx + 1) % artworks.length]);
    }
    if (e.key === "ArrowLeft" && lightbox) {
      const idx = artworks.findIndex(a => a.id === lightbox.id);
      setLightbox(artworks[(idx - 1 + artworks.length) % artworks.length]);
    }
  }, [lightbox]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const visible = filter === "all" ? artworks : artworks.filter(a => a.category === filter);

  // distribute artworks into shortest column by accumulated aspect-ratio height
  const columns = Array.from({ length: cols }, () => []);
  const colHeights = new Array(cols).fill(0);
  visible.forEach((art) => {
    const shortest = colHeights.indexOf(Math.min(...colHeights));
    columns[shortest].push(art);
    colHeights[shortest] += ratios[art.id] ?? 1; // default 1:1 until loaded
  });

  return (
    <>
      <style>{GOOGLE_FONTS}</style>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #FFFFFF; }

        .portfolio {
          min-height: 100vh;
          background: #FFFFFF;
          color: #1C1C1A;
          font-family: 'Karla', sans-serif;
        }

        /* ── header ── */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding: 48px 40px 32px;
          border-bottom: 1px solid rgba(28,28,26,0.10);
        }
        .header-name {
          font-family: 'Cormorant', serif;
          font-weight: 300;
          font-size: clamp(2rem, 4vw, 3.2rem);
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .header-sub {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #888;
          margin-top: 6px;
          font-weight: 300;
        }

        /* ── column switcher ── */
        .col-switcher {
          display: flex;
          gap: 2px;
          align-items: center;
        }
        .col-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 7px 11px;
          font-family: 'Karla', sans-serif;
          font-size: 12px;
          letter-spacing: 0.12em;
          color: #AAA;
          transition: color 0.2s;
          border-radius: 2px;
        }
        .col-btn:hover { color: #1C1C1A; }
        .col-btn.active {
          color: #1C1C1A;
          background: rgba(28,28,26,0.07);
        }
        .col-btn svg { display: block; }

        /* ── filter bar ── */
        .filter-bar {
          display: flex;
          gap: 24px;
          padding: 20px 40px;
          border-bottom: 1px solid rgba(28,28,26,0.08);
        }
        .filter-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Karla', sans-serif;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #AAA;
          padding: 0 0 3px;
          transition: color 0.2s;
          border-bottom: 1px solid transparent;
        }
        .filter-btn:hover { color: #1C1C1A; }
        .filter-btn.active {
          color: #1C1C1A;
          border-bottom-color: #1C1C1A;
        }

        /* ── grid ── */
        .grid-wrap {
          padding: ${GAP}px;
          display: flex;
          gap: ${GAP}px;
          align-items: flex-start;
        }
        .grid-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: ${GAP}px;
        }

        /* ── tile ── */
        .tile {
          position: relative;
          cursor: pointer;
          overflow: hidden;
          background: #EAE9E5;
        }
        .tile img {
          display: block;
          width: 100%;
          height: auto;
          transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* skeleton shimmer */
        .tile-skeleton {
          width: 100%;
          background: linear-gradient(90deg, #E8E7E3 25%, #F0EFEB 50%, #E8E7E3 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── lightbox ── */
        .lb-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(14,13,12,0.92);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .lb-inner {
          position: relative;
          max-width: min(88vw, 1000px);
          max-height: 90vh;
          cursor: default;
        }
        .lb-img {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          display: block;
          animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }

        .lb-close {
          position: fixed;
          top: 24px;
          right: 28px;
          background: none;
          border: none;
          color: rgba(249,248,246,0.5);
          cursor: pointer;
          font-size: 28px;
          line-height: 1;
          transition: color 0.2s;
          font-weight: 300;
          z-index: 1001;
        }
        .lb-close:hover { color: #FFFFFF; }

        .lb-nav {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(249,248,246,0.35);
          cursor: pointer;
          font-size: 32px;
          padding: 16px;
          transition: color 0.2s;
          z-index: 1001;
          font-weight: 200;
        }
        .lb-nav:hover { color: rgba(249,248,246,0.85); }
        .lb-nav.prev { left: 12px; }
        .lb-nav.next { right: 12px; }

        /* ── footer ── */
        .footer {
          padding: 40px;
          text-align: center;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #C0BDB7;
          border-top: 1px solid rgba(28,28,26,0.08);
          margin-top: ${GAP}px;
        }
      `}</style>

      <div className="portfolio">

        {/* header */}
        <header className="header">
          <div>
            <div className="header-name">libbie frost</div>
          </div>

          {/* column switcher */}
          <div className="col-switcher">
            {[2, 3, 4].map(n => (
              <button
                key={n}
                className={`col-btn${cols === n ? " active" : ""}`}
                onClick={() => setCols(n)}
                title={`${n} columns`}
              >
                <ColIcon n={n} />
              </button>
            ))}
          </div>
        </header>

        {/* filter bar */}
        <div className="filter-bar">
          {[
            { key: "all",              label: "All" },
            { key: "black-and-white",  label: "Black & White" },
            { key: "water-collection", label: "Water Collection" },
            { key: "murals",           label: "Murals" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`filter-btn${filter === key ? " active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* masonry grid */}
        <div className="grid-wrap">
          {columns.map((col, ci) => (
            <div className="grid-col" key={ci}>
              {col.map(art => (
                <div
                  className="tile"
                  key={art.id}
                  onClick={() => setLightbox(art)}
                >
                  {!loaded[art.id] && (
                    <div
                      className="tile-skeleton"
                      style={{ paddingTop: "130%" }}
                    />
                  )}
                  <img
                    src={art.src}
                    alt=""
                    style={{ display: loaded[art.id] ? "block" : "none" }}
                    onLoad={e => {
                      const { naturalWidth, naturalHeight } = e.target;
                      if (naturalWidth) setRatios(p => ({ ...p, [art.id]: naturalHeight / naturalWidth }));
                      setLoaded(p => ({ ...p, [art.id]: true }));
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="footer"></div>
      </div>

      {/* lightbox */}
      {lightbox && (
        <div className="lb-backdrop" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)}>×</button>

          <button
            className="lb-nav prev"
            onClick={e => {
              e.stopPropagation();
              const idx = artworks.findIndex(a => a.id === lightbox.id);
              setLightbox(artworks[(idx - 1 + artworks.length) % artworks.length]);
            }}
          >‹</button>

          <div className="lb-inner" onClick={e => e.stopPropagation()}>
            <img className="lb-img" src={lightbox.src} alt="" key={lightbox.id} />
          </div>

          <button
            className="lb-nav next"
            onClick={e => {
              e.stopPropagation();
              const idx = artworks.findIndex(a => a.id === lightbox.id);
              setLightbox(artworks[(idx + 1) % artworks.length]);
            }}
          >›</button>
        </div>
      )}
    </>
  );
}

// SVG grid icons for the column switcher
function ColIcon({ n }) {
  const gap = 3;
  const totalW = 18;
  const rectW = (totalW - gap * (n - 1)) / n;
  const rects = Array.from({ length: n }, (_, i) => i * (rectW + gap));
  return (
    <svg width={totalW} height="10" viewBox={`0 0 ${totalW} 10`} fill="currentColor">
      {rects.map((x, i) => (
        <rect key={i} x={x} y={0} width={rectW} height="10" rx="0.5" />
      ))}
    </svg>
  );
}
