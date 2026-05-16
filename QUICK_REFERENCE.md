# 📚 Quick Reference - OratorHub Production Deployment

## 🚀 One-Click Actions

### Test Production Build Locally

```bash
npm run build && npm run preview
```

Then visit: http://localhost:4173

### Check Build Output

```bash
ls -lh dist/
```

### View Environment Variables (Local)

```bash
cat .env
```

### Reset and Rebuild

```bash
rm -rf dist node_modules/.vite
npm run build
```

## 🔗 Important URLs

### Development

```
Local: http://localhost:5173
```

### Production (After Vercel Setup)

```
https://yoursite.com/
https://yoursite.com/login
https://yoursite.com/dashboard
```

### Vercel Dashboard

```
https://vercel.com/dashboard
```

### GitHub Repository

```
https://github.com/LucasC-Pinheiro/OratorHub
```

### Supabase Console

```
https://app.supabase.com
```

## 📋 Deployment Checklist

### Before Pushing

- [x] Code committed: `git add . && git commit -m "..."`
- [x] Build tested locally: `npm run build`
- [x] No errors: Check terminal output
- [x] Ready to push: `git push`

### On Vercel Dashboard

- [ ] Go to Settings → Environment Variables
- [ ] Add `VITE_SUPABASE_URL`
- [ ] Add `VITE_SUPABASE_ANON_KEY`
- [ ] Set both to "Production" environment
- [ ] Wait for automatic redeploy

### Testing Production

- [ ] Visit domain
- [ ] Try `/login`
- [ ] Try `/dashboard` with refresh
- [ ] Try `/talks` with refresh
- [ ] Check browser console (F12)

## 🐛 Troubleshooting Commands

### Check Git Status

```bash
git status
git log --oneline -5
```

### View Recent Commits

```bash
git log --pretty=format:"%h - %s"
```

### Check Vercel Build Logs

Visit: https://vercel.com/dashboard → OratorHub → Deployments

### Verify Build Output

```bash
# Check if dist folder exists
ls -la dist/

# Check if _redirects is present
cat dist/_redirects

# Verify index.html
head -20 dist/index.html

# Count assets
ls dist/assets/ | wc -l
```

## 🔑 Critical Information

### Supabase Credentials

```
URL: https://drnknluovsjujsrmbtet.supabase.co
Key: sb_publishable_q0JM3k4FGDt-eHehrMuAnA_8WiqoCrM
```

### Environment Variable Names (EXACT)

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

⚠️ **Important**: Names must match EXACTLY in Vercel dashboard

### Build Command (Vercel)

```
npm run build
```

### Output Directory (Vercel)

```
dist
```

## 📞 Support Links

### Documentation Files

- `DEPLOYMENT_SUMMARY.md` - Quick start guide
- `COMPLETE_ANALYSIS.md` - Detailed analysis
- `PRODUCTION_CHECKLIST.md` - Full checklist
- `VERCEL_ENV_SETUP.sh` - Setup guide

### External Resources

- [Vercel Docs](https://vercel.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev)

## ⏱️ Expected Timelines

| Task                | Time           |
| ------------------- | -------------- |
| Set Vercel env vars | 2 min          |
| Vercel build        | 2-3 min        |
| Vercel deploy       | 1-2 min        |
| DNS propagation     | <1 min         |
| First test          | 1 min          |
| **Total**           | **~8 minutes** |

## ✅ Final Verification

Run this to verify everything is ready:

```bash
npm run build 2>&1 | tail -5 && echo "✓ Build OK" && ls -lh dist/ && echo "✓ Dist ready"
```

Should show:

```
✓ built in XXms
✓ Build OK
total [size]
✓ Dist ready
```

## 🎯 Success Indicators

✅ Build completes without errors
✅ dist/ folder exists with assets
✅ Environment variables set in Vercel
✅ Vercel shows "Deployment Successful"
✅ Site loads at production URL
✅ Routes work with refresh
✅ Login works with Supabase
✅ Console shows no errors

---

**Last Updated**: May 16, 2026
**Status**: Production Ready
**Next Step**: Set environment variables in Vercel dashboard
