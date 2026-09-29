import React from 'react';
import type { ContentProps } from '@optimizely/cms-sdk';
import {
  OptimizelyComposition,
  getPreviewUtils,
  type ComponentContainerProps,
} from '@optimizely/cms-sdk/react/server';
import { EslHomeExperienceContentType } from './EslHomePage';
import { VisualBuilderConstraintAlert } from '../shared/VisualBuilderConstraintAlert';
import { getAllowedSectionsFromContentType } from '../shared/visualBuilderConstraintUtils';

const {
  allowedKeys: ALLOWED_HOME_TYPE_KEYS,
  allowedSections: ESL_HOME_ALLOWED_SECTIONS,
} = getAllowedSectionsFromContentType(EslHomeExperienceContentType);

export { ESL_HOME_ALLOWED_SECTIONS };

function ExperienceComponentWrapper({ children, node, displaySettings }: ComponentContainerProps) {
  const { pa } = getPreviewUtils(node);
  const componentNode = node as Record<string, unknown>;
  const componentObj = componentNode.component as Record<string, unknown> | undefined;
  const rawTypename = typeof componentObj?.__typename === 'string' ? componentObj.__typename : undefined;
  const componentType =
    (rawTypename && rawTypename !== '_Component' ? rawTypename : undefined) ||
    (typeof componentNode.type === 'string' ? componentNode.type : '') ||
    rawTypename ||
    '';

  const previewAttrs = pa(node) as Record<string, unknown>;
  const isEditMode = Boolean(
    (node as { __context?: { edit?: boolean } }).__context?.edit ||
      previewAttrs?.['data-epi-block-id'] ||
      previewAttrs?.['data-epi-edit']
  );

  const isAllowed = ALLOWED_HOME_TYPE_KEYS.has(componentType);

  if (!isAllowed) {
    if (isEditMode) {
      return (
        <div
          {...pa(node)}
          data-component-type={componentType}
          style={{ width: '100%', display: 'block' }}
        >
          <VisualBuilderConstraintAlert
            componentType={componentType}
            componentDisplayName={node.displayName || undefined}
            pageDisplayName="ESL Home Experience"
            allowedTypes={ESL_HOME_ALLOWED_SECTIONS}
          />
        </div>
      );
    }
    return <></>;
  }

  const childrenWithProps =
    React.isValidElement<{ displaySettings?: Record<string, string | boolean> }>(children) && displaySettings
      ? React.cloneElement(children, { displaySettings })
      : children;

  return (
    <div
      {...pa(node)}
      data-component-type={componentType}
      style={{ width: '100%', display: 'block' }}
    >
      {childrenWithProps}
    </div>
  );
}

type ExperienceCompositionData = {
  nodes?: Parameters<typeof OptimizelyComposition>[0]['nodes'] | null;
  [key: string]: unknown;
};

type Props = {
  content?:
    | ContentProps<typeof EslHomeExperienceContentType>
    | {
        composition?: ExperienceCompositionData | null;
        [key: string]: unknown;
      }
    | null;
};

export default function EslHomeExperience({ content }: Props) {
  const nodes = content?.composition?.nodes;

  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <OptimizelyComposition nodes={nodes} ComponentWrapper={ExperienceComponentWrapper} />
  );
}

export { EslHomeExperience as EslHomePage };
