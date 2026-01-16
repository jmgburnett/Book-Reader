# CLAUDE.md - AI Assistant Guide for Book Reader

## Project Overview

**Book Reader** is a digital book reading application designed to provide a seamless reading experience for various book formats. This document serves as a comprehensive guide for AI assistants working on this codebase.

---

## Table of Contents

1. [Repository Status](#repository-status)
2. [Project Architecture](#project-architecture)
3. [Directory Structure](#directory-structure)
4. [Development Workflow](#development-workflow)
5. [Code Conventions](#code-conventions)
6. [Testing Strategy](#testing-strategy)
7. [Documentation Standards](#documentation-standards)
8. [Git Workflow](#git-workflow)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)
10. [Common Tasks](#common-tasks)

---

## Repository Status

**Current State:** This is a new repository. The initial codebase is being established.

**Tech Stack:** (To be determined based on initial setup)
- Frontend: TBD (React, Vue, or vanilla JavaScript)
- Backend: TBD (Node.js, Python, or other)
- Database: TBD (SQLite, PostgreSQL, MongoDB, or other)
- Build Tools: TBD

**Key Dependencies:** To be documented as they are added.

---

## Project Architecture

### Core Components

1. **Reader Interface**
   - Book rendering engine
   - Page navigation
   - Annotation and highlighting
   - Bookmarking system

2. **Library Management**
   - Book collection organization
   - Metadata management
   - Search and filtering
   - Collections/categories

3. **File Processing**
   - Format parsers (EPUB, PDF, MOBI, TXT, etc.)
   - Text extraction
   - Image handling
   - Format conversion

4. **User Settings**
   - Reading preferences (font, size, theme)
   - Layout customization
   - Progress tracking
   - Sync capabilities

### Design Principles

- **Performance First:** Optimize for fast loading and smooth reading experience
- **Accessibility:** Support screen readers and keyboard navigation
- **Modularity:** Keep components decoupled and reusable
- **Progressive Enhancement:** Core reading functionality works everywhere
- **Privacy:** User data and reading preferences stored locally by default

---

## Directory Structure

The following structure should be followed as the project develops:

```
Book-Reader/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── core/              # Core business logic
│   │   ├── parsers/       # Format parsers (EPUB, PDF, etc.)
│   │   ├── reader/        # Reading engine
│   │   └── library/       # Library management
│   ├── services/          # External services and APIs
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles and themes
│   ├── types/             # TypeScript type definitions
│   └── config/            # Configuration files
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                  # Documentation
│   ├── api/              # API documentation
│   ├── architecture/     # Architecture decisions
│   └── user-guide/       # User documentation
├── public/               # Static assets
│   ├── fonts/           # Font files
│   ├── icons/           # Icon assets
│   └── images/          # Image assets
├── scripts/              # Build and utility scripts
├── .github/             # GitHub configurations
│   └── workflows/       # CI/CD workflows
└── config/              # Build tool configurations
```

---

## Development Workflow

### Branch Strategy

- **main/master:** Production-ready code
- **develop:** Integration branch for features
- **claude/*:** AI assistant working branches (temporary)
- **feature/*:** New feature development
- **bugfix/*:** Bug fixes
- **hotfix/*:** Emergency production fixes

### Before Making Changes

1. **Understand the Context:**
   - Read relevant existing code
   - Check for related issues or PRs
   - Review recent commits in the affected area

2. **Plan the Implementation:**
   - Break down complex tasks into smaller steps
   - Use TodoWrite tool to track progress
   - Identify files that need changes

3. **Verify Assumptions:**
   - Ask clarifying questions if requirements are unclear
   - Use AskUserQuestion tool when multiple approaches are viable

### Making Changes

1. **Read Before Writing:**
   - Always read files before modifying them
   - Understand existing patterns and conventions
   - Maintain consistency with surrounding code

2. **Minimal Changes:**
   - Make only necessary changes
   - Avoid refactoring unrelated code
   - Don't add features beyond the request

3. **Code Quality:**
   - Follow existing code style
   - Add comments only where logic is non-obvious
   - Ensure proper error handling at system boundaries

4. **Security:**
   - Validate user input
   - Sanitize data before rendering
   - Avoid common vulnerabilities (XSS, SQL injection, etc.)

### After Making Changes

1. **Test Your Changes:**
   - Run existing tests
   - Add tests for new functionality
   - Verify in the application if possible

2. **Document if Needed:**
   - Update API documentation for interface changes
   - Add JSDoc comments for public functions
   - Update README if user-facing features changed

3. **Commit and Push:**
   - Write clear, descriptive commit messages
   - Use conventional commit format (feat:, fix:, docs:, etc.)
   - Push to the appropriate branch

---

## Code Conventions

### General Principles

- **DRY (Don't Repeat Yourself):** Extract common logic, but avoid premature abstraction
- **YAGNI (You Aren't Gonna Need It):** Don't add functionality until it's needed
- **KISS (Keep It Simple, Stupid):** Prefer simple solutions over complex ones

### Naming Conventions

```javascript
// Variables and functions: camelCase
const bookTitle = "Example Book";
function loadBook(bookId) { }

// Classes and Components: PascalCase
class BookReader { }
const BookViewer = () => { }

// Constants: UPPER_SNAKE_CASE
const MAX_BOOK_SIZE = 50 * 1024 * 1024;

// Private methods/properties: prefix with underscore
class Reader {
  _privateMethod() { }
}

// Files: kebab-case for multi-word files
// book-reader.js, library-manager.js
```

### File Organization

- One component/class per file
- Group related functionality in directories
- Index files for clean imports
- Keep files under 300 lines when possible

### Comments

- Write self-documenting code first
- Add comments for "why", not "what"
- Document complex algorithms
- Use JSDoc for public APIs

```javascript
// Good: Explains why
// Use binary search since books array is sorted by title
const index = binarySearch(books, title);

// Bad: States the obvious
// Loop through books
for (const book of books) { }

// Good: JSDoc for public API
/**
 * Loads a book from the library by its ID
 * @param {string} bookId - Unique identifier for the book
 * @returns {Promise<Book>} The loaded book object
 * @throws {BookNotFoundError} If book doesn't exist
 */
async function loadBook(bookId) { }
```

### Error Handling

```javascript
// Validate at boundaries
function addBookToLibrary(book) {
  if (!book || !book.id) {
    throw new Error('Invalid book object');
  }
  // ... proceed with valid data
}

// Don't over-validate internal code
function _processBookMetadata(book) {
  // Trust that book is valid since it's internal
  return book.metadata;
}

// Use specific error types
class BookNotFoundError extends Error {
  constructor(bookId) {
    super(`Book not found: ${bookId}`);
    this.name = 'BookNotFoundError';
  }
}
```

---

## Testing Strategy

### Test Structure

```
tests/
├── unit/              # Fast, isolated tests
├── integration/       # Tests for component interaction
└── e2e/              # Full user workflow tests
```

### Testing Guidelines

1. **Unit Tests:**
   - Test individual functions and methods
   - Mock external dependencies
   - Fast execution (< 100ms per test)
   - High coverage for core logic

2. **Integration Tests:**
   - Test component interactions
   - Use real dependencies when practical
   - Focus on critical paths

3. **E2E Tests:**
   - Test user workflows
   - Cover happy paths and critical errors
   - Run in CI/CD pipeline

### Test Naming

```javascript
describe('BookReader', () => {
  describe('loadBook', () => {
    it('should load a valid book successfully', () => {});
    it('should throw BookNotFoundError for invalid ID', () => {});
    it('should cache loaded books for performance', () => {});
  });
});
```

### When to Write Tests

- **New features:** Add tests for core functionality
- **Bug fixes:** Add regression test first
- **Refactoring:** Ensure existing tests pass
- **Don't test:** UI styling, trivial getters/setters

---

## Documentation Standards

### README.md

- Project description and features
- Installation instructions
- Quick start guide
- Links to detailed documentation

### API Documentation

- Document all public interfaces
- Include usage examples
- Document error conditions
- Keep synchronized with code

### Architecture Decisions

- Use ADR (Architecture Decision Records) for significant choices
- Store in `docs/architecture/`
- Include context, decision, and consequences

### Code Documentation

- JSDoc for public APIs
- Inline comments for complex logic
- TODO comments with issue references

```javascript
/**
 * BookReader manages the reading experience
 *
 * @example
 * const reader = new BookReader(bookId);
 * await reader.open();
 * reader.goToPage(5);
 */
class BookReader {
  // TODO: Add annotation support (issue #123)
}
```

---

## Git Workflow

### Commit Messages

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(reader): add EPUB support

Implement EPUB parser and renderer for displaying
EPUB format books in the reader interface.

Closes #45
```

```
fix(library): prevent duplicate books in collection

Add unique constraint check before adding books
to prevent duplicates in user's library.

Fixes #78
```

### Branch Naming

- `feature/add-pdf-support`
- `bugfix/fix-page-navigation`
- `hotfix/critical-security-patch`
- `claude/task-description-xxxxx` (AI assistant branches)

### Pull Requests

1. **Title:** Clear, descriptive summary
2. **Description:**
   - Summary of changes
   - Motivation and context
   - Testing performed
   - Screenshots (if UI changes)
3. **Review:** Request review before merging
4. **CI/CD:** Ensure all checks pass

---

## AI Assistant Guidelines

### General Principles

1. **Read First, Write Second:**
   - Always read files before modifying
   - Understand existing patterns
   - Maintain consistency

2. **Minimal Changes:**
   - Only change what's necessary
   - Avoid refactoring unrelated code
   - Don't add unrequested features

3. **Ask When Uncertain:**
   - Use AskUserQuestion for clarification
   - Don't guess at requirements
   - Verify assumptions about architecture

4. **Track Progress:**
   - Use TodoWrite for multi-step tasks
   - Mark tasks as in_progress, then completed
   - Keep user informed of progress

### Common Patterns

#### Reading a Book File

```javascript
// src/core/parsers/base-parser.js
class BaseParser {
  async parse(filePath) {
    const content = await this.readFile(filePath);
    const metadata = this.extractMetadata(content);
    const chapters = this.extractChapters(content);
    return { metadata, chapters };
  }
}
```

#### Managing Library State

```javascript
// src/core/library/library-manager.js
class LibraryManager {
  constructor() {
    this.books = new Map();
    this.collections = new Map();
  }

  addBook(book) {
    if (this.books.has(book.id)) {
      throw new Error('Book already exists');
    }
    this.books.set(book.id, book);
  }
}
```

#### Reader State Management

```javascript
// src/core/reader/reader-state.js
class ReaderState {
  constructor(book) {
    this.book = book;
    this.currentPage = 0;
    this.bookmarks = [];
    this.annotations = [];
  }

  goToPage(pageNumber) {
    if (pageNumber < 0 || pageNumber >= this.book.pageCount) {
      throw new RangeError('Invalid page number');
    }
    this.currentPage = pageNumber;
  }
}
```

### File Locations

- **Parsers:** `src/core/parsers/`
- **Reader logic:** `src/core/reader/`
- **Library management:** `src/core/library/`
- **UI components:** `src/components/`
- **Utilities:** `src/utils/`
- **Tests:** `tests/` (mirroring src structure)

### Security Checklist

- [ ] Validate file uploads (size, type)
- [ ] Sanitize user input before display
- [ ] Escape HTML in book content
- [ ] Prevent path traversal in file operations
- [ ] Implement CSRF protection for APIs
- [ ] Use secure headers
- [ ] Don't expose sensitive errors to users

### Performance Guidelines

1. **Lazy Loading:**
   - Load book content on demand
   - Paginate large libraries
   - Defer non-critical resources

2. **Caching:**
   - Cache parsed books
   - Cache rendered pages
   - Implement proper cache invalidation

3. **Optimization:**
   - Minimize DOM operations
   - Use virtual scrolling for large lists
   - Optimize image loading

---

## Common Tasks

### Adding a New Book Format

1. Create parser in `src/core/parsers/`
2. Extend BaseParser class
3. Implement format-specific parsing
4. Add tests in `tests/unit/parsers/`
5. Register parser in format registry
6. Update documentation

### Adding a Reader Feature

1. Identify feature location (reader, UI, both)
2. Update reader state if needed
3. Implement UI component
4. Wire up event handlers
5. Add tests
6. Update user documentation

### Fixing a Bug

1. Reproduce the bug
2. Write a failing test
3. Fix the bug
4. Verify test passes
5. Check for similar issues
6. Commit with descriptive message

### Adding Tests

1. Identify what to test (unit, integration, e2e)
2. Create test file in appropriate directory
3. Write descriptive test cases
4. Ensure tests are isolated
5. Run test suite to verify
6. Update CI configuration if needed

---

## Quick Reference

### Essential Commands

```bash
# Install dependencies (once tech stack is chosen)
npm install  # or yarn install, pip install -r requirements.txt

# Run development server
npm run dev  # or yarn dev, python manage.py runserver

# Run tests
npm test     # or yarn test, pytest

# Build for production
npm run build  # or yarn build

# Lint code
npm run lint  # or yarn lint

# Format code
npm run format  # or yarn format
```

### File References

When referencing code in responses, use the pattern:
```
src/core/reader/book-reader.js:42
```

This helps users navigate to the exact location.

### Important Files

- `CLAUDE.md` (this file): AI assistant guide
- `README.md`: User-facing documentation
- `package.json`: Dependencies and scripts (if Node.js)
- `.gitignore`: Ignored files
- `LICENSE`: Project license

---

## Revision History

| Date       | Version | Changes                           |
|------------|---------|-----------------------------------|
| 2026-01-16 | 1.0.0   | Initial creation of CLAUDE.md     |

---

## Notes for Future Updates

This document should be updated when:

- Tech stack is chosen and implemented
- Major architectural decisions are made
- New conventions are established
- Development workflow changes
- New common patterns emerge

Keep this document as a single source of truth for AI assistants working on this codebase.

---

**Last Updated:** 2026-01-16
**Maintained By:** AI Assistants working on this repository
**Questions?** Check the issues or discussions in the repository.
