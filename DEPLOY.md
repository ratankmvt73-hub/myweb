# Deploy Guide — Elite Cooling Website

## Step 1: Create GitHub Repo (2 min)

1. Open https://github.com/login → Login ya Sign up karo
2. Top-right corner mein **+** → **New repository**
3. Repository name: `elite-cooling-solution`
4. **Public** select karo → **Create repository**
5. Repo banne ke baad, yeh screen dikhegi:
   ```
   https://github.com/YOUR_USERNAME/elite-cooling-solution
   ```

## Step 2: Push Code to GitHub (1 min)

Terminal mein yeh commands copy-paste karo (apna username dalna):

```bash
git remote add origin https://github.com/YOUR_USERNAME/elite-cooling-solution.git
git branch -M main
git push -u origin main
```

> Username ki jagah apna GitHub username daalo, jaise: `git remote add origin https://github.com/narayankumar/elite-cooling-solution.git`

**Password maange to:** GitHub password nahi, **Personal Access Token** daalo. Token banane ke liye:
- https://github.com/settings/tokens → **Generate new token (classic)**
- Note: `deploy` → Scope: `repo` tick karo → **Generate**
- Token copy karo aur password ki jagah paste karo

## Step 3: Create Render.com Account (1 min)

1. https://dashboard.render.com/register → **Sign up with GitHub**
2. GitHub authorize karo

## Step 4: Deploy on Render.com (2 min)

1. Render Dashboard → **New +** → **Web Service**
2. Connect `elite-cooling-solution` repo
3. Fill settings:
   - **Name**: `elite-cooling`
   - **Region**: Singapore (closest)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: *(blank — kuch mat daalo)*
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. **Environment Variables** add karo:
   - Click **Advanced** → **Add Environment Variable**
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_live_xxxxxxxxxxxxxxxx` (Stripe dashboard se lo)

5. **Create Web Service** → Bas! 2-3 min mein live URL milegi.

## Live URL Format:
```
https://elite-cooling.onrender.com
```

## Admin Panel Access:
```
https://elite-cooling.onrender.com/admin.html
```
- Username: `admin`
- Password: `elitecooling@2026`

## Stripe Live Key Kahan Se Lo:
1. https://dashboard.stripe.com/apikeys
2. **Developers** → **API keys**
3. **Secret key** → Reveal → Copy
4. Render ke Environment Variables mein paste karo

## Done! 🔥
