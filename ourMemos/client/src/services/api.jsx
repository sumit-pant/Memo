import axios from "axios"

const URI = import.meta.env.VITE_BACKEND_URI

export const uploadFile = async (data) => {
    try {
        let response = await axios.post(`${URI}/api/file/upload`, data)
        return response.data
    } catch (err) {
        console.error(`Error while calling the api ${err.message}`)
    }
}