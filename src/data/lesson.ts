import {
  AppWindow,
  BarChart3,
  Brain,
  Globe,
  Repeat,
} from "lucide-react";
import { SLIDE_INDEX } from "@/data/slides";
import type {
  DataTypeCard,
  QuizQuestion,
  SummaryConcept,
  UseCase,
} from "@/types";

/* -------------------------------------------------------------------------
   Slide 2 — What is Python?
   ------------------------------------------------------------------------- */
export const USE_CASES: UseCase[] = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    icon: Brain,
    example: "Python can teach a computer to tell a cat from a dog in a photo.",
    snippet: 'guess = model.predict(photo)\nprint(guess)',
  },
  {
    id: "websites",
    title: "Websites",
    icon: Globe,
    example: "Python can run the part of a website that saves your account.",
    snippet: 'user = "Ali"\nprint("Welcome back,", user)',
  },
  {
    id: "automation",
    title: "Automation",
    icon: Repeat,
    example: "Python can rename a thousand files while you drink your coffee.",
    snippet: 'for file in files:\n    rename(file)',
  },
  {
    id: "data",
    title: "Data",
    icon: BarChart3,
    example: "Python can read a big sales file and find the best month.",
    snippet: 'sales = [120, 340, 90]\nprint(max(sales))',
  },
  {
    id: "apps",
    title: "Applications",
    icon: AppWindow,
    example: "Python can build a small program with buttons you click.",
    snippet: 'button = Button("Save")\nbutton.show()',
  },
];

/* -------------------------------------------------------------------------
   Slide 3 — How code works
   ------------------------------------------------------------------------- */
export const HOW_CODE_STEPS = [
  {
    id: "write",
    title: "You write code.",
    detail: "You type an instruction in Python.",
    sample: 'print("Hello")',
  },
  {
    id: "read",
    title: "Python reads the code.",
    detail: "Python checks the line word by word.",
    sample: "reading line 1…",
  },
  {
    id: "follow",
    title: "The computer follows the instruction.",
    detail: "It does exactly what the line says.",
    sample: "display the text",
  },
  {
    id: "result",
    title: "You see the result.",
    detail: "The answer appears on your screen.",
    sample: "Hello",
  },
] as const;

/* -------------------------------------------------------------------------
   Slide 4 — print()
   ------------------------------------------------------------------------- */
export const PRINT_PARTS = [
  {
    id: "print",
    token: "print",
    title: "print",
    meaning: "Displays information on the screen.",
  },
  {
    id: "parens",
    token: "( )",
    title: "Parentheses",
    meaning: "They contain what we want to display.",
  },
  {
    id: "quotes",
    token: '" "',
    title: "Quotation marks",
    meaning: "They show that the value is text.",
  },
  {
    id: "text",
    token: "Hello, Python!",
    title: "Hello, Python!",
    meaning: "The string being displayed.",
  },
] as const;

export type PrintPartId = (typeof PRINT_PARTS)[number]["id"];

/* -------------------------------------------------------------------------
   Slide 6 — Data types
   ------------------------------------------------------------------------- */
export const DATA_TYPES: DataTypeCard[] = [
  {
    id: "string",
    name: "String",
    sample: '"Hello"',
    definition: "Text written inside quotation marks.",
    code: 'greeting = "Hello"\nprint(type(greeting))',
    comparison: "Like a name written on a label.",
    pythonType: "<class 'str'>",
    accent: "blue",
  },
  {
    id: "integer",
    name: "Integer",
    sample: "25",
    definition: "A whole number without a decimal point.",
    code: "age = 25\nprint(type(age))",
    comparison: "Like counting people in a room.",
    pythonType: "<class 'int'>",
    accent: "yellow",
  },
  {
    id: "float",
    name: "Float",
    sample: "3.14",
    definition: "A number with a decimal point.",
    code: "price = 3.14\nprint(type(price))",
    comparison: "Like a price tag or a temperature.",
    pythonType: "<class 'float'>",
    accent: "blue",
  },
  {
    id: "boolean",
    name: "Boolean",
    sample: "True",
    definition: "A value that is either True or False.",
    code: "is_open = True\nprint(type(is_open))",
    comparison: "Like a light switch: on or off.",
    pythonType: "<class 'bool'>",
    accent: "yellow",
  },
];

/* -------------------------------------------------------------------------
   Slide 10 — List vs Tuple sorting game
   ------------------------------------------------------------------------- */
export const SORTING_ITEMS = [
  { id: "s1", code: '["Apple", "Banana"]', answer: "list" as const },
  { id: "s2", code: '("Blue", "Yellow")', answer: "tuple" as const },
  { id: "s3", code: '[1, 2, 3]', answer: "list" as const },
  { id: "s4", code: '("Cairo", "Muscat")', answer: "tuple" as const },
];

/* -------------------------------------------------------------------------
   Slide 11 — Quiz
   ------------------------------------------------------------------------- */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Which function displays information?",
    options: ["print()", "list()", "type()", "input()"],
    answerIndex: 0,
    because: "print() shows a value on the screen.",
  },
  {
    id: "q2",
    prompt: "Which data type stores text?",
    options: ["Integer", "String", "Float", "Boolean"],
    answerIndex: 1,
    because: "A string is text inside quotation marks.",
  },
  {
    id: "q3",
    prompt: "Which collection can be changed?",
    options: ["Tuple", "Boolean", "List", "Integer"],
    answerIndex: 2,
    because: "A list can be changed after you create it.",
  },
  {
    id: "q4",
    prompt: "Which collection uses parentheses?",
    options: ["List", "String", "Float", "Tuple"],
    answerIndex: 3,
    because: "A tuple is written with parentheses ( ).",
  },
];

/* -------------------------------------------------------------------------
   Slide 12 — Summary
   ------------------------------------------------------------------------- */
export const SUMMARY_CONCEPTS: SummaryConcept[] = [
  {
    id: "print",
    label: "print()",
    slideIndex: SLIDE_INDEX["print"]!,
    recap: "Shows a value on the screen.",
  },
  {
    id: "variables",
    label: "variables",
    slideIndex: SLIDE_INDEX["variables"]!,
    recap: "Store information to use later.",
  },
  {
    id: "strings",
    label: "strings",
    slideIndex: SLIDE_INDEX["string"]!,
    recap: "Text inside quotation marks.",
  },
  {
    id: "integers",
    label: "integers",
    slideIndex: SLIDE_INDEX["data-types"]!,
    recap: "Whole numbers, like 25.",
  },
  {
    id: "floats",
    label: "floats",
    slideIndex: SLIDE_INDEX["data-types"]!,
    recap: "Numbers with a decimal point, like 3.14.",
  },
  {
    id: "booleans",
    label: "booleans",
    slideIndex: SLIDE_INDEX["data-types"]!,
    recap: "True or False.",
  },
  {
    id: "lists",
    label: "lists",
    slideIndex: SLIDE_INDEX["list"]!,
    recap: "Many items in [ ], and you can change them.",
  },
  {
    id: "tuples",
    label: "tuples",
    slideIndex: SLIDE_INDEX["tuple"]!,
    recap: "Many items in ( ), and they stay fixed.",
  },
];
