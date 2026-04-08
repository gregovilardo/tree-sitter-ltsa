-- Example Neovim configuration for tree-sitter-ltsa
-- 
-- Add this to your Neovim configuration to enable LTSA syntax highlighting
-- IMPORTANT: This must be loaded BEFORE opening any .lts files

-- OPTION 1: GitHub Installation (Recommended)
-- ============================================

-- Step 1: Register the LTSA parser
require("nvim-treesitter.parsers").ltsa = {
	install_info = {
		url = "https://github.com/gregovilardo/tree-sitter-ltsa",
		files = { "src/parser.c" },
		branch = "main",
	},
	filetype = "ltsa",
}

-- Step 2: Register language and filetype detection
vim.treesitter.language.register("ltsa", "lts")
vim.filetype.add({ extension = { lts = "ltsa" } })

-- Step 3: Enable treesitter features for LTSA files
vim.api.nvim_create_autocmd("FileType", {
	pattern = "ltsa",
	callback = function()
		vim.treesitter.start() -- Enable syntax highlighting
		vim.wo.foldexpr = "v:lua.vim.treesitter.foldexpr()" -- Enable folding
		vim.wo.foldmethod = "expr"
		vim.bo.indentexpr = "v:lua.require'nvim-treesitter'.indentexpr()" -- Enable indentation
	end,
})

-- USAGE:
-- 1. Add the above configuration to your init.lua or a plugin file
-- 2. Restart Neovim or reload config
-- 3. Run: :TSInstall ltsa
-- 4. Open any .lts file and enjoy syntax highlighting!

-- OPTION 2: Local Installation (for development)
-- ===============================================

-- Uncomment and adjust if you have a local checkout:

-- require("nvim-treesitter.parsers").ltsa = {
-- 	install_info = {
-- 		path = vim.fn.expand('~/path/to/tree-sitter-ltsa'),
-- 		files = { 'src/parser.c' },
-- 	},
-- 	filetype = 'ltsa',
-- }
--
-- vim.treesitter.language.register("ltsa", "lts")
-- vim.filetype.add({ extension = { lts = "ltsa" } })
--
-- vim.api.nvim_create_autocmd("FileType", {
-- 	pattern = "ltsa",
-- 	callback = function()
-- 		vim.treesitter.start()
-- 		vim.wo.foldexpr = "v:lua.vim.treesitter.foldexpr()"
-- 		vim.wo.foldmethod = "expr"
-- 		vim.bo.indentexpr = "v:lua.require'nvim-treesitter'.indentexpr()"
-- 	end,
-- })

-- TROUBLESHOOTING:
-- ================
-- If syntax highlighting doesn't work:
-- 1. Verify parser is installed: :TSModuleInfo (look for ltsa)
-- 2. Check filetype: :set filetype? (should show "ltsa")
-- 3. Manually copy queries if needed:
--    mkdir -p ~/.local/share/nvim/site/queries/ltsa
--    cp /path/to/tree-sitter-ltsa/queries/*.scm ~/.local/share/nvim/site/queries/ltsa/
-- 4. Reinstall parser: :TSUninstall ltsa then :TSInstall ltsa

