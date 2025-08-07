# osrs-web-scraper

TypeScript Node.js CLI application that scrapes the Old School RuneScape website and converts content to MediaWiki format. Uses Puppeteer for web scraping and includes news posts, polls, and world list scraping functionality.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap, Build, and Test the Repository
- Install dependencies: `PUPPETEER_SKIP_DOWNLOAD=true npm install` -- takes 15 seconds. Chrome/Chromium download may fail in restricted networks.
- Build the project: `npm run build` -- takes 7 seconds. NEVER CANCEL.
- Run linting: `npm run lint` -- takes 2 seconds.
- Run tests: `npm run test` -- takes 8 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Fix linting issues: `npm run lint:fix`
- Format code: `npm run prettier:fix`

### Development Mode
- Development with hot reload: `npm run start` -- starts nodemon with TypeScript support.
- Production mode: `npm run start:node` -- requires build first.

### CLI Usage
- Get help: `node dist/src/index.js --help`
- Scrape latest news: `node dist/src/index.js news`
- Scrape specific news: `node dist/src/index.js news <news-url>`
- Scrape poll: `node dist/src/index.js poll <poll-url>`
- Scrape worlds: `node dist/src/index.js worlds`

### Browser Requirements for Scraping
- **IMPORTANT**: Scraping commands require Chrome/Chromium to be installed for Puppeteer.
- Install Chrome: `npx puppeteer browsers install chrome` -- may fail in restricted networks.
- Alternative: `sudo apt-get install chromium-browser` -- may fail due to snap dependency issues.
- **LIMITATION**: In restricted environments, scraping functionality may not work due to browser installation failures.

## Validation

### Code Quality
- **ALWAYS** run `npm run lint` and `npm run prettier:fix` before committing or CI will fail.
- Pre-commit hooks automatically run lint-staged via Husky.
- All linting issues must be resolved before CI passes.

### Testing
- Run all tests: `npm run test` -- 84 tests in 27 suites with snapshot testing.
- Watch mode for development: `npm run test:watch` -- press 'a' to run all tests, 'q' to quit.
- Tests include comprehensive coverage of HTML parsing, MediaWiki transformers, and utilities.
- **DO NOT** modify tests to make them pass unless fixing actual bugs.

### Manual Validation Scenarios
- **CLI Help**: Run `node dist/src/index.js --help` to verify CLI structure.
- **Development Mode**: Start `npm run start` and verify nodemon works correctly.
- **Build Output**: Check `dist/` directory is created after build.
- **Linting**: Verify no new ESLint errors are introduced.

## Command Timeouts and Timing Expectations

- `npm install`: 15 seconds (with PUPPETEER_SKIP_DOWNLOAD=true)
- `npm run build`: 7 seconds -- NEVER CANCEL
- `npm run lint`: 2 seconds
- `npm run test`: 8 seconds -- NEVER CANCEL, set timeout to 30+ seconds
- `npm run prettier`: 1 second
- Development startup: 3-5 seconds

## CI/CD Information

### GitHub Actions Workflows
- **Pull Request**: Requires changeset file + lint/build/test
- **Push to Main**: Runs lint/build/test + creates release PR via changesets
- **CI Command**: All workflows use `npm ci` for dependency installation
- **Node Version**: Uses Node.js 20 in CI

### Changeset Workflow
- Create changeset: `npx changeset`
- Merging PR with changeset creates release PR
- Merging release PR publishes new version

## Common Tasks

### Repository Structure
```
src/
├── cli/                 # Command-line interface
│   ├── commands/        # CLI command implementations
│   └── cli.ts          # Main CLI setup with Commander.js
├── config/             # Environment configuration
├── scrapers/           # Web scraping modules
│   ├── news/           # News post scraping
│   ├── polls/          # Poll scraping
│   └── worlds/         # World list scraping
├── utils/              # Utility functions
├── index.ts            # Application entry point
└── scraper.ts          # Main Puppeteer scraper class
```

### Key Files
- `package.json` -- contains all npm scripts and dependencies
- `tsconfig.json` -- TypeScript configuration with path mapping
- `jest.config.js` -- Jest test configuration with ts-jest
- `.eslintrc.js` -- ESLint configuration for TypeScript
- `prettier.config.js` -- Prettier code formatting rules
- `.husky/pre-commit` -- Git hook for running lint-staged

### Dependencies Overview
- **Runtime**: Commander.js (CLI), Puppeteer (scraping), node-html-parser (parsing)
- **Build**: TypeScript, ts-patch, typescript-transform-paths
- **Testing**: Jest, ts-jest
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Releases**: Changesets

### Adding New Commands
1. Create command file in `src/cli/commands/`
2. Implement using Commander.js pattern
3. Add scraper logic in `src/scrapers/`
4. Add tests in `__tests__/` directories
5. Export from appropriate index files

### Working with MediaWiki Content
- Uses `@osrs-wiki/mediawiki-builder` package for content creation
- Transformers convert HTML to MediaWiki format
- Output includes templates, files, and formatted text

### Environment Variables
- `NODE_ENV` -- Set to 'test' for testing
- `PUPPETEER_SKIP_DOWNLOAD` -- Skip Chrome download during npm install
- Uses `.env.test` for test configuration

## Known Issues and Limitations

- **Network Dependencies**: Puppeteer Chrome download may fail in restricted networks
- **Browser Requirements**: Scraping requires Chrome/Chromium installation
- **ESLint Warnings**: Two unused import warnings exist (MediaWikiBreak, MediaWikiExternalLink)
- **Snap Dependencies**: Chromium installation via apt may fail due to snap issues

## Debugging and Troubleshooting

- Check build output in `dist/` directory after compilation
- Use `npm run start` for development with hot reload
- Test individual commands: `node dist/src/index.js <command> --help`
- View comprehensive logs during scraping operations
- Use Jest watch mode for iterative test development