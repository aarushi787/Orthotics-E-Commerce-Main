export default function ComparePage({ products, onClose }:any) {
return (
<div className="fixed inset-0 bg-black/80 z-40 flex justify-center overflow-y-auto">
  <div className="bg-white dark:bg-black p-8 mt-10 rounded-xl shadow w-[90%]">
    <button className="float-right text-xl" onClick={onClose}>✕</button>

    <h2 className="text-2xl font-bold mb-6">Compare Products</h2>

    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th></th>
          {products.map((p:any)=>(<th key={p.id} className="text-center">{p.name}</th>))}
        </tr>
      </thead>

      <tbody>
        <tr><td>Price</td>{products.map((p:any)=><td>₹{p.price}</td>)}</tr>
        <tr><td>Category</td>{products.map((p:any)=><td>{p.category}</td>)}</tr>
        <tr><td>Rating</td> {products.map((p:any)=><td>⭐ {p.rating}</td>)}</tr>
        <tr><td>SIZES</td>{products.map((p:any)=><td>{p.sizes.join(", ")}</td>)}</tr>
        <tr><td>Material</td>{products.map((p:any)=><td>{p.material}</td>)}</tr>
        <tr><td>Certifications</td>{products.map((p:any)=><td>{p.certifications.join(", ")}</td>)}</tr>
      </tbody>
    </table>
  </div>
</div>
);}
