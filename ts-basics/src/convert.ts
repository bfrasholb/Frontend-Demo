// 1. Real conversion (these change the value, unlike `as`)
console.log(Number("42"), Number(""), Number("12abc"), parseInt("12abc", 10));

// 2. A safe converter: the return type admits it can fail
function toNumber(text: string): number | undefined {
	if (text.trim() === "" || Number.isNaN(Number(text))) {
		return undefined;
	}
	return Number(text);
}
console.log(toNumber("42"), toNumber(""), toNumber("abc"));

// 3. JSON.parse returns `any`, so the checker is off for its result
const json = '{"id": 1, "name": "Ada"}';
// const trusted = JSON.parse(json) as { id: number; name: string };
// console.log(trusted.name.toUpperCase());

// 4. Safer: treat it as unknown and check before use
const checked: unknown = JSON.parse(json);
if (
	typeof checked === "object" &&
	checked !== null &&
	"name" in checked &&
	typeof checked.name === "string"
) {
	console.log(checked.name.toUpperCase());
} else {
	console.log("bad data");
}
