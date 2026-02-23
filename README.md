# 🐍 Reveal Snakes

Instagram ghost detector — find who's not following you back, then auto-unfollow them.

Built by [@kairui.mp4](https://instagram.com/kairui.mp4) + [@gary_ying.k](https://instagram.com/gary_ying.k)

## Stack
- **Frontend:** Vanilla JS, single-file, zero dependencies
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (tracks global reveal count + total snakes found)
- **Deploy:** Railway

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up local postgres and create your .env
cp .env.example .env
# Fill in your local DATABASE_URL

# 3. Run
npm run dev
```

Visit `http://localhost:3000`

---

## Deploy to Railway (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/reveal-snakes.git
git push -u origin main
```

### 2. Create Railway project
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `reveal-snakes` repo
4. Railway will auto-detect Node.js and deploy

### 3. Add PostgreSQL
1. In your Railway project, click **+ New** → **Database** → **Add PostgreSQL**
2. Railway automatically sets `DATABASE_URL` in your environment — you don't need to do anything else
3. Your server reads it on boot and creates the `stats` table automatically

### 4. Get your URL
Railway gives you a public URL like `https://reveal-snakes-production.up.railway.app`  
That's your live site. Done.

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Returns `{ reveals, snakes_found }` |
| `POST` | `/api/reveal` | Body: `{ snake_count: number }` — increments counters, returns updated stats |

---

## How it works

1. User downloads their Instagram data export (followers_1.html + following.html)
2. Files are parsed client-side — **no data ever leaves the user's device**
3. Set difference reveals snakes (you follow, they don't) and fans (they follow, you don't)
4. On reveal, the snake count is POSTed to `/api/reveal` to update the global counter
5. Optionally generates a browser console script to auto-unfollow snakes with randomized delays
