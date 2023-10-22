import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import litLogo from "./assets/lit.svg";
import viteLogo from "/vite.svg";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("my-element")
export class MyElement extends LitElement {
  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0; // This count does not get reflected in the HTML when it changes

  @property({ type: String })
  foo = "meh";

  @state()
  private blaState = { test: "intial" };

  render() {
    return html`
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src=${viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://lit.dev" target="_blank">
          <img src=${litLogo} class="logo lit" alt="Lit logo" />
        </a>
      </div>
      <slot name="title"></slot>
      <div class="card">
        <button @click=${this._onClick} part="button">
          count is ${this.count}
        </button>
        <button @click=${this._resetState} part="button">Reset state!</button>
      </div>
      <slot name="innerTitle"></slot>
      <!-- the inner counter does get updated as well if updating the outer counter,
           but the outer counter does not get updated when updating the inner one! -->
      <inner-counter count=${this.count}></inner-counter>
      <a href="https://example.com">${this.foo}</a>
      <p>State: ${this.blaState.test}</p>
      <slot name="never">This is a slot fallback!</slot>
    `;
  }

  private _resetState() {
    this.blaState = { test: "reset!" };
  }

  private _onClick() {
    this.count++;
    this.blaState.test = "clicked!";
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #f2ca53;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      button {
        background-color: #f9f9f9;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
