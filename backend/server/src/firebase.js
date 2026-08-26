const admin = require("./config/firebase.cjs");

module.exports = {
  admin,
  db: admin.firestore(),
  storage: admin.storage(),
};
