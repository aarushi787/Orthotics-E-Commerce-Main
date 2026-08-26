import { useState, useEffect } from "react";

export default function ReviewSection({ productId }:any){

  const key="reviews_"+productId;
  const [reviews,setReviews]=useState<any[]>(JSON.parse(localStorage.getItem(key)||"[]"));
  const [text,setText]=useState("");
  const [stars,setStars]=useState(5);
  const [image,setImage]=useState<any>(null);

  // Submit
  const submit=()=>{
    if(!text) return;
    const r={stars,text,image,date:new Date().toLocaleDateString()};
    const newList=[...reviews,r];
    setReviews(newList); localStorage.setItem(key,JSON.stringify(newList));
    setText(""); setImage(null); alert("Review Added");
  };

return(
<div className="bg-white dark:bg-black p-6 mt-10 rounded-xl shadow">

  {/* Breakdown */}
  <h2 className="text-2xl font-bold mb-3">Customer Reviews</h2>
  {[5,4,3,2,1].map(s=>
    <div key={s} className="flex items-center gap-2">
      <span>{s}★</span>
      <div className="bg-gray-300 dark:bg-gray-600 h-2 flex-1 rounded">
        <div style={{width:(reviews.filter(r=>r.stars===s).length/reviews.length*100)+"%"}} 
          className="h-full bg-green-500 rounded"></div>
      </div>
      <span>{reviews.filter(r=>r.stars===s).length}</span>
    </div>)}

  {/* Review input */}
  <textarea placeholder="Write review..." value={text} onChange={e=>setText(e.target.value)}
     className="w-full p-3 border rounded mt-4"/>

  <input type="file" onChange={e=>setImage(URL.createObjectURL(e.target.files![0]))}
    className="mt-2"/>

  <input type="number" min={1} max={5} value={stars} onChange={e=>setStars(+e.target.value)}
    className="w-16 border p-2 ml-3"/>

  <button className="block bg-brand-teal-500 hover:bg-brand-teal-600 text-white px-4 py-2 rounded mt-3 transition"
    onClick={submit}>Submit Review</button>

  {/* List */}
  <div className="mt-6 space-y-4">
    {reviews.map((r,i)=>(
      <div key={i} className="border p-3 rounded">
        <b>{r.stars}★</b> <span>{r.text}</span>
        {r.image && <img src={r.image} className="w-32 mt-2 rounded" />}
      </div>
    ))}
  </div>
</div>
);}
