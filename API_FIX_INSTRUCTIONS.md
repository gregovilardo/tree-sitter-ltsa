# UPDATED CONFIGURATION - API FIX

## The Problem

The old configuration used the deprecated `get_parser_configs()` method with an autocmd, which doesn't work with modern nvim-treesitter (v0.9+).

## The Solution

Use the direct parser configuration approach instead.

## Updated Configuration for Your Neovim

Replace the content in `/home/gregovilardo/.config/nvim/plugin/packs/treesitter.lua:16` with:

```lua
-- tree-sitter-ltsa configuration (Modern API)
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.ltsa = {
  install_info = {
    url = "https://github.com/gregovilardo/tree-sitter-ltsa",
    files = { "src/parser.c" },
    branch = "main",
  },
  filetype = "ltsa",
}

vim.treesitter.language.register('ltsa', 'ltsa')
vim.filetype.add({
  extension = {
    lts = 'ltsa',
  },
})
```

## Testing Steps

1. **Update your Neovim config** with the code above

2. **Restart Neovim**

3. **Push the changes to GitHub** (you'll need to do this manually):
   ```bash
   cd /home/gregovilardo/ltsa_treesitter
   git push origin main
   ```

4. **Install the parser** in Neovim:
   ```vim
   :TSInstall ltsa
   ```

5. **Test it**:
   ```bash
   # Create a test file
   echo "PROCESS = (action -> STOP)." > test.lts
   
   # Open in Neovim
   nvim test.lts
   ```

6. **Verify**:
   - Check filetype: `:set filetype?` (should show "ltsa")
   - Check tree-sitter: `:TSBufToggle highlight`
   - Syntax highlighting should work

## What Changed

### Old (Deprecated):
```lua
vim.api.nvim_create_autocmd('User', {
  pattern = 'TSUpdate',
  callback = function()
    local parser_config = require('nvim-treesitter.parsers').get_parser_configs()
    ...
  end
})
```

### New (Correct):
```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.ltsa = { ... }
```

## Git Status

Current commits:
```
9ea532c Fix: Update to modern nvim-treesitter API
dd5ccce Initial commit: LTSA tree-sitter parser for Neovim
```

**You need to push these to GitHub manually** due to SSH key permissions.

## After Pushing to GitHub

The parser will be available at:
https://github.com/gregovilardo/tree-sitter-ltsa

Anyone can then install it using the updated configuration!
