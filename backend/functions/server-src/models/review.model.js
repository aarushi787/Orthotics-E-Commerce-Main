const admin = require("../config/firebase.cjs");
const db = admin.firestore();

class Review {
  static async getByProductId(productId) {
    const snapshot = await db
      .collection("reviews")
      .where("productId", "==", Number(productId))
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async addReview(data) {
    const res = await db.collection("reviews").add(data);
    return { id: res.id, ...data };
  }
}

module.exports = Review;
