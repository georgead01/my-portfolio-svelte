console.log("IT’S ALIVE!");

function $$ (selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

/*
// getting current link
let navLinks = $$("nav a");
let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname)

// make current link a member of the class current
if (currentLink) {
	currentLink.classList.add("current");
}
*/

// are we home?
const ARE_WE_HOME = document.documentElement.classList.contains("home");

// define array of pages
let pages = [
	{url: ".", title: "home"},
	{url: "projects", title: "projects"},
	{url: "resume", title: "resume"},
    {url: "contact", title: "contact"},
    {url: "https://github.com/georgead01", title: "github"}
];

// create nav bar
let nav = document.createElement("nav");
document.body.prepend(nav);

// add links to bar
for (let p of pages) {
	let url = p.url;
	let title = p.title;
	
    let a = document.createElement("a");

    a.textContent = title;
    a.href = url;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current");
    }

    if (a.host != location.host) {
        a.setAttribute('target', '_blank')
    }

    nav.appendChild(a);
}

// add color scheme control
document.body.insertAdjacentHTML("afterbegin", `
	<label class="color-scheme">
		Theme:
		<select>
        <option value="light dark">default</option>
        <option value="light">light</option>
        <option value="dark">dark</option>
		</select>
	</label>`
);

let select = document.querySelector('.color-scheme');
select.addEventListener("input", function (event) {
	console.log("color scheme changed to", event.target.value);
    document.documentElement.style.setProperty("color-scheme", event.target.value);
    localStorage.colorScheme = event.target.value;
});

// update color scheme
if ("colorScheme" in localStorage) {
    let scheme = localStorage.colorScheme;
    select.value = scheme;
    document.documentElement.style.setProperty("color-scheme", scheme);
}