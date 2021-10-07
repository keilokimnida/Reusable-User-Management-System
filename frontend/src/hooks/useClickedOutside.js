// https://stackoverflow.com/a/42234988

import { useEffect } from 'react';

const useClickedOutside = (ref, callback, exceptions = []) => {
    useEffect(() => {
        const clickedOutside = (r, e) => r.current && !r.current.contains(e.target);

        const handleClick = (event) => {
            // here i want click inside, thus the bang
            const exemptedClick = exceptions.some(ref => !clickedOutside(ref, event));
            if (exemptedClick) return callback(false);

            clickedOutside(ref, event) ? callback(true) : callback(false);
        }

        window.addEventListener("mousedown", handleClick);
        return () => window.removeEventListener("mousedown", handleClick);
    });
}

export default useClickedOutside;
