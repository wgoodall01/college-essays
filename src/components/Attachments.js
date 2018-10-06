import React from 'react';
import PropTypes from 'prop-types';
import './Attachments.css';

const Attachments = ({files}) => {
  return (
    <div className="Attachments">
      {files.map(f => (
        <a
          className="Attachments_attachment"
          key={f.id}
          href={f.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="Attachments_thumb">
            <img src={f.thumbnails && f.thumbnails.small.url} alt="" />
          </span>
          <span className="Attachments_name">{f.filename}</span>
        </a>
      ))}
    </div>
  );
};

Attachments.propTypes = {
  files: PropTypes.array.isRequired // see airtable Attachment docs
};

export default Attachments;
