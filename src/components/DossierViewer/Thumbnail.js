import React from 'react';
import PropTypes from 'prop-types';

export default function Thumbnail({ file, images, sizes: { width, height } = {} }) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        src={images[0].src}
        className={`file-dossier-img-rotate${file.rotate || 0}`}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxWidth: `${width}px`,
          maxHeight: `${height}px`
        }}
        // alt="Не удалось отобразить preview файла"
        alt=""
      />
    </div>
  );
}

Thumbnail.propTypes = {
  file: PropTypes.object.isRequired,
  images: PropTypes.array.isRequired,
  sizes: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired
};
