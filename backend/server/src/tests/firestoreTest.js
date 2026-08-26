const admin = require('../config/firebase.cjs');  // corrected path

async function testFirestore() {
  const db = admin.firestore();

  console.log("🔥 Testing Firestore write...");

  await db.collection('test').doc('ping').set({
    message: "Hello Firestore!",
    time: Date.now()
  });

  const doc = await db.collection('test').doc('ping').get();
  console.log("📄 Firestore read:", doc.data());
}

testFirestore().catch(console.error);
