import React from 'react';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import ReactQuill from 'react-quill';

const CustomInlineReader = ({
  descriptionContent,
  textAlignment,
  isSubmitted,
  placeholderColor,
}) => (
  <ReactQuill
    readOnly
    theme="bubble"
    name="description"
    id="description"
    modules={{
      clipboard: {
        matchVisual: false,
      },
    }}
    // eslint-disable-next-line no-nested-ternary
    value={
      isJson(descriptionContent)
        ? isHtml(
            draftToHtml(
              convertToRaw(convertFromRaw(JSON.parse(descriptionContent)))
            )
          )
          ? EditorState.createWithContent(
              convertFromRaw(JSON.parse(descriptionContent))
            ).getCurrentContent()
          : ''
        : isHtml(descriptionContent)
        ? descriptionContent
            .replace(/<ins>/g, '<u>')
            .replace(/<\/ins>/g, '</u>')
        : descriptionContent || ''
    }
    style={{
      textAlign: textAlignment,
    }}
  />
);

CustomInlineReader.propTypes = {
  descriptionContent: PropTypes.instanceOf(Object),
  textAlignment: PropTypes.string,
  isSubmitted: PropTypes.bool,
  placeholderColor: PropTypes.string,
};

CustomInlineReader.defaultProps = {
  descriptionContent: {},
  textAlignment: 'left',
  isSubmitted: false,
  placeholderColor: '',
};

export default CustomInlineReader;
