import React, {useEffect, useState} from 'react';
import './return-book.scss'
import classNames from 'classnames'
import {routePrefix} from "../../globals"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft"
import searchService from "../../services/search-service"

library.add(faChevronLeft)

const ReturnBook = ({setBackLocation, setHeaderVisibility}) => {

    const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState([])

    useEffect(() => {
        setBackLocation(`${routePrefix}`)

    })

    useEffect(() => {
        console.log(`search results: ${searchResults.map(book => book.name)}`)
        searching ? setHeaderVisibility(false) : setHeaderVisibility(true)
        return () => setHeaderVisibility(true)
    })

    const setClassWithModifier = (className) => classNames(className, {[`${className}--searching`]: searching})

    const search = async (event) => {
        const response = await searchService.searchBooks(event.target.value)
        setSearchResults(response.data.data.books)

    }

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
                    <input className={setClassWithModifier("text-input")} type="text"
                           onClick={() => {
                               setSearching(true)
                           }}
                           onChange={event => {search(event)}}
                    />
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