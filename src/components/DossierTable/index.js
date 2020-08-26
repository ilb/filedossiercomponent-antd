import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import DossierFile from './DossierFile';

export default function DossierTable ({ dossierFiles, actionsState, dossierActions, readOnly }) {
  return (
    <Table compact celled striped unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Файл</Table.HeaderCell>
          <Table.HeaderCell>Управление</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {dossierFiles.map(dossierFile => (
          <DossierFile
            key={dossierFile.code}
            dossierFile={dossierFile}
            actionsState={actionsState}
            dossierActions={dossierActions}
            readOnly={readOnly}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

DossierTable.propTypes = {
  dossierFiles: PropTypes.array.isRequired,
  actionsState: PropTypes.object.isRequired,
  dossierActions: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
};
