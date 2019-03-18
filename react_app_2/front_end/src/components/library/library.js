import React from 'react';
import './library.scss'
import {routePrefix} from "../../globals"

const Library = ({history, setBackLocation}) => {
    setBackLocation(null)

    return (
        <div className={"library-container"}>
            <div className={"image-container"}>image goes here</div>
            <button
                onClick={() => history.push(`${routePrefix}/return`)}
                id={"return-button"}
                className={"teal-button"}
            >
                RETURN
            </button>
            <button
                id={"borrow-button"}
                className={"white-button"}
            >
                BORROW
            </button>
        </div>
    )
}

export default Library