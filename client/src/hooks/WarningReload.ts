import { useEffect } from 'react';


const useWarningReload = (hasUnsavedChanges: boolean): void => {
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();

                // Required for Chrome compatibility
                e.returnValue = '';
            }
        };

        if (hasUnsavedChanges) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);
};

export default useWarningReload;