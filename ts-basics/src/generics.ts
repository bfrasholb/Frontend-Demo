// without generics: returns any, so the type is lost
function firstAny(items: any[]): any {
	return items[0];
}

// with generics: T is filled in from the argument
// number[] gives T = number, string[] gives T = string
function first<T>(items: T[]): T | undefined {
	return items[0];
}

const a = first([10, 20, 30]); // number | undefined
const b = first(["x", "y"]); // string | undefined

console.log("a:", a);
console.log("b:", b);

// a generic type: Box holds a value of any type
type Box<T> = { value: T };

const numBox: Box<number> = { value: 5 };
const textBox: Box<string> = { value: "hi" };

console.log("numBox:", numBox.value);
console.log("textBox:", textBox.value);
console.log(a?.toFixed(1));
