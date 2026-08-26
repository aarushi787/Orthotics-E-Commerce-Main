from colorthief import ColorThief
import json

images = [
    'images/Deal.jpg',
    'images/Slider-poster.jpg',
    'images/Combo.jpg'
]

palette_all = []
for img in images:
    try:
        ct = ColorThief(img)
        palette = ct.get_palette(color_count=6)
        hexes = ['#%02x%02x%02x' % c for c in palette]
        palette_all.extend(hexes)
    except Exception as e:
        print(f'Error processing {img}:', e)

# unique while preserving order
seen = set()
unique = []
for h in palette_all:
    h_up = h.upper()
    if h_up not in seen:
        seen.add(h_up)
        unique.append(h_up)

# Ensure at least 5 colors
defaults = ['#197D86','#0F6A74','#4ED2D3','#5AC7D7','#E3F8FF']
while len(unique) < 5:
    unique.append(defaults[len(unique)])

palette = unique[:5]
out = {'source': images, 'palette': palette}
with open('scripts/extracted_palette_py.json','w',encoding='utf-8') as f:
    json.dump(out,f,indent=2)
print(json.dumps(out,indent=2))
