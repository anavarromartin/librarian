import React from 'react';
import './app-header.scss'
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft"

library.add(faChevronLeft)


const AppHeader = ({
                       match,
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
        <div className={"app-header__title"}>THE BOOKSHELF</div>
        {
            headerConfig.displayButtons &&
            <>
                <button
                    onClick={() => history.push(`/${match.params.officeName.toLowerCase()}/return`)}
                    id={"header__return-button"}
                >
                    RETURN
                </button>
                <button
                    onClick={() => history.push(`/${match.params.officeName.toLowerCase()}/borrow`)}
                    id={"header__borrow-button"}
                >
                    BORROW
                </button>
            </>
        }

    </div>
)

export default AppHeader