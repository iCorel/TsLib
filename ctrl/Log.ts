module z.ctrl {
	export class Log {
		public ws: WebSocket;
		public ajax: XMLHttpRequest;
		public lastCmd: string = "";
		constructor(public elm: HTMLElement) {
			this.elm.jsObj = this;
			this.installAjax();
		}
		showLog() {
			var temp = this;
			var ajax = new XMLHttpRequest();
			ajax.onload = () => {
				temp.elm.innerHTML += temp.ajax.response;
				temp.elm.scrollTop = temp.elm.scrollHeight;
			};
			ajax.open("GET", this.elm.getAttribute("data-log-url"), true);
			ajax.send();
		}
		installAjax() {
			this.ajax = new XMLHttpRequest();
			var temp = this;
			this.ajax.onload = () => {
				temp.elm.innerHTML += temp.ajax.response;
				if (temp.elm.innerHTML.length > 10000)
					temp.elm.innerHTML = temp.elm.innerHTML.substring(temp.elm.innerHTML.length - 9500);
				temp.elm.scrollTop = temp.elm.scrollHeight;
			};
			setInterval(() => {
				this.ajax.open("GET", this.elm.getAttribute("data-url"), true);
				this.ajax.send();
			}, 10000);
		}
		installWs() {
			this.ws = new WebSocket("ws://" + HOST + ":" + PORT + "/Ws");
			//this.ws = new WebSocket("ws://localhost:1590/Ws");
			var temp = this;
			var obj: Array<Object>;
			this.ws.onopen = evt=> {
				temp.elm.el("div").innerHTML += "<h4 style=\"color:red;\">Ready</h4>";
			}
			this.ws.onclose = evt=> {
				temp.elm.el("div").innerHTML += "<h4 style=\"color:red;\">Ws Close pls F5</h4>";
			}
			this.ws.onerror = evt=> {
				temp.elm.el("div").innerHTML += "<h4 style=\"color:red;\">Ws Error</h4>";
				temp.elm.el("div").scrollTop = temp.elm.el("div").scrollHeight;
			}
			this.ws.onmessage = evt=> {
				temp.elm.el("div").innerHTML += evt.data;
				if (temp.elm.el("div").innerHTML.length > 10000)
					temp.elm.el("div").innerHTML = temp.elm.el("div").innerHTML.substring(temp.elm.el("div").innerHTML.length - 9000);
				temp.elm.el("div").scrollTop = temp.elm.el("div").scrollHeight;
			}
			this.elm.el("input[type=\"text\"]").onkeydown = evt=> {
				if (evt.keyCode == 13) {
					var str = (<any>temp.elm.el("input[type=\"text\"]")).value;
					(<any>temp.elm.el("input[type=\"text\"]")).value = "";
					temp.ws.send(str);
					temp.elm.el("div").innerHTML += ">" + str + "<br/>";
					temp.lastCmd = str;
				}
				if (evt.keyCode == 38) {
					(<any>temp.elm.el("input[type=\"text\"]")).value = temp.lastCmd;
				}
			}
			this.elm.el("input[type=\"button\"]").onclick = () => {
				var str = (<any>temp.elm.el("input[type=\"text\"]")).value;
				(<any>temp.elm.el("input[type=\"text\"]")).value = "";
				temp.ws.send(str);
				temp.elm.el("div").innerHTML += ">" + str + "<br/>";
				temp.elm.el("input[type=\"text\"]").focus();
				temp.lastCmd = str;
			}
		}
	}
}