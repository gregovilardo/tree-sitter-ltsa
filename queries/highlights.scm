; Highlights for LTSA (Labelled Transition System Analyser)

; Keywords
[
  "const"
  "range"
  "set"
  "when"
  "if"
  "then"
  "else"
  "forall"
  "property"
  "progress"
  "menu"
] @keyword

; Built-in processes
(stop_process) @constant.builtin
(error_process) @constant.builtin

; Operators
[
  "->"
  "|"
  "||"
  "."
  "::"
  ":"
  "/"
  "@"
  "\\"
  "+"
  ".."
  "<<"
  ">>"
] @operator

; Delimiters
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ","
  "="
] @punctuation.delimiter

; Comments
(comment) @comment

; Numbers
(number) @number

; Process definitions
(process_definition
  (process_name) @type.definition)

(composite_definition
  (process_name) @type.definition)

(property_definition
  (process_name) @type.definition)

; Process definitions
(process_definition
  (process_name) @type.definition)

(composite_definition
  (process_name) @type.definition)

(property_definition
  (process_name) @type.definition)

; Process references
(process_ref
  (identifier) @type)

; Process state names in local definitions
(process_state
  (identifier) @type)

; Constants
(const_definition
  (identifier) @constant)

; Range names
(range_definition
  (identifier) @type)

; Set names
(set_definition
  (identifier) @type)

; Progress names
(progress_name
  (identifier) @type)

; Menu names
(menu_definition
  (identifier) @variable)

; Parameters
(parameter
  (identifier) @variable.parameter)

; Labels and prefixes
(label_id
  (identifier) @variable)

; Quoted labels
(quoted_label) @string.special

; Identifiers in actions
(action_label (identifier) @function.method)

; Guards
(guard
  "when" @keyword.conditional)

; Comparison operators
(comparison
  ["==" "!=" "<" ">" "<=" ">="] @operator.comparison)

; Logical operators
["&&" "||" "!"] @operator.logical

; Arithmetic operators
(binary_expr
  ["+" "-" "*" "/" "%" "&" "|" ">>" "<<"] @operator)
