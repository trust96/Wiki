import {
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type NodeKey,
  type SerializedLexicalNode,
} from "lexical";
import type { JSX } from "react";

type TSerializedImageNode = SerializedLexicalNode & {
  src: string;
  alt: string;
};

const convertImage = (element: HTMLElement): DOMConversionOutput | null => {
  const src = element.getAttribute("src");
  if (!src) return null;
  return {
    node: $createImageNode(src, element.getAttribute("alt") ?? ""),
  };
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  constructor(src: string, alt = "", key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  createDOM(_config: EditorConfig) {
    const span = document.createElement("span");
    span.className = "wikiEditorImage";
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <img src={this.__src} alt={this.__alt} />;
  }

  exportJSON(): TSerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
      alt: this.__alt,
    };
  }

  static importJSON(json: TSerializedImageNode) {
    return $createImageNode(json.src, json.alt);
  }

  exportDOM(): DOMExportOutput {
    const img = document.createElement("img");
    img.setAttribute("src", this.__src);
    img.setAttribute("alt", this.__alt);
    return { element: img };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({ conversion: convertImage, priority: 0 }),
    };
  }
}

export const $createImageNode = (src: string, alt = "") =>
  new ImageNode(src, alt);
