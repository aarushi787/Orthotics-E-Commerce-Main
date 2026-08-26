import React, { useState, useEffect } from "react";

interface Props {
  images: Record<string, string[]> | string[];  // Accepts BOTH formats
  sku?: string;
  autoPlay?: boolean;
  delay?: number;
}

export default function ImageGallery({
  images,
  sku,
  autoPlay = true,
  delay = 4000,
}: Props) {

  /** 🔥 Convert array → firestore format automatically */
  const formattedImages: Record<string,string[]> = Array.isArray(images)
      ? { default: images }
      : images;

  const colorKeys = Object.keys(formattedImages || {});
  const [activeColor, setActiveColor] = useState(colorKeys[0]);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [play, setPlay] = useState(autoPlay);

  const imgs = (formattedImages[activeColor] || []).map((u) => {
    // Normalize URL: make absolute when needed
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/')) return u;
    return u.startsWith('images/') ? `/${u}` : `/${u}`;
  });

  const [extraImgs, setExtraImgs] = useState<string[]>([]);
  const allImgs = [...imgs, ...extraImgs].filter(Boolean);

  /* Auto Slide */
  useEffect(() => {
    if (!play || allImgs.length <= 1) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % allImgs.length), delay);
    return () => clearInterval(timer);
  }, [play, allImgs.length, delay]);

  // Probe for additional SKU-based images (e.g. SKU-2.jpg, SKU-03.jpg)
  useEffect(() => {
    let mounted = true;
    if (!sku) return;
    const existing = new Set(imgs.map(u => u.toLowerCase()));
    const candidates: string[] = [];
    const maxExtra = 8; // try up to 8 extra images
    const extensions = ['jpg','jpeg','png','webp'];
    for (let i=1;i<=maxExtra;i++){
      for (const ext of extensions){
        candidates.push(`/images/${sku}/${sku}-${i}.${ext}`);
        const pad = i<10?`0${i}`:`${i}`;
        candidates.push(`/images/${sku}/${sku}-${pad}.${ext}`);
      }
    }

    const probes: Promise<string | null>[] = candidates.map(url => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(null);
      img.src = url;
    }));

    Promise.all(probes).then(results => {
      if (!mounted) return;
      const found = results.filter(Boolean) as string[];
      const filtered = found.filter(u => !existing.has(u.toLowerCase()));
      const uniq = Array.from(new Set(filtered));
      if (uniq.length) setExtraImgs(uniq);
    }).catch(()=>{});

    return ()=>{ mounted = false; };
  }, [sku, imgs]);

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* Main Image */}
      <div className="relative w-full h-screen md:h-[600px] bg-white shadow rounded-xl flex items-center justify-center border">
        {allImgs.length ? (
          <>
            <img
              src={allImgs[index]}
              alt={`Product image ${index + 1}`}
              onClick={() => setZoom(true)}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.dataset.attempt === '1') {
                  img.src = '/images/no-image.png';
                  return;
                }
                img.dataset.attempt = '1';
                if (sku) {
                  const s = sku.toString().toUpperCase();
                  img.src = `/images/${s}/${s}-1.jpg`;
                  return;
                }
                img.src = '/images/no-image.png';
              }}
              className="max-h-screen md:max-h-[600px] w-full object-contain cursor-zoom-in"
            />

            {/* Nav Arrows */}
            {allImgs.length > 1 && <>
              <button onClick={() => setIndex(i => (i - 1 + allImgs.length) % allImgs.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow">◀</button>
              <button onClick={() => setIndex(i => (i + 1) % allImgs.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow">▶</button>
            </>}

            {/* Play/Pause */}
            <button className="absolute bottom-3 right-3 bg-white/80 px-3 py-1 rounded-full shadow"
              onClick={() => setPlay(!play)}>
              {play ? "⏸" : "▶"}
            </button>
          </>
        ) : <p className="text-gray-400">No Images Available</p>}
      </div>

      {/* Variants (only if more than 1 set exists) */}
      {colorKeys.length > 1 && (
        <div className="flex gap-2 my-3">
          {colorKeys.map(c => (
            <button key={c} onClick={() => { setActiveColor(c); setIndex(0); }}
              className={`px-3 py-1 border rounded ${activeColor === c ? "bg-black text-white" : "bg-white"}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {allImgs.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {allImgs.map((url, i) => (
            <img key={i} src={url} alt={`Thumbnail ${i+1}`} onClick={() => setIndex(i)} onError={(e)=>{const img=e.currentTarget as HTMLImageElement; if(img.dataset.attempt==='1'){img.src='/images/no-image.png'; return;} img.dataset.attempt='1'; if(sku){const s=sku.toString().toUpperCase(); img.src=`/images/${s}/${s}-1.jpg`; return;} img.src='/images/no-image.png';}}
              className={`w-28 h-28 rounded border cursor-pointer ${i===index?"ring-2 ring-blue-500 scale-110":"opacity-90"}`}
            />
          ))}
        </div>
      )}

      {/* Zoom Popup */}
      {zoom && (
        <div onClick={() => setZoom(false)}
             className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50">
          <img src={allImgs[index]} alt="Zoomed product" className="max-h-[90vh] rounded-xl shadow-xl" />
        </div>
      )}
    </div>
  );
}