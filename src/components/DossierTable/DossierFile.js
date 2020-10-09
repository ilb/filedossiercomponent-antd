import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import DossierActions from './DossierActions';

function DossierFile ({ dossierFile, actionsState, dossierActions, readOnly }) {
  return (
    <Table.Row key={dossierFile.code}>
      <Table.Cell>
        {dossierFile.exists && dossierFile.linksByRel && dossierFile.linksByRel.attachment
          ? <a href={dossierFile.linksByRel.attachment} target="_blank" rel='noreferrer noopener'>{dossierFile.name}</a>
          : dossierFile.name
        }
      </Table.Cell>
      <Table.Cell collapsing style={{ position: 'relative' }}>
        <DossierActions
          dossierFile={dossierFile}
          actionsState={actionsState}
          dossierActions={dossierActions}
          readOnly={readOnly}
        />
      </Table.Cell>
    </Table.Row>
  );
}

DossierFile.propTypes = {
  dossierFile: PropTypes.object.isRequired,
  actionsState: PropTypes.object.isRequired,
  dossierActions: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
};

export default DossierFile;
