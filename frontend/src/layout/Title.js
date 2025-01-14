import Helmet from "react-helmet";
import React from 'react';

const Title = ({title}) => {
    const defaultTitle = "Reusable User Management System";
    return (
        <Helmet>
            <meta charSet="utf-8"/>
            <title>{title ? title : defaultTitle}</title>
        </Helmet>
    )
}

export default Title;