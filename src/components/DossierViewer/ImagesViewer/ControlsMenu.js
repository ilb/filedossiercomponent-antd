import React from 'react';
import PropTypes from 'prop-types';
import DossierInfo from './DossierInfo';

import {
  LeftOutlined,
  RightOutlined,
  MinusOutlined,
  PlusOutlined,
  CaretDownOutlined,
  UndoOutlined,
  RedoOutlined,
  MenuOutlined
} from '@ant-design/icons';

import { Dropdown, Space, Input, Button } from 'antd';

const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;

export const getZoomInScale = (scaleNum) => {
  let newScale = (scaleNum * DEFAULT_SCALE_DELTA).toFixed(2);
  newScale = Math.ceil(newScale * 10) / 10;
  newScale = Math.min(MAX_SCALE, newScale);

  return newScale;
};

export const getZoomOutScale = (scaleNum) => {
  let newScale = (scaleNum / DEFAULT_SCALE_DELTA).toFixed(2);
  newScale = Math.floor(newScale * 10) / 10;
  newScale = Math.max(MIN_SCALE, newScale);

  return newScale;
};

export const calcScaleNum = ({
  scale,
  currentScaleNum,
  rotate,
  containerSizes,
  elementSizes,
  numPages
}) => {
  let scaleNum = scale;

  if (scale === 'pageActualOption') {
    scaleNum = 1.0;
  } else if (!scale || scale === 'pageWidthOption' || scale === 'pageFitOption') {
    // calc by container size
    let { width: elemWidth, height: elemHeight } = elementSizes;
    scaleNum = containerSizes.width / elemWidth; // scale by width
    // TODO there we assume that if more than 1 pages - it will not fit in container and there will be vertical scroll
    if (scaleNum * elemHeight > containerSizes.height || numPages > 1) {
      // element doesn't fit by height (or more than 1 pages)
      if (scale === 'pageFitOption') {
        scaleNum = containerSizes.height / elemHeight; // scale by height
      } else {
        scaleNum = (containerSizes.width - 15) / elemWidth; // vertical scroll size
      }
    }
  } else if (scale === 'pageRotateOption') {
    // calc by container size
    let { width: elemWidth, height: elemHeight } = elementSizes;
    let { width: containerWidth, height: containerHeight } = containerSizes;
    if (rotate % 180 === 0) {
      [elemWidth, elemHeight] = [elemHeight, elemWidth]; // swap
    }
    scaleNum = currentScaleNum; // scale by width
  }

  if (!Number(scaleNum)) {
    throw new Error(`Invalid scale value = ${scaleNum}`);
  }

  return scaleNum;
};

function ControlsMenu({
  file,
  numPages,
  currentPage,
  setPage,
  pageText,
  setPageText,
  scaleValue,
  scaleNum,
  setScale,
  rotateFile,
  rotateLoading
}) {
  const items = [
    { key: 'pageActualOption', label: <b>Реальный размер</b>, onClick: ({ key }) => setScale(key) },
    {
      key: 'pageWidthOption',
      label: <b>По ширине страницы</b>,
      onClick: ({ key }) => setScale(key)
    },
    {
      key: 'pageFitOption',
      label: <b>По размеру страницы</b>,
      onClick: ({ key }) => setScale(key)
    },
    { key: '0.5', label: <b>50%</b>, onClick: ({ key }) => setScale(key) },
    { key: '0.75', label: <b>75%</b>, onClick: ({ key }) => setScale(key) },
    { key: '1', label: <b>100%</b>, onClick: ({ key }) => setScale(key) },
    { key: '1.25', label: <b>125%</b>, onClick: ({ key }) => setScale(key) },
    { key: '1.5', label: <b>150%</b>, onClick: ({ key }) => setScale(key) },
    { key: '2', label: <b>200%</b>, onClick: ({ key }) => setScale(key) },
    { key: '3', label: <b>300%</b>, onClick: ({ key }) => setScale(key) },
    { key: '4', label: <b>400%</b>, onClick: ({ key }) => setScale(key) }
  ];

  return (
    <>
      <div className="file-dossier-file-name" title={file.name}>
        <b>{file.name}</b>
      </div>

      <nav
        className="file-dossier-file-controls"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '5px 20px',
          backgroundColor: '#69c0ff'
        }}>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}>
          {numPages && numPages > 1 && currentPage && (
            <Space style={{ padding: '5px 0' }}>
              <Button
                type="primary"
                icon={<LeftOutlined />}
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage <= 1}
              />

              <Button
                type="primary"
                icon={<RightOutlined />}
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage >= numPages}
              />

              <Input
                name="pageText"
                value={pageText || ''}
                style={{ width: '3rem' }}
                onChange={({ target: { value } }) => {
                  setPageText((value || '').replace(/\D/g, ''));
                }}
                onFocus={(e) => {
                  e.currentTarget.select();
                }}
                onBlur={() => {
                  if (pageText != currentPage) {
                    setPageText(currentPage);
                  }
                }} // eslint-disable-line eqeqeq
                onKeyDown={(e) => {
                  if (e.keyCode === 13 && pageText && Number(pageText)) {
                    setPage(pageText);
                  }
                }}
              />
              <b className="file-dossier-page-count-label">&nbsp;из {numPages}</b>
            </Space>
          )}

          {scaleNum && (
            <Space style={{ padding: '5px 0' }}>
              <Button
                type="primary"
                icon={<MinusOutlined />}
                onClick={() => {
                  setScale(getZoomOutScale(scaleNum));
                }}
                disabled={scaleNum <= MIN_SCALE}
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setScale(getZoomInScale(scaleNum));
                }}
                disabled={scaleNum >= MAX_SCALE}
              />

              <b>{scaleNum ? `${Math.round(scaleNum * 100)}%` : ''}</b>

              <Dropdown
                className="file-dossier-scale-selection"
                menu={{ items, selectable: true }}
                value={scaleValue || 'pageWidthOption'}
                trigger={['click']}>
                <CaretDownOutlined />
              </Dropdown>
            </Space>
          )}

          <Space>
            {scaleNum && (
              <Button
                type="primary"
                icon={<UndoOutlined />}
                onClick={() => rotateFile(-90, currentPage)}
                disabled={!!rotateLoading}
              />
            )}
            {scaleNum && (
              <Button
                type="primary"
                icon={<RedoOutlined />}
                onClick={() => rotateFile(90, currentPage)}
                disabled={!!rotateLoading}
              />
            )}

            <Dropdown
              className="file-dossier-dossier-info"
              menu={{ items: [{ key: '1', label: <DossierInfo file={file} /> }] }}
              placement="bottomRight"
              trigger={['click']}>
              <MenuOutlined />
            </Dropdown>
          </Space>
        </div>
      </nav>
    </>
  );
}

ControlsMenu.propTypes = {
  file: PropTypes.object.isRequired,

  numPages: PropTypes.number,
  currentPage: PropTypes.number,

  pageText: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setPage: PropTypes.func,
  setPageText: PropTypes.func,

  scaleValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scaleNum: PropTypes.number,
  setScale: PropTypes.func.isRequired,

  rotateFile: PropTypes.func.isRequired,
  rotateLoading: PropTypes.string
};

export default ControlsMenu;
