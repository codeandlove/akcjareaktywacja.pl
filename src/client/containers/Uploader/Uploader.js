import React from "react";
import { PropTypes } from "prop-types";
import Dropzone from 'react-dropzone';

import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
//import { Modal, Header, Button, Icon } from 'semantic-ui-react';

import "./Uploader.scss";

const filesPath = "uploadedFiles";

const Uploader = ({ uploadedFiles, firebase }) => {
    // Uploads files and push's objects containing metadata to database at dbPath
    const onFilesDrop = (files) => {
        // uploadFiles(storagePath, files, dbPath)
        console.log(firebase);
        return firebase.uploadFiles(filesPath, files, filesPath)
    };

    // Deletes file and removes metadata from database
    const onFileDelete = (file, key) => {
        // deleteFile(storagePath, dbPath)
        return firebase.deleteFile(file.fullPath, `${filesPath}/${key}`)
    };

    return (
        <div>
            <Dropzone onDrop={onFilesDrop}>
                <div>
                    Drag and drop files here
                    or click to select
                </div>
            </Dropzone>
            {
                uploadedFiles &&
                <div>
                    <h3>
                        Uploaded file(s):
                    </h3>
                    {
                        Object.keys(uploadedFiles).map((key,index) => {
                            const file = uploadedFiles[key];
                            console.log(file);

                            return (
                                <div key={file.name + index}>
                                    <span>{file.name}</span>
                                    <img src={file.downloadURL} alt="asd" />
                                    <button onClick={() => onFileDelete(file, index)}>
                                        Delete File
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
};


Uploader.propTypes = {
    firebase: PropTypes.object.isRequired,
    uploadedFiles: PropTypes.object
};

const enhance = compose(
    firebaseConnect([
        filesPath
    ]),
    connect(({firebase: { data, auth, profile }}) => ({
        uploadedFiles: data[filesPath],
        auth,
        profile
    }))
);

export default enhance(Uploader);