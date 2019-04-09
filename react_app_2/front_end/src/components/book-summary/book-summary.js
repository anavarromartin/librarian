import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faBookOpen} from "@fortawesome/free-solid-svg-icons/faBookOpen";
import './book-summary.scss'

library.add(faBookOpen)

const BookSummary = ({bookTitle, quantity, imageLink}) => {

    return (
        <div className={"book-summary__container"}>
            {
                imageLink
                    ? (<img className={"book-summary__image"} src={imageLink}/>)
                    : (<div className={"book-summary__no-image"}>No Image</div>)
            }
            <div className={"book-summary__title"}>{bookTitle}</div>
            <div className={"book-summary__quantity"}>
                <div className={"quantity__icon"}>
                    <FontAwesomeIcon icon={faBookOpen}/>
                </div>
                <div
                    style={{color: quantity === 0 ? '#bf1e25' : 'unset'}}
                >{quantity} available</div>
            </div>
        </div>
    )
}

export default BookSummary