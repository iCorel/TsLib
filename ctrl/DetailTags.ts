module z.ctrl {
	export class DetailTags extends Ctrl {
		public Data: Array<m.Tag>;
		public hinput: HTMLInputElement;
		public txt: HTMLElement;
		public list: HTMLUListElement;
		public nested = "_";
		public from = 2;
		public to = 99;
		constructor(public elm: HTMLElement) {
			super(elm);
			this.txt = <any> elm.el('[contenteditable="true"]');
			this.list = <any> elm.el("ul");
			this.txt.onkeydown = evt=> { this.onkeydown(evt); };
			this.txt.onkeyup = evt=> { this.onkeyup(); };
		}
		public getSearchText() {
			//return this.txt.innerHTML.replace(/<q>.*<\/q>/, "");
			var out = this.txt.innerHTML.replace(/.*(<\/q>)/, "");
			out = out.replace(/.* /, "");
			out = out.replace(/&nbsp;/, "");
			//var out = this.txt.innerHTML;
			//var ix=
			//out = out.substr(out.lastIndexOf("</q>")).replace("</q>","");
			console.debug("Tags", out);
			return out;
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
				case 40:
					var selected = this.list.el(".selected");
					this.list.els(".selected").forEach(x=> x.className = "");
					if (selected.nextElementSibling != null)
						(<HTMLElement>selected.nextElementSibling).className = "selected";
					else
						(<HTMLElement>this.list.firstElementChild).className = "selected";
					evt.preventDefault();
			}
			console.debug("", evt.keyCode);
		}
		public onkeyup() {
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
			api.onload = evt=> {
				this.Data = JSON.parse(api.response);
				this.repaint();
			};
		}
		public setSelect(index: number) {
			this.list.els(".selected").forEach(x=> x.className = "");
			(<HTMLElement>this.list.childNodes[index]).className = "selected";
		}
		public reselect() {
			if (this.hinput.value != "" && this.list.el('[data-id="' + this.hinput.value + '"') != null) {
				this.list.el('[data-id="' + this.hinput.value + '"');
			} else if (this.list.firstElementChild != null) {
				(<HTMLElement>this.list.firstElementChild).className = "selected";
				this.hinput.value = this.list.el(".selected").getAttribute("data-id");
			}
		}
		public onclick(evt: MouseEvent) {
			var eli=<HTMLElement>evt.srcElement.cloneNode(true);
			this.txt.innerHTML = this.txt.innerHTML.substr(0, this.txt.innerHTML.lastIndexOf(this.getSearchText()));
			eli = document.createElement("q");
			eli.innerHTML = (<HTMLElement> evt.srcElement).innerHTML;
			eli.setAttribute("data-id",(<HTMLElement> evt.srcElement).getAttribute("data-id"));
			this.txt.appendChild(eli);
			this.txt.focus();
			window.getSelection().selectAllChildren(this.txt);
			window.getSelection().collapseToEnd();
			this.txt.focus();
		}
		public repaint() {
			//if (this.list.el(".selected") != null) {
			//	//this.hinput.value = this.list.el(".selected").getAttribute("data-id");
			//}
			this.list.innerHTML = "";
			this.Data.forEach(x=> {
				var eli = document.createElement("li");
				this.list.appendChild(eli);
				eli.innerHTML = x.Name;
				eli.setAttribute("data-id", x.Id + "");
				eli.onclick = evt=> {this.onclick(evt);};
			});
			//if (this.hinput.value != "" && this.list.el('[data-id="' + this.hinput.value + '"') != null) {
			//	this.list.el('[data-id="' + this.hinput.value + '"]').className = "selected";
			//} else if (this.list.firstElementChild != null) {
			//	(<HTMLElement>this.list.firstElementChild).className = "selected";
			//	//this.hinput.value = this.list.el(".selected").getAttribute("data-id");
			//}
		}
	}
}
//els('[data-ctrl="detailtags"]').forEach(x=> { new z.jsCtrl.Tags(<any>x); });
