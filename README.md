# LocateBase — localhost demo working copy

This folder contains three components recovered from the team's supplied ZIP files, plus focused changes for the COMP 311 localhost demo. **Do not push real credentials or `.env` files.**

## Folder layout
- `backend/` — original Java/Spring Boot application, with optional GPS at creation and PATCH guesthouse status.
- `web-admin/` — original dashboard pages remain at `/admin`; a new connected demo portal lives at `/`.
- `mobile-app/` — original Expo Explore UI retained, with Firebase customer authentication in `src/app/login.tsx` and API response mapping fixed.

## Setup
1. Ensure Java **25**, Maven (or included Maven wrapper), Node/npm, MongoDB Atlas access and a Firebase project are available. Existing backend configuration expects Firebase project `locatebase-614b5`.
2. Backend: set `MONGODB_URI` in your terminal environment (never commit it); from `backend/`, run `./mvnw spring-boot:run` on macOS/Linux or `mvnw.cmd spring-boot:run` on Windows. Expect localhost port 8080.
3. Web: copy `web-admin/.env.example` to `.env` and fill in Firebase public client configuration. `cd web-admin && npm install && npm run dev`. Open `http://localhost:5173/`. The original unfinished dashboard pages remain at `/admin`.
4. Mobile: copy `mobile-app/.env.example` to `.env`; set `EXPO_PUBLIC_API_URL` to `http://YOUR_COMPUTER_LAN_IP:8080` for testing on a physical phone (or use emulator-specific host). Fill in the same Firebase public client configuration. `cd mobile-app && npm install && npx expo start`.
5. Enable Email/Password provider in Firebase Console. Existing administrators must be provisioned by a trusted backend/database administrator; **the portal intentionally has no public admin sign-up**.

## Demonstration
- Sign up in web portal as owner, sign out, sign back in, and check role is preserved.
- Sign in as an existing admin. Create a draft guesthouse with name, city, price. Publish with the status action; it becomes public.
- Refresh mobile Explore to display published guesthouses; drafts/suspended houses are omitted.
- Tap the profile icon in the mobile header to open `/login` and create a customer account and sign in (via router path). The Firebase account syncs to MongoDB with customer role.
- Owner listing requests, promotions, user management, photos, maps and billing remain outside this demo scope and are **not implemented** by this patch.

## Important limitations
- External MongoDB/Firebase access and credentials are required; no offline mock-auth bypass is provided.
- Mobile Firebase Auth on some native Expo environments may require a persistence adapter; login persistence across restarts is not guaranteed by this patch.
- The original admin dashboard uses mocks and is **not** a production-ready administration interface. Use the connected root demo portal for the lecturer walkthrough.
- We have not verified a full Spring Boot build or native Expo run in this container. Run local tests before presenting.
- Existing API role onboarding accepts `owner` at first sync; it cannot assign `admin`. For production, owner onboarding should be hardened, e.g. with server-enforced registration context and invitation/approval rules.

## Never commit
Do not commit MongoDB URI, Firebase private keys, service account JSON, Cloudinary API secrets, or real `.env` files. Use isolated test data if your original Atlas database contains important records.
