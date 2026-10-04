type User = { id: number; name: string };

// a Promise<void>: resolves later, with no value
function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// async: the return type is Promise<User>, even though we return a plain object
async function loadUser(id: number): Promise<User> {
	await wait(100);
	return { id, name: "User " + id };
}

async function main(): Promise<void> {
	const user = await loadUser(1); // await unwraps Promise<User> into User
	console.log("user:", user.name);

	const p = loadUser(2); // no await: p is the Promise itself
	console.log("p is a Promise:", p instanceof Promise);
	const other = await p;
	console.log("other:", other.name);
}

main();
