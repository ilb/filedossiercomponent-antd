import React from 'react';
import { DossierComponent } from '../src';

export default function AppForm() {
  const dossierParams = {
    dossierKey: 'teststorekey',
    dossierPackage: 'testimg',
    dossierCode: 'TEST',
    dossierMode: 'mode1'
  };
  return (
    <DossierComponent
      height="calc(100vh - 10rem)"
      dossierParams={dossierParams}
      // basePath="/api/filedossier-web/web"
      basePath="https://avclick.ru/filedossier-web/web"
      mode="preview"
    />
  );
}
