import axios from 'axios'

export const performGet = async (url, httpService = axios) => {
    return await httpService.get(url)
}