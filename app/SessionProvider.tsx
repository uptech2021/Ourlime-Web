// app/SessionHandler.tsx
'use client';

import { useEffect } from 'react';
import { sessionMiddleware } from '@/storeMiddleware';

export function SessionHandler() {
    useEffect(() => {
        sessionMiddleware((set) => ({}))(
            () => {},
            () => {},
            {}
        );
    }, []);

    return null;
}
