const Vibrant = require('node-vibrant');
const fs = require('fs');

const images = [
  'images/Deal.jpg',
  'images/Slider-poster.jpg',
  'images/Combo.jpg'
];

async function extract() {
  const all = [];
  for (const img of images) {
    try {
      const palette = await Vibrant.from(img).getPalette();
      // Collect swatches if present
      Object.values(palette).forEach(s => {
        if (s && s.getHex) all.push(s.getHex());
      });
    } catch (e) {
      console.error('Error processing', img, e.message);
    }
  }

  // Keep order and unique
  const unique = [...new Set(all.map(h => h.toUpperCase()))];

  // If less than 5, pad with defaults
  const defaults = ['#197D86','#0F6A74','#4ED2D3','#5AC7D7','#E3F8FF'];
  while (unique.length < 5) unique.push(defaults[unique.length]);

  // Pick first 5 as palette
  const palette = unique.slice(0, 5);
  const out = {
    sourceImages: images,
    palette
  };

  fs.writeFileSync('scripts/extracted_palette.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
}

extract();
