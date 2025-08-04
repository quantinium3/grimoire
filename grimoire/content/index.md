---
title: ""
author: quantinium
date: 2025-08-04
description: the index page for grimoire - a static site generator
slug: home
draft: false
extra:
  hero_image: /static/images/hero.jpg
---

a simple, minimal and extensible filesystem based static site generator converting your markdown blog into an one click deployable website.

## Quick Start
### Install
```bash
$ curl -sS https://grimoire.quantinium.dev/install.sh | sh
```

#### Github
```bash
$ git clone https://github.com/quantinium3/grimoire.git
$ cargo build
```

#### Nix
```bash
nix run github:quantinium3/grimoire
```

### Start blogging
- `grimoire init grim` - this initializes a repository named grim in which we can write our content in the `content` dir.
- `grimoire build` - this output the html from the markdown content we have into `public`
- `grimoire serve` - serve the public directory to `localhost:5000` for testing.
- `grimoire add --type <content_type>` - you can manually create new and directories or run this command to automatically do it. Presently we support two types of pages.
    - `static` - these are single pages
    - `blog` - these are blog type pages which come under one category.
- `grimoire clean` - clean your public directory.
- `grimoire list` - list all the files in your `content` directory.

