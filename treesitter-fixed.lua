local langs = { "python", "javascript", "rust", "c", "lua", "vim", "vimdoc", "query", "markdown", "markdown_inline" }
require("nvim-treesitter").install(langs)
vim.api.nvim_create_autocmd("FileType", {
	pattern = langs,
	callback = function()
		vim.treesitter.start() -- highlighting
		vim.wo.foldexpr = "v:lua.vim.treesitter.foldexpr()" -- folds
		vim.wo.foldmethod = "expr"
		vim.bo.indentexpr = "v:lua.require'nvim-treesitter'.indentexpr()" -- indentation
	end,
})

-- LTSA tree-sitter configuration (Modern API - Fixed)
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.ltsa = {
	install_info = {
		url = "https://github.com/gregovilardo/tree-sitter-ltsa",
		files = { "src/parser.c" },
		branch = "main",
	},
	filetype = "ltsa",
}

vim.treesitter.language.register("ltsa", "ltsa")
vim.filetype.add({ extension = { lts = "ltsa" } })
