// declaration: types on each parameter, and on the return (after the parentheses)
function add(a: number, b: number): number {
	return a + b;
}

// arrow function stored in a const (the variable gives it its name)
const double = (n: number): number => n * 2;

// anonymous arrow function, passed straight into map (no name)
// n is inferred as number from the array, so no annotation is needed
const doubled = [1, 2, 3].map((n) => n * 2);

// optional parameter: inside the function, title is string | undefined
// optional ones must come after the required ones
function greet(name: string, title?: string): string {
	if (title === undefined) {
		return "Hello " + name;
	}
	return "Hello " + title + " " + name;
}

// default parameter: the type is inferred from the default value
function repeat(text: string, times = 2): string {
	return text.repeat(times);
}

// rest parameter: extra arguments are collected into an array
function sum(...nums: number[]): number {
	let total = 0;
	for (const n of nums) {
		total += n;
	}
	return total;
}

console.log("add:", add(2, 3));
console.log("double:", double(4));
console.log("doubled:", doubled);
console.log("greet 1:", greet("Ada"));
console.log("greet 2:", greet("Ada", "Dr"));
console.log("repeat 1:", repeat("ha"));
console.log("repeat 2:", repeat("ha", 3));
console.log("sum:", sum(1, 2, 3, 4));
console.log("sum empty:", sum());

function fullName(first: string, last: string, middle?: string): string {
	if (middle) {
		return first + " " + middle[0] + " " + last;
	} else {
		return first + " " + last;
	}
}

console.log(fullName("Ada", "Lovelace"));
console.log(fullName("Ada", "Lovelace", "Middle"));

console.log("trap:", add(2, 3));
