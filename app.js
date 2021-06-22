import { LitElement, html, css } from 'https://unpkg.com/lit@latest?module';
export class MSwitch extends LitElement{
    constructor() {
        super();
        this.active = false;
        this.addEventListener('click', this.flipSwitch);
    }
    static get properties() {
        return {
            active: {type: Boolean},
            color: {type: String}
        };
    }
    flipSwitch(){
        this.active = !(this.active);
    }

    static get styles(){
        return css`
          :host{
            --mcolor: var(--color, white);
            --msize: var(--size, 50px);
            --mdisabledcolor: var(--disabled-color, #888888);
            --mactivecolor: var(--glow-color, white);
            --test: 0;
          }
          :host[disabled]{
            --mcolor: var(--disabled-color, #888888) !important;
          }
          #frame{
            display: flex;
            margin: calc(var(--msize) * .2);
            border: calc(var(--msize) * .05) solid var(--mcolor);
            padding: calc(var(--msize) * .05);
            height: var(--msize);
            width: calc(var(--msize) * 1.5);
            border-radius: calc(var(--msize) * .6);
            transition: box-shadow 300ms cubic-bezier(0.1, 0.9, 0.2, 1);
            background-color: rgba(0, 0, 0, 0);
            backdrop-filter: opacity(.5);
            box-shadow: none;
          }
          #slider{
            width: calc(var(--msize)*.9);
            background-color: var(--mcolor);
            box-shadow: none;
            border-radius: calc(var(--msize) * .5);
            transition: all 300ms cubic-bezier(0.1, 0.9, 0.2, 1);
            position: relative;
            margin: calc(var(--msize)*.05);
            left: 0px;
          }
          #frame:focus{
            outline: none;
          }
          #frame.active #slider{
            left: 33%;
            background-color: var(--mcolor);
            box-shadow: 0px 0px 12px var(--mactivecolor);
          }
          #frame.active{
            border: calc(var(--msize) * .05) solid var(--mcolor);
            box-shadow: 0px 0px 12px var(--mactivecolor), inset 0px 0px 12px var(--mactivecolor);
          }
        `
    }
    render() {
        return html`
            <div id="frame" tabindex="0" class="${(this.active) ? "active" : "" }">
                <div id="slider"></div>
            </div>
        `
    }
}
customElements.define('m-switch', MSwitch);






var select = new Audio('Select.wav');
var deselect = new Audio('Back.wav');
var move = new Audio('Move.wav');


const cursor = document.querySelector("#cursor");

const DEFAULT_CURSOR_SIZE = cursor.style.getPropertyValue("--height");

let isCursorLocked = false;

document.addEventListener("mousedown", () => {
        cursor.style.setProperty("--scale", 0.99);
        select.play()
});

document.addEventListener("mouseup", () => {
        cursor.style.setProperty("--scale", 1);
});

document.addEventListener("mousemove", ({ x, y }) => {
    if (!isCursorLocked) {
        cursor.style.setProperty("--top", y + "px");
        cursor.style.setProperty("--left", x + "px");
    }
});
document.querySelectorAll("m-switch").forEach((msw) => {
    let rect = null;

    msw.addEventListener(
        "mouseenter",
        ({ target }) => {
            isCursorLocked = true;
            move.play()
            rect = target.getBoundingClientRect();
            cursor.style.setProperty("--ccolor", window.getComputedStyle(target).getPropertyValue('--mactivecolor'))
            cursor.style.setProperty("--cglowcolor", window.getComputedStyle(target).getPropertyValue('--mcolor'))


            cursor.classList.add("is-locked");
            cursor.style.setProperty("--top", rect.top + rect.height / 2 + "px");
            cursor.style.setProperty("--left", rect.left + rect.width / 2 + "px");
            cursor.style.setProperty("--width", rect.width + "px");
            cursor.style.setProperty("--height", rect.height + "px");

            target.style.setProperty("--scale", 1.05);
        },
        { passive: true }
    );

    msw.addEventListener(
        "mousemove",
        ({ target }) => {
            const halfHeight = rect.height / 2;
            const topOffset = (event.y - rect.top - halfHeight) / halfHeight;
            const halfWidth = rect.width / 2;
            const leftOffset = (event.x - rect.left - halfWidth) / halfWidth;

            
            cursor.style.setProperty("--translateX", `${leftOffset * 3}px`);
            cursor.style.setProperty("--translateY", `${topOffset * 3}px`);

            target.style.setProperty("--translateX", `${leftOffset * 6}px`);
            target.style.setProperty("--translateY", `${topOffset * 4}px`);
        },
        { passive: true }
    );

    msw.addEventListener(
        "mouseleave",
        ({ target }) => {
            isCursorLocked = false;

            cursor.style.setProperty("--ccolor", "")
            cursor.style.setProperty("--cglowcolor", "")

            cursor.style.setProperty("--width", DEFAULT_CURSOR_SIZE);
            cursor.style.setProperty("--height", DEFAULT_CURSOR_SIZE);
            cursor.style.setProperty("--translateX", 0);
            cursor.style.setProperty("--translateY", 0);

            target.style.setProperty("--translateX", 0);
            target.style.setProperty("--translateY", 0);
            target.style.setProperty("--scale", 1);

            setTimeout(() => {
                if (!isCursorLocked) {
                    cursor.classList.remove("is-locked");
                }
            }, 100);
        },
        { passive: true }
    );
});