import React from 'react';
import './library.scss'
import {routePrefix} from "../../globals"
import { ReactComponent as Logo } from '../../assets/home_page_img.svg';

const Library = ({history, setBackLocation}) => {
    setBackLocation(null)

    return (
        <div className={"library-container"}>
            <Logo className={"image-container"}  alt={"logo"} />
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