import React, {useEffect} from 'react';
import './return-book.scss'
import classNames from 'classnames'
import {routePrefix} from "../../globals"

const ReturnBook = ({setBackLocation}) => {

    useEffect(() => {
        setBackLocation(`${routePrefix}`)
    })

    return (
        <div className={"container"}>
            <div className={"header"}>Return A Book</div>
            <form>
                <label>Find the Book You Borrowed</label>
                <input className={"text-input"} type="text"/>
                <input className={classNames("teal-button", "button-input")} type="submit" value="RETURN" />
            </form>
        </div>
    )
}

export default ReturnBook