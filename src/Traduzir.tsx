import React from "react";
import { useIdioma } from "./idiomas";

export default function Traduzir({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useIdioma();

  function traduzirTexto(texto: string) {
    const normalizado = texto.replace(/\s+/g, " ").trim();

    if (!normalizado) return texto;

    const traducao = t(normalizado);

    if (traducao === normalizado) return texto;

    const espacoAntes = /^\s/.test(texto) ? " " : "";
    const espacoDepois = /\s$/.test(texto) ? " " : "";

    return espacoAntes + traducao + espacoDepois;
  }

  function percorrer(no: React.ReactNode): React.ReactNode {
    if (typeof no === "string") {
      return traduzirTexto(no);
    }

    if (Array.isArray(no)) {
      return React.Children.map(no, percorrer);
    }

    if (!React.isValidElement(no)) {
      return no;
    }

    const elemento = no as React.ReactElement<{
      children?: React.ReactNode;
      title?: string;
      alt?: string;
      placeholder?: string;
      "aria-label"?: string;
    }>;

    const propriedades = { ...elemento.props };

    if (propriedades.children !== undefined) {
      propriedades.children = percorrer(propriedades.children);
    }

    // Traduz atributos de texto de elementos HTML.
    // URLs, classes, eventos e valores dos formulários são preservados.
    if (typeof elemento.type === "string") {
      if (propriedades.title) {
        propriedades.title = traduzirTexto(propriedades.title);
      }

      if (propriedades.alt) {
        propriedades.alt = traduzirTexto(propriedades.alt);
      }

      if (propriedades.placeholder) {
        propriedades.placeholder = traduzirTexto(
          propriedades.placeholder,
        );
      }

      if (propriedades["aria-label"]) {
        propriedades["aria-label"] = traduzirTexto(
          propriedades["aria-label"],
        );
      }
    }

    return React.cloneElement(elemento, propriedades);
  }

  return <>{percorrer(children)}</>;
}