import React from 'react';
import PropTypes from 'prop-types';

import { DownloadOutlined } from '@ant-design/icons';
import { Space } from 'antd';

function DossierInfo({ file }) {
  return (
    <Space direction="vertical" style={{ maxWidth: '360px' }}>
      <span style={{ wordBreak: 'break-all' }}>
        <b>Имя файла:</b> {file.name}
      </span>

      {file.lastModified && (
        <span>
          <b>Загружен:</b> {file.lastModified}
        </span>
      )}

      {file.linksByRel && file.linksByRel.attachment && (
        <Space size="small">
          <DownloadOutlined />
          <a href={file.linksByRelExt.attachment} target="_blank" rel="noreferrer">
            <b>Скачать</b>
          </a>
        </Space>
      )}
    </Space>
  );
}

DossierInfo.propTypes = {
  file: PropTypes.object.isRequired
};

export default DossierInfo;
