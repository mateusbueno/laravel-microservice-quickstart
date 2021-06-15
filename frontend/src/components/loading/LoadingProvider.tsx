// @flow 
import React, { useEffect, useMemo, useState } from 'react';
import LoadingContext from './LoadingContext';
import { addGlobalRequestInterceptor, addGlobalResponseInterceptor, removeGlobalRequestInterceptor, removeGlobalResponseInterceptor } from '../../util/http';

const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [countRequest, setCountRequest] = useState(0);

    useMemo(() => {
        console.log(countRequest)
        let isSubscribed = true;
        const requestIds = addGlobalRequestInterceptor((config) => {
            if (isSubscribed) {
                setLoading(true);
                setCountRequest((prevCountRequest) => prevCountRequest + 1);
            };
            return config;
        });
        //axios.interceptors.request.use();
        const responseIds = addGlobalResponseInterceptor(
            (response) => {
                if (isSubscribed) {
                    decrementCountRequest();
                };
                return response;
            },
            (error) => {
                if (isSubscribed) {
                    decrementCountRequest();
                };
                return Promise.reject(error);
            }
        );
        //axios.interceptors.response.use();
        return () => {
            isSubscribed = false;
            removeGlobalRequestInterceptor(requestIds);
            removeGlobalResponseInterceptor(responseIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [true]);

    useEffect(() => {
        if (!countRequest) {
            setLoading(false);
        }
    }, [countRequest])

    function decrementCountRequest() {
        setCountRequest((prevCountRequest) => prevCountRequest - 1);
    };


    return (
        <LoadingContext.Provider value={loading}>
            {children}
        </LoadingContext.Provider>
    );
};

export default LoadingProvider;