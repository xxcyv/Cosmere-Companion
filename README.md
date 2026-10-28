# Cosmere Reading Order Companion

Local single-page web app that visualizes Cosmere books as a dependency map and helps with both reading-order planning and dependency exploration.

## Quick Start

1. Open [index.html](index.html) in a browser.
2. Use the controls at the top to filter links and formats.
3. Click or right-click books to activate the two selection/filtering modes.

No build step is required.

## Implemented Features

### 1. Data-driven graph rendering

- Source of truth is [data/books-data.js](data/books-data.js) via `window.BOOK_DATA`.
- Books are rendered as boxes and dependencies as SVG arrows.
- Horizontal placement is dependency-aware (prerequisites appear to the left).

### 2. Row grouping and layout

- Rows are grouped by series + setting.
- Rows are ordered using `seriesOrder` and `settingOrder` from data.
- Within a row, boxes are stacked to avoid direct overlaps.
- Novels and novella-like formats are split into separate internal lanes in the same row when both are present.

### 3. Link types and link filtering

Supported link types:

- `required`
- `recommended`
- `nice_to_have`

Link display filter options:

- All link types
- Show only required links
- Show required + recommended links

Arrows and right-click direct-dependency results respect the selected link display mode.

### 4. Format support and format filtering

Supported formats:

- `Novel`
- `Novella`
- `Short Story`
- `Graphic Novel`

`Short Story` is handled like `Novella` in filtering and lane behavior.
`Graphic Novel` is handled like `Novel` in filtering and lane behavior.

Format filters:

- Show only Novels
- Show only Novellas/Short Stories

### 5. Left-click dependency exploration mode

- Left-click a book to focus its dependency neighborhood.
- This shows ancestor/descendant context for that specific book (overview mode).
- Left-click the same book again to clear left-click focus.

### 6. Right-click multi-select "next-read" mode

- Right-click toggles per-book selection (right-click again to unselect that book).
- Multiple books can be selected at once.
- Filter shows only:
  - right-click selected books
  - direct outgoing dependencies to the right
  - candidates that do not have any left-side dependency from an unselected book
- This is designed to answer: "Given what I already read, what can I read next?"

### 7. Clear action

- The `Clear selected book` button clears both:
  - left-click single selection
  - right-click multi-selection

### 8. Localization (EN/DE mode)

- Toggle German mode from the header.
- UI labels, legend text, series/setting labels, and format labels are localized.
- German title behavior:
  - Uses `germanTitles` if available
  - Falls back to original title with `*` marker if unavailable

### 9. Legend and guidance

Legend includes:

- line style meaning (`required`, `recommended`, `nice_to_have`)
- click-filtering explanation (left-click vs right-click purpose)
- Arcanum note
- German availability note (shown contextually in German mode)

### 10. Visual and interaction polish

- Series-based row background coloring.
- Prominent selected-book highlighting.
- Drag-to-pan on the board surface (no text gets selected while dragging).
- Alt+click a box to select and copy its title without triggering the click filters.
- Responsive layout for smaller screens.

## User Manual

### Main workflow

1. Open the map and identify your current progress.
2. Right-click all books you already read.
3. Use `Link display` to choose how strict the dependency interpretation should be.
4. Read the remaining visible right-side candidates as your next options.

### Detailed controls

- Left-click a book:
  - dependency overview mode for that one target
  - good for understanding "what leads to this book"
- Right-click a book:
  - add/remove from multi-select read-history set
  - good for finding next possible books
- Clear selected book:
  - resets both click modes
- Link display:
  - narrows visible arrows and right-click dependency candidates by link type
- Show only Novels:
  - hides Novella/Short Story entries
- Show only Novellas/Short Stories:
  - hides Novel entries

### Recommended usage patterns

- Planning next read:
  - use right-click multi-select + required-only links
- Understanding spoilers/references:
  - switch to required + recommended
- Deep dependency inspection:
  - left-click a target end book

## Data Model Reference

Defined in [data/books-data.js](data/books-data.js):

- `settingOrder`: global setting row ordering
- `seriesOrder`: global series ordering
- `books`: array of book objects

Each book supports:

- `id` (string, unique)
- `title` (string)
- `germanTitles` (string[])
- `setting` (string)
- `series` (string)
- `format` (`Novel`, `Novella`, `Short Story`, `Graphic Novel`)
- `arcanumUnbounded` (boolean)
- `dependencies` (array of `{ id, type }`)

Dependency `type` values:

- `required`
- `recommended`
- `nice_to_have`

## Project Structure

- [index.html](index.html): UI structure, controls, legend, template.
- [styles.css](styles.css): visual design, responsive behavior, highlight states.
- [app.js](app.js): layout engine, rendering, filtering, localization, interactions.
- [data/books-data.js](data/books-data.js): all content and ordering metadata.
