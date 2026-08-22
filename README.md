# My Data Analytics Portfolio (Multi-Page)

A 5-page animated portfolio site:
- `index.html` — Home (Hero, About, Quick Links, Contact)
- `experience.html` — Experience timeline
- `education.html` — Education + certifications
- `skills.html` — Skills with animated progress bars
- `projects.html` — Projects with 3D tilt hover cards

## Animations included
- Page fade-in on load
- Hero: animated SVG line-draw + subtle grid background
- Scroll-triggered reveal animations (fade + slide) on every section
- Sticky nav with animated underline + active page indicator
- Cursor-follow glow (desktop only)
- Scroll progress bar at the top
- Project cards: 3D tilt on mouse move (desktop only)
- Skills page: progress bars animate/fill when scrolled into view
- Reduced-motion respected (users with that OS setting see no animation)

## Files
- `style.css` — all styling, colors, fonts, animation keyframes
- `script.js` — nav toggle, scroll reveal, cursor glow, tilt effect, skill bar fill
- `assets/` — put `profile.jpeg` (or update the extension in index.html) here
- `resume.pdf` — put your resume in the root folder

## How to edit content
Open each `.html` file and replace "Your Name", links, and placeholder
text/entries. Colors and fonts are set at the top of `style.css` under `:root`.
To add a new project card, copy an existing `<article class="project-card tilt reveal">`
block in `projects.html`. To add a new skill bar, copy a `.skill-bar` block in
`skills.html` and set `data-level` to a number 0–100.

## Deploy on GitHub Pages
Upload all files (keeping the same names/paths) to your
`yourusername.github.io` repo, same as before — no new setup needed.
