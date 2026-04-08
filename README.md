# tree-sitter-ltsa

A Tree-sitter grammar for LTSA (Labelled Transition System Analyser) FSP (Finite State Processes) files, with full Neovim integration.

## Features

- **Complete FSP Grammar**: Supports all LTSA/FSP language constructs
- **Syntax Highlighting**: Rich, semantic syntax highlighting
- **Tree-sitter Integration**: Native Neovim tree-sitter support
- **Incremental Parsing**: Fast and efficient parsing for large files
- **Code Folding**: Automatic folding for process definitions and composite processes
- **Smart Indentation**: Context-aware indentation

## Installation

### Prerequisites

- Neovim 0.9+ with [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) installed
- A C compiler (for building the parser)

### Installing via nvim-treesitter

Add the following configuration to your Neovim config (e.g., `init.lua` or in a separate plugin config file):

**Important:** This configuration must be loaded BEFORE running `:TSInstall ltsa`

```lua
-- Register the LTSA parser (Modern API for nvim-treesitter v0.9+)
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.ltsa = {
  install_info = {
    url = "https://github.com/gregovilardo/tree-sitter-ltsa",
    files = { "src/parser.c" },
    branch = "main",
    -- Optionally pin to a specific commit:
    -- revision = "abc123...",
  },
  filetype = "ltsa",
}

-- Register the language
vim.treesitter.language.register('ltsa', 'ltsa')

-- Set up filetype detection for .lts files
vim.filetype.add({
  extension = {
    lts = 'ltsa',
  },
})
```

Then install the parser:

```vim
:TSInstall ltsa
```

### Alternative: Local Installation

If you have a local checkout of this repository:

```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.ltsa = {
  install_info = {
    path = '~/path/to/tree-sitter-ltsa',  -- Adjust to your path
    files = { 'src/parser.c' },
  },
  filetype = 'ltsa',
}

vim.treesitter.language.register('ltsa', 'ltsa')
vim.filetype.add({ extension = { lts = 'ltsa' } })
```
vim.filetype.add({ extension = { lts = 'ltsa' } })
```

## Usage

Once installed, simply open any `.lts` file in Neovim. Syntax highlighting and tree-sitter features will work automatically.

### Example LTSA File

```fsp
const N = 3

COUNTER(N=0) = (
    when(N < 3) increment -> COUNTER[N+1]
  | when(N > 0) decrement -> COUNTER[N-1]
).

property SAFE = (increment -> SAFE | decrement -> SAFE).

||SYSTEM = (COUNTER || SAFE).
```

## Grammar

The grammar supports:

- **Process Definitions**: `PROCESS = (action -> STOP).`
- **Composite Processes**: `||SYSTEM = (P1 || P2).`
- **Choice**: `P = (a -> P | b -> Q).`
- **Guarded Actions**: `when(cond) action -> process`
- **Conditional Processes**: `if cond then P else Q`
- **Parameters**: `COUNTER(N=3) = ...`
- **Action Sets**: `{a, b, c}`
- **Ranges**: `range R = 0..5`
- **Constants**: `const N = 10`
- **Relabeling**: `P/{new/old}`
- **Hiding**: `P\\{hidden}`
- **Alphabet Extension**: `P+{extra}`
- **Priority**: `P << {high}` or `P >> {low}`
- **Properties**: `property SAFE = ...`
- **Progress**: `progress P = {actions}`
- **Menu**: `menu M = {actions}`

## Development

### Building from Source

Clone the repository and build the parser:

```bash
git clone https://github.com/gregovilardo/tree-sitter-ltsa.git
cd tree-sitter-ltsa
npm install
npx tree-sitter generate
```

### Running Tests

```bash
npx tree-sitter test
```

### Parsing Files

To test parsing on a specific file:

```bash
npx tree-sitter parse path/to/your/file.lts
```

### Grammar Development

The grammar is defined in `grammar.js`. After making changes:

1. Regenerate the parser: `npx tree-sitter generate`
2. Run tests: `npx tree-sitter test`
3. Test in Neovim: `:TSInstall ltsa` (reinstall)

### Query Files

Tree-sitter query files are located in `queries/`:

- `highlights.scm` - Syntax highlighting rules
- `indents.scm` - Indentation rules
- `folds.scm` - Code folding rules

## Troubleshooting

### Parser not found

If you get "Parser not found" errors:

1. Ensure nvim-treesitter is installed and up to date
2. Check that the parser is registered before running `:TSInstall ltsa`
3. Try `:TSUpdate` to refresh all parsers

### Syntax highlighting not working

1. Verify filetype is set correctly: `:set filetype?` (should show `ltsa`)
2. Check tree-sitter is active: `:TSBufToggle highlight`
3. Ensure queries are properly loaded: `:echo nvim_get_runtime_file('queries/ltsa/highlights.scm', 1)`

### Build errors

Ensure you have:
- A C compiler installed (gcc, clang, or MSVC)
- Node.js and npm installed (for development)

## References

- [LTSA Tool](https://www.doc.ic.ac.uk/ltsa/)
- [Concurrency: State Models and Java Programs](https://www.doc.ic.ac.uk/~jnm/book/) by Jeff Magee and Jeff Kramer
- [Tree-sitter](https://tree-sitter.github.io/)
- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT License - See [LICENSE](LICENSE) file for details.
