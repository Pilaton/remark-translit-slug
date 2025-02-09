import { type Options } from '@sindresorhus/slugify';
import { visit } from 'unist-util-visit';
type Node = Parameters<typeof visit>[0];
export default function remarkTranslitSlug(options?: Options): (tree: Node) => void;
export {};
//# sourceMappingURL=index.d.ts.map