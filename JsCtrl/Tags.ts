module z.jsCtrl {
	export class Tags extends Ctrl {
		public Data: Array<m.Tag>;
		public Value: Array<m.Tag> = new Array();
		public hinput: HTMLInputElement;
		public txt: HTMLElement;
		public list: HTMLUListElement;
		public currentSelect;
		public nested = "_";
		public from = 2;
		public to = 99;
		constructor(public elm: HTMLElement) {
			super(elm);
			if (elm.hasAttribute("data-nested")) {

			}
			this.txt = <any> elm.el('[contenteditable="true"]');
			this.list = <any> elm.el("ul");
			this.hinput = <any>elm.el('input[type="hidden"]');
			this.txt.onkeydown = evt=> { this.onkeydown(evt); };
			this.txt.onkeyup = evt=> { this.onkeyup(evt); };
		}
		public getSearchText() {
			var out = this.txt.innerHTML.replace(/.*(<\/q>)/, "");
			out = out.replace(/&nbsp;/, "");
			console.debug("Tags", out);
			return out;
		}
		//#region event
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
					var dat: m.Tag;
					this.Data.forEach(x=> {
						if (x.Id + "" == selected.getAttribute("data-id"))
							dat = x;
					}
						);
					this.select(dat);
					evt.preventDefault();
					break;
			}
			console.debug("", evt.keyCode);
		}
		public onkeyup(evt: KeyboardEvent) {
			if (evt.keyCode == 38 || evt.keyCode == 40) {
				return;
			}
			var api = new XMLHttpRequest();
			var url = "/api/tag?";
			url += "query=" + this.getSearchText();
			url += "&nested=" + this.nested;
			//if (this.txt.hasAttribute("data-from")) {
			url += "&from=" + this.from;
			//}
			//if (this.to) {
			url += "&to=" + this.to;
			//}
			api.open("GET", url, true);
			var dat = new FormData();
			api.send();
			//var _this=this;
			api.onload = evt=> {
				this.Data = JSON.parse(api.response);
				this.repaint();
			};
		}
		public select(dat: m.Tag) {
			this.Value.push(dat);
			var eli = document.createElement("q");
			var elib = document.createElement("button");
			eli = document.createElement("q");
			eli.innerHTML = " " + dat.Name;
			eli.setAttribute("data-id", dat.Id + "");
			eli.appendChild(elib);
			elib.classList.add("close");
			elib.innerHTML = '<span aria-hidden="true">&times;</span>';
			elib.onclick = evt=> { this.remove(dat); };
			this.txt.innerHTML = this.txt.innerHTML.substr(0, this.txt.innerHTML.lastIndexOf(this.getSearchText()));
			this.txt.appendChild(eli);
			this.reFocusTxt();
			this.refreshValue();
		}
		public remove(dat: m.Tag) {
			var index = this.Value.indexOf(dat);
			this.Value.splice(index);
			this.txt.els('[data-id="' + dat.Id + '"]').forEach(x=> {
				this.txt.removeChild(x);
			});
			this.refreshValue();
		}
		public refreshValue() {
			var value = "";
			this.Value.forEach(x=> value += "," + x.Id);
			value=value.substr(1);
			this.hinput.value = value;
		}
		public reFocusTxt() {
			this.txt.focus();
			window.getSelection().selectAllChildren(this.txt);
			window.getSelection().collapseToEnd();
			this.txt.focus();
		}
		//#endregion
		public repaint() {
			this.list.innerHTML = "";
			this.Data.forEach(x=> {
				var eli = document.createElement("li");
				this.list.appendChild(eli);
				eli.innerHTML = x.Name;
				eli.setAttribute("data-id", x.Id + "");
				eli.onclick = evt=> { this.select(x); };
			});
			this.list.els(".selected").forEach(x=> x.className = "");
			if (this.list.el("li") != null)
				(<HTMLElement>this.list.el("li")).className = "selected";
		}
	}
}
els('[data-ctrl="tags"]').forEach(x=> { new z.jsCtrl.Tags(<any>x); });
