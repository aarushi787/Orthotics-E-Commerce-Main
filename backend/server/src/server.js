// server/src/server.js
const createApp = require("./app");

const PORT = process.env.PORT || 5000;

const app = createApp();

if (require.main === module) {
	app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));
}

module.exports = app;