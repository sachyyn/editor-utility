import React, { useEffect, useMemo, useState } from 'react';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import createInlineToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/inline-toolbar';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  UnorderedListButton,
  OrderedListButton,
} from '@draft-js-plugins/buttons';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import createLinkPlugin from '@draft-js-plugins/anchor';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import 'draft-js/dist/Draft.css';

const CustomInlineToolbarEditor = ({
  placeholder,
  descriptionContent,
  setDescriptionContent,
  isPreview,
  textAlignment,
  className,
  isSource,
}) => {
  const inlineToolbarPlugin = createInlineToolbarPlugin();
  const linkPlugin = createLinkPlugin();
  const [plugins, InlineToolbar] = useMemo(
    () => [
      [inlineToolbarPlugin, linkPlugin],
      inlineToolbarPlugin.InlineToolbar,
    ],
    []
  );
  let contentState;
  const isJson = (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };
  if (descriptionContent) {
    if (isJson(descriptionContent)) {
      contentState = EditorState.createWithContent(
        convertFromRaw(JSON.parse(descriptionContent))
      );
    } else {
      contentState = createEditorStateWithText(descriptionContent);
    }
  } else {
    contentState = createEditorStateWithText('');
  }
  const [editorState, setEditorState] = useState(contentState);
  const [previewState, setPreviewState] = useState(contentState);
  useEffect(() => {
    if (isPreview && descriptionContent) {
      let previewContent;
      if (!isJson(descriptionContent)) {
        previewContent = createEditorStateWithText(descriptionContent);
      } else {
        previewContent = EditorState.createWithContent(
          convertFromRaw(JSON.parse(descriptionContent))
        );
      }
      setPreviewState(previewContent);
    } else if (!descriptionContent) {
      setEditorState(contentState);
    }
  }, [descriptionContent]);
  const onEditorStateChange = (state) => {
    setEditorState(state);
    const contentRaw = JSON.stringify(convertToRaw(state.getCurrentContent()));
    setDescriptionContent(contentRaw);
  };
  return (
    <div>
      {!isPreview ? (
        <div className={className || 'editor-description-content-field'}>
          <Editor
            className="description-content-editor"
            editorKey="CustomInlineToolbarEditor"
            placeholder={placeholder}
            editorState={editorState}
            onChange={onEditorStateChange}
            plugins={plugins}
            textAlignment={textAlignment}
          />
          <InlineToolbar>
            {(externalProps) => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                {!isSource && (
                  <>
                    <UnderlineButton {...externalProps} />
                    <Separator {...externalProps} />
                    <UnorderedListButton {...externalProps} />
                    <OrderedListButton {...externalProps} />
                  </>
                )}
                <linkPlugin.LinkButton {...externalProps} />
              </div>
            )}
          </InlineToolbar>
        </div>
      ) : (
        <Editor
          editorState={previewState}
          plugins={plugins}
          readOnly
          textAlignment={textAlignment}
        />
      )}
    </div>
  );
};

CustomInlineToolbarEditor.propTypes = {
  placeholder: PropTypes.string,
  descriptionContent: PropTypes.instanceOf(Object),
  setDescriptionContent: PropTypes.func,
  isPreview: PropTypes.bool,
  isSource: PropTypes.bool,
  textAlignment: PropTypes.string,
  className: PropTypes.string,
};

CustomInlineToolbarEditor.defaultProps = {
  placeholder: 'Optional: Add a line/description',
  descriptionContent: {},
  setDescriptionContent: noop,
  isPreview: false,
  isSource: false,
  textAlignment: 'left',
  className: '',
};

export default CustomInlineToolbarEditor;
