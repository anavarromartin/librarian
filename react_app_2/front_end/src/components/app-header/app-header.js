import React from 'react';
import './app-header.scss'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft"

library.add(faChevronLeft)


const AppHeader = ({history, backButtonEnabled, onNavigateBack, headerConfig = {}}) => {

    const backButtonElement = backButtonEnabled()
        ? <FontAwesomeIcon icon={faChevronLeft} onClick={() => onNavigateBack(history)}/>
        : null


    return (
        <div className="app-header">
            <div className={"app-header__back-button"}> {backButtonElement} </div>
            <div className={"app-header__title"}> DALLAS LIBRARY</div>
            {
                headerConfig.displayButtons &&
                <>
                    <button
                        onClick={() => history.push(`/return`)}
                        id={"header__return-button"}
                        className={"white-button-small"}
                    >
                        RETURN
                    </button>
                    <button
                        onClick={() => history.push(`/borrow`)}
                        id={"header__borrow-button"}
                        className={"teal-button-small"}
                    >
                        BORROW
                    </button>
                </>
            }

        </div>
    )
}

export default AppHeader