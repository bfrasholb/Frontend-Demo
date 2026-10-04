//Claude Practice

console.log(Number("12abc")); // NaN
console.log(parseInt("12abc")); // 12

const double = (n) => 2 * n; // Arrow Function
function doublen(n) {
	// Block Declaration
	return 2 * n;
}
function doubledecl(n) {
	return n * 2;
} // Inline declaration
let n = 2; // 2
let n2 = double(n); // 4
let n3 = doublen(n); // 4
let n4 = doubledecl(n); // 4

const my_list = [1, 2, 3, 4, 5];

my_list.map((x) => double(n)).filter((x) => x % 2 === 0); // [2, 4, 6, 8, 10]

const Person = { name: "Sam", city: "Melbourne" }; // Objects with multiple variables
const { name, city } = Person; // Copy an object + Properties
const moved = { ...Person, city: "Sydney" }; // Change Properties
console.log(name, city);
console.log(Person, moved);
