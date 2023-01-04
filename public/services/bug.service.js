
import {storageService} from './async-storage.service.js'
import {utilService} from './util.service.js'

// const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug
}

function query(filterBy) {
    console.log('filterBy', filterBy)
    const { title, severity, labels } = filterBy
    return axios.get(BASE_URL+ `?title=${title}&severity=${severity}&labels=${labels}`)
        .then(res => res.data)

}
function getById(bugId) {
    // return storageService.get(STORAGE_KEY, bugId)
    return axios.get(`${BASE_URL}/${bugId}`)
    .then(res => res.data)

}
function remove(bugId) {
    // return storageService.remove(STORAGE_KEY, bugId)
    return axios.delete(`${BASE_URL}/${bugId}`)
    .then(res => res.data)
}
function save(bug) {  
        if (bug._id) return axios.put(BASE_URL + `/${bug._id}`,bug).then(res => res.data)
        else return axios.post(BASE_URL,bug).then(res => res.data)
}

function getDefaultFilter() {
    return { title: '', severity: 5, labels: '' }
}

function getEmptyBug() {
    return {
        title: '',
        description: '',
        severity: 5,
    }}
