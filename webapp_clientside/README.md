# webapp_clientside

Vue 3 frontend of the Waste & Recycling Management project.

Run every npm command **inside this folder**, not at the repo root.

```
npm install      # first time, or after a pull that changes package.json
npm run serve    # dev server on http://localhost:8080
npm run build    # production build in dist/ (serve it, don't open index.html directly)
npm run lint
```

For now the pages read the fake data in `../data/*.json` (see `getAllData()` in each view).
It will be replaced by `fetch()` calls once the Express server is ready.
