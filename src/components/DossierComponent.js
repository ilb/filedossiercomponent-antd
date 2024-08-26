import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Alert, Card, Typography } from 'antd';

import FileDossier from '../classes/FileDossier';
import DossierViewer from './DossierViewer';

/* Раскомментировать после перевода компонентов на Antd */
// import DossierTable from './DossierTable';
// import DossierDropzone from './DossierDropzone';
// import DossierTabs from './DossierTabs';
// import DossierInlineTabs from './DossierInlineTabs';

export default function DossierComponent(props) {
  const {
    dossierParams,
    preloadedDossierData,
    basePath,
    dossierDataChangeHandler,
    onUploadHandler
  } = props;

  var [dossierData, _setDossierData] = useState({
    loading: false,
    error: null,
    dossier: null,
    external: null,
    ...preloadedDossierData
  });

  // wrap hook action to trigger outer callback when dossier changed/loaded
  const setDossierData = (newState) => {
    const newDossierData = { ...dossierData, ...newState };
    _setDossierData(newDossierData);

    if (dossierDataChangeHandler) {
      dossierDataChangeHandler(newDossierData);
    }
  };

  const dossierInst = new FileDossier({ dossierParams, basePath });

  /* Dossier actions */
  var [actionsState, setActionsState] = useState({ loading: false, error: null });
  const loadDossier = () => {
    dossierInst.getDossier({ callback: setDossierData });
  };
  const dossierActions = {
    loadDossier,
    uploadFile: dossierInst.createAction({
      description: 'Загрузка файла',
      setState: setActionsState,
      action: dossierInst.uploadFile,
      callback: loadDossier
    }),
    importFile: dossierInst.createAction({
      description: 'Импорт файла',
      setState: setActionsState,
      action: dossierInst.importFile,
      callback: loadDossier
    })
  };

  // load dossier if it's not passed (or when props changed)
  useEffect(() => {
    if (!preloadedDossierData) {
      loadDossier();
    }
  }, [...Object.values(dossierParams)]);

  const { header, mode, filesFilter, sort, readOnly, height = '100%' } = props;
  const { dossier, error, loading, external } = dossierData;

  let FilesComponent = DossierViewer;

  /* Раскомментировать после перевода компонентов на Antd */
  // let FilesComponent;
  // switch (mode) {
  //   case 'preview':
  //     FilesComponent = DossierViewer;
  //     break;
  //   case 'table':
  //     FilesComponent = DossierTable;
  //     break;
  //   case 'dropzone':
  //     FilesComponent = DossierDropzone;
  //     break;
  //   case 'tabs':
  //     FilesComponent = DossierTabs;
  //     break;
  //   case 'inline_tabs':
  //     FilesComponent = DossierInlineTabs;
  //     break;
  //   default:
  //     FilesComponent = DossierTable; // default as table
  // }

  // filter dossie files that will be showed
  let dossierFiles = (dossier && dossier.dossierFile) || [];

  if (sort) {
    if (typeof sort === 'function') {
      dossierFiles = dossierFiles.sort(sort);
    } else {
      throw new Error('Invalid {sort} type');
    }
  }

  if (filesFilter) {
    if (typeof filesFilter === 'function') {
      dossierFiles = dossierFiles.filter(filesFilter);
    } else if (typeof filesFilter === 'string') {
      dossierFiles = dossierFiles.filter((file) => file.code === filesFilter);
    } else if (Array.isArray(filesFilter)) {
      // Array of file codes
      dossierFiles = dossierFiles.filter((file) => filesFilter.indexOf(file.code) !== -1);
    } else {
      throw new Error('Invalid {filesFilter} type');
    }
  } else {
    dossierFiles = dossierFiles.filter((file) => !file.hidden); // default don't show hidden files
  }

  return (
    <Card loading={loading} className="file-dossier" style={{ padding: 0, margin: 0 }}>
      <div
        style={{
          color: 'rgba(0,0,0,0.87)',
          height,
          width: '100%',
          display: 'flex',
          flexFlow: 'column'
        }}>
        {header && !!dossier && (
          <Typography.Title level={2}>{header === true ? dossier.name : header}</Typography.Title>
        )}

        {!(dossierParams && dossierParams.dossierKey) && (
          <Alert message="В компонент не переданы данные по досье" type="error" showIcon />
        )}

        {!!error && (
          <Alert message="Ошибка при загрузке досье" description={error} type="error" showIcon />
        )}

        {!!(external && external.error) && (
          <Alert
            message="Ошибка при загрузке внешнего досье"
            description={external.error}
            type="error"
            showIcon
          />
        )}

        {!!actionsState.error && (
          <Alert
            message={`Ошибка при выполнении действия с досье${
              actionsState.description ? `: ${actionsState.description}` : ''
            }`}
            description={actionsState.error}
            type="error"
            showIcon
          />
        )}

        {dossier && !dossierFiles.length && (
          <Alert message="Отсутствуют файлы в досье" type="error" showIcon />
        )}

        {dossier && dossierFiles.length > 0 && (
          <FilesComponent
            basePath={basePath}
            dossierFiles={dossierFiles}
            external={external}
            actionsState={actionsState}
            dossierActions={dossierActions}
            readOnly={readOnly}
            onUploadHandler={onUploadHandler}
          />
        )}
      </div>
    </Card>
  );
}

DossierComponent.propTypes = {
  dossierParams: PropTypes.object.isRequired,
  preloadedDossierData: PropTypes.object,
  basePath: PropTypes.string,
  dossierDataChangeHandler: PropTypes.func,
  header: PropTypes.any, // bool, string, jsx, component
  filesFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.func]),
  mode: PropTypes.string,
  height: PropTypes.string,
  readOnly: PropTypes.bool
};
