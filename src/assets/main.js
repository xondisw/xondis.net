const swup = new Swup({
	containers: ["#swup", "#swup-topbar"]
});

let header_startHeight = 0;

swup.hooks.on("visit:start", () => {
	const header = document.getElementById("header");
	header_startHeight = header.getBoundingClientRect().height;
	header.style.height = `${header_startHeight}px`;
});

swup.hooks.on("page:view", () => {
	const header = document.getElementById("header");
	const topbar = document.getElementById("topbar");
	const header_imgName = document.getElementById("header-img-name");

	const main_container = document.getElementById("swup");
	const header_state = main_container.getAttribute("data-header-state");
	const topbar_on = main_container.getAttribute("data-topbar-on") === "true"; 

	header.classList.remove("transition-headerResize");
	header.style.height = "";

	const transitions = ["transition-headerHide", "transition-headerShow"];
	if (topbar) topbar.classList.remove(...transitions);
	if (header_imgName) header_imgName.classList.remove(...transitions);

	if (header_state === 'full') {
		header.classList.remove('h-auto');
		header.classList.add('h-[calc(100vh-12rem)]');
		
		if (topbar) {
			topbar.classList.add(transitions[0]);
			topbar.classList.remove(transitions[1]);
		}
		if (header_imgName) {
			header_imgName.classList.add(transitions[1]);
			header_imgName.classList.remove(transitions[0]);
		}

	} else {
		// compact / other unrecognized type
		header.classList.remove('h-[calc(100vh-12rem)]');
		header.classList.add('h-auto');

		if (topbar) {
			if (topbar_on) {
				topbar.classList.add(transitions[1]);
				topbar.classList.remove(transitions[0]);
			} else {
				topbar.classList.add(transitions[0]);
				topbar.classList.remove(transitions[1]);
			}
		}
		if (header_imgName) {
			header_imgName.classList.add(transitions[0]);
			header_imgName.classList.remove(transitions[1]);
		}
	}

	const header_targetHeight = header.getBoundingClientRect().height;

	header.style.height = `${header_startHeight}px`;
	void header.offsetHeight;
	header.classList.add("transition-headerResize");
	header.style.height = `${header_targetHeight}px`;
	
	setTimeout(() => {header.style.height = "";}, 550);
});

swup.hooks.on("content:replace.before", () => {
	const main_container = document.getElementById("swup");
	main_container.style.opacity = "0";
});
swup.hooks.on("content:replace", () => {twemoji.parse(document.body);});

swup.hooks.on("visit:end", () => {
	const main_container = document.getElementById("swup");
	main_container.style.opacity = "";
});