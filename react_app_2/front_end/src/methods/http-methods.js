import axios from 'axios'

export const performGet = async (url, httpService = axios) => (await httpService.get(url))

export const performPatch = async (url, body, httpService = axios) => (await httpService.patch(url, body))