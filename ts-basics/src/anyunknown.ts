type Point = { x: number; y: number };
interface Shape {
	name: string;
}
interface Circle extends Shape {
	radius: number;
}
type Labelled = Point & { label: string }; // & combines two types

const c: Circle = { name: "c1", radius: 5 };
const l: Labelled = { x: 1, y: 2, label: "origin" };

let a: any = "hello";
a = 42;
console.log(a.toUpperCase); // no error, even though a is a number now

let u: unknown = "hello";
// console.log(u.toUpperCase()); // uncomment this: error
if (typeof u === "string") {
	console.log(u.toUpperCase()); // fine inside the check
}

console.log(c, l);
