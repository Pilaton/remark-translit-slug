import { type Options as SlugifyOptions, slugifyWithCounter } from '@sindresorhus/slugify';
import type { Heading } from 'mdast';
import { toString as tStr } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

type PluginSpecificOptions = {
  /**
   * Preserve an existing `id` on a heading when present.
   * @default true
   */
  preserveExistingIds?: boolean;
};

export type RemarkTranslitSlugOptions = SlugifyOptions & PluginSpecificOptions;

type Node = Parameters<typeof visit>[0];

interface HeadingNode extends Heading {
  data?: {
    hProperties?: {
      id?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export default function remarkTranslitSlug(options: RemarkTranslitSlugOptions = {}) {
  const pluginOptions: RemarkTranslitSlugOptions = {
    separator: '-',
    lowercase: true,
    decamelize: false,
    ...options,
  } satisfies RemarkTranslitSlugOptions;

  const { preserveExistingIds = true, ...slugifyOptions } = pluginOptions;

  const slugifySettings: SlugifyOptions = slugifyOptions;

  return (tree: Node) => {
    const slugify = slugifyWithCounter();

    visit(tree, 'heading', (node) => {
      const heading = node as HeadingNode;

      if (heading.depth === 1) {
        return;
      }

      const text = tStr(heading).trim();
      if (!text) {
        return;
      }

      const data = heading.data ?? (heading.data = {});
      const hProperties = (data.hProperties ??= {});

      if (
        preserveExistingIds &&
        typeof hProperties.id === 'string' &&
        hProperties.id.trim().length > 0
      ) {
        return;
      }

      const transliteratedId = slugify(text, slugifySettings);

      hProperties.id = transliteratedId;
    });
  };
}
