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

    const setClassWithModifier = (className) => classNames(className, {[`${className}--searching`]: searching})

    return (
        <div className={"container"}>
            <div className={setClassWithModifier("header")}
            >Return A Book
            </div>
            <form className={setClassWithModifier("form")}>
                <label className={setClassWithModifier("label")}
                >Find the Book You Borrowed
                </label>
                <div className={setClassWithModifier("text-input__container")}>
                    <div className={setClassWithModifier("back__container")}>
                        <FontAwesomeIcon
                            className={setClassWithModifier("text-input__back")}
                            icon={faChevronLeft} onClick={() => setSearching(false)}/>
                    </div>
                    <input className={setClassWithModifier("text-input")} type="text" onClick={() => {
                        setSearching(true)
                    }}/>
                </div>
                <input className={
                    classNames("teal-button", setClassWithModifier("button-input"))
                } type="submit" value="RETURN"
                />
            </form>
        </div>
    )
}

export default ReturnBook