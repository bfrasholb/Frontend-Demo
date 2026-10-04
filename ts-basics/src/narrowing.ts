// 1. Assertion (as): you tell TS "trust me", it does NOT check or convert
const raw: unknown = "hello";
const text = raw as string;
console.log(text.toUpperCase());

// 2. Narrowing: TS follows your checks and updates the type
function show(value: string | number) {
	if (typeof value === "string") {
		console.log(value.toUpperCase()); // value is string here
	} else {
		console.log(value.toFixed(2)); // value is number here
	}
}
show("abc");
show(3.14159);

// 3. Non-null assertion (!): "this is not null/undefined, trust me"
const input: string | undefined = "42";
console.log(input!.length);
