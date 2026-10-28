// Cache key DOM elements once for faster access.
const board = document.getElementById("board");
const template = document.getElementById("book-template");
const linkModeFilter = document.getElementById("filter-link-mode");
const bookModeFilter = document.getElementById("filter-book-mode");
const clearFocusBtn = document.getElementById("clear-focus");
const germanModeToggle = document.getElementById("german-mode");
const INTERACTIVE_ELEMENTS_SELECTOR = "button, input, select, textarea";
const SVG_NS = "http://www.w3.org/2000/svg";
const ROW_KEY_SEPARATOR = "|||";
const LINK_TYPE_REQUIRED = "required";
const LINK_TYPE_RECOMMENDED = "recommended";
const LINK_TYPE_NICE_TO_HAVE = "nice_to_have";
const LINK_MODE_ALL = "all";
const LINK_MODE_REQUIRED = "required";
const LINK_MODE_REQUIRED_RECOMMENDED = "required_recommended";
const LINK_MODE_NICE_TO_HAVE = "nice_to_have";
const BOOK_MODE_ALL = "all";
const BOOK_MODE_NOVELS = "novels";
const BOOK_MODE_NOVELLAS = "novellas";
const FORMAT_NOVEL = "Novel";
const FORMAT_NOVELLA = "Novella";
const FORMAT_SHORT_STORY = "Short Story";
const FALLBACK_ROW_BAND_COLOR = "rgba(160, 160, 160, 0.12)";

// Centralized references for translatable UI text nodes.
const uiRefs = {
  appTitle: document.getElementById("app-title"),
  appSubtitle: document.getElementById("app-subtitle"),
  germanModeLabel: document.getElementById("german-mode-label"),
  legendLineStylesTitle: document.getElementById("legend-line-styles-title"),
  legendRequiredLabel: document.getElementById("legend-required-label"),
  legendRequiredText: document.getElementById("legend-required-text"),
  legendRecommendedLabel: document.getElementById("legend-recommended-label"),
  legendRecommendedText: document.getElementById("legend-recommended-text"),
  legendNiceLabel: document.getElementById("legend-nice-label"),
  legendNiceText: document.getElementById("legend-nice-text"),
  legendArcanumBlock: document.getElementById("legend-arcanum-note-block"),
  legendArcanumTitle: document.getElementById("legend-arcanum-title"),
  legendArcanumText: document.getElementById("legend-arcanum-text"),
  legendGermanBlock: document.getElementById("legend-german-note-block"),
  legendGermanTitle: document.getElementById("legend-german-title"),
  legendGermanText: document.getElementById("legend-german-text"),
  legendControlsTitle: document.getElementById("legend-controls-title"),
  legendClickTitle: document.getElementById("legend-click-title"),
  legendClickLeftText: document.getElementById("legend-click-left-text"),
  legendClickRightText: document.getElementById("legend-click-right-text"),
  legendCopyTitle: document.getElementById("legend-copy-title"),
  legendCopyText: document.getElementById("legend-copy-text"),
  legendPanTitle: document.getElementById("legend-pan-title"),
  legendPanText: document.getElementById("legend-pan-text"),
  filterLinkLabel: document.getElementById("filter-link-label"),
  filterLinkAll: document.getElementById("filter-link-all"),
  filterLinkRequired: document.getElementById("filter-link-required"),
  filterLinkRequiredRecommended: document.getElementById("filter-link-required-recommended"),
  filterBookLabel: document.getElementById("filter-book-label"),
  filterBookAll: document.getElementById("filter-book-all"),
  filterBookNovels: document.getElementById("filter-book-novels"),
  filterBookNovellas: document.getElementById("filter-book-novellas"),
};

// [element, copy key] pairs applied as plain text (or HTML for the notes below) on language change.
const TEXT_BINDINGS = [
  [uiRefs.appTitle, "appTitle"],
  [uiRefs.appSubtitle, "appSubtitle"],
  [uiRefs.germanModeLabel, "germanModeLabel"],
  [uiRefs.legendLineStylesTitle, "legendLineStylesTitle"],
  [uiRefs.legendRequiredLabel, "requiredLabel"],
  [uiRefs.legendRequiredText, "requiredText"],
  [uiRefs.legendRecommendedLabel, "recommendedLabel"],
  [uiRefs.legendRecommendedText, "recommendedText"],
  [uiRefs.legendNiceLabel, "niceLabel"],
  [uiRefs.legendNiceText, "niceText"],
  [uiRefs.legendArcanumTitle, "arcanumTitle"],
  [uiRefs.legendGermanTitle, "germanTitle"],
  [uiRefs.legendControlsTitle, "controlsTitle"],
  [uiRefs.legendClickTitle, "clickTitle"],
  [uiRefs.legendClickLeftText, "clickLeftText"],
  [uiRefs.legendClickRightText, "clickRightText"],
  [uiRefs.legendCopyTitle, "copyTitle"],
  [uiRefs.legendCopyText, "copyText"],
  [uiRefs.legendPanTitle, "panTitle"],
  [uiRefs.legendPanText, "panText"],
  [uiRefs.filterLinkLabel, "filterLinkLabel"],
  [uiRefs.filterLinkAll, "filterLinkAll"],
  [uiRefs.filterLinkRequired, "filterLinkRequired"],
  [uiRefs.filterLinkRequiredRecommended, "filterLinkRequiredRecommended"],
  [uiRefs.filterBookLabel, "filterBookLabel"],
  [uiRefs.filterBookAll, "filterBookAll"],
  [uiRefs.filterBookNovels, "filterBookNovels"],
  [uiRefs.filterBookNovellas, "filterBookNovellas"],
  [clearFocusBtn, "clearFocus"],
];

// Notes contain markup (<sup>), so they are set via innerHTML from trusted static copy.
const HTML_BINDINGS = [
  [uiRefs.legendArcanumText, "arcanumText"],
  [uiRefs.legendGermanText, "germanText"],
];

// Global UI state used by rendering and filters.
const state = {
  focusId: null,
  linkMode: LINK_MODE_ALL,
  bookMode: BOOK_MODE_ALL,
  isGerman: false,
};

// Tracks books selected via right-click for next-read filtering.
const rightClickSelectedIds = new Set();

// Language copy and display labels.
const copy = {
  en: {
    lang: "en",
    pageTitle: "Cosmere Companion",
    appTitle: "Cosmere Reading Order Companion",
    appSubtitle: "Which book should you read next?",
    germanModeLabel: "German mode",
    legendLineStylesTitle: "Line Styles and Meaning",
    requiredLabel: "Required:",
    requiredText: "Must read to understand the story.",
    recommendedLabel: "Recommended:",
    recommendedText: "Avoid spoilers or understand subplots and major references.",
    niceLabel: "Nice to have:",
    niceText: "Understand minor references or bigger eastereggs.",
    arcanumTitle: "Note",
    arcanumText: "<sup>AU</sup> - Entries are included in Arcanum Unbounded.",
    germanTitle: "German Availability",
    germanText: "<sup>E</sup> - Entries are not available in German.",
    controlsTitle: "Controls",
    clickTitle: "Selection Filtering",
    clickLeftText: "Left-click: Shows the full dependency overview for a specific book.",
    clickRightText: "Right-click: Select all books you've already read to see the next readable books.",
    copyTitle: "Copying Titles",
    copyText: "Alt+Click: Copies the selected book title to the clipboard.",
    panTitle: "Moving the Diagram",
    panText: "You can move the diagram sideways by dragging it with the cursor.",
    filterLinkLabel: "Link display",
    filterLinkAll: "All link types",
    filterLinkRequired: "Show only required links",
    filterLinkRequiredRecommended: "Show required + recommended links",
    filterBookLabel: "Book display",
    filterBookAll: "Show all books",
    filterBookNovels: "Show only Novels",
    filterBookNovellas: "Show only Novellas and Short Stories",
    clearFocus: "Clear selection",
    formats: {
      [FORMAT_NOVEL]: "Novel",
      [FORMAT_NOVELLA]: "Novella",
      [FORMAT_SHORT_STORY]: "Short Story",
    },
    series: {
      Mistborn: "Mistborn",
      "Stormlight Archive": "The Stormlight Archive",
      Elantris: "Elantris",
      Standalones: "Standalones",
    },
    settings: {
      Scadrial: "Scadrial",
      Roshar: "Roshar",
      Elantris: "Elantris",
      Nalthis: "Nalthis",
      Taldain: "Taldain",
      Canticle: "Canticle",
      Lumar: "Lumar",
      Komashi: "Komashi",
      Threnody: "Threnody",
      "First of the Sun": "First of the Sun",
    },
  },
  de: {
    lang: "de",
    pageTitle: "Kosmeer Ratgeber",
    appTitle: "Kosmeer Lesereihenfolge-Ratgeber",
    appSubtitle: "Welches Buch solltest du als Nächstes lesen?",
    germanModeLabel: "Deutscher Modus",
    legendLineStylesTitle: "Linienstile und Bedeutung",
    requiredLabel: "Pflicht:",
    requiredText: "Muss gelesen werden, um die Geschichte zu verstehen.",
    recommendedLabel: "Empfohlen:",
    recommendedText: "Vermeidet Spoiler oder hilft, Nebenhandlungen und größere Referenzen zu verstehen.",
    niceLabel: "Gut zu haben:",
    niceText: "Hilft, kleinere Referenzen oder größere Easter Eggs zu verstehen.",
    arcanumTitle: "Arcanum-Hinweis",
    arcanumText: "<sup>AU</sup> - Einträge sind in Arcanum Unbounded enthalten.",
    germanTitle: "Hinweis",
    germanText: "<sup>E</sup> - Einträge sind nicht auf Deutsch verfügbar.",
    controlsTitle: "Steuerung",
    clickTitle: "Auswahl-Filter",
    clickLeftText: "Linksklick: Zeigt die vollständige Abhängigkeitsübersicht für ein bestimmtes Buch.",
    clickRightText: "Rechtsklick: Wähle alle Bücher aus, die du bereits gelesen hast, um die nächsten lesbaren Bücher zu sehen.",
    copyTitle: "Titel kopieren",
    copyText: "Alt+Klick: Kopiert den ausgewählten Buchtitel in die Zwischenablage.",
    panTitle: "Diagramm verschieben",
    panText: "Du kannst das Diagramm seitlich verschieben, indem du es mit dem Cursor ziehst.",
    filterLinkLabel: "Verknüpfungen",
    filterLinkAll: "Alle Verknüpfungstypen",
    filterLinkRequired: "Nur Pflicht-Verknüpfungen anzeigen",
    filterLinkRequiredRecommended: "Pflicht- und empfohlene Verknüpfungen anzeigen",
    filterBookLabel: "Bücher",
    filterBookAll: "Alle Bücher anzeigen",
    filterBookNovels: "Nur Romane anzeigen",
    filterBookNovellas: "Nur Novellen und Kurzgeschichten anzeigen",
    clearFocus: "Auswahl zurücksetzen",
    formats: {
      [FORMAT_NOVEL]: "Roman",
      [FORMAT_NOVELLA]: "Novelle",
      [FORMAT_SHORT_STORY]: "Kurzgeschichte",
    },
    series: {
      Mistborn: "Die Nebelgeborenen",
      "Stormlight Archive": "Die Sturmlicht-Chroniken",
      Elantris: "Elantris",
      Standalones: "Einzelwerke",
    },
    settings: {
      Scadrial: "Scadrial",
      Roshar: "Roschar",
      Elantris: "Elantris",
      Nalthis: "Nalthis",
      Taldain: "Taldain",
      Canticle: "Canticle",
      Lumar: "Lumar",
      Komashi: "Komashi",
      Threnody: "Threnody",
      "First of the Sun": "First of the Sun",
    },
  },
};

// Palette used to color series row bands.
const SERIES_COLOR_POOL = [
  "rgba(145, 120, 196, 0.17)",
  "rgba(122, 185, 255, 0.16)",
  "rgba(255, 194, 110, 0.17)",
  "rgba(130, 204, 126, 0.18)",
  "rgba(111, 188, 166, 0.18)",
  "rgba(175, 204, 117, 0.17)",
  "rgba(237, 163, 110, 0.18)",
  "rgba(171, 158, 230, 0.16)",
];

init();

async function init() {
  // Bootstrap data, initial render, and event wiring.
  try {
    const data = await loadData();
    const graph = createGraph(data);
    applyLanguage(graph);
    render(graph);
    setupDragToPan(board);

    linkModeFilter.addEventListener("change", () => {
      state.linkMode = linkModeFilter.value;
      updateVisibility(graph);
    });

    bookModeFilter.addEventListener("change", () => {
      state.bookMode = bookModeFilter.value;
      updateVisibility(graph);
    });

    clearFocusBtn.addEventListener("click", () => {
      state.focusId = null;
      rightClickSelectedIds.clear();
      updateVisibility(graph);
    });

    germanModeToggle.addEventListener("change", () => {
      state.isGerman = germanModeToggle.checked;
      applyLanguage(graph);
      render(graph);
    });

    window.addEventListener("resize", () => redrawEdges(graph));
  } catch (error) {
    showLoadError(error);
  }
}

function setupDragToPan(container) {
  // Enables click-and-drag panning on the board background.
  let pointerDown = false;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;

  container.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    // Reset any previous box text selection.
    window.getSelection().removeAllRanges();
    container.querySelector(".book.text-selectable")?.classList.remove("text-selectable");

    // Alt+click on a box selects its text instead of panning.
    const bookEl = event.target.closest(".book");
    if (event.altKey && bookEl) {
      bookEl.classList.add("text-selectable");
      return;
    }

    if (event.target.closest(INTERACTIVE_ELEMENTS_SELECTOR)) {
      return;
    }

    pointerDown = true;
    dragging = false;
    startX = event.clientX;
    startY = event.clientY;
    startScrollLeft = container.scrollLeft;
    startScrollTop = container.scrollTop;
    container.setPointerCapture(event.pointerId);
  });

  // Boxes are buttons and can't be drag-selected, so Alt+click selects and copies the title.
  container.addEventListener("mousedown", (event) => {
    const bookEl = event.target.closest(".book");
    const titleEl = bookEl?.querySelector(".book-title-list");
    if (event.button !== 0 || !event.altKey || !titleEl) {
      return;
    }
    event.preventDefault();
    const range = document.createRange();
    range.selectNodeContents(titleEl);
    const selection = window.getSelection();
    selection.addRange(range);
    navigator.clipboard.writeText(selection.toString()).catch(() => document.execCommand("copy"));
  });

  container.addEventListener("pointermove", (event) => {
    if (!pointerDown) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!dragging && Math.abs(deltaX) < 3 && Math.abs(deltaY) < 3) {
      return;
    }

    dragging = true;
    container.classList.add("dragging");
    document.body.classList.add("is-panning");

    container.scrollLeft = startScrollLeft - deltaX;
    container.scrollTop = startScrollTop - deltaY;
    event.preventDefault();
  });

  const stopDragging = (event) => {
    if (pointerDown && container.hasPointerCapture(event.pointerId)) {
      container.releasePointerCapture(event.pointerId);
    }
    pointerDown = false;
    dragging = false;
    container.classList.remove("dragging");
    document.body.classList.remove("is-panning");
  };

  container.addEventListener("pointerup", stopDragging);
  container.addEventListener("pointercancel", stopDragging);
}

async function loadData() {
  // Reads embedded dataset from books-data.js.
  if (window.BOOK_DATA && Array.isArray(window.BOOK_DATA.books)) {
    return window.BOOK_DATA;
  }

  throw new Error("BOOK_DATA is missing or invalid in data/books-data.js.");
}

function showLoadError(error) {
  // Displays a visible error when data cannot be loaded.
  const message = document.createElement("div");
  message.style.padding = "1rem";
  message.style.color = "#8a1f1f";
  message.style.fontWeight = "600";
  message.textContent = `Could not load book data. ${error.message}`;
  board.replaceChildren(message);
}

function applyLanguage(graph) {
  // Applies localized labels and mode-dependent UI visibility.
  const text = getCopy();

  document.documentElement.lang = text.lang;
  document.title = text.pageTitle;
  document.body.classList.toggle("german-mode", state.isGerman);

  for (const [element, key] of TEXT_BINDINGS) {
    if (element) {
      element.textContent = text[key];
    }
  }
  for (const [element, key] of HTML_BINDINGS) {
    if (element) {
      element.innerHTML = text[key];
    }
  }

  applyDynamicLabelColumnWidths(graph);

  uiRefs.legendArcanumBlock?.classList.toggle("hidden", state.isGerman);
  uiRefs.legendGermanBlock?.classList.toggle("hidden", !state.isGerman || !hasGermanUnavailableBooks(graph));
}

function applyDynamicLabelColumnWidths(graph) {
  // Expands sticky label columns when translated labels need more space.
  const rootStyles = getComputedStyle(document.documentElement);
  const bodyStyles = getComputedStyle(document.body);
  const defaultSeriesWidth = parseInt(rootStyles.getPropertyValue("--series-col-w"), 10) || 92;
  const defaultSettingWidth = parseInt(rootStyles.getPropertyValue("--setting-col-w"), 10) || 98;

  const rootFontSize = parseFloat(rootStyles.fontSize) || 16;
  const seriesFontSize = rootFontSize * 0.74;
  const settingFontSize = rootFontSize * 0.82;
  const fontFamily = bodyStyles.fontFamily || "Segoe UI, Tahoma, Geneva, Verdana, sans-serif";
  const seriesFont = `700 ${seriesFontSize}px ${fontFamily}`;
  const settingFont = `400 ${settingFontSize}px ${fontFamily}`;

  // Labels wrap at spaces, so the longest single word determines the minimum column width.
  const longestWordWidth = (labels, font) => Math.max(
    ...labels.flatMap((label) => label.split(/\s+/).filter(Boolean).map((word) => measureTextWidth(word, font))),
    0,
  );
  const seriesLabels = Array.from(new Set(graph.rows.map((row) => getSeriesLabel(row.series))));
  const settingLabels = graph.rows.map((row) => getSettingLabel(row.setting));

  const seriesPaddingPx = rootFontSize * 0.85;
  const settingPaddingPx = rootFontSize * 1.1;
  const finalSeriesWidth = Math.max(
    defaultSeriesWidth,
    Math.ceil(longestWordWidth(seriesLabels, seriesFont) + seriesPaddingPx),
  );
  const finalSettingWidth = Math.max(
    defaultSettingWidth,
    Math.ceil(longestWordWidth(settingLabels, settingFont) + settingPaddingPx),
  );

  document.body.style.setProperty("--series-col-w", `${finalSeriesWidth}px`);
  document.body.style.setProperty("--setting-col-w", `${finalSettingWidth}px`);
  document.body.style.setProperty("--label-w", `${finalSeriesWidth + finalSettingWidth}px`);
}

function measureTextWidth(text, font) {
  // Measures text width using a shared canvas context.
  const canvas = measureTextWidth._canvas || (measureTextWidth._canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width;
}

function getCopy() {
  // Returns active language dictionary.
  return state.isGerman ? copy.de : copy.en;
}

function getFormatLabel(format) {
  // Maps a format key to localized display text.
  return getCopy().formats[format] || format;
}

function isNovellaLike(format) {
  // Treat short stories like novellas for filtering/layout.
  return format === FORMAT_NOVELLA || format === FORMAT_SHORT_STORY;
}

function getSeriesLabel(series) {
  // Maps a series key to localized display text.
  return getCopy().series[series] || series;
}

function getSettingLabel(setting) {
  // Maps a setting key to localized display text.
  return getCopy().settings[setting] || setting;
}

function hasGermanUnavailableBooks(graph) {
  // Checks whether any entries are missing German alternative titles.
  return graph.books.some((book) => !book.germanTitles || book.germanTitles.length === 0);
}

function getRowKey(series, setting) {
  // Builds a stable composite key for row grouping.
  return `${series}${ROW_KEY_SEPARATOR}${setting}`;
}

function getBookTitleDisplay(book) {
  // Builds title lines and annotation marker based on active language.
  if (!state.isGerman) {
    return {
      lines: [book.title],
      marker: book.arcanumUnbounded ? "AU" : "",
      missingGerman: false,
    };
  }

  const germanTitles = book.germanTitles || [];
  if (germanTitles.length > 0) {
    const lines = germanTitles.length > 1
      ? germanTitles.map((title, index) => `${index + 1}. ${title}`)
      : [...germanTitles];

    return {
      lines,
      marker: "",
      missingGerman: false,
    };
  }

  return {
    lines: [book.title],
    marker: "E",
    missingGerman: true,
  };
}

function createGraph(data) {
  // Builds graph structures and computed placement metadata.
  const books = data.books.map((book) => ({ ...book }));
  const booksById = new Map(books.map((book) => [book.id, book]));
  const edges = [];

  for (const target of books) {
    for (const dep of target.dependencies) {
      if (!booksById.has(dep.id)) {
        continue;
      }
      edges.push({
        from: dep.id,
        to: target.id,
        type: dep.type || LINK_TYPE_REQUIRED,
      });
    }
  }

  // Edges in a stable order so redraws always paint in the same sequence.
  const drawOrderEdges = [...edges].sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to));

  const rows = buildRows(books, data);
  const placement = placeBooks(books, edges, rows);
  const rowLayout = buildRowLayout(placement.rowSlotCounts);
  const seriesPalette = buildSeriesPalette(data, books);

  for (const book of books) {
    const pos = placement.positions.get(book.id);
    book.col = pos.col;
    book.row = pos.row;
    book.stack = pos.stack;
    book.slotRow = rowLayout.rowStarts[pos.row] + pos.stack;
  }

  return {
    books,
    booksById,
    edges,
    drawOrderEdges,
    rows: rows.rowItems,
    seriesPalette,
    rowLayout,
    widthCols: placement.maxCol + 1,
    heightRows: rowLayout.totalSlots,
  };
}

function buildSeriesPalette(data, books) {
  // Assigns a repeatable band color to each series.
  const seriesOrder = Array.isArray(data.seriesOrder) ? data.seriesOrder : [];
  const seriesFromBooks = Array.from(new Set(books.map((book) => book.series)));
  const orderedSeries = [
    ...seriesOrder,
    ...seriesFromBooks.filter((series) => !seriesOrder.includes(series)),
  ];

  const palette = {};
  for (let i = 0; i < orderedSeries.length; i += 1) {
    palette[orderedSeries[i]] = SERIES_COLOR_POOL[i % SERIES_COLOR_POOL.length];
  }

  return palette;
}

function buildRowLayout(rowSlotCounts) {
  // Converts per-row slot counts into cumulative grid row starts.
  // Every row occupies at least one slot, even if it contains no books.
  const normalizedCounts = rowSlotCounts.map((count) => Math.max(1, count));
  const rowStarts = [];
  let cursor = 0;

  for (const count of normalizedCounts) {
    rowStarts.push(cursor);
    cursor += count;
  }

  return {
    rowStarts,
    rowSlotCounts: normalizedCounts,
    totalSlots: cursor,
  };
}

function buildRows(books, data) {
  // Creates ordered row definitions grouped by series and setting.
  const seriesOrder = data.seriesOrder || [];
  const settingOrder = data.settingOrder || [];

  const seriesRank = new Map(seriesOrder.map((v, i) => [v, i]));
  const settingRank = new Map(settingOrder.map((v, i) => [v, i]));
  const keySet = new Set(books.map((book) => getRowKey(book.series, book.setting)));

  // Unlisted series/settings sort last; ties fall back to alphabetical order.
  const rowItems = Array.from(keySet)
    .map((key) => {
      const [series, setting] = key.split(ROW_KEY_SEPARATOR);
      return {
        key,
        series,
        setting,
        seriesRank: seriesRank.has(series) ? seriesRank.get(series) : Number.MAX_SAFE_INTEGER,
        settingRank: settingRank.has(setting) ? settingRank.get(setting) : Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((a, b) => {
      if (a.seriesRank !== b.seriesRank) {
        return a.seriesRank - b.seriesRank;
      }
      if (a.settingRank !== b.settingRank) {
        return a.settingRank - b.settingRank;
      }
      if (a.setting !== b.setting) {
        return a.setting.localeCompare(b.setting);
      }
      return a.series.localeCompare(b.series);
    });

  const rowIndexByKey = new Map(rowItems.map((item, index) => [item.key, index]));
  return { rowItems, rowIndexByKey };
}

function placeBooks(books, edges, rows) {
  // Places books into columns/stacks while respecting dependencies.
  const booksById = new Map(books.map((book) => [book.id, book]));
  const rowIndexOf = (book) => rows.rowIndexByKey.get(getRowKey(book.series, book.setting));
  const incoming = new Map(books.map((b) => [b.id, []]));
  const outgoing = new Map(books.map((b) => [b.id, []]));
  const indegree = new Map(books.map((b) => [b.id, 0]));

  for (const edge of edges) {
    incoming.get(edge.to).push(edge.from);
    outgoing.get(edge.from).push(edge.to);
    indegree.set(edge.to, indegree.get(edge.to) + 1);
  }

  const zeroIndegreeIds = books
    .filter((b) => indegree.get(b.id) === 0)
    .map((b) => b.id)
    .sort();

  // Kahn's algorithm; the queue is re-sorted (row, then title) so the order is deterministic.
  const topologicalOrderIds = [];
  while (zeroIndegreeIds.length) {
    zeroIndegreeIds.sort((idA, idB) => {
      const bookA = booksById.get(idA);
      const bookB = booksById.get(idB);
      const rowA = rowIndexOf(bookA);
      const rowB = rowIndexOf(bookB);
      if (rowA !== rowB) {
        return rowA - rowB;
      }
      return bookA.title.localeCompare(bookB.title);
    });

    const current = zeroIndegreeIds.shift();
    topologicalOrderIds.push(current);

    for (const nxt of outgoing.get(current)) {
      indegree.set(nxt, indegree.get(nxt) - 1);
      if (indegree.get(nxt) === 0) {
        zeroIndegreeIds.push(nxt);
      }
    }
  }

  const positions = new Map();
  const rowFormatFlags = new Map(rows.rowItems.map((_, idx) => [idx, { hasNovel: false, hasNovella: false }]));
  const rowSlotCounts = Array.from({ length: rows.rowItems.length }, () => 0);
  const columnEntries = new Map();
  let maxCol = 0;

  // Record which rows mix novels with novellas/short stories.
  for (const book of books) {
    const flags = rowFormatFlags.get(rowIndexOf(book));
    if (book.format === FORMAT_NOVEL) {
      flags.hasNovel = true;
    }
    if (isNovellaLike(book.format)) {
      flags.hasNovella = true;
    }
  }

  // Column = one step right of the right-most prerequisite; books are then grouped per (row, column) cell.
  for (const id of topologicalOrderIds) {
    const book = booksById.get(id);
    const row = rowIndexOf(book);
    let col = 0;

    for (const pre of incoming.get(id)) {
      col = Math.max(col, positions.get(pre).col + 1);
    }

    const formatKey = isNovellaLike(book.format) ? FORMAT_NOVELLA : FORMAT_NOVEL;
    const columnKey = `${row}:${col}`;
    if (!columnEntries.has(columnKey)) {
      columnEntries.set(columnKey, { row, col, [FORMAT_NOVEL]: [], [FORMAT_NOVELLA]: [] });
    }

    // Books of one format sharing identical dependencies form one group.
    const dependencyKey = (book.dependencies || [])
      .map((dep) => `${dep.id}:${dep.type || LINK_TYPE_REQUIRED}`)
      .sort()
      .join(",");
    const groups = columnEntries.get(columnKey)[formatKey];
    let group = groups.find((candidate) => candidate.dependencyKey === dependencyKey);
    if (!group) {
      group = { dependencyKey, ids: [] };
      groups.push(group);
    }
    group.ids.push(id);

    positions.set(id, { row, col, stack: 0 });
    maxCol = Math.max(maxCol, col);
  }

  // Assign vertical stack positions inside each cell.
  for (const entry of columnEntries.values()) {
    const formatFlags = rowFormatFlags.get(entry.row);
    const hasBothFormats = formatFlags.hasNovel && formatFlags.hasNovella;
    const assign = (ids, startStack) => {
      ids.forEach((bookId, index) => {
        const stack = startStack + index;
        positions.get(bookId).stack = stack;
        rowSlotCounts[entry.row] = Math.max(rowSlotCounts[entry.row], stack + 1);
      });
    };

    // Rows with a single format simply stack novel groups first, then novella groups.
    if (!hasBothFormats) {
      let cursor = 0;
      for (const formatKey of [FORMAT_NOVEL, FORMAT_NOVELLA]) {
        for (const group of entry[formatKey]) {
          assign(group.ids, cursor);
          cursor += group.ids.length;
        }
      }
      continue;
    }

    // Pair the k-th novel group with the k-th novella group; novellas sit directly below the novels.
    const novelGroups = entry[FORMAT_NOVEL];
    const novellaGroups = entry[FORMAT_NOVELLA];
    const pairCount = Math.max(novelGroups.length, novellaGroups.length);
    let cursor = 0;
    for (let k = 0; k < pairCount; k += 1) {
      const novelIds = novelGroups[k] ? novelGroups[k].ids : [];
      const novellaIds = novellaGroups[k] ? novellaGroups[k].ids : [];
      const novelSize = Math.max(1, novelIds.length);
      assign(novelIds, cursor);
      assign(novellaIds, cursor + novelSize);
      cursor += novelSize + Math.max(1, novellaIds.length);
    }
  }

  return { positions, maxCol, rowSlotCounts };
}

function render(graph) {
  // Renders row bands, books, and the SVG edge layer.
  const layoutStyles = getComputedStyle(document.body);
  const slotHeight = parseInt(layoutStyles.getPropertyValue("--box-h"), 10) +
    parseInt(layoutStyles.getPropertyValue("--row-gap"), 10);
  const expandedSlotHeight = parseInt(layoutStyles.getPropertyValue("--box-h-expanded"), 10) +
    parseInt(layoutStyles.getPropertyValue("--row-gap"), 10);
  const colWidth = parseInt(layoutStyles.getPropertyValue("--box-w"), 10) +
    parseInt(layoutStyles.getPropertyValue("--col-gap"), 10);
  const rowSlotHeights = buildRowSlotHeights(graph, slotHeight, expandedSlotHeight);

  board.style.gridTemplateRows = rowSlotHeights.map((height) => `${height}px`).join(" ");
  board.style.gridTemplateColumns = `var(--label-w) repeat(${graph.widthCols}, ${colWidth}px)`;

  board.replaceChildren();

  // Three stacked layers share the board grid: row bands (back), SVG edges, then book boxes (front).
  const bandsLayer = createGridLayer("bands-layer");
  graph.rows.forEach((_, index) => bandsLayer.append(createRowBand(graph, index)));

  const arrowsLayer = createArrowsLayer();

  const booksLayer = createGridLayer("books-layer");
  const bookElements = new Map();
  for (const book of graph.books) {
    const element = createBookElement(graph, book);
    bookElements.set(book.id, element);
    booksLayer.append(element);
  }

  board.append(bandsLayer, arrowsLayer, booksLayer);

  graph._svg = arrowsLayer;
  graph._bookElements = bookElements;
  updateVisibility(graph);
}

function createGridLayer(className) {
  // Creates a layer that reuses the board's grid tracks.
  const layer = document.createElement("div");
  layer.className = className;
  layer.style.display = "grid";
  layer.style.gridTemplateRows = board.style.gridTemplateRows;
  layer.style.gridTemplateColumns = board.style.gridTemplateColumns;
  return layer;
}

function createArrowsLayer() {
  // Creates the SVG layer holding the shared arrowhead marker definition.
  const layer = document.createElementNS(SVG_NS, "svg");
  layer.classList.add("arrows-layer");

  const defs = document.createElementNS(SVG_NS, "defs");
  const marker = document.createElementNS(SVG_NS, "marker");
  marker.setAttribute("id", "arrowhead");
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "9");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "7");
  marker.setAttribute("markerHeight", "7");
  marker.setAttribute("orient", "auto-start-reverse");
  const tip = document.createElementNS(SVG_NS, "path");
  tip.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  tip.setAttribute("fill", "#2f3844");
  marker.append(tip);
  defs.append(marker);
  layer.append(defs);
  return layer;
}

function createRowBand(graph, index) {
  // Builds the colored band and sticky label for one series/setting row.
  const rowMeta = graph.rows[index];
  const prevRow = graph.rows[index - 1];
  const nextRow = graph.rows[index + 1];
  // Consecutive rows of the same series only show the series name once.
  const isSeriesStart = !prevRow || prevRow.series !== rowMeta.series;
  const isSeriesEnd = !nextRow || nextRow.series !== rowMeta.series;
  const start = graph.rowLayout.rowStarts[index] + 1;
  const end = start + graph.rowLayout.rowSlotCounts[index];

  const band = document.createElement("div");
  band.className = "row-band";
  band.style.gridColumn = "1 / -1";
  band.style.gridRow = `${start} / ${end}`;
  band.style.background = graph.seriesPalette[rowMeta.series] || FALLBACK_ROW_BAND_COLOR;

  const label = document.createElement("div");
  label.className = "row-label";
  label.classList.toggle("series-start", isSeriesStart);
  label.classList.toggle("series-end", isSeriesEnd);
  label.classList.toggle("series-continue", !isSeriesStart);
  label.innerHTML = `<span class="row-label-series">${isSeriesStart ? escapeHtml(getSeriesLabel(rowMeta.series)) : ""}</span><span class="row-label-setting">${escapeHtml(getSettingLabel(rowMeta.setting))}</span>`;
  band.append(label);
  return band;
}

function createBookElement(graph, book) {
  // Clones the book template, fills in localized text and wires click handlers.
  const item = template.content.firstElementChild.cloneNode(true);
  item.dataset.id = book.id;
  item.style.gridColumn = `${book.col + 2}`; // Column 1 is the label column.
  item.style.gridRow = `${book.slotRow + 1}`;

  const titleDisplay = getBookTitleDisplay(book);
  const lineCount = titleDisplay.lines.length;
  item.classList.toggle("book-multi-title", lineCount > 1);
  item.classList.toggle("book-missing-german", titleDisplay.missingGerman);

  // The annotation marker is attached to the last title line only.
  const markerHtml = titleDisplay.marker ? `<sup class="book-title-marker">${escapeHtml(titleDisplay.marker)}</sup>` : "";
  const titleLinesHtml = titleDisplay.lines
    .map((line, index) => `<span class="book-title-line">${escapeHtml(line)}${titleDisplay.marker && index === lineCount - 1 ? markerHtml : ""}</span>`)
    .join("");
  item.innerHTML = `<span class="book-title-list">${titleLinesHtml}</span><span class="meta">${escapeHtml(getFormatLabel(book.format))}</span>`;

  // Left-click toggles the dependency focus; right-click toggles the "already read" selection.
  item.addEventListener("click", (event) => {
    // Alt+click/drag is reserved for text selection.
    if (event.altKey || item.classList.contains("text-selectable")) {
      return;
    }
    state.focusId = state.focusId === book.id ? null : book.id;
    updateVisibility(graph);
  });
  item.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (rightClickSelectedIds.has(book.id)) {
      rightClickSelectedIds.delete(book.id);
    } else {
      rightClickSelectedIds.add(book.id);
    }
    updateVisibility(graph);
  });
  return item;
}

function buildRowSlotHeights(graph, slotHeight, expandedSlotHeight) {
  // Expands only slots containing a multi-line German title, keeping gaps between boxes uniform.
  const heights = new Array(graph.rowLayout.totalSlots).fill(slotHeight);

  if (state.isGerman) {
    for (const book of graph.books) {
      if (getBookTitleDisplay(book).lines.length > 1) {
        heights[book.slotRow] = expandedSlotHeight;
      }
    }
  }

  return heights;
}

function updateVisibility(graph) {
  // Applies active filters and selection state to books and edges.
  const relatedSet = state.focusId ? computeConnectedBooks(graph, state.focusId) : null;
  const directRelatedSet = rightClickSelectedIds.size > 0
    ? computeDirectlyConnectedBooks(graph, rightClickSelectedIds)
    : null;

  const visibleBookMap = new Map();
  for (const book of graph.books) {
    const visible = matchesBookMode(book)
      && (!relatedSet || relatedSet.has(book.id))
      && (!directRelatedSet || directRelatedSet.has(book.id));

    visibleBookMap.set(book.id, visible);
  }

  for (const [id, el] of graph._bookElements) {
    const isVisible = visibleBookMap.get(id);
    const isSelected = id === state.focusId || rightClickSelectedIds.has(id);
    el.classList.toggle("faded", !isVisible);
    el.classList.toggle("selected", isSelected);
    el.setAttribute("aria-pressed", isSelected ? "true" : "false");
  }

  redrawEdges(graph, visibleBookMap);
}

function redrawEdges(graph, visibleBookMap) {
  // Recomputes and redraws dependency curves for visible books.
  const svg = graph._svg;
  if (!svg) {
    return;
  }

  while (svg.lastChild && svg.lastChild.nodeName !== "defs") {
    svg.removeChild(svg.lastChild);
  }

  const boardRect = board.getBoundingClientRect();
  const rectsById = new Map();
  for (const [id, el] of graph._bookElements) {
    rectsById.set(id, el.getBoundingClientRect());
  }

  svg.setAttribute("width", `${board.scrollWidth}`);
  svg.setAttribute("height", `${board.scrollHeight}`);
  svg.setAttribute("viewBox", `0 0 ${board.scrollWidth} ${board.scrollHeight}`);

  const visibleEdges = [];

  for (const edge of graph.drawOrderEdges) {
    const src = rectsById.get(edge.from);
    const dst = rectsById.get(edge.to);
    if (!src || !dst) {
      continue;
    }

    const bothEndsVisible = !visibleBookMap || (visibleBookMap.get(edge.from) && visibleBookMap.get(edge.to));
    if (bothEndsVisible && matchesLinkMode(edge.type, state.linkMode)) {
      visibleEdges.push({ edge, src, dst });
    }
  }

  // Spread edges that share a node vertically so their anchor points do not overlap.
  assignAnchorSlots(
    groupBy(visibleEdges, (item) => item.edge.from).values(),
    (item) => item.dst,
    (item) => item.edge.to,
    (item, index, total) => {
      item.outIndex = index;
      item.outTotal = total;
    },
  );
  assignAnchorSlots(
    groupBy(visibleEdges, (item) => item.edge.to).values(),
    (item) => item.src,
    (item) => item.edge.from,
    (item, index, total) => {
      item.inIndex = index;
      item.inTotal = total;
    },
  );

  // Parallel edges between the same two books get separate lanes (curve offsets).
  const laneByPair = new Map();
  for (const item of visibleEdges) {
    const pairKey = `${item.edge.from}->${item.edge.to}`;
    const lane = laneByPair.get(pairKey) || 0;
    laneByPair.set(pairKey, lane + 1);
    item.lane = lane;
  }

  for (const item of visibleEdges) {
    const { edge, src, dst } = item;

    const x1 = src.right - boardRect.left + board.scrollLeft;
    const y1 = centerY(src) - boardRect.top + board.scrollTop + slotOffset(item.outIndex || 0, item.outTotal || 1);
    const x2 = dst.left - boardRect.left + board.scrollLeft;
    const y2 = centerY(dst) - boardRect.top + board.scrollTop + slotOffset(item.inIndex || 0, item.inTotal || 1);

    const dx = Math.max(24, x2 - x1);
    const laneOffset = item.lane * 12;
    let c1x = x1 + dx * 0.48 + laneOffset;
    let c2x = x2 - dx * 0.48 + laneOffset;

    c1x = Math.min(c1x, x2 - 12);
    c2x = Math.max(c2x, x1 + 12);

    const path = document.createElementNS(SVG_NS, "path");
    path.classList.add("edge", edge.type);
    path.setAttribute("marker-end", "url(#arrowhead)");
    path.setAttribute("d", `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`);

    svg.append(path);
  }
}

function assignAnchorSlots(groups, getOtherRect, getOtherId, setSlot) {
  // Orders each group by the other endpoint's vertical position (id as tie-break) and stores index/total.
  for (const items of groups) {
    items.sort((a, b) => {
      const ay = centerY(getOtherRect(a));
      const by = centerY(getOtherRect(b));
      if (ay !== by) {
        return ay - by;
      }
      return getOtherId(a).localeCompare(getOtherId(b));
    });

    items.forEach((item, index) => setSlot(item, index, items.length));
  }
}

function matchesBookMode(book) {
  // Checks if a book passes the Book display filter.
  if (state.bookMode === BOOK_MODE_NOVELS) {
    return book.format === FORMAT_NOVEL;
  }
  if (state.bookMode === BOOK_MODE_NOVELLAS) {
    return isNovellaLike(book.format);
  }
  return true;
}

function getActiveEdges(graph) {
  // Edges that are currently drawable: the link type passes the Link display filter and both books pass the Book display filter.
  return graph.edges.filter((edge) => matchesLinkMode(edge.type, state.linkMode)
    && matchesBookMode(graph.booksById.get(edge.from))
    && matchesBookMode(graph.booksById.get(edge.to)));
}

function computeConnectedBooks(graph, startId) {
  // Returns the ancestor/descendant closure for a selected book, following only active edges.
  const outgoing = new Map(graph.books.map((b) => [b.id, new Set()]));
  const incoming = new Map(graph.books.map((b) => [b.id, new Set()]));

  for (const edge of getActiveEdges(graph)) {
    outgoing.get(edge.from).add(edge.to);
    incoming.get(edge.to).add(edge.from);
  }

  const descendants = collectReachable(outgoing, startId);
  const ancestors = collectReachable(incoming, startId);

  return new Set([...ancestors, ...descendants]);
}

function computeDirectlyConnectedBooks(graph, selectedIds) {
  // Finds directly readable right-side books from right-click selections, following only active edges.
  const selectedSet = selectedIds instanceof Set ? selectedIds : new Set(selectedIds);
  const related = new Set(selectedSet);
  const booksById = graph.booksById;
  const incomingByTarget = new Map();
  const rightSideCandidates = new Set();

  for (const edge of getActiveEdges(graph)) {
    if (!incomingByTarget.has(edge.to)) {
      incomingByTarget.set(edge.to, []);
    }
    incomingByTarget.get(edge.to).push(edge);

    if (!selectedSet.has(edge.from)) {
      continue;
    }

    const source = booksById.get(edge.from);
    const target = booksById.get(edge.to);
    if (!source || !target) {
      continue;
    }

    if (target.col > source.col) {
      rightSideCandidates.add(edge.to);
    }
  }

  // True if the book has a left-side prerequisite; with `onlyUnselected`, only unselected prerequisites count.
  const hasLeftDependency = (book, onlyUnselected) => (incomingByTarget.get(book.id) || []).some((edge) => {
    const dependency = booksById.get(edge.from);
    if (!dependency || dependency.col >= book.col) {
      return false;
    }
    return !onlyUnselected || !selectedSet.has(edge.from);
  });

  for (const candidateId of rightSideCandidates) {
    const candidate = booksById.get(candidateId);
    if (candidate && !hasLeftDependency(candidate, true)) {
      related.add(candidateId);
    }
  }

  // Books without any left-side prerequisite are always starting points.
  for (const book of graph.books) {
    if (!hasLeftDependency(book, false)) {
      related.add(book.id);
    }
  }

  return related;
}

function collectReachable(adjMap, startId) {
  // Depth-first traversal helper returning all reachable node ids.
  const seen = new Set([startId]);
  const stack = [startId];

  while (stack.length) {
    const current = stack.pop();
    for (const nxt of adjMap.get(current)) {
      if (!seen.has(nxt)) {
        seen.add(nxt);
        stack.push(nxt);
      }
    }
  }

  return seen;
}

function groupBy(items, getKey) {
  // Groups list items into a Map keyed by getKey(item).
  const map = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  }
  return map;
}

function centerY(rect) {
  // Returns vertical center of a DOMRect.
  return rect.top + rect.height / 2;
}

function slotOffset(index, total) {
  // Spaces multiple edge anchors around the vertical midpoint.
  return (index - (total - 1) / 2) * 7;
}

function matchesLinkMode(type, mode) {
  // Checks if an edge type should be shown under the current link mode.
  if (mode === LINK_MODE_REQUIRED) {
    return type === LINK_TYPE_REQUIRED;
  }
  if (mode === LINK_MODE_REQUIRED_RECOMMENDED) {
    return type === LINK_TYPE_REQUIRED || type === LINK_TYPE_RECOMMENDED;
  }
  if (mode === LINK_MODE_NICE_TO_HAVE) {
    return type === LINK_TYPE_NICE_TO_HAVE;
  }
  return true;
}

function escapeHtml(value) {
  // Escapes text inserted into HTML strings.
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
