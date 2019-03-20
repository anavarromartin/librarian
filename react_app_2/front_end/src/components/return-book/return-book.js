import React, {useEffect, useState} from 'react';
import './return-book.scss'
import classNames from 'classnames'
import {routePrefix} from "../../globals"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft"

library.add(faChevronLeft)

const ReturnBook = ({setBackLocation, setHeaderVisibility}) => {

    const [searching, setSearching] = useState(false)

    useEffect(() => {
        setBackLocation(`${routePrefix}`)

    })

    useEffect(() => {
        searching ? setHeaderVisibility(false) : setHeaderVisibility(true)
        return () => setHeaderVisibility(true)
    })

    const setClassName = (className) => classNames(className, {[`${className}--searching`]: searching})

    return (
        <div className={"container"}>
            <div className={setClassName("header")}
            >Return A Book
            </div>
            <form className={setClassName("form")}>
                <label className={setClassName("label")}
                >Find the Book You Borrowed
                </label>
                <div className={setClassName("text-input__container")}>
                    <div className={setClassName("back__container")}>
                        <FontAwesomeIcon
                            className={setClassName("text-input__back")}
                            icon={faChevronLeft} onClick={() => setSearching(false)}/>
                    </div>
                    <input className={setClassName("text-input")} type="text" onClick={() => {
                        setSearching(true)
                    }}/>
                </div>
                <input className={
                    classNames("teal-button", setClassName("button-input"))
                } type="submit" value="RETURN"
                />
            </form>
        </div>
    )
}

export default ReturnBook