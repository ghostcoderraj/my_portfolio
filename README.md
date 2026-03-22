# Aditya Raj – Portfolio

A single-page portfolio site built from your content (sourced from [rajaditya.in](https://www.rajaditya.in/)), with a multipage UI kit–style layout: Hero, About, Skills, and Contact.

## Features

- **Sections:** Home (hero), About me, Skills, Contact
- **Dark / light theme** with toggle (🌙 / 🌤️) and preference saved in `localStorage`
- **Responsive:** Mobile-friendly nav (hamburger) and stacked layout on small screens
- **Accessible:** Skip link, semantic HTML, ARIA where needed
- **Content:** Your intro, fintech/StockneX/Ozak AI, remote work, passion for coding, and full skills list with contact form and social links

## Run locally

1. Open `index.html` in a browser, or  
2. From the project folder run a simple server, e.g.:
   - **Node:** `npx serve .`
   - **Python 3:** `python -m http.server 8000`

Then visit `http://localhost:3000` (serve) or `http://localhost:8000` (Python).

## Customization

- **Profile image:** Replace the `.profile-placeholder` block in `index.html` with an `<img>` pointing to your photo.
- **Form:** The contact form currently shows an alert on submit. Connect it to a backend (e.g. Formspree, Netlify Forms, or your API) when you deploy.
- **Colors/fonts:** Edit CSS variables in `:root` and `[data-theme="dark"]` in `styles.css`.

## Figma note

The [Figma Portfolio MultiPage UI Kit](https://www.figma.com/design/W4HqErfE3nEEHhHHJvgcjQ/) design is not publicly readable, so this implementation uses a clean, section-based layout inspired by common portfolio UI kits and your existing site structure.
