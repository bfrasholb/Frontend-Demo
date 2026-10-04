type Status = "loading" | "done" | "error";

// a function that takes a literal union and returns a string
function label(status: Status): string {
	if (status === "loading") {
		return "Please wait";
	}
	if (status === "done") {
		return "All good";
	}
	return "Something failed";
}

// discriminated union: every shape has a "kind" property with a different literal
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Rect = { kind: "rectangle"; width: number; height: number };
type Shape = Circle | Square | Rect;

function area(shape: Shape): number {
	// checking kind narrows shape to one of the two types
	switch (shape.kind) {
		case "circle":
			return Math.PI * shape.radius * shape.radius; // shape is Circle here
		case "square":
			return shape.side * shape.side; // shape is Square here
		case "rectangle":
			return shape.width * shape.height;
	}
}

// a function that returns a shape, so tsc cannot narrow it too early
function makeCircle(): Shape {
	return { kind: "circle", radius: 2 };
}

console.log("label:", label("done"));
console.log("circle:", area(makeCircle()));
console.log("square:", area({ kind: "square", side: 3 }));
console.log("rect:", area({ kind: "rectangle", width: 2, height: 5 }));
