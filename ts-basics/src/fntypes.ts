// a function type: (parameter types) => return type
type Op = (a: number, b: number) => number;

// the parameter names a and b are inferred from Op, so no annotations needed
const plus: Op = (a, b) => a + b;
const times: Op = (a, b) => a * b;

// a function as a parameter (a "callback")
function apply(a: number, b: number, op: Op): number {
	return op(a, b);
}

// void: the function returns nothing useful
function logTwice(message: string): void {
	console.log(message);
	console.log(message);
}

// a callback type written inline, returning void
function repeatTask(times: number, task: (i: number) => void): void {
	for (let i = 0; i < times; i++) {
		task(i);
	}
}

console.log("plus:", apply(2, 3, plus));
console.log("times:", apply(2, 3, times));
// anonymous function passed inline: its types come from Op
console.log(
	"inline:",
	apply(10, 4, (a, b) => a - b),
);
logTwice("hi");
repeatTask(3, (i) => console.log("run", i));

type Transform = (text: string) => string;

function applyAll(items: string[], fn: Transform): string[] {
	return items.map((item) => fn(item));
}

console.log(
	"applyAll:",
	applyAll(["a", "b"], (s) => s.toUpperCase()),
);
console.log(apply(2, 3, (a: number, b: number) => a + b));
