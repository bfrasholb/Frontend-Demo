import { useState, useEffect, useRef } from "react";

export default function App() {
	const [name, setName] = useState("");
	const [user, setUser] = useState({ age: 30 });
	const [tags, setTags] = useState(["a", "b"]);
	const [show, setShow] = useState(true);
	useEffect(() => {
		document.title = name;
	}, [name]);

	return (
		<Card title={name}>
			<p>A conversation in tags:</p>
			<Tag text="Hello There!" color="blue" />
			<Tag text="General Kenobi!" color="red" />
			<Counter />
			<NameBox name={name} setName={setName} />
			<Profile
				name={name}
				user={user}
				setUser={setUser}
				tags={tags}
				setTags={setTags}
			/>
			<Parent />
			<TagList user={user} tags={tags} isAdmin={true} />
			<button onClick={() => setShow(!show)}>Timer Toggle</button>
			{show && <Timer />}
			<Users />
			<Focus />
		</Card>
	); // used like a custom HTML tag
}

function Focus() {
	const inputRef = useRef(null); // box with a .current slot

	return (
		<div>
			<input ref={inputRef} />
			<button onClick={() => inputRef.current.focus()}>Focus</button>
		</div>
	);
}

function Users() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		// EFFECT: runs AFTER render
		fetch("https://jsonplaceholder.typicode.com/users")
			.then((res) => {
				if (!res.ok) throw new Error("HTTP " + res.status); // fetch does NOT throw on 404/500
				return res.json();
			})
			.then((data) => setUsers(data)) // setter: triggers RENDER with data
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []); // [] = fetch once

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	return (
		<ul>
			{users.map((u) => (
				<li key={u.id}>{u.name}</li>
			))}
		</ul>
	);
}

function Timer() {
	const [secs, setSecs] = useState(0);

	useEffect(() => {
		console.log("effect start");
		const id = setInterval(() => setSecs((s) => s + 1), 1000); // setter: updater form
		return () => {
			console.log("cleanup");
			clearInterval(id); // CLEANUP: runs on unmount and before the effect re-runs
		};
	}, []); // dependency array: [] = run once after the first render

	return <p>{secs}s</p>;
}

// second effect, re-runs when name changes:
// useEffect(() => { document.title = name }, [name])

function Badge() {
	return <span>admin</span>;
}

const Tag = ({ text, color = "gray" }) => (
	<span
		style={{
			background: color,
			color: "white",
			padding: "2px 8px",
			borderRadius: 6,
		}}
	>
		{text}
	</span>
);
const Card = ({ title, children }) => (
	<div className="card">
		<h2>{title}</h2>
		{children}
	</div>
);

function Counter() {
	const [count, setCount] = useState(0);
	console.log("count is", count);
	return (
		<div>
			<button
				onClick={() => {
					setCount(count + 1);
				}}
			>
				+
			</button>
			<button
				onClick={() => {
					setCount(count - 1);
				}}
			>
				-
			</button>
			<button
				onClick={() => {
					setCount(0);
				}}
			>
				reset
			</button>
			<p>{count}</p>
		</div>
	);
}

function NameBox({ name, setName }) {
	return (
		<div>
			<input value={name} onChange={(e) => setName(e.target.value)} />
			<p>
				Hello {name}, there are {name.length} chars in your name!
			</p>
			<button onClick={() => setName("")}>reset</button>
		</div>
	);
}

function Profile({ name, user, setUser, tags, setTags }) {
	return (
		<div>
			<button onClick={() => setUser({ ...user, age: user.age + 1 })}>
				Birthday
			</button>
			<button onClick={() => setTags([...tags, "tag" + Date.now()])}>
				Add tag
			</button>
			<button onClick={() => setTags(tags.filter((t) => t !== "a"))}>
				Remove a
			</button>
			<button onClick={() => setTags(tags.slice(0, -1))}>
				Remove last Tag
			</button>
			<p>
				{name} is {user.age}
			</p>
			{tags.length > 0 ? (
				<ul>
					{tags.map((t) => (
						<li key={t}>{t}</li>
					))}
				</ul>
			) : (
				<p>No Tags</p>
			)}
			{user.age >= 18 && <Badge />}
		</div>
	);
}

function Child({ label, amount, onChange }) {
	return <button onClick={() => onChange(amount)}>{label}</button>; // calls the parent's function
}

function Parent() {
	const [total, setTotal] = useState(0); // state lives in the parent
	return (
		<div>
			<p>Total: {total}</p>
			<Child label="Add 5" amount={5} onChange={(n) => setTotal(total + n)} />
			<Child
				label="Subtract 1"
				amount={1}
				onChange={(n) => setTotal(total - n)}
			/>
		</div>
	);
}

function TagList({ user, tags, isAdmin }) {
	return (
		<div>
			<ul>
				{tags.map((t) => (
					<li key={t}>{t}</li> // key: unique id so React can track each item
				))}
			</ul>
			{isAdmin ? <Badge /> : <span>{user.name}</span>}{" "}
			{/* ternary: pick one of two */}
			{isAdmin && <Badge />} {/* &&: show or nothing */}
			{tags.length && <p>has tags</p>} {/* BUG: renders "0" when empty */}
			{tags.length > 0 && <p>has tags</p>}{" "}
			{/* FIX: compare so it's true/false */}
		</div>
	);
}
