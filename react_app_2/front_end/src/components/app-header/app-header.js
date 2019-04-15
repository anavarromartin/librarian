import React from 'react';
import './app-header.scss'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft"

library.add(faChevronLeft)


const AppHeader = ({
                       history = {},
                       backButtonEnabled = () => {
                       },
                       onNavigateBack = () => {
                       },
                       headerConfig = {}
                   }) => (
    <div className="app-header">
        {
            backButtonEnabled() &&
            <div
                className={"app-header__back-button"}
                onClick={() => onNavigateBack(history)}
            >
                <FontAwesomeIcon icon={faChevronLeft}/>
            </div>
        }
        <div className={"app-header__title"}> DALLAS LIBRARY</div>
        {
            headerConfig.displayButtons &&
            <>
                <button
                    onClick={() => history.push(`/return`)}
                    id={"header__return-button"}
                >
                    RETURN
                </button>
                <button
                    onClick={() => history.push(`/borrow`)}
                    id={"header__borrow-button"}
                >
                    BORROW
                </button>
            </>
        }

    </div>
)

export default AppHeader