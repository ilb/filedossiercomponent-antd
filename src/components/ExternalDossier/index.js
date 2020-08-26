import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Grid, List, Message, Dropdown, Label, Checkbox } from 'semantic-ui-react';
import FileContent from '../DossierViewer/FileContent';

export default function ExternalDossier ({ file, external, actionsState, dossierActions }) {
  const { value: externalFiles } = external;
  if (!externalFiles || !externalFiles.length) { return null; }
  const initialState = { selectedFile: externalFiles[0], selectedFiles: [], uploadMode: 'new' };
  const [state, _setState] = useState(initialState);
  const setState = (newState) => { _setState({ ...state, ...newState }); };
  const { selectedFile, selectedFiles, uploadMode } = state;
  const { loading, error } = actionsState;

  const closeModal = () => {
    const closeIcon = document.querySelector('#externalDossierModal > i.close.icon');
    closeIcon.click();
  };

  const importSelectedFiles = async () => {
    if (selectedFiles && selectedFiles.length) {
      const importResult = await dossierActions.importFile({
        dossierFile: file,
        urls: selectedFiles.map(sf => sf.linksByRel.attachment),
        update: uploadMode === 'merge',
      });
      if (!importResult.error/* && uploadMode !== 'merge' */) {
        closeModal();
      }
    }
  };

  const thumbnailSizes = {
    width: 120,
    height: 170,
  };

  const selectFile = (e, { checked }) => {
    e.stopPropagation();
    const sFile = externalFiles[e.currentTarget.dataset.index];
    const newSelectedFiles = checked ? [...selectedFiles, sFile] : selectedFiles.filter(f => f.path !== sFile.path);
    setState({ selectedFile: sFile, selectedFiles: newSelectedFiles });
  };

  const renderFileThumbnail = (externalFile, fileIndex) => {
    const selectedIndex = selectedFiles.findIndex(f => f.path === externalFile.path) + 1;

    return (
      <List.Item key={externalFile.path} style={{ display: 'inline-block' }}
        active={externalFile.path === selectedFile.path}
        onClick={() => { setState({ selectedFile: externalFile }); }}
      >
        <FileContent
          file={externalFile}
          mode="thumbnail"
          sizes={thumbnailSizes}
        />
        <Checkbox className="external-thumbnail-file-name" style={{ width: `${thumbnailSizes.width}px` }}
          data-index={fileIndex} onChange={selectFile} checked={!!selectedIndex} label={externalFile.name}
        />
        {!!selectedIndex && <Label color="blue" circular content={selectedIndex}/>}
      </List.Item>
    );
  };

  return (
    <div className="external-dossier">
      <Modal
        id="externalDossierModal"
        size="fullscreen"
        closeIcon
        closeOnDimmerClick={false}
        trigger={<Button basic content="Выбрать файл" id="fdChooseExternalFile"/>}
        onOpen={() => { setState(initialState); }}
        style={{ position: 'static' }}
      >
        <Modal.Header>
          Выбор файла: {file.name}
        </Modal.Header>
        <Modal.Content>
          <Grid style={{ height: 'calc(100vh - 200px)' }}>
            <Grid.Column style={{ width: '450px', height: '100%', overflow: 'auto' }}>
              <List selection className="external-dossier-files-list">
                {externalFiles.map(renderFileThumbnail)}
              </List>
            </Grid.Column>
            <Grid.Column style={{ width: 'calc(100% - 450px)', height: '100%' }}>
              {selectedFile &&
                <FileContent file={selectedFile}/>
              }
            </Grid.Column>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          {!!error && <Message error compact content={error} style={{ margin: 0, padding: '0.6rem 1rem' }}/>}
          <Button type="button" color="green" attached="left"
            content={`${uploadMode === 'merge' ? 'Догрузить' : 'Загрузить'} файлы: ${selectedFiles.length}`}
            onClick={importSelectedFiles}
            loading={loading}
            disabled={loading || !selectedFiles.length}
          />
          <Dropdown text=" "
            className="right attached button green icon file-dossier-upload-mode-selection"
            icon={`${uploadMode === 'merge' ? 'copy' : 'file'} outline`}
            onChange={(e, { value }) => { setState({ uploadMode: value }); }}
            value={uploadMode}
            options={[
              { key: 'new', text: 'Загрузить новый файл', value: 'new', icon: 'file outline' },
              { key: 'merge', text: 'Объединить файлы', value: 'merge', icon: 'copy outline' },
            ]}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
}

ExternalDossier.propTypes = {
  file: PropTypes.object.isRequired,
  external: PropTypes.object.isRequired,
  actionsState: PropTypes.object.isRequired,
  dossierActions: PropTypes.object.isRequired,
};
