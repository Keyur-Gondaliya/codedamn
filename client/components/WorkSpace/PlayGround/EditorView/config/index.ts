const config = {
  notifications: {
    props: {
      anchorOrigin: { vertical: "top", horizontal: "right" },
      autoHideDuration: 2500,
    },
    defaultState: {
      isActive: false,
      message: "",
      variant: "info",
      opt: {},
    },
  },
  option: {
    acceptSuggestionOnCommitCharacter: true,
    acceptSuggestionOnEnter: "on",
    accessibilitySupport: "auto",
    autoIndent: false,
    automaticLayout: true,
    codeLens: true,
    colorDecorators: true,
    contextmenu: true,
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: false,
    cursorStyle: "line",
    disableLayerHinting: false,
    disableMonospaceOptimizations: false,
    dragAndDrop: false,
    fixedOverflowWidgets: false,
    folding: true,
    foldingStrategy: "auto",
    fontLigatures: false,
    formatOnPaste: false,
    formatOnType: false,
    hideCursorInOverviewRuler: false,
    highlightActiveIndentGuide: true,
    links: true,
    mouseWheelZoom: false,
    multiCursorMergeOverlapping: true,
    multiCursorModifier: "alt",
    overviewRulerBorder: true,
    overviewRulerLanes: 2,
    quickSuggestions: true,
    quickSuggestionsDelay: 100,
    readOnly: false,
    renderControlCharacters: false,
    renderFinalNewline: true,
    renderIndentGuides: true,
    renderLineHighlight: "all",
    renderWhitespace: "none",
    revealHorizontalRightPadding: 30,
    roundedSelection: true,
    rulers: [],
    scrollBeyondLastColumn: 5,
    scrollBeyondLastLine: true,
    selectOnLineNumbers: true,
    selectionClipboard: true,
    selectionHighlight: true,
    showFoldingControls: "mouseover",
    smoothScrolling: false,
    suggestOnTriggerCharacters: true,
    wordBasedSuggestions: true,
    // eslint-disable-next-line
    wordSeparators: `~!@#$%^&*()-=+[{]}\|;:'",.<>/?`,
    wordWrap: "off",
    wordWrapBreakAfterCharacters: "\t})]?|&,;",
    wordWrapBreakBeforeCharacters: "{([+",
    wordWrapBreakObtrusiveCharacters: ".",
    wordWrapColumn: 80,
    wordWrapMinified: true,
    wrappingIndent: "none",
  },
  messages: {
    errorBoundary: {
      somethingWentWrong:
        "Oooops... Sorry, I guess, something went wrong. You can:",
      resetApp: "Press here to reset the application",
      openIssue: "Press here to open issue about it on GitHub",
    },
    invalidOptions:
      "Seems like options file is not a valid json, please double check it.",
  },

  urls: {
    octocatIcon: "/icons/octocat.png",
    themeModeIcon: "/icons/theme-mode.png",
    IEditorOptions:
      "https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IEditorOptions.html#acceptSuggestionOnCommitCharacter",
  },

  defaultThemes: ["vs-dark", "light"],

  supportedLanguages: [
    { id: 1, name: "apex" },
    { id: 2, name: "azcli" },
    { id: 3, name: "bat" },
    { id: 4, name: "c" },
    { id: 5, name: "clojure" },
    { id: 6, name: "coffeescript" },
    { id: 7, name: "cpp" },
    { id: 8, name: "csharp" },
    { id: 9, name: "csp" },
    { id: 10, name: "css" },
    { id: 11, name: "dockerfile" },
    { id: 12, name: "fsharp" },
    { id: 13, name: "go" },
    { id: 14, name: "graphql" },
    { id: 15, name: "handlebars" },
    { id: 16, name: "html" },
    { id: 17, name: "ini" },
    { id: 18, name: "java" },
    { id: 19, name: "javascript" },
    { id: 20, name: "json" },
    { id: 21, name: "kotlin" },
    { id: 22, name: "less" },
    { id: 23, name: "lua" },
    { id: 24, name: "markdown" },
    { id: 25, name: "msdax" },
    { id: 26, name: "mysql" },
    { id: 27, name: "objective-c" },
    { id: 28, name: "pascal" },
    { id: 29, name: "perl" },
    { id: 30, name: "pgsql" },
    { id: 31, name: "php" },
    { id: 32, name: "plaintext" },
    { id: 33, name: "postiats" },
    { id: 34, name: "powerquery" },
    { id: 35, name: "powershell" },
    { id: 36, name: "pug" },
    { id: 37, name: "python" },
    { id: 38, name: "r" },
    { id: 39, name: "razor" },
    { id: 40, name: "redis" },
    { id: 41, name: "redshift" },
    { id: 42, name: "ruby" },
    { id: 43, name: "rust" },
    { id: 44, name: "sb" },
    { id: 45, name: "scheme" },
    { id: 46, name: "scss" },
    { id: 47, name: "shell" },
    { id: 48, name: "sol" },
    { id: 49, name: "sql" },
    { id: 50, name: "st" },
    { id: 51, name: "swift" },
    { id: 52, name: "tcl" },
    { id: 53, name: "typescript" },
    { id: 54, name: "vb" },
    { id: 55, name: "xml" },
    { id: 56, name: "yaml" },
  ],
};
type LanguageList = {
  [key: string]: string;
};
export function _getLanguageFromFileExtension(fileExtension: string) {
  const extensionToLanguageMap: LanguageList = {
    cls: "apex",
    azcli: "azcli",
    bat: "bat",
    c: "c",
    clj: "clojure",
    coffee: "coffeescript",
    cpp: "cpp",
    csharp: "cs",
    csp: "csp",
    css: "css",
    dockerfile: "dockerfile",
    fs: "fsharp",
    go: "go",
    graphql: "graphql",
    hbs: "handlebars",
    html: "html",
    ini: "ini",
    java: "java",
    js: "javascript",
    json: "json",
    jsx: "javascript",
    kt: "kotlin",
    less: "less",
    lua: "lua",
    md: "markdown",
    msdax: "msdax",
    sql: "mysql",
    m: "objective-c",
    pas: "pascal",
    pl: "perl",
    pgsql: "pgsql",
    php: "php",
    txt: "plaintext",
    dats: "postiats",
    pq: "powerquery",
    ps1: "powershell",
    pug: "pug",
    py: "python",
    r: "r",
    cshtml: "razor",
    conf: "redis",
    rb: "ruby",
    rs: "rust",
    scss: "scss",
    sh: "shell",
    sol: "sol",
    st: "st",
    swift: "swift",
    tcl: "tcl",
    ts: "typescript",
    tsx: "typescript",
    vb: "vb",
    xml: "xml",
    yaml: "yaml",
    cjs: "javascript",
  };

  // Convert file extension to lowercase for case-insensitive comparison
  const lowerCaseExtension = fileExtension.toLowerCase();

  // Return the corresponding language or default to plaintext
  return extensionToLanguageMap[lowerCaseExtension] || "plaintext";
}

export default config as any;
