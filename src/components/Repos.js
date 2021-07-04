import React from 'react'

const Repos = ({name, star, user}) => {


    return (
        <>
            <div className="repo">
                <span>Repo Name: </span> {name}
            </div>
        </>
    )
}

export default Repos
