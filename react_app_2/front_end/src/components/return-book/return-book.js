import React, {useEffect, useState} from 'react';
import './return-book.scss'
import classNames from 'classnames'
import {routePrefix} from "../../globals"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft"
import SearchResults from "../search-results/search-results"
import LabelInput from "../label-input/label-input"

library.add(faChevronLeft)

const ReturnBook = ({setBackLocation, setHeaderVisibility, getBooks}) => {

    const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [selectedResult, selectResult] = useState(null)

    useEffect(() => {
        setBackLocation(`${routePrefix}`)
    })

    useEffect(() => {
        searching ? setHeaderVisibility(false) : setHeaderVisibility(true)
        return () => setHeaderVisibility(true)
    })

    const setClassWithModifier = (className) => classNames(className, {[`${className}--searching`]: searching})

    const resetSearch = () => {
        console.log('clearing!')
        setSearching(false)
        setSearchResults([])
    }

    const search = async (event) => {
        const searchInput = event.target.value
        if (searchInput.trim() !== '') {
            setSearchResults((await getBooks(searchInput)).data.data.books)
        } else {
            setSearchResults([])
        }
    }

    const onSelectSearchResult = (searchResult) => {
        selectResult(searchResult)
        resetSearch()
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
                            icon={faChevronLeft} onClick={() => resetSearch()}/>
                    </div>

                    <div className={setClassWithModifier("text-input")}>
                        <LabelInput
                            labels={selectedResult ? [selectedResult] : []}
                            onClick={() => setSearching(true)}
                            onChange={event => search(event)}
                            clearLabel={() => selectResult(null)}
                        />
                    </div>
                </div>
                <div
                    className={"search-results"}
                    style={{display: searchResults.length > 0 ? 'block' : 'none'}}
                >
                    <SearchResults
                        results={searchResults}
                        onSelectResult={onSelectSearchResult}
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