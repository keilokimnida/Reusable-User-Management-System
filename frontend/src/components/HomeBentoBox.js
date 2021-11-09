import React from 'react'

const HomeBentoBox = ({ content, variation }) => {
    return (
        <div className = {`c-Home-bento-box c-Home-bento-box--var-${variation}`}>
            <h1>{content ? content : "Hidden"}</h1>
        </div>
    )
}

export default HomeBentoBox;