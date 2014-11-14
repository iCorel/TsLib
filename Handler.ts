module z {
	export class Handler {

		public static keydown: Object = new Object();
		public static keypress: Object = new Object();
		public static click: Object = new Object();
		public static bodyclick: Object = new Object();
		public static lazyLoad: Object = new Object();

		public static onClick(evt: MouseEvent) {
			for (var x in Handler.bodyclick) {
				if (isDebug)
					console.debug("bodyclick run:", x);
				Handler.bodyclick[x](evt.srcElement);
			}
			Handler.invoke("click", evt);
		}
		public static onkeypress(evt: KeyboardEvent) {
			Handler.invoke("keypress", evt);
		}
		public static onkeydown(evt: KeyboardEvent) {
			Handler.invoke("keydown", evt);
		}
		public static onLoad() {
			if (isDebug)
				console.groupCollapsed("lazyload");
			for (var x in Handler.lazyLoad) {
				if (isDebug)
					console.debug("lazyload run:", x);
				Handler.lazyLoad[x]();
			}
			if (isDebug)
				console.groupEnd();
		}
		public static invoke(type: string, evt: Event) {
			if (isDebug)
				var g = dbO(type);
			var datType = "data-" + type;
			var elm = <HTMLElement> evt.srcElement;
			if (elm == null) return;
			while (!elm.hasAttribute(datType) && elm.tagName != "HTML") {
				elm = elm.parentElement;
			}
			if (!elm.hasAttribute(datType)) {
				if (isDebug) {
					console.debug("not found element [" + datType + "]");
					dbE(g);
				}
				return;
			} else if (Handler[type] == null) {
				if (isDebug) {
					console.debug("ctrl [" + elm.getAttribute(datType) + " " + type + "] not found");
					dbE(g);
				}
				return;
			} else if (Handler[type][elm.getAttribute(datType)] == null) {
				if (isDebug) {
					console.debug("ctrl [" + elm.getAttribute(datType) + " " + type + "] not found");
					dbE(g);
				}
				return;
			}
			Handler[type][elm.getAttribute(datType)](elm, evt);
			if (isDebug) {
				console.debug("excute [" + elm.getAttribute(datType) + " " + type + "]");
				dbE(g);
			}
		}
		public static invokeRunlater() {
			els("script[data-runlater]").forEach(x=> {
				setTimeout(x.innerHTML, 500);
			});
		}
	}
}
window.onload = z.Handler.onLoad;
document.addEventListener("click", z.Handler.onClick);
document.addEventListener("keypress", z.Handler.onkeypress);
document.addEventListener("keydown", z.Handler.onkeydown);