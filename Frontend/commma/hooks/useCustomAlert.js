// hooks/useCustomAlert.js
import { useState } from 'react';

export const useCustomAlert = () => {
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        buttons: [],
        type: 'default',
    });

    const showAlert = (config) => {
        setAlertConfig({
            ...config,
            visible: true,
        });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({
            ...prev,
            visible: false,
        }));
    };

    return {
        alertConfig,
        showAlert,
        hideAlert,
    };
};
