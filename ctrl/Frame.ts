module z.ctrl {
	export class Frame {
		public static getNav(elm: HTMLElement): HTMLElement {
			var eli = elm;
			while (eli.nodeName != "BODY") {
				if (eli.getAttribute("data-ctrl") == "frame-nav") {
					return eli;
				}
				eli = eli.parentElement;
			}
			console.error("Not Found [frame-nav]"); return;
		}
		public static getBase(elm: HTMLElement): HTMLElement {
			var eli = elm;
			while (eli.nodeName != "BODY") {
				if (eli.getAttribute("data-ctrl") == "frame-base") {
					return eli;
				}
				eli = eli.parentElement;
			}
			console.error("Not Found [frame-base]"); return;
		}
		public static go(elm: HTMLElement, str: string) {
			var frame = el("[data-frame='" + str + "']");
			var base = Frame.getBase(frame);
			var nav = Frame.getNav(elm);
			base.els("[data-frame]").forEach(x=> {
				if (x.classList.contains("active"))
					x.classList.remove("active");
			});
			nav.els("[data-role='frame']").forEach(x=> {
				if (x.classList.contains("active"))
					x.classList.remove("active");
			});
			frame.classList.add("active");
			elm.classList.add("active");
		}
	}
}