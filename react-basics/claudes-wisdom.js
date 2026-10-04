// Claude's React Wisdoms
//Types
const s = "hello"; // string
const n = 42; // number (integers and decimals are the same type)
const b = true; // boolean
const nothing = null; // deliberate "no value"
let notSet; // undefined: "never assigned"
const arr = [1, "a", true]; // array (can mix types)
const obj = { name: "Sam", age: 30 }; // object
const fn = () => {}; // functions are values too

console.log(typeof s); // "string"
console.log(typeof arr); // "object"  (quirk: arrays report as object)
console.log(Array.isArray(arr)); // true
console.log(typeof null); // "object"  (famous historical bug)

// To number
Number("42"); // 42
Number("42px"); // NaN  (not a number)
parseInt("42px"); // 42   (reads until it hits a non-digit)
parseFloat("3.14") + // 3.14
	"42"; // 42   (unary plus shortcut)

// To string
String(42)(42) // "42"
	.toString() // "42"
`${42}`; // "42"

// To boolean
Boolean(0); // false
Boolean("hi"); // true
!!"hi"; // true  (double-negation shortcut)

// Checks
Number.isNaN(Number("abc")); // true

"5" + 1; // "51"  (string concatenation!)
"5" - 1; // 4     (numeric)
1 == "1"; // true  (loose equality converts types)
1 === "1"; // false (strict equality: no conversion)

//Functions
// 1. Declaration (hoisted: usable before it's defined)
function add(a, b) {
	return a + b;
}

// 2. Function expression (function stored in a variable)
const add2 = function (a, b) {
	return a + b;
};

// 3. Arrow function: the default style in React
const add3 = (a, b) => {
	return a + b;
};

// 4. Arrow with implicit return (single expression, no braces)
const add4 = (a, b) => a + b;
const square = (n) => n * n; // one param: parentheses optional
const makeUser = (name) => ({ name, active: true }); // object literal needs ( )

//Unnamed Functions
[1, 2, 3].map(function (n) {
	return n * 2;
}); // anonymous function expression
[1, 2, 3].map((n) => n * 2); // anonymous arrow: [2, 4, 6]

setTimeout(() => console.log("later"), 1000); // callback

button.onClick = () => doThing(); // you'll write this constantly in React

// IIFE: an anonymous function that runs immediately (rare in React, common in older JS)
(() => {
	console.log("ran once");
})();

//Parameter features
const greet = (name = "friend") => `Hi ${name}`; // default value
const sum = (...nums) => nums.reduce((a, b) => a + b, 0); // rest: collects args into an array
sum(1, 2, 3); // 6

//Higher Order Functions
const makeCounter = () => {
	let count = 0;
	return () => ++count;
};
const next = makeCounter();
next();
next(); // 1, 2

//Keywords and Syntax
// Declarations
const x = 1; // can't be reassigned: your default
let y = 2; // can be reassigned
// var            // old; avoid

// Modules
import React from "react"; // default import
import { useState } from "react"; // named import
export default App; // default export (one per file)
export const helper = () => {}; // named export

// Control flow
if (a) {
} else if (b) {
} else {
}
for (const item of list) {
} // loop over values
cond ? "yes" : "no"; // ternary (expression form of if)
a && b; // b only if a is truthy
a ?? b; // b only if a is null/undefined
user?.address?.city; // optional chaining: no crash if user is undefined

// Destructuring and spread
const { name, age } = person;
const [first, ...rest] = list;
const copy = { ...person, age: 31 }; // copy + override
const bigger = [...list, 4];

// Async
const load = async () => {
	try {
		const res = await fetch(url);
		const data = await res.json();
	} catch (e) {
		console.error(e);
	}
};

// Array methods: replace loops in React
list.map((x) => x * 2); // transform each item → new array
list.filter((x) => x > 1); // keep matching items
list.find((x) => x.id === 3); // first match
list.reduce((acc, x) => acc + x, 0);
