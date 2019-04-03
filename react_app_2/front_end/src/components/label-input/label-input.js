import React from 'react'
import './label-input.scss'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

library.add(faTimes)

const LabelInput = ({
                        labels = [],
                        clearLabel,
                        onClick,
                        onChange = () => {},
                        value = ''
                    }) => (
    <div className={"label-input__container"}>
        <div
            className={"labels__container"}
            style={{display: labels.length > 0 ? 'block' : 'none'}}
        >
            {
                labels.map(label => (
                    <div key={label.id} className={"labels-input__label"}>
                        <div className={"labels-input__label-text"}>
                            {label.book_name} - {label.borrower_name}
                        </div>
                        <FontAwesomeIcon
                            className={"labels-input__label-remove"}
                            icon={faTimes}
                            onClick={clearLabel}
                        />
                    </div>
                ))
            }
        </div>
        <input
            style={{display: labels.length > 0 ? 'none' : 'block'}}
            className={"labels-input__input"}
            onClick={onClick}
            onChange={onChange}
            value={value}
            type="text"
        />
    </div>
)

export default LabelInput