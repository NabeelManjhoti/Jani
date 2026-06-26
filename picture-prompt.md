# Jani — DALL-E Image Prompts

Generate these 3 images via DALL-E 3 in ChatGPT or directly via OpenAI API. Save to `public/images/`.

---

## 1. Food Stall — Burns Road Bun Kabab

**Filename:** `food-stall.jpg`

**Prompt:**
```
A busy Burns Road food street in Karachi at night. A street vendor's stall with a 
hot iron griddle (tawa) sizzling with bun kababs — round patties being fried with 
eggs. Warm orange and yellow lighting from hanging bulbs. Steam rising in the cool 
night air. People gathering around the stall. In the background, old Karachi 
buildings with neon signs. Cinematic, photorealistic style, warm tones, shallow 
depth of field. Aspect ratio 16:9.
```

---

## 2. Chai Dhabba — Traditional Tea Stall

**Filename:** `chai-dhabba.jpg`

**Prompt:**
```
A traditional chai dhabba (tea stall) in Karachi at golden hour. A large 
bubbling kettle (samovar) on a coal stove. Clay cups (kullar) stacked on a 
wooden shelf. Two old men in shalwar kameez sitting on wooden stools, 
holding small clay tea cups. Warm amber lighting, dust particles visible in 
the sun rays. Rustic brick wall background. Nostalgic, cinematic mood. 
Photorealistic. Aspect ratio 16:9.
```

---

## 3. Mazar-e-Quaid — Jinnah's Mausoleum

**Filename:** `mazar-e-quaid.jpg`

**Prompt:**
```
Mazar-e-Quaid (Quaid-e-Azam's mausoleum) in Karachi at golden hour. The iconic 
white marble dome with its distinctive curved arches. Warm sunset light casting 
long shadows across the marble platform. A green and white auto rickshaw passing 
on the road in the foreground. A few visitors on the steps. Palm trees swaying. 
Crimson and golden sky. Cinematic photography style, wide angle, symmetry. 
Photorealistic. Aspect ratio 16:9.
```
Replace food-stall.jpg, chai-dhabba.jpg, mazar-e-quaid.jpg with DALL-E generated images
Run supabase-schema.sql in Supabase SQL Editor
Enable Google OAuth in Supabase Auth → Settings
Create .env.local with your keys (SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY)
npm run dev to test locally
Push to GitHub + deploy on Vercel