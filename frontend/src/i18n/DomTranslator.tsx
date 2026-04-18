import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { normalizeLanguage, translateContent } from "./catalog";

const textNodeOriginals = new WeakMap<Text, string>();
const attributeOriginals = new WeakMap<HTMLElement, Record<string, string>>();
const ATTRIBUTES_TO_TRANSLATE = ["placeholder", "title", "aria-label", "alt"] as const;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME"]);

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;
  if (!parent) return true;
  if (SKIP_TAGS.has(parent.tagName)) return true;
  if (parent.closest("[data-no-translate='true']")) return true;
  return false;
}

function applyTextTranslations(root: ParentNode, lang: "pt" | "en" | "fr") {
  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentText = textWalker.nextNode();

  while (currentText) {
    const textNode = currentText as Text;

    if (!shouldSkipTextNode(textNode)) {
      const original = textNodeOriginals.get(textNode) ?? textNode.nodeValue ?? "";
      if (!textNodeOriginals.has(textNode)) {
        textNodeOriginals.set(textNode, original);
      }

      const translated = translateContent(original, lang);
      if ((textNode.nodeValue ?? "") !== translated) {
        textNode.nodeValue = translated;
      }
    }

    currentText = textWalker.nextNode();
  }

  const elementWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let currentElement = elementWalker.nextNode();

  while (currentElement) {
    const element = currentElement as HTMLElement;

    if (!SKIP_TAGS.has(element.tagName) && !element.closest("[data-no-translate='true']")) {
      const originals = attributeOriginals.get(element) ?? {};

      ATTRIBUTES_TO_TRANSLATE.forEach((attribute) => {
        const currentValue = element.getAttribute(attribute);
        if (currentValue === null) return;

        if (!(attribute in originals)) {
          originals[attribute] = currentValue;
          attributeOriginals.set(element, originals);
        }

        const translated = translateContent(originals[attribute], lang);
        if (currentValue !== translated) {
          element.setAttribute(attribute, translated);
        }
      });
    }

    currentElement = elementWalker.nextNode();
  }
}

export function DomTranslator() {
  const { lang } = useTheme();

  useEffect(() => {
    const normalizedLang = normalizeLanguage(lang);
    let frameId = 0;

    const run = () => {
      frameId = 0;
      applyTextTranslations(document.body, normalizedLang);
    };

    const schedule = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(run);
    };

    schedule();

    const observer = new MutationObserver(() => {
      schedule();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRIBUTES_TO_TRANSLATE],
    });

    return () => {
      observer.disconnect();
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [lang]);

  return null;
}
