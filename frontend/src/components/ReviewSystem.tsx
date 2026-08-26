import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props { productId:number; }

export default function ReviewSystem({ productId }:Props){

  const [reviews,setReviews]=useState<any[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rating,setRating]=useState(0);
  const [text,setText]=useState("");
  const [name,setName]=useState("");

  // FETCH REVIEWS FROM SERVER
  const loadReviews=async()=>{
    try {
      const res=await axios.get(`/api/reviews/${productId}`);
      setReviews(res.data.reviews || []);
      setLoadError(null);
    } catch (err) {
      console.error('Failed to load reviews', err);
      setLoadError('Unable to load reviews at the moment.');
      setReviews([]);
    }
  };

  useEffect(()=>{ loadReviews(); },[]);


  // SUBMIT NEW REVIEW
  const submit=async()=>{
    if(!rating||!text.trim()) return alert("Rating + Review required");

    await axios.post("/api/reviews",{
      productId,rating,review:text,name:name||"Anonymous"
    });

    setRating(0); setText(""); setName("");
    loadReviews();
  };


  return(
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>


      {/* Input Form */}
      <div className="p-4 border rounded bg-white">
        
        <input type="text" placeholder="Your Name"
          value={name} onChange={e=>setName(e.target.value)}
          className="w-full p-2 border mb-2 rounded"/>

        <div className="flex gap-2 mb-2">
          {[1,2,3,4,5].map(n=>(
            <span key={n}
                onClick={()=>setRating(n)}
                className={`text-2xl cursor-pointer 
                  ${rating>=n?"text-yellow-400":"text-gray-300"}`}>
              ★
            </span>
          ))}
        </div>

        <textarea placeholder="Write your experience..."
          value={text} onChange={e=>setText(e.target.value)}
          className="w-full p-2 border h-24 rounded mb-2"/>

        <button onClick={submit}
          className="bg-brand-teal-500 hover:bg-brand-teal-600 text-white w-full py-2 rounded font-bold transition">
          Submit Review
        </button>
      </div>


      {/* Display Review List */}
      {reviews.length>0?(
        <div className="mt-6 space-y-4">
          {reviews.map((r,i)=>(
            <div key={i} className="p-4 border rounded bg-slate-50">
              <div className="flex justify-between">
                <b>{r.name}</b>
                <span className="text-yellow-500">{("★").repeat(r.rating)}</span>
              </div>
              <p className="text-gray-700 mt-1">{r.review}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ):<p className="mt-5 text-gray-500">No reviews yet.</p>}
      {loadError && <p className="mt-3 text-sm text-red-500">{loadError}</p>}
    </div>
  );
}