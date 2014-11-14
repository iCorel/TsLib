module app {
    export class Search {
        public elm: HTMLElement;
        public dat: Array<m.Search>;
        public static install() {
            els("#search").forEach(x=> new Search(x));
        }
        public constructor(elm: HTMLElement) {
            this.elm = elm;
            this.dat = new Array<m.Search>();
            this.elm.el('[name="sex"]').onchange = () => { this.onchange("sex"); };
            this.elm.el('[name="city"]').onchange = () => { this.onchange("city"); };
            this.elm.el('[name="city"]').onchange = () => { this.onchange("city"); };
           // this.elm.el('.tags').onkeydown = (evt) => { this.onkeydown(evt) };
           // this.elm.el('.tags').onkeypress = (evt) => { this.onkeypress(evt) };
            this.elm.el('.tags').onfocus = () => { this.elm.el('.tags input').focus(); };
            this.elm.el('.tags').onactivate = () => { this.elm.el('.tags input').focus(); };
            this.elm.el('.tags').onclick = () => { this.elm.el('.tags input').focus(); };
        }
        public onkeydown(evt: KeyboardEvent) {
            switch (evt.keyCode) {
                default:
                    //this.elm.el(".tags").innerText += String.fromCharCode(evt.keyCode);
            }
            //evt.preventDefault();
        }
        public onkeypress(evt: KeyboardEvent) {
            console.debug("Key: ", evt.keyCode);
            switch (evt.keyCode) {
                default:
                    //this.elm.el(".tags").innerText += evt.char;
            }
            //evt.preventDefault();
        }
        public repaint() {
            this.elm.el(".tags").innerHTML = "";
            this.dat.forEach(x=> {
                var eli = document.createElement("div");
                this.elm.el(".tags")
                    .appendChild(eli);
                eli.innerHTML = x.index + ":" + x.query;
            });
        }
        public onchange(index:string) {
            var iindex = (<HTMLSelectElement>el("[name='"+index+"']")).selectedIndex;
            iindex++;
            var query = el('[name="'+index+'"] option:nth-child(' + iindex + ')').getAttribute("value");
            if (this.dat.filter(x=> x.index == index).length == 0) {
                var x = new m.Search();
                x.index = index;
                x.query = query;
                this.dat.push(x);
            } else {
                this.dat.filter(x=> x.index == index).forEach(x=> {
                    x.index = index;
                    x.query = query;
                });
            }
            this.repaint();
        }
    }
}
app.Search.install();