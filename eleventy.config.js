//import { IdAttributePlugin } from "@11ty/eleventy";

import fs from "fs";
import path from "path";

export default function(eleventyConfig) {
	// material icons - shortcode
	let shortcode_symbol = function(name, weight = 400, style = "rounded", extraClasses = "material-icons-rounded") {
		if (weight === null) weight = 400;
		const filePath = path.join(process.cwd(), `node_modules/@material-symbols/svg-${weight}/${style}/${name}.svg`);
		if (!fs.existsSync(filePath)) {
			console.warn(`Material Symbols' "${name}" not found in "${style}" style.`);
			return "";
		}
		let svgContent = fs.readFileSync(filePath, 'utf8');

		if (!extraClasses.includes("material-icons-rounded")) {extraClasses = "material-icons-rounded ".concat(extraClasses);}
		if (extraClasses) {svgContent = svgContent.replace('<svg ', `<svg class="${extraClasses}" `);}

		return svgContent;
	};
	eleventyConfig.addShortcode("symbol", shortcode_symbol);

	// simple icons (brand logos) - shortcode
	let shortcode_brand = function(slug, extraClasses = "material-icons-rounded") {
	    const filePath = path.join(process.cwd(), `node_modules/simple-icons/icons/${slug}.svg`);
	    if (!fs.existsSync(filePath)) {console.warn(`Simple Icons' slug "${slug}" not found.`); return "";}
	    let svgContent = fs.readFileSync(filePath, 'utf8');

	    // "brand" inherits material-icons-rounded's class
	    if (!extraClasses.includes("material-icons-rounded")) {extraClasses = "material-icons-rounded ".concat(extraClasses);}
	    if (extraClasses) {svgContent = svgContent.replace('<svg ', `<svg class="${extraClasses}" `);}

	    return svgContent;
	};
	eleventyConfig.addShortcode("brand", shortcode_brand);

	// topbar shortcodes
	eleventyConfig.addShortcode("topbarPath", function(title, path = "", links = "") {
		let home_icon = shortcode_symbol("home", 400, undefined, "fill-current");
		let home_btn = `<a href="/" class="my-4 text-primary-700 bg-primary-100 p-2 border-6 border-double border-primary-700 rounded-full"><span>${home_icon}<span class="mx-1 font-mono font-medium">home</span></span></a>`;
		if (!title) {return home_btn;}

		let path_icon = shortcode_symbol("east", 400, undefined, "!inline-block sm:!hidden");
		let subdirectory_path_icon = shortcode_symbol("subdirectory_arrow_right", 400, undefined, "!inline-block sm:!hidden");

		let smpath_icon = shortcode_symbol("east", 400, undefined, "!hidden sm:!inline-block");

		let linebreak = `<div class="sm:!hidden basis-full h-0"></div>`;
		let first_path_icon_wrapper = `<div class="flex items-center"><span class="m-2">${subdirectory_path_icon}${smpath_icon}</span>`;
		let path_icon_wrapper = `<div class="flex items-center"><span class="m-2">${path_icon}${smpath_icon}</span>`;

		if (path) path = `${path}|${title}`; else path = title;

		path = path.split("|");
		if (links) links = links.split("|");

		let html_crumbs = path.map((name, index) => {
			if (index == path.length - 1) {return `<span class="inline mx-1 text-black text-7xl font-porcelain font-medium">${name}</span></div>`}
			let link = links ? links[index] : null;
			let link_extraClasses = "inline mx-1 text-black text-xl font-display font-medium";
			return link
			? `<a href="${link}"><span class="${link_extraClasses} no-underline border-b-2 border-solid border-black">${name}</span></a></div>${(index == path.length - 2 && path.length > 1) ? linebreak : ""}`
			: `<span class="${link_extraClasses}">${name}</span></div>${(index == path.length - 2 && path.length > 1) ? linebreak : ""}`
		});

		return `${home_btn}${linebreak}${first_path_icon_wrapper}${html_crumbs.join(path_icon_wrapper)}`;
	});

	// general config
	eleventyConfig.addPassthroughCopy({"src/assets": "shared"});
	eleventyConfig.addPassthroughCopy({"src/fonts": "shared/fonts"});

	return {
		markdownTemplateEngine: "njk"
	};
}