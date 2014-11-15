/// <reference path="tag.ts" />
module z.ctrl {
	export class Tags extends Tag {
		public input: HTMLElement;
		public Value: Array<m.Tag> = new Array();
		constructor(public elm: HTMLElement) {
			super(elm);
		}
		public install() {
			if (this.elm.hasAttribute("data-installed"))
				return;
			this.input = <any>this.elm.el('[contenteditable="true"]');
			this.list = <any>this.elm.el('ul');
			this.hinput = <any>this.elm.el('input[type="hidden"]');
			if (this.input == null) {
				this.input = <any> document.createElement("input");
				this.input.setAttribute("contenteditable", "true");
				this.input.classList.add("form-control");
				this.elm.appendChild(this.input);
			}
			if (this.list == null) {
				this.list = <any> document.createElement("ul");
				this.elm.appendChild(this.list);
			}
			if (this.hinput == null) {
				this.hinput = <any> document.createElement("input");
				this.hinput.type = "hidden";
				this.hinput.name = this.input.getAttribute("data-name");
				this.elm.appendChild(this.hinput);
			}
			this.input.onkeydown = evt=> { this.onkeydown(evt) };
			this.input.onkeyup = evt=> { this.onkeyup() };
		}
		public getSearchText() {
			var out = this.input.innerHTML.replace(/.*(<\/q>)/, "");
			out = out.replace(/&nbsp;/, "");
			console.debug("Tags", out);
			return out;
		}
		public select(dat: m.Tag) {
			this.Value.push(dat);
			this.refreshValue();
			this.reFocusTxt();
		}
		public remove(dat: m.Tag) {
			var index = this.Value.indexOf(dat);
			this.Value.splice(index,1);
			this.input.els('[data-id="' + dat.Id + '"]').forEach(x=> {
				this.input.removeChild(x);
			});
			this.refreshValue();
			this.reFocusTxt();
		}
		public reFocusTxt() {
			this.input.focus();
			window.getSelection().selectAllChildren(this.input);
			window.getSelection().collapseToEnd();
			this.input.focus();
		}
		public refreshValue() {
			var value = "";
			this.input.innerHTML = "";
			this.Value.forEach(x=> {
				value += "," + x.Id;
				var eli = document.createElement("q");
				var elib = document.createElement("button");
				eli = document.createElement("q");
				eli.innerHTML = " " + x.Name;
				eli.setAttribute("data-id", x.Id + "");
				eli.appendChild(elib);
				elib.classList.add("close");
				elib.innerHTML = '<span aria-hidden="true">&times;</span>';
				elib.onclick = evt=> { this.remove(x); };
				this.input.appendChild(eli);
			});
			value = value.substr(1);
			this.hinput.value = value;
		}
	}
}
z.Handler.lazyLoad["tags"] = evt=> { els('[data-ctrl="tags"]:not([data-installed])').forEach(x=> { new z.ctrl.Tags(x); }) };