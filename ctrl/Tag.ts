module z.ctrl {
	export class Tag {
		public main: HTMLElement;
		public hinput: HTMLInputElement;
		//public input: HTMLInputElement;
		public list: HTMLUListElement;
		public Data: Array<m.Tag>;
		public onChange: Function;
		public constructor(public input: HTMLInputElement) {
			this.main = document.createElement("div");
			this.main.setAttribute("data-ctrl", "tag");
			this.hinput = <any> document.createElement("input");
			this.hinput.type = "hidden";
			this.hinput.name = this.input.getAttribute("data-name");
			this.input.onkeydown = evt=> { this.onkeydown(evt) };
			this.input.onkeyup = evt=> { this.onkeyup() };
			this.list = <any> document.createElement("ul");
			//#region Get Width Height
			//var w = this.input.offsetWidth;
			//var h = this.input.offsetHeight;
			//#endregion
			var cs = this.input.classList;
			cs.remove("form-control");
			for (var i = 0; i < cs.length; i++) {
				this.main.classList.add(cs[i]);
				this.input.classList.remove(cs[i]);
			}
			this.input.parentElement.insertBefore(this.main, this.input);
			this.main.appendChild(this.input);
			this.main.appendChild(this.hinput);
			this.main.appendChild(this.list);
			this.onkeyup();
			//#region Bootstrap
			//this.main.style.height = h + "px";
			//this.main.style.width = w + "px";
			this.input.classList.add("form-control");
			this.list.classList.add("dropdown-menu");
			this.main.classList.add("input-group");
			if (this.input.hasAttribute("data-lbl")) {
				var lbl = document.createElement("div");
				lbl.innerHTML = this.input.getAttribute("data-lbl");
				lbl.classList.add("input-group-addon");
				this.main.insertBefore(lbl, this.input);
			}
			var btn = document.createElement("div");
			btn.classList.add("input-group-btn");
			this.main.insertBefore(btn,this.hinput);
			btn.innerHTML = '<button type="button" class="btn btn-info"><span class="caret"></span></button>';
			btn.onclick = () => {
				if (this.list.classList.contains("show")) {
					this.list.classList.remove("show");
				} else {
					this.list.style.width = this.main.offsetWidth+"px";
					this.list.classList.add("show");
				}
			};
			//#endregion
			this.main.jsObj = this;
		}
		public onclick() {
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
			url += "query=" + this.input.value;
			url += "&nested=" + this.input.getAttribute("data-nested");
			if (this.input.hasAttribute("data-from")) {
				url += "&from="+this.input.getAttribute("data-from");
			}
			if (this.input.hasAttribute("data-to")) {
				url += "&to=" + this.input.getAttribute("data-to");
			}
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
		public repaint() {
			if (this.list.el(".selected") != null) {
				this.hinput.value = this.list.el(".selected").getAttribute("data-id");
			}
			this.list.innerHTML = "";
			this.Data.forEach(x=> {
				var eli = document.createElement("li");
				this.list.appendChild(eli);
				eli.innerHTML = "<a>" + x.Name + "</a>";
				eli.setAttribute("data-id", x.Id + "");
			});
			if (this.hinput.value != "" && this.list.el('[data-id="' + this.hinput.value + '"') != null) {
				this.list.el('[data-id="' + this.hinput.value + '"]').className = "selected";
			} else if (this.list.firstElementChild != null) {
				(<HTMLElement>this.list.firstElementChild).className = "selected";
				this.hinput.value = this.list.el(".selected").getAttribute("data-id");
			}
		}
	}
}
//els('[data-ctrl="tag"]').forEach(x=> { new z.ctrl.Tag(<any>x); });