/**
 * Tree-sitter grammar for LTSA (Labelled Transition System Analyser)
 * FSP (Finite State Processes) notation
 */

module.exports = grammar({
  name: "ltsa",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$.action_label],
    [$.local_process],
    [$.process_body],
    [$._simple_process],
    [$._action_component, $.action_set],
    [$.composite_body, $.composite_element],
    [$.composite_element, $.forall_composition],
    [$.composite_element],
    [$.prefix_label, $.process_ref],
    [$.process_ref, $._action_component],
    [$.process_ref, $.label_id],
    [$.set_element, $._action_component],
    [$.set_element, $._action_component, $.action_set],
    [$.index_ref, $.action_index],
    [$.paren_expr, $.condition],
    [$._expression, $._index_range],
    [$.set_element, $._action_component, $.action_set_item],
    [$._action_component, $.action_set_item],
  ],

  rules: {
    source_file: ($) => repeat($._definition),

    _definition: ($) =>
      choice(
        $.const_definition,
        $.range_definition,
        $.set_definition,
        $.process_definition,
        $.composite_definition,
        $.property_definition,
        $.progress_definition,
        $.menu_definition
      ),

    // ==================== Comments ====================
    comment: ($) =>
      choice(
        seq("//", /[^\n]*/),
        seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
      ),

    // ==================== Constants and Ranges ====================
    const_definition: ($) =>
      seq("const", $.identifier, "=", $._expression),

    range_definition: ($) =>
      seq("range", $.identifier, "=", $.range_expr),

    set_definition: ($) =>
      seq("set", $.identifier, "=", $.set_expr),

    range_expr: ($) => seq($._expression, "..", $._expression),

    set_expr: ($) =>
      seq("{", optional($._set_elements), "}"),

    _set_elements: ($) =>
      seq($.set_element, repeat(seq(",", $.set_element))),

    set_element: ($) =>
      choice(
        $.identifier,
        $.action_label,
        $.set_expr
      ),

    // ==================== Expressions ====================
    _expression: ($) =>
      choice(
        $.number,
        $.identifier,
        $.quoted_label,
        $.binary_expr,
        $.unary_expr,
        $.paren_expr
      ),

    binary_expr: ($) =>
      choice(
        prec.left(1, seq($._expression, choice("+", "-"), $._expression)),
        prec.left(2, seq($._expression, choice("*", "/", "%"), $._expression)),
        prec.left(0, seq($._expression, choice(">>", "<<", "&", "|"), $._expression))
      ),

    unary_expr: ($) => prec(3, seq(choice("-", "!"), $._expression)),

    paren_expr: ($) => seq("(", $._expression, ")"),

    // ==================== Process Definition ====================
    process_definition: ($) =>
      seq(
        $.process_name,
        optional($.parameter_list),
        "=",
        $.process_body,
        "."
      ),

    process_name: ($) => $.identifier,

    parameter_list: ($) =>
      seq("(", $.parameter, repeat(seq(",", $.parameter)), ")"),

    parameter: ($) =>
      seq($.identifier, optional(seq("=", $._expression))),

    process_body: ($) =>
      seq(
        $.local_process,
        repeat(seq(",", $.local_process_def))
      ),

    local_process_def: ($) =>
      seq($.process_state, "=", $.local_process),

    process_state: ($) =>
      seq($.identifier, optional($.index_ranges)),

    // Local process with optional modifiers
    local_process: ($) =>
      prec.left(seq(
        $._simple_process,
        repeat($.process_modifier)
      )),

    _simple_process: ($) =>
      prec.left(choice(
        $.stop_process,
        $.error_process,
        $.process_ref,
        $.action_prefix,
        $.choice_process,
        $.guarded_process,
        $.if_process,
        $.paren_process
      )),

    stop_process: ($) => "STOP",
    error_process: ($) => "ERROR",

    process_ref: ($) =>
      seq($.identifier, optional(choice($.index_refs, $.argument_list))),

    index_refs: ($) => repeat1($.index_ref),
    index_ref: ($) => seq("[", $._expression, "]"),

    argument_list: ($) =>
      seq("(", $._expression, repeat(seq(",", $._expression)), ")"),

    // Action prefix: action -> process
    action_prefix: ($) =>
      prec.right(2, seq(
        $.action_label,
        "->",
        $._simple_process
      )),

    // Choice: process | process
    choice_process: ($) =>
      prec.left(1, seq(
        choice($.action_prefix, $.guarded_process, $.paren_process),
        repeat1(seq("|", choice($.action_prefix, $.guarded_process, $.paren_process)))
      )),

    // Guarded process: when(cond) action -> process
    guarded_process: ($) =>
      prec.right(2, seq(
        $.guard,
        $.action_label,
        "->",
        $._simple_process
      )),

    guard: ($) => seq("when", "(", $.condition, ")"),

    condition: ($) =>
      choice(
        $.comparison,
        $._expression,  // Allow simple boolean expressions
        seq("!", $.condition),  // Negation
        seq("(", $.condition, ")"),
        prec.left(1, seq($.condition, choice("&&", "||"), $.condition))
      ),

    comparison: ($) =>
      prec.left(seq(
        $._expression,
        choice("==", "!=", "<", ">", "<=", ">="),
        $._expression
      )),

    // Conditional: if cond then process else process
    if_process: ($) =>
      prec.right(seq(
        "if",
        $.condition,
        "then",
        $._simple_process,
        optional(seq("else", $._simple_process))
      )),

    paren_process: ($) => seq("(", $.local_process, ")"),

    // ==================== Actions ====================
    action_label: ($) =>
      prec.left(seq(
        $._action_component,
        repeat(seq(".", $._action_component))
      )),

    _action_component: ($) =>
      choice(
        $.identifier,
        $.quoted_label,
        seq($.identifier, repeat1($.action_index)),
        $.action_set
      ),

    action_set: ($) =>
      seq("{", $.action_set_item, repeat(seq(",", $.action_set_item)), "}"),

    action_set_item: ($) =>
      seq(
        $.identifier,
        optional(repeat1($.action_index)),
        repeat(seq(".", $.identifier, optional(repeat1($.action_index))))
      ),

    action_index: ($) =>
      seq("[", choice(
        $._expression,
        seq($.identifier, ":", $._index_range),
        $._index_range
      ), "]"),

    index_ranges: ($) => repeat1($.index_range_bracket),

    index_range_bracket: ($) =>
      seq("[", choice(
        seq($.identifier, ":", $._index_range),
        seq($._expression, "..", $._expression),  // Range first (more specific)
        $._expression  // Then expression
      ), "]"),

    _index_range: ($) =>
      choice(
        seq($._expression, "..", $._expression),
        $.identifier
      ),

    // ==================== Process Modifiers ====================
    process_modifier: ($) =>
      choice(
        $.alphabet_extension,
        $.hiding,
        $.interface_hiding
      ),

    alphabet_extension: ($) => seq("+", choice($.identifier, $.set_expr)),
    hiding: ($) => seq("\\", $.set_expr),
    interface_hiding: ($) => seq("@", $.set_expr),

    // ==================== Composite Definition ====================
    composite_definition: ($) =>
      seq(
        "||",
        $.process_name,
        optional($.parameter_list),
        "=",
        $.composite_body,
        optional($.composite_modifiers),
        "."
      ),

    composite_body: ($) =>
      choice(
        $.parallel_composition,
        $.forall_composition,
        seq("(", $.composite_body, ")")
      ),

    parallel_composition: ($) =>
      prec.left(seq(
        $.composite_element,
        repeat(seq("||", $.composite_element))
      )),

    composite_element: ($) =>
      seq(
        repeat($.prefix_label),
        choice($.process_ref, $.stop_process, $.error_process, seq("(", $.composite_body, ")")),
        optional($.relabeling)
      ),

    prefix_label: ($) =>
      choice(
        seq($.label_id, ":"),
        seq($.label_id, $.index_ranges, ":"),
        seq("{", $.prefix_label_item, repeat(seq(",", $.prefix_label_item)), "}", "::"),
      ),

    prefix_label_item: ($) =>
      seq($.label_id, optional($.index_ranges), repeat(seq(".", $.label_id, optional($.index_ranges)))),

    label_id: ($) => $.identifier,

    forall_composition: ($) =>
      seq("forall", $.index_ranges, choice(
        $.composite_element,
        seq("(", $.composite_body, ")")
      )),

    // ==================== Relabeling ====================
    relabeling: ($) =>
      seq("/", choice(
        seq("{", $.relabel_def, repeat(seq(",", $.relabel_def)), "}"),
        $.relabel_def
      )),

    relabel_def: ($) => seq($.action_label, "/", $.action_label),

    // ==================== Composite Modifiers ====================
    composite_modifiers: ($) =>
      repeat1(choice(
        $.alphabet_extension,
        $.hiding,
        $.interface_hiding,
        $.priority,
        $.relabeling
      )),

    priority: ($) =>
      choice(
        seq("<<", $.set_expr),
        seq(">>", $.set_expr)
      ),

    // ==================== Property Definition ====================
    property_definition: ($) =>
      seq(
        "property",
        $.process_name,
        optional($.parameter_list),
        "=",
        $.process_body,
        optional($.process_modifier),
        "."
      ),

    // ==================== Progress Definition ====================
    progress_definition: ($) =>
      seq("progress", $.progress_name, "=", choice($.set_expr, $.action_label)),

    progress_name: ($) =>
      seq($.identifier, optional($.index_ranges)),

    // ==================== Menu Definition ====================
    menu_definition: ($) =>
      seq("menu", $.identifier, "=", $.set_expr),

    // ==================== Tokens ====================
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    quoted_label: ($) => seq("'", /[a-zA-Z_][a-zA-Z0-9_]*/),
    number: ($) => /\d+/,
  },
});
