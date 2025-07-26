grimoire - a simple and dumb static site generator

flow -
- user does npx create grimoire@latest. this should create a barebones structure for a simple blog. 
    - one static main page + one blog page + one simple navbar on top.
    - this would be starting directory structure.
```
├──  content
│   ├──  blog
│   │   ├──  'Sat Jul 26 2025 22:15:37.md'
│   │   └──  'Sat Jul 26 2025 22:16:05.md'
│   └──  static
│       └──  'Sat Jul 26 2025 22:16:05.md'
├──  static
│   ├──  images
│   └──  styles
└──  templates
    ├──  blog.hbs
    ├──  index.hbs
    └──  page.hbs
```

- In order to create blog pages or static pages. user can do two thing - 
    - create the files themselves
    - run `npx grimoire add blog` - this check if the blog dir exists or not and if it doesnt create it and create a new post with the current time and some metadata inside it.  if it exists create a new file with the current timestamp as file name and put some metadata for user to edit.
    - run `npx grimoire add static` - similarly checks for static dir and creates if it doesnt exists and create a new md file in it.

- diff between static and other directory processing - each md file in static would be created to have a independant route unrelated to anything and others would have an index page to mention all the posts in that dir which will redirect to content.

- building - run `npx grimoire build` and itll build everything to a public/dist directory which'll contain html that can be hosted on any platform as its just html.

- serve - run `npx grimoire serve to locally see whats happening`

should i make the cli in rust - 
    - use of cli
        - `init` - basically a script that creates stuff which is fetched through a cdn.
        - `add` - normie code to create file and dir.
        - `build` - invokes the js code to transform the md to html. 
        - `serve` - will have to think about it. building everytime when there is a change is bad have to have incremental builds or smth.
