const createApp = require('./app');

const app = createApp();
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Vedic Astrology Prediction Engine running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
