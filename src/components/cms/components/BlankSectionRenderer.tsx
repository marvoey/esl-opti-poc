import React from 'react';
import {
  OptimizelyGridSection,
  getPreviewUtils,
  type ComponentContainerProps,
  type StructureContainerProps,
} from '@optimizely/cms-sdk/react/server';
import styles from './BlankSection.module.css';

type SectionNode = Parameters<typeof OptimizelyGridSection>[0]['nodes'][number];

type Props = {
  content?: {
    key?: string | null;
    nodes?: SectionNode[] | null;
    [key: string]: unknown;
  } | null;
};

function Row({ node, children }: StructureContainerProps) {
  const { pa } = getPreviewUtils(node);
  return (
    <div className={styles.row} {...pa(node)}>
      {children}
    </div>
  );
}

function Column({ node, children }: StructureContainerProps) {
  const { pa } = getPreviewUtils(node);
  return (
    <div className={styles.column} {...pa(node)}>
      {children}
    </div>
  );
}

// Without a wrapper the SDK spreads the preview attributes onto the component's
// props, where our renderers ignore them, so elements would not be selectable.
function Element({ node, children, displaySettings }: ComponentContainerProps) {
  const { pa } = getPreviewUtils(node);
  const childrenWithProps =
    React.isValidElement<{ displaySettings?: Record<string, string | boolean> }>(children) && displaySettings
      ? React.cloneElement(children, { displaySettings })
      : children;

  return (
    <div className={styles.element} {...pa(node)}>
      {childrenWithProps}
    </div>
  );
}

/** Renders the built-in Visual Builder `BlankSection`: rows of columns holding elements. */
export default function BlankSection({ content }: Props) {
  if (!content) return null;

  const { pa } = getPreviewUtils(content as Parameters<typeof getPreviewUtils>[0]);
  const nodes = content.nodes ?? [];
  const isEditMode = Boolean((content as { __context?: { edit?: boolean } }).__context?.edit);

  // An empty section is kept on pages as a workaround for a Visual Builder bug
  // (inline components can't be selected on a page with no section). Render
  // nothing for it on the live site.
  if (nodes.length === 0 && !isEditMode) return null;

  return (
    <section className={styles.section} {...pa(content as { key: string })}>
      <OptimizelyGridSection nodes={nodes} row={Row} column={Column} ComponentWrapper={Element} />
    </section>
  );
}
