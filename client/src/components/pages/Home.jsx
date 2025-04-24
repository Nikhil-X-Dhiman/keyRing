export function Home() {
	// WRITE THE FETCH FUNCTION HERE TO GET LOGIN LIST

	return (
		<>
			<h1 className="">Home</h1>
			<main className="flex">
				<div className="sidepanel">
					<ul>
						<li>All Items</li>
						<li>Favourites</li>
						<li>Bin</li>
					</ul>
					<button>TYPES</button>
					<ul>
						<li>Login</li>
						<li>Card</li>
						<li>Identity</li>
						<li>Secure Note</li>
						<li>SSH Key</li>
					</ul>
					<button>FOLDERS</button>
					<ul>
						<li>No Folder</li>
					</ul>
				</div>
				<div className="entry-list">
					{/* LOGIN LIST HERE */} <p>hello</p>
				</div>
				<div className="entry-content">
					<p>world</p>
				</div>
			</main>
		</>
	);
}
