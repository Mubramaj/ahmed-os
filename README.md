# ahmed-os

Personal website and writing surface for **Ahmed Loudghiri**, built as a small Rails app: public pages and a slug-based blog at `/writing`, plus a lightweight **admin** area for posts (no authentication yet).

## Branding assets

- **Portrait** for the public site: [`app/assets/images/ahmed.png`](app/assets/images/ahmed.png) (Propshaft / `image_tag`).
- **Favicon & touch icon** served from the web root: [`public/icon.png`](public/icon.png), [`public/apple-touch-icon.png`](public/apple-touch-icon.png) (same source image).

For correct **Open Graph / Twitter** absolute image URLs in production, set your app host (e.g. `config.action_controller.default_url_options` or `config.asset_host`) to your real domain.

## Stack

- [Ruby on Rails](https://rubyonrails.org/) 8.1
- [SQLite](https://www.sqlite.org/) (files under `storage/`)
- [Propshaft](https://github.com/rails/propshaft) for assets
- [importmap-rails](https://github.com/rails/importmap-rails), [Turbo](https://turbo.hotwired.dev/), [Stimulus](https://stimulus.hotwired.dev/)

Ruby version is pinned in [`.ruby-version`](.ruby-version) (currently **3.4.1**).

## Prerequisites

- Ruby and Bundler
- SQLite 3
- For image-related gems in development, [libvips](https://www.libvips.org/) is recommended (matches CI)

## Setup

```bash
bundle install
bin/rails db:prepare
bin/rails db:seed   # optional: sample published + draft posts (skipped in production)
```

## Run locally

```bash
bin/dev
# or
bin/rails server
```

Open [http://localhost:3000](http://localhost:3000).

## Routes (public)

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/about` | About |
| `/writing` | Published posts only |
| `/writing/:slug` | Single post by slug |
| `/projects` | Projects placeholder |
| `/experiments` | Experiments placeholder |

## Admin (editor)

Posts are managed at **`/admin/posts`** (scaffold-style CRUD). This is intentionally separate from the public `/writing` URLs. **Secure this route** before exposing the app to the internet.

## Posts model

- **Published** on the site: `published: true` and `published_at` set.
- **Slug**: unique, URL-safe; auto-generated from the title when left blank.
- **Scopes**: `Post.published`, `Post.drafts`, `Post.recent`.

## Entry terminal (intro)

A skippable, terminal-style overlay appears on first visit; completion is stored in **localStorage** (not a security gate). You can reopen it anytime with **Ctrl+`** or **Cmd+`** (backtick key), or dismiss with **Esc** / **skip**. Direct navigation to public URLs is never blocked for crawlers or bookmarks.

## Tests

```bash
bin/rails db:test:prepare
bin/rails test
```

## CI

- **GitHub Actions** (see [`.github/workflows/ci.yml`](.github/workflows/ci.yml)): Brakeman, `bundler-audit`, `importmap audit`, RuboCop, `bin/rails test`, and `bin/rails test:system` against SQLite.
- **Local full pipeline** (includes a test `db:seed:replant` smoke step):

```bash
bin/ci
```

Configured in [`config/ci.rb`](config/ci.rb).

## Deployment

This app ships with [Kamal](https://kamal-deploy.org/) configuration; adjust [`config/deploy.yml`](config/deploy.yml) and credentials for your hosts before deploying.
