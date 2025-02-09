import { type Options, slugifyWithCounter } from '@sindresorhus/slugify';
import type { Heading } from 'mdast';
import { toString as tStr } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

type Node = Parameters<typeof visit>[0];
interface HeadingNode extends Heading {
  data?: {
    hProperties?: {
      id: string;
    };
  };
}

export default function remarkTranslitSlug(options: Options = {}) {
  const settings = {
    separator: '-',
    lowercase: true,
    decamelize: false,
    ...options,
  } satisfies Options;

  return (tree: Node) => {
    const slugify = slugifyWithCounter();

    visit(tree, 'heading', (node: HeadingNode) => {
      if (node.depth === 1) {
        return;
      }

      const text = tStr(node);
      if (!text) {
        return;
      }

      const transliteratedId = slugify(text, settings);

      node.data = node.data || {};
      node.data.hProperties = {
        ...node.data.hProperties,
        id: transliteratedId,
      };
    });
  };
}
