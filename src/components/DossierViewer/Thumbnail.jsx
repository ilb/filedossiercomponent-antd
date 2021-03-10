import React from 'react';
import PropTypes from 'prop-types';

export default function Thumbnail({ file, images, sizes: { width, height } = {} }) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        src={images[0].src} // key={images[0].src}
        className={`ui fluid image file-dossier-img-rotate${file.rotate || 0}`}
        style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
        // alt="Не удалось отобразить preview файла"
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
