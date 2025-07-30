const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['build.ts'], // Entry point of your TypeScript project
    bundle: true,                  // Bundle all dependencies into one file
    outfile: 'build.js',     // Output file
    platform: 'node',              // Target platform (use 'browser' for web apps)
    format: 'esm',                 // Output format (CommonJS for Node.js, or 'esm' for ES Modules)
    minify: true,                  // Minify the output for production
    sourcemap: true,               // Generate source maps for debugging
    target: 'es2020',              // Target JavaScript version (adjust as needed)
    loader: { '.ts': 'ts' },       // Ensure TypeScript files are handled
  })
  .then(() => console.log('Build succeeded'))
  .catch(() => process.exit(1));
