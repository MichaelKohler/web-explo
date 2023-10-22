import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("inner-counter")
export class InnerCounter extends LitElement {
  @property({ type: Number, reflect: true })
  count = 100; // This gets reflected in HTML attribute when it changes because of reflect above

  render() {
    return html`
      <div class="card">
        <button @click=${this._onClick} part="button">
          inner count is ${this.count}
        </button>
      </div>
    `;
  }

  private _onClick() {
    this.count--;
  }

  static styles = css`
    .card {
      padding: 2em;
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
    "inner-counter": InnerCounter;
  }
}
