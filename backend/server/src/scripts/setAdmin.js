const admin = require("../config/firebase.cjs");

// const adminEmail = "your-admin-email@gmail.com";
const adminEmail = "admin@gmail.com";

async function setAdminRole() {
  const user = await admin.auth().getUserByEmail(adminEmail);

  await admin.auth().setCustomUserClaims(user.uid, { admin: true });

  console.log("Admin role assigned to:", adminEmail);
}

setAdminRole().catch(console.error);
