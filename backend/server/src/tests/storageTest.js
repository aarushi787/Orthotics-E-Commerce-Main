const admin = require("../config/firebase.cjs");
const path = require("path");

async function testStorage() {
  const bucket = admin.storage().bucket();

  // local file you want to test
  const localFile = path.join(__dirname, "../../../images/abdominal-universal/1.jpg");

  // destination path in Firebase Storage
  const destination = "test/uploads/sample1.jpg";

  console.log("🔥 Uploading to Firebase Storage...");

  await bucket.upload(localFile, {
    destination: destination,
    metadata: { contentType: "image/jpeg" }
  });

  // get signed url
  const file = bucket.file(destination);
//   const [url] = await file.getSignedUrl({
const [url] = await file.getSignedUrl({
    action: "read",
    expires: "03-01-2030"
  });

  console.log("✅ File uploaded successfully!");
  console.log("📌 Storage URL:", url);
}

testStorage().catch(console.error);
