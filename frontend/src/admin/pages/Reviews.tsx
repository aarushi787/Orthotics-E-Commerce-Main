import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, "reviews"));
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchReviews();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Product Reviews</h2>

      <div className="mt-4">
        {reviews.map((r) => (
          <div key={r.id} className="border p-3 rounded mb-2">
            <p><b>User:</b> {r.user}</p>
            <p><b>Rating:</b> ⭐ {r.rating}</p>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
