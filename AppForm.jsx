import React from 'react';
import { DossierComponent } from './src';

export default function AppForm() {
  const dossierParams = {
    dossierKey: 'teststorekey',
    dossierPackage: 'testmodel',
    dossierCode: 'TEST',
    dossierMode: 'mode1'
  };
  return (
    <DossierComponent
      dossierParams={dossierParams}
      // basePath="/api/filedossier-web/web"
      basePath="https://demo01.ilb.ru/filedossier-web/web"
      mode="preview"
    />
  );
}
