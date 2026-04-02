import React, { JSX } from 'react';
import { ComponentProps } from 'lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';

type LayoutColumnProps = ComponentProps & {
  children?: React.ReactNode;
};

const ComponentContent = (props: LayoutColumnProps): JSX.Element => {
  return (
    <div className={props.params?.styles || ''} id={props.params?.RenderingIdentifier}>
      <div>{props.children}</div>
    </div>
  );
};

export const Layout2Column = (props: LayoutColumnProps): JSX.Element => {
  console.log('LayoutColumn props:', props);
  const phKey1 = `layoutColumn-1-${props.params.DynamicPlaceholderId}`;
  const phKey2 = `layoutColumn-2-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <div className="component-content p-sentence_layout2">
        <div className="c-collay">
          <div className="c-collay_item">
            <Placeholder key={phKey1} name={phKey1} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey2} name={phKey2} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </ComponentContent>
  );
};

export const Layout2Column4x8 = (props: LayoutColumnProps): JSX.Element => {
  const phKey1 = `layoutColumn-1-${props.params.DynamicPlaceholderId}`;
  const phKey2 = `layoutColumn-2-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <div className="component-content p-sentence_layout2--4x8">
        <div className="c-collay">
          <div className="c-collay_item">
            <Placeholder key={phKey1} name={phKey1} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey2} name={phKey2} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </ComponentContent>
  );
};

export const Layout2Column8x4 = (props: LayoutColumnProps): JSX.Element => {
  const phKey1 = `layoutColumn-1-${props.params.DynamicPlaceholderId}`;
  const phKey2 = `layoutColumn-2-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <div className="component-content p-sentence_layout2--8x4">
        <div className="c-collay">
          <div className="c-collay_item">
            <Placeholder key={phKey1} name={phKey1} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey2} name={phKey2} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </ComponentContent>
  );
};

export const Layout2ColumnSP2 = (props: LayoutColumnProps): JSX.Element => {
  const phKey1 = `layoutColumn-1-${props.params.DynamicPlaceholderId}`;
  const phKey2 = `layoutColumn-2-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <div className="component-content p-sentence_layout2 p-sentence_layout2-sp2">
        <div className="c-collay">
          <div className="c-collay_item">
            <Placeholder key={phKey1} name={phKey1} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey2} name={phKey2} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </ComponentContent>
  );
};

export const Layout3Column = (props: LayoutColumnProps): JSX.Element => {
  const phKey1 = `layoutColumn-1-${props.params.DynamicPlaceholderId}`;
  const phKey2 = `layoutColumn-2-${props.params.DynamicPlaceholderId}`;
  const phKey3 = `layoutColumn-3-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <div className="component-content p-sentence_layout3">
        <div className="c-collay">
          <div className="c-collay_item">
            <Placeholder key={phKey1} name={phKey1} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey2} name={phKey2} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey3} name={phKey3} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </ComponentContent>
  );
};

export const Layout4Column = (props: LayoutColumnProps): JSX.Element => {
  const phKey1 = `layoutColumn-1-${props.params.DynamicPlaceholderId}`;
  const phKey2 = `layoutColumn-2-${props.params.DynamicPlaceholderId}`;
  const phKey3 = `layoutColumn-3-${props.params.DynamicPlaceholderId}`;
  const phKey4 = `layoutColumn-4-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <div className="component-content p-sentence_layout4">
        <div className="c-collay">
          <div className="c-collay_item">
            <Placeholder key={phKey1} name={phKey1} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey2} name={phKey2} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey3} name={phKey3} rendering={props.rendering} />
          </div>
          <div className="c-collay_item">
            <Placeholder key={phKey4} name={phKey4} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </ComponentContent>
  );
};

export const Section2Column = (props: LayoutColumnProps): JSX.Element => {
  const phKey1 = `section2Column-1-${props.params.DynamicPlaceholderId}`;
  const phKey2 = `section2Column-2-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <div className="component-content">
        <div className="l-section l-section_2col">
          <div className="l-section-inner">
            <div className="l-section_side">
              <Placeholder key={phKey1} name={phKey1} rendering={props.rendering} />
            </div>
            <div className="l-section_main">
              <Placeholder key={phKey2} name={phKey2} rendering={props.rendering} />
            </div>
          </div>
        </div>
      </div>
    </ComponentContent>
  );
};

export const Section2ColumnReverse = (props: LayoutColumnProps): JSX.Element => {
  const phKey1 = `section2ColumnReverse-1-${props.params.DynamicPlaceholderId}`;
  const phKey2 = `section2ColumnReverse-2-${props.params.DynamicPlaceholderId}`;

  return (
    <ComponentContent {...props}>
      <div className="component-content p-sentence_component-wtp">
        <div className="p-layout-side">
          <div className="p-layout-side__main">
            <Placeholder key={phKey1} name={phKey1} rendering={props.rendering} />
          </div>
          <div className="p-layout-side__side">
            <Placeholder key={phKey2} name={phKey2} rendering={props.rendering} />
          </div>
        </div>
      </div>
    </ComponentContent>
  );
};
