import { type Options as SlugifyOptions } from '@sindresorhus/slugify';
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
export default function remarkTranslitSlug(options?: RemarkTranslitSlugOptions): (tree: Node) => void;
export {};
//# sourceMappingURL=index.d.ts.map