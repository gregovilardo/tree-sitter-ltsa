# Quick Reference: Publishing to GitHub

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `tree-sitter-ltsa`
3. Description: "Tree-sitter grammar for LTSA (Labelled Transition System Analyser)"
4. Public repository
5. **DO NOT** initialize with README, .gitignore, or license (you already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

```bash
cd /home/gregovilardo/ltsa_treesitter

# Add remote
git remote add origin https://github.com/gregovilardo/tree-sitter-ltsa.git

# Push to GitHub
git push -u origin main
```

## Step 3: Test Installation in Neovim

### Add to your Neovim config:

```lua
-- In your init.lua or lua/plugins/ltsa.lua

vim.api.nvim_create_autocmd('User', { 
  pattern = 'TSUpdate',
  callback = function()
    local parser_config = require('nvim-treesitter.parsers').get_parser_configs()
    parser_config.ltsa = {
      install_info = {
        url = 'https://github.com/gregovilardo/tree-sitter-ltsa',
        files = { 'src/parser.c' },
        branch = 'main',
      },
      filetype = 'ltsa',
    }
  end
})

vim.treesitter.language.register('ltsa', 'ltsa')
vim.filetype.add({ extension = { lts = 'ltsa' } })
```

### Install the parser:

```vim
:TSInstall ltsa
```

### Verify it works:

```bash
# Create test file
echo "PROCESS = (action -> STOP)." > test.lts

# Open in Neovim
nvim test.lts

# Check filetype (should show "ltsa")
:set filetype?

# Toggle tree-sitter highlighting
:TSBufToggle highlight
```

## Step 4: Share with Others

After pushing, others can use your parser by:

1. Adding the same config to their Neovim
2. Running `:TSInstall ltsa`
3. Opening any `.lts` file

## Current Commit

```
commit dd5ccce
Initial commit: LTSA tree-sitter parser for Neovim
```

---

**That's it!** Your parser is ready to be shared with the Neovim community! 🎉
