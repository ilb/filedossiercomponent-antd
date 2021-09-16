import React, { useState, useEffect } from 'react';
import FileDossier from '../classes/FileDossier';

const Dossier = ({ basePath, dossierParams, onUpload, children, ...childrenProps }) => {
  const dossierClient = new FileDossier({ dossierParams, basePath });
  const [dossierData, setDossierData] = useState();
  const [actionsState, setActionsState] = useState({
    loading: false,
    error: null
  });
  const [selectedFile, selectFile] = useState();

  const reloadDossier = () => {
    return dossierClient.getDossier({ callback: setDossierData });
  };

  const actions = {
    selectFile: dossierClient.createAction({
      description: 'Выбрать файл',
      setState: setActionsState,
      action: selectFile
    }),
    uploadFile: dossierClient.createAction({
      description: 'Загрузка файла',
      setState: setActionsState,
      action: dossierClient.uploadFile,
      callback: async () => {
        const { dossier } = await reloadDossier();
        const updatedFile = dossier.dossierFile.find(({ code }) => code === selectedFile.code);
        selectFile(updatedFile);
        onUpload && onUpload(updatedFile);
      }
    }),
    importFile: dossierClient.createAction({
      description: 'Импорт файла',
      setState: setActionsState,
      action: dossierClient.importFile,
      callback: reloadDossier
    })
  };

  useEffect(() => {
    reloadDossier();
  }, [...Object.values(dossierParams)]);

  return (
    <>
      {React.cloneElement(children, {
        basePath,
        actions,
        actionsState,
        selectedFile,
        key: selectedFile,
        dossier: dossierData?.dossier,
        ...childrenProps
      })}
    </>
  );
};

export default Dossier;
