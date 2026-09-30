# TravelMate

React (Vite) sayohat platformasi: turar joy, gid, taksi, taomlar, valyuta ayirboshlash, eSIM, chiptalar (avtobus/poyezd, aviachipta, kino, tadbirlar) va avtomobil ijarasi. 11 til (10 ta top til + o'zbek), Google orqali kirish.

## Ishga tushirish

```bash
npm install
cp .env.example .env      # keyin VITE_GOOGLE_CLIENT_ID ni to'ldiring
npm run dev               # http://localhost:5173
```

## Google orqali kirishni sozlash (bir marta)

1. https://console.cloud.google.com/ → yangi loyiha yarating (yoki mavjudini tanlang).
2. **APIs & Services → OAuth consent screen**: *External* tanlang, ilova nomi (TravelMate) va emailingizni kiriting, saqlang.
   Test rejimida bo'lsa, **Test users** ga o'zingizning Gmail'ingizni qo'shing (yoki ilovani *Publish* qiling).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**
   - Application type: **Web application**
   - **Authorized JavaScript origins** ga qo'shing:
     - `http://localhost:5173`
     - `http://localhost`
     - (deploy qilsangiz) `https://sizning-domeningiz.com`
   - Redirect URI kerak emas.
4. Olingan **Client ID** ni `.env` ga yozing:
   ```
   VITE_GOOGLE_CLIENT_ID=1234567890-abc...apps.googleusercontent.com
   ```
5. `npm run dev` ni qayta ishga tushiring. Saytni aynan `http://localhost:5173` orqali oching
   (`127.0.0.1` Google'da ro'yxatdan o'tmagan origin hisoblanadi).

> Origin'ni qo'shgandan keyin Google tomonida kuchga kirishi 5 daqiqagacha vaqt olishi mumkin.

Kirish Google Identity Services orqali ishlaydi: Google ID token (JWT) qaytaradi, ilova uning `iss`, `aud` va `exp` maydonlarini tekshiradi, foydalanuvchini (ism, email, rasm) 7 kunlik sessiya sifatida saqlaydi. Bronlar har bir foydalanuvchi uchun alohida saqlanadi.
Agar keyinchalik backend qo'shsangiz, tokenni serverda ham tekshiring (`google-auth-library` → `verifyIdToken`).

## Tuzilma

```
src/
  i18n/            # 11 til: en, uz, ru, zh, es, fr, de, ar (RTL), hi, pt, ja
  data/            # joylar, xizmatlar, takliflar, chiptalar, qidiruv
  context/         # AuthContext (Google), ToastContext
  hooks/           # Wikipedia rasmlari, count-up, bron, formatlash
  components/      # Navbar, SubNav (hover top-10), HeroCarousel, SearchBar, Sections, Footer...
  pages/           # Home, Auth, Popular, Place, Search, Service, Profile, 404
```

Joylar rasmlari va tavsiflari real vaqtda Wikipedia API'dan olinadi.
