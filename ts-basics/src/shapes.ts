const scores: number[] = [90, 85, 70];
const names: Array<string> = ["Ada", "Linus"];
scores.push(100);

type User = {
	id: number;
	name: string;
	email?: string; // the ? means the value is string OR undefined
};

interface Product {
	id: number;
	title: string;
}

const u: User = { id: 1, name: "Ada" };
const p: Product = { id: 7, title: "Lamp" };

console.log(scores, names, u, p);
