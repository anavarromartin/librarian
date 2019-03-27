import React from 'react';
import './app-header.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft"

library.add(faChevronLeft)


const AppHeader = ({history, backButtonEnabled, onNavigateBack}) => {

    const backButtonElement = backButtonEnabled()
        ? <FontAwesomeIcon icon={faChevronLeft} onClick={() => onNavigateBack(history)}/>
        : null


    return (
        <div className="app-header">
            <div className={"app-header__back-button"}> {backButtonElement} </div>
            <div className={"app-header__title"}> DALLAS LIBRARY</div>
        </div>
    )
}

export default AppHeader