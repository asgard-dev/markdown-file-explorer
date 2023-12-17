# Markdown File Explorer

This is a simple NodeJS application which can serve a markdown file explorer over a browser.

## Running

```sh
npm install
npm start -- -p <path-to-directory>
```

The server will discover the given directory recursively, and will serve the found markdown files similiar to a wiki website **on port 80**.