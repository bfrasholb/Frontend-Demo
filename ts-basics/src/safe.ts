// Instead of `as`: check first
const raw: unknown = 42;
if (typeof raw === "string") {
	console.log(raw.toUpperCase());
} else {
	console.log("not a string:", String(raw));
}

// Instead of `!`: optional chaining and a fallback
function getInput(): string | undefined {
	return undefined;
}

const input = getInput(); // type is string | undefined, TS can't know which
console.log(input?.length); // undefined, no crash
console.log(input?.length ?? 0); // 0
