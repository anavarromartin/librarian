import React, {useEffect} from 'react';
import './library.scss'
import {routePrefix} from "../../globals"
import { ReactComponent as Logo } from '../../assets/home_page_img.svg';

const Library = ({history, setBackLocation, setHeaderConfig}) => {
    setBackLocation(null)

    useEffect(() => {
        setHeaderConfig(
            {
                displayButtons: true
            }
        )
        return () => setHeaderConfig({})
    }, [])


    return (
        <div className={"library-container"}>
            <Logo className={"image-container"}  alt={"logo"} />
        </div>
    )
}

export default Library