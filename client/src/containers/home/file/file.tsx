import React from 'react';
import style from './file.module.scss';
import { File } from '../../../store/files/files.state';
import { Card, Grow, IconButton, LinearProgress, SvgIcon } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import LoopIcon from '@material-ui/icons/Loop';
import ErrorIcon from '@material-ui/icons/Error';
import AbortedIcon from '@material-ui/icons/Cancel';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CopyToClipboard from 'react-copy-to-clipboard'
import { apiRoutes } from '../../../resources';

export interface Props {
    file: File;
    onAbortUpload(): void;
    onDownload(): void;
}

export const FileComponent = (props: Props) => {
    return (
        <Grow in={true}>
            <Card className={style.rootLayout}>
                <div className={style.titleRow}>
                    {renderStatusIcon()}
                    <div className={style.textWrapper}>
                        {renderFileName()}
                        {hasUploadFailed() && renderErrorMessage()}
                    </div>
                    {isUploadSuccessful() && /*renderDownloadButton() && */ copyOnClickButton()}
                    {isUploadInProgress() && renderAbortButton()}
                </div>
                {isUploadInProgress() && renderProgressBar()}
            </Card>
        </Grow>
    );

    function renderStatusIcon(): JSX.Element {
        switch (props.file.status) {
            case 'done':
                return <CheckIcon data-test-done-icon className={`${style.statusIcon} ${style.done}`}/>;
            case 'aborted':
                return <AbortedIcon data-test-aborted-icon className={`${style.statusIcon} ${style.failed}`}/>;
            case 'failed':
                return <ErrorIcon data-test-failed-icon className={`${style.statusIcon} ${style.failed}`}/>;
            case 'uploading':
                return <LoopIcon data-test-uploading-icon className={`${style.statusIcon} ${style.uploading}`}/>;
        }
    }

    function renderFileName(): JSX.Element {
        return <div className={style.title}>{props.file.name}</div>;
    }

    function renderErrorMessage(): JSX.Element {
        return <div className={style.errorMessage}>{props.file.error}</div>;
    }

    /*function renderDownloadButton(): JSX.Element {
        return <IconButton data-test-download-button aria-label='Download' onClick={props.onDownload}>
            <CloudDownloadIcon data-test-download-icon/>
        </IconButton>;
    }*/

    function copyOnClickButton(): JSX.Element {
        return <CopyToClipboard text={window.location.href.slice(0, -1) + apiRoutes.download(props.file.name)}
            onCopy={() => alert(`Copied: ${window.location.href.slice(0, -1) + apiRoutes.download(props.file.name)}`)}>
            <IconButton aria-label="copy">
                <SvgIcon>
                    <path d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531" />
                </SvgIcon>
            </IconButton>
        </CopyToClipboard>
    }

    function renderAbortButton(): JSX.Element {
        return <IconButton data-test-abort-button aria-label='Clear' onClick={props.onAbortUpload}>
            <ClearIcon/>
        </IconButton>;
    }

    function renderProgressBar(): JSX.Element {
        return (
            <LinearProgress data-test-progress variant='determinate' value={props.file.progress}/>
        );
    }

    function hasUploadFailed(): boolean {
        return props.file.status === 'failed';
    }

    function isUploadInProgress(): boolean {
        return props.file.status === 'uploading';
    }

    function isUploadSuccessful(): boolean {
        return props.file.status === 'done';
    }
};
