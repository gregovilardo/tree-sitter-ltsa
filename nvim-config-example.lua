-- Example Neovim configuration for tree-sitter-ltsa
-- 
-- Add this to your Neovim configuration to enable LTSA syntax highlighting
-- You can place this in:
--   - init.lua (directly)
--   - lua/plugins/ltsa.lua (if using a modular config)
--   - As part of your nvim-treesitter setup

-- IMPORTANT: This configuration must be loaded BEFORE running :TSInstall ltsa

-- Option 1: GitHub installation (recommended for most users)
-- Modern nvim-treesitter API (v0.9+)
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.ltsa = {
  install_info = {
    url = "https://github.com/gregovilardo/tree-sitter-ltsa",
    files = { "src/parser.c" },
    branch = "main",
    -- Optional: Pin to a specific commit for stability
    -- revision = "abc123...",
  },
  filetype = "ltsa",
}

-- Register the language with Neovim's treesitter
vim.treesitter.language.register('ltsa', 'ltsa')

-- Set up filetype detection for .lts files
vim.filetype.add({
  extension = {
    lts = 'ltsa',
  },
})

-- Optional: Additional nvim-treesitter configuration
-- If you're using nvim-treesitter, you can also add this to enable features:
-- require('nvim-treesitter.configs').setup({
--   ensure_installed = { 'ltsa' },  -- Auto-install ltsa parser
--   highlight = {
--     enable = true,
--   },
--   indent = {
--     enable = true,
--   },
-- })

-- After adding this configuration:
-- 1. Restart Neovim
-- 2. Run :TSInstall ltsa
-- 3. Open a .lts file and enjoy syntax highlighting!

--------------------------------------------------------------------------------
-- Option 2: Local installation (for development or offline use)
--------------------------------------------------------------------------------

-- Uncomment and adjust the following if you have a local checkout:

-- local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
-- parser_config.ltsa = {
--   install_info = {
--     path = vim.fn.expand('~/path/to/tree-sitter-ltsa'),  -- Adjust this path
--     files = { 'src/parser.c' },
--   },
--   filetype = 'ltsa',
-- }
--
-- vim.treesitter.language.register('ltsa', 'ltsa')
-- vim.filetype.add({ extension = { lts = 'ltsa' } })

--------------------------------------------------------------------------------
-- Legacy API (for older nvim-treesitter versions, pre-0.9)
--------------------------------------------------------------------------------

-- If you're using an older version of nvim-treesitter and get API errors,
-- try this version instead:

-- vim.api.nvim_create_autocmd('User', {
--   pattern = 'TSUpdate',
--   callback = function()
--     local parser_config = require('nvim-treesitter.parsers').get_parser_configs()
--     parser_config.ltsa = {
--       install_info = {
--         url = 'https://github.com/gregovilardo/tree-sitter-ltsa',
--         files = { 'src/parser.c' },
--         branch = 'main',
--       },
--       filetype = 'ltsa',
--     }
--   end,
-- })
--
-- vim.treesitter.language.register('ltsa', 'ltsa')
-- vim.filetype.add({ extension = { lts = 'ltsa' } })

