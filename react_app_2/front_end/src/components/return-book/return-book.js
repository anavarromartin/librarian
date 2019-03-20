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

    return (
        <div className={"container"}>
            <div className={
                classNames("header", {"header--searching": searching})}
            >Return A Book
            </div>
            <form className={classNames({"form--searching": searching})}>
                <label className={classNames({"label--searching": searching})}>Find the Book You Borrowed</label>
                <div className={classNames({"text-input__container": true})}>
                    <div className={classNames("back__container", {"back__container--searching": searching})}>
                        <FontAwesomeIcon className={classNames(
                            "text-input__back",
                            {"text-input__back--searching": searching}
                        )} icon={faChevronLeft} onClick={() => setSearching(false)}/>
                    </div>
                    <input className={
                        classNames("text-input",
                            {"text-input--searching": searching})
                    } type="text" onClick={() => {
                        setSearching(true)
                    }}/>
                </div>
                <input className={
                    classNames("teal-button", "button-input", {"button-input--searching": searching})
                } type="submit" value="RETURN"
                />
            </form>
        </div>
    )
}

export default ReturnBook