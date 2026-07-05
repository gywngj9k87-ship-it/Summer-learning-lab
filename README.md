# ☀️📚 Summer Learning Lab

A gamified daily learning app for two kids — **Niall** (10, Grade 5) and
**Naurishka** (6, Grade 1). They log in, work through a fresh mix of activities
each day, earn points, and trade those points for PS5 time. Difficulty adapts
automatically to how well each child is doing.

Built with React + Vite. **Local-first** (works offline, no accounts needed),
with optional **cross-device sync** when deployed to Netlify.

---

## What's inside

**Activities (age-tuned for each child)**
- 🔢 **Sudoku** — 4×4 for Naurishka, 9×9 for Niall
- 🔤 **Word Guess** (Wordle-style) — short words for the little one, 5-letter for the older
- 🧩 **Crossword** — mini interlocking puzzles with clues
- 📖 **Reading comprehension** — a passage plus questions
- 🗣️ **Vocabulary** — learn a word's meaning, then use it in a sentence of your own
- 🌍 **Geography**, 🏛️ **History**, 💡 **General Knowledge** (sports, nations…)
- 🕊️ **Model UN prep** (Niall only) — country facts + world affairs

**How the game works**
- **Login gate:** a session is created *only* when the typed **name + age** match
  a known player (Niall/10 or Naurishka/6). Any mismatch is rejected.
- **Today's Plan:** ~5 activities, mixed across topics, refreshed every day so
  they keep learning new things.
- **Adaptive difficulty:** each topic has its own level (1–5). Ace a session
  (≥85%) and it steps **up**; struggle (≤45%) and it steps **down**.
- **Points → PS5:** **100 points = 30 minutes of PS5.** Two counters — a
  **Lifetime** total (only ever grows, shown on the home screen with its PS5-hour
  value) and a **Spendable** balance that drops when time is redeemed.
- **Parent PIN:** redeeming PS5 time (and the Parent area) is protected by a
  4-digit PIN, set on first use.
- **Days & the Friday test:** days are counted as **Day 1, Day 2…** (each new
  calendar day used). On real **Fridays**, a mixed **test** unlocks for bonus
  points. There's also a **1-hour-a-day** learning-time goal, tracked live.
- **Parent area:** see each child's points, PS5 earned/redeemed, days active,
  total learning time, per-topic difficulty, and recent test scores. Includes
  **testing tools** to reset points, reset the question history (so questions
  reappear), or fully reset a child's progress.

**How the kids can answer**
- **Tap / select** — big buttons for every multiple-choice question.
- **Type** — on-screen tiles *and* physical keyboard for Word Guess, Crossword,
  and Sudoku (no keyboard required).
- **Apple Pencil** — iPad's built-in **Scribble** writes handwriting into any
  text box automatically; every activity also has a ✏️ **Scratchpad** canvas for
  working things out by hand.
- **Speak** — an optional 🎤 voice-answer button appears where the browser
  supports speech recognition (great in Chrome; limited on iPad Safari). Tap is
  always available as the reliable fallback.

---

## Run it locally

```bash
npm install
npm run dev      # open the printed http://localhost:5173 URL
```

Build a production copy:

```bash
npm run build    # output in dist/
npm run preview  # serve the built copy
```

Locally the app runs in **local-first** mode: progress is saved in that
browser. That's all you need to try it out.

---

## Deploy to Netlify (hosting + cross-device sync)

Deploying to Netlify gives the kids a shareable link **and** turns on
cross-device sync — with **no keys or extra services**. Sync uses Netlify
Functions backed by **Netlify Blobs** (both included in this repo under
`netlify/`), so progress follows each child from device to device.

1. Log in to **[Netlify](https://app.netlify.com)** → **Add new site** →
   **Import an existing project**.
2. Connect GitHub and pick the **`Summer-learning-lab`** repository.
3. Netlify reads `netlify.toml` automatically — build command `npm run build`,
   publish directory `dist`, functions in `netlify/functions`. Just click
   **Deploy**.
4. When it finishes you'll get a public URL (e.g.
   `https://your-name.netlify.app`). Open it on any device and progress syncs.

That's it — no configuration, no API keys. (If you ever deploy somewhere without
these functions, the app quietly falls back to local-only and still works.)

> **How sync behaves:** each child's data is keyed by name (matching the
> name+age login — no passwords). Saves happen after every activity. If the same
> child is used on two devices at once, the most recent save wins.

---

## Growing the content

All content lives in `src/data/` and is easy to extend — add more items to any
array and they're picked up automatically:

- `geography.js`, `history.js`, `generalKnowledge.js`, `mun.js` — quiz banks
  (`junior` / `senior`), ordered roughly easy → hard.
- `reading.js` — passages + questions.
- `vocabulary.js` — words with a meaning, choices, and a model example sentence.
- `crosswords.js` — mini crossword puzzles.
- Word lists for Word Guess are in `src/lib/words.js`.

Difficulty tuning (levels, clue counts, guess limits) lives in
`src/lib/adaptive.js`; the points ⇄ PS5 rate is in `src/lib/points.js`.

---

## Note on privacy

This is a public repository, so the **code** is visible to anyone, but it
contains no personal data — the kids' names are just login labels and all
progress is stored per-browser (or in your private Netlify Blobs when deployed).
The parent PIN gates screen-time redemptions.
