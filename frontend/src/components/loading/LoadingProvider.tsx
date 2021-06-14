// @flow 
import React, { useEffect, useState } from 'react';
import LoadingContext from './LoadingContext';
import axios from 'axios';

const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        let isSubscribed = true;
        axios.interceptors.request.use((config) => {
            if (isSubscribed) {
                setLoading(true);
            };
            return config;
        });
        axios.interceptors.response.use(
            (response) => {
                if (isSubscribed) {
                    setLoading(false);
                };
                return response;
            },
            (error) => {
                if (isSubscribed) {
                    setLoading(false);
                };
                return Promise.reject(error);
            }
        );
        return () => {
            isSubscribed = false;
        }
    }, [])

    return (
        <LoadingContext.Provider value={loading}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;