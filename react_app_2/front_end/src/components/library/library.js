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
                onClick={() => history.push(`/return`)}
                id={"return-button"}
                className={"white-button"}
            >
                RETURN
            </button>
            <button
                onClick={() => history.push(`/borrow`)}
                id={"borrow-button"}
                className={"teal-button"}
            >
                BORROW
            </button>
        </div>
    )
}

export default Library