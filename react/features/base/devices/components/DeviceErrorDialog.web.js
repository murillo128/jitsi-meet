import React, { Component } from 'react';

import { MessageDialog } from '../../dialog';
import { translate } from '../../i18n';
import { JitsiTrackError, JitsiTrackErrors } from '../../lib-jitsi-meet';

/**
 * Implements a device error message dialog.
 */
class DeviceErrorDialog extends Component {
    /**
     * {@code DeviceErrorDialog} component's property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * This camera error to be displayed.
         */
        cameraError: React.PropTypes.object,

        /**
         * The microphone error to be displayed.
         */
        micError: React.PropTypes.object,

        /**
         * Invoked to obtain translated strings.
         */
        t: React.PropTypes.func
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;
        const micError = this.props.micError;
        const cameraError = this.props.cameraError;

        const dontShowAgain = {
            localStorageKey: 'doNotShowErrorAgain',
            textKey: 'dialog.doNotShowWarningAgain'
        };
        const isMicJitsiTrackErrorAndHasName = micError && micError.name
            && micError instanceof JitsiTrackError;
        const isCameraJitsiTrackErrorAndHasName
            = cameraError && cameraError.name
                && cameraError instanceof JitsiTrackError;
        let showDoNotShowWarning = false;

        if (micError && cameraError && isMicJitsiTrackErrorAndHasName
            && isCameraJitsiTrackErrorAndHasName) {
            showDoNotShowWarning = true;
        } else if (micError && isMicJitsiTrackErrorAndHasName
            && !cameraError) {
            showDoNotShowWarning = true;
        } else if (cameraError && isCameraJitsiTrackErrorAndHasName
            && !micError) {
            showDoNotShowWarning = true;
        }

        if (micError) {
            dontShowAgain.localStorageKey += `-mic-${micError.name}`;
        }

        if (cameraError) {
            dontShowAgain.localStorageKey += `-camera-${cameraError.name}`;
        }

        const cameraJitsiTrackErrorMsg
            = cameraError
                ? _getCameraErrorMessageKey(cameraError.name)
                : undefined;
        const micJitsiTrackErrorMsg
            = micError
                ? _getMicErrorMessageKey(micError.name)
                : undefined;

        const cameraErrorMsg
            = cameraError
                ? cameraJitsiTrackErrorMsg
                    || _getCameraErrorMessageKey(JitsiTrackErrors.GENERAL)
                : '';
        const micErrorMsg
            = micError
                ? micJitsiTrackErrorMsg
                    || _getMicErrorMessageKey(JitsiTrackErrors.GENERAL)
                : '';
        const additionalCameraErrorMsg
            = !cameraJitsiTrackErrorMsg
                && cameraError
                && cameraError.message
                    ? <div>${cameraError.message}</div>
                    : '';
        const additionalMicErrorMsg
            = !micJitsiTrackErrorMsg
                && micError
                && micError.message
                    ? <div>${micError.message}</div>
                    : '';

        let cameraMessage, micMessage;

        /* eslint-disable react/jsx-wrap-multilines */
        if (micError) {
            micMessage
                = <div>
                    <h3>{ t('dialog.micErrorPresent') }</h3>
                    <h4>{ t(micErrorMsg) }</h4>
                    {additionalMicErrorMsg}
                </div>;
        }

        if (cameraError) {
            cameraMessage
                = <div>
                    <h3>{ t('dialog.cameraErrorPresent') }</h3>
                    <h4>{ t(cameraErrorMsg) }</h4>
                    {additionalCameraErrorMsg}
                </div>;
        }
        /* eslint-enable react/jsx-wrap-multilines */

        let title = 'dialog.error';

        if (micError && micError.name === JitsiTrackErrors.PERMISSION_DENIED) {
            if (!cameraError
                || cameraError.name === JitsiTrackErrors.PERMISSION_DENIED) {
                title = 'dialog.permissionDenied';
            }
        } else if (cameraError
            && cameraError.name === JitsiTrackErrors.PERMISSION_DENIED) {
            title = 'dialog.permissionDenied';
        }

        const additionalProps = {};

        if (showDoNotShowWarning) {
            additionalProps.doNotShowWarningTextKey = dontShowAgain.textKey;
            additionalProps.doNotShowWarningLocalStorageKey
                = dontShowAgain.localStorageKey;
        }

        return (
            <MessageDialog
                cancelDisabled = { true }
                titleKey = { title }
                width = 'medium'
                { ...additionalProps }>
                {micMessage}
                {cameraMessage}
            </MessageDialog>
        );
    }
}

/**
 * Returns the i18n key for known camera errors.
 *
 * @param {string} name - The name of the error.
 * @returns {string|null} - Returns the appropriate i18n key.
 * @private
 */
function _getCameraErrorMessageKey(name) {
    switch (name) {
    case JitsiTrackErrors.UNSUPPORTED_RESOLUTION:
        return 'dialog.cameraUnsupportedResolutionError';
    case JitsiTrackErrors.GENERAL:
        return 'dialog.cameraUnknownError';
    case JitsiTrackErrors.PERMISSION_DENIED:
        return 'dialog.cameraPermissionDeniedError';
    case JitsiTrackErrors.NOT_FOUND:
        return 'dialog.cameraNotFoundError';
    case JitsiTrackErrors.CONSTRAINT_FAILED:
        return 'dialog.cameraConstraintFailedError';
    case JitsiTrackErrors.NO_DATA_FROM_SOURCE:
        return 'dialog.cameraNotSendingData';
    default:
        return null;
    }
}

/**
 * Returns the i18n key for known microphone errors.
 *
 * @param {string} name - The name of the error.
 * @returns {string|null} - Returns the appropriate i18n key.
 * @private
 */
function _getMicErrorMessageKey(name) {
    switch (name) {
    case JitsiTrackErrors.GENERAL:
        return 'dialog.micUnknownError';
    case JitsiTrackErrors.PERMISSION_DENIED:
        return 'dialog.micPermissionDeniedError';
    case JitsiTrackErrors.NOT_FOUND:
        return 'dialog.micNotFoundError';
    case JitsiTrackErrors.CONSTRAINT_FAILED:
        return 'dialog.micConstraintFailedError';
    case JitsiTrackErrors.NO_DATA_FROM_SOURCE:
        return 'dialog.micNotSendingData';
    default:
        return null;
    }
}

export default translate(DeviceErrorDialog);
