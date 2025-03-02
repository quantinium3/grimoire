comp:
	bun run src/main.ts
serve:
	serve -l 8080 dist/
run:
	bun run src/main.ts && serve -l 8080 dist/
