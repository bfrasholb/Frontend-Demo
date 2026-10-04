type User = {
	id: number;
	name: string;
	email: string;
};

// Partial<User>: every property becomes optional
function updateUser(user: User, changes: Partial<User>): User {
	return { ...user, ...changes };
}

// Pick<User, "id" | "name">: keep only these properties
type UserPreview = Pick<User, "id" | "name">;

// Omit<User, "email">: keep everything except these
type PublicUser = Omit<User, "email">;

const ada: User = { id: 1, name: "Ada", email: "ada@example.com" };

console.log("updated:", updateUser(ada, { name: "Ada L" }));

const preview: UserPreview = { id: 1, name: "Ada" };
const pub: PublicUser = { id: 1, name: "Ada" };

console.log("preview:", preview);
console.log("pub:", pub);
