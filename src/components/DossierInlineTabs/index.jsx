import React, { useEffect, useState } from 'react';
import { Grid, Header, Icon, Label, Menu, Segment, Transition } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import FileContent from '../DossierViewer/FileContent';
import { useDropzone } from 'react-dropzone';
// todo component
export default function DossierInlineTabs({
                                      basePath,
                                      dossierFiles,
                                      actionsState,
                                      dossierActions,
                                      onUploadHandler
                                    }) {
  const [selectedFile, selectFile] = useState();
  const [filesUploaded, setFilesUploaded] = useState(false);

  useEffect(async () => {
    if (!dossierFiles.find(({ code }) => code === selectedFile?.code)) {
      selectFile(dossierFiles[0]);
    } else {
      selectFile(dossierFiles.find(({ code }) => code === selectedFile.code)); // force reload current dossier file to reload preview
    }
  }, [dossierFiles]);

  const onTabChange = (e, { name }) => {
    setFilesUploaded(false);
    selectFile(dossierFiles.find(({ code }) => code === name));
  };

  const updateDropzone = useDropzone({
    accept: selectedFile?.allowedMediaTypes,
    onDrop: async (acceptedFiles) => {
      await dossierActions.uploadFile({
        dossierFile: selectedFile,
        files: acceptedFiles,
        update: true
      });
      setFilesUploaded(true);

      setTimeout(() => {
        setFilesUploaded(false);
      }, 3000);

      onUploadHandler && onUploadHandler(selectedFile);
    }
  });

  const replaceDropzone = useDropzone({
    accept: selectedFile?.allowedMediaTypes,
    onDrop: async (acceptedFiles) => {
      await dossierActions.uploadFile({
        dossierFile: selectedFile,
        files: acceptedFiles
      });
      setFilesUploaded(true);

      setTimeout(() => {
        setFilesUploaded(false);
      }, 3000);

      onUploadHandler && onUploadHandler(selectedFile);
    }
  });

  return (
    <React.Fragment>
      <Grid>
        <Grid.Column class="dossier">
          <div style={{ marginBottom: 16 }}>
            <Header>Досье</Header>
          </div>
          {dossierFiles.length > 0 && (
           <>
             <Menu fluid widths={dossierFiles.length}>
               {dossierFiles.map((df) => {
                 return (
                   <Menu.Item
                     key={df.code}
                     name={df.code}
                     active={df.code === selectedFile?.code}
                     onClick={onTabChange}>
                     <div>
                       {df.name}
                       <Transition

                         visible={df.code === selectedFile?.code && df.exists && filesUploaded}
                         animation="scale"
                         duration={500}>
                         <Label style={{top: -30}} attached="top right">
                           <Icon name="check circle" color="green" loading={actionsState.loading} />
                           Файл загружен
                         </Label>
                       </Transition>
                     </div>
                   </Menu.Item>
                 );
               })}
             </Menu>
             {selectedFile && !selectedFile.readonly && (
               <Segment.Group
                 horizontal
                 style={{
                   border: '1px',
                   borderStyle: 'dashed',
                   cursor: 'pointer'
                 }}>
                 <Segment
                   textAlign="center"
                   style={{
                     minHeight: 0
                   }}>
                   <div {...updateDropzone.getRootProps({ className: 'updateDropzone' })}>
                     <div style={{ opacity: 0.9, marginBottom: 8 }}>Добавить файл</div>
                     <div style={{ opacity: 0.5 }}>Нажмите или перетащите</div>
                     <input {...updateDropzone.getInputProps()} />
                   </div>
                 </Segment>
                 <Segment
                   textAlign="center"
                   style={{ minHeight: 0 }}>
                   <div {...replaceDropzone.getRootProps({ className: 'replaceDropzone' })}>
                     <div style={{ opacity: 0.9, marginBottom: 8 }}>Заменить файл</div>
                     <div style={{ opacity: 0.5 }}>Нажмите или перетащите</div>{' '}
                     <input {...replaceDropzone.getInputProps()} />
                   </div>
                 </Segment>
               </Segment.Group>
             )}
           </>
          )}

          <Segment
            piled
            style={{
              height: '100vh',
              width: 'auto',
              marginTop: 16,
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
            {selectedFile?.exists && <FileContent basePath={basePath} file={selectedFile} />}
          </Segment>
        </Grid.Column>
      </Grid>
    </React.Fragment>
  );
}

DossierInlineTabs.propTypes = {
  dossierFiles: PropTypes.array.isRequired,
  external: PropTypes.object,
  actionsState: PropTypes.object.isRequired,
  dossierActions: PropTypes.object.isRequired,
  readOnly: PropTypes.bool
};
