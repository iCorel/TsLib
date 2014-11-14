/// <reference path="ctrl.ts" />
module z.ctrl {
	export class Tag{
		//public main: HTMLElement;
		public hinput: HTMLInputElement;
		public input;
		public list: HTMLUListElement;
		public curSelect;
		public Data: Array<m.Tag>;
		public Value;
		public nested;
		public from;
		public to;
		constructor(public elm: HTMLElement) {
			//super(elm);
			this.nested = "_";
			this.from = 2;
			if (this.elm.hasAttribute("data-nested"))
				this.nested = this.elm.getAttribute("data-nested");
			if (this.elm.hasAttribute("data-from"))
				this.from = this.elm.getAttribute("data-from");
			this.to = this.from;
			if (this.elm.hasAttribute("data-to"))
				this.to = this.elm.getAttribute("data-to");
			this.install();
			this.elm.jsObj = this;
		}
		public install() {
			if (this.elm.hasAttribute("data-installed"))
				return;
			this.input = <any>this.elm.el('input:not([type="hidden"])');
			this.list = <any>this.elm.el('ul');
			this.hinput = <any>this.elm.el('input[type="hidden"]');
			if (this.input == null) {
				this.input = <any> document.createElement("input");
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
			return this.input.value;
		}
		public onkeyup() {
			var api = new XMLHttpRequest();
			var url = "/api/tag?";
			url += "query=" + this.getSearchText();
			url += "&nested=" + this.nested;
			url += "&from=" + this.from;
			url += "&to=" + this.to;

			api.open("GET", url, true);
			var dat = new FormData();
			api.send();
			api.onload = evt=> {
				this.Data = JSON.parse(api.response);
				this.repaint();
			};
		}
		public onkeydown(evt: KeyboardEvent) {
			switch (evt.keyCode) {
				case 38:
					var selected = this.list.el(".selected");
					this.list.els(".selected").forEach(x=> x.className = "");
					if (selected.previousElementSibling != null)
						(<HTMLElement>selected.previousElementSibling).className = "selected";
					else
						(<HTMLElement>this.list.lastElementChild).className = "selected";
					evt.preventDefault();
					break;
				case 40:
					var selected = this.list.el(".selected");
					this.list.els(".selected").forEach(x=> x.className = "");
					if (selected.nextElementSibling != null)
						(<HTMLElement>selected.nextElementSibling).className = "selected";
					else
						(<HTMLElement>this.list.firstElementChild).className = "selected";
					evt.preventDefault();
					break;
				case 13:
					var selected = this.list.el(".selected");
					if (selected != null)
						this.select(selected.jsObj);
					evt.preventDefault();
					break;
			}
		}
		public select(dat: m.Tag) {
			this.Value = dat;
			this.input.value = this.Value.Name;
			this.hinput.value = this.Value.Id + "";
		}
		public repaint() {
			var s;
			if (this.list.el(".selected") != null) {
				s = this.list.el(".selected").getAttribute("data-id");
			}
			this.list.innerHTML = "";
			this.Data.forEach(x=> {
				var eli = document.createElement("li");
				this.list.appendChild(eli);
				eli.innerText = x.Name;
				eli.setAttribute("data-id", x.Id + "");
				eli.jsObj = x;
				eli.onclick = evt=> {
					this.select(x);
				};
			});
			if (s != null && this.list.el('[data-id="' + s + '"') != null) {
				this.list.el('[data-id="' + s + '"]').className = "selected";
			} else if (this.list.firstElementChild != null) {
				this.list.el("li").className = "selected";
				s = this.list.el(".selected").getAttribute("data-id");
			}
		}
	}
}
z.Handler.lazyLoad["tag"] = evt=> { els('[data-ctrl="tag"]:not([data-installed])').forEach(x=> { new z.ctrl.Tag(x); }) };