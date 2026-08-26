export default function CompareSheet({ products, onClose }:any){
return (
<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
  <div className="bg-white p-6 rounded-xl w-[85%] overflow-x-auto max-h-[85vh]">
    <button onClick={onClose} className="float-right mb-3 text-lg">✖</button>
    <h2 className="text-2xl font-bold mb-4 text-center">Product Comparison</h2>

    <table className="w-full border-collapse text-center">
      <tr><th></th>{products.map(p=><th key={p.id}>{p.name}</th>)}</tr>
      <tr><td>Price</td>{products.map(p=><td>₹{p.price}</td>)}</tr>
      <tr><td>Rating</td>{products.map(p=><td>{p.rating}★</td>)}</tr>
      <tr><td>Material</td>{products.map(p=><td>{p.material}</td>)}</tr>
      <tr><td>Sizes</td>{products.map(p=><td>{p.sizes.join(", ")}</td>)}</tr>
    </table>
  </div>
</div>
);}
