export default function RecommendationEngine({target,products}:any){

  const rec = products
    .filter(p=>p.id!==target.id)
    .map(p=>({
      ...p,
      score:
        (p.category===target.category?5:0) +
        (Math.abs(p.price-target.price)<200?3:0) +
        (p.rating>=target.rating?2:0)
    }))
    .sort((a,b)=>b.score-a.score).slice(0,3);

return(
<div className="mt-16">
  <h2 className="text-2xl font-bold mb-6">Recommended for You 🔥</h2>

  <div className="grid md:grid-cols-3 gap-6">
    {rec.map((p:any)=>(
      <div key={p.id} className="p-4 bg-white dark:bg-black rounded shadow">
        <img
          src={
            (p.imageUrls && p.imageUrls[0])
              ? (p.imageUrls[0].startsWith('/') ? p.imageUrls[0] : '/' + p.imageUrls[0])
              : (p.images && p.images[0])
                ? (p.images[0].startsWith('/') ? p.images[0] : '/' + p.images[0])
                : `/images/no-image.png`
          }
          className="h-40 mx-auto"
          alt={p.name || 'product'}
          loading="lazy"
          onError={(e:any)=>{
            const img = e.currentTarget as HTMLImageElement;
            if (img.dataset.tried) return;
            img.dataset.tried = '1';
            const sku = (p.sku || p.SKU || p.productCode || p.id || '').toString().toUpperCase();
            if (sku) {
              img.src = `/images/${sku}/${sku}-1.jpg`;
            } else {
              img.src = `/images/no-image.png`;
            }
          }}
        />
        <h3 className="mt-3 font-bold">{p.name}</h3>
        <p className="text-green-600 font-semibold">₹{p.price}</p>
      </div>
    ))}
  </div>
</div>
);}
