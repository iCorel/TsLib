module z.ctrl {
	export class HashTable {

	}
}
window.addEventListener("hashchange", (evt) => {
	var thelm = el("thead[data-hash]");
	var tbelm = thelm.parentElement;
	var ajax = new XMLHttpRequest();
	ajax.open("GET", thelm.getAttribute("data-hash") + location.hash.substr(1) + "&layout=0");
	ajax.onload = (evt) => {
		tbelm.outerHTML = ajax.response;
	};
	ajax.send();
});