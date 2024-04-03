import axios from "axios"

const api = axios.create()

api.interceptors.response.use((response) => response.data)
api.interceptors.request.use(req => {
    req.headers['x-api-key'] = process.env.EXPO_PUBLIC_SHYFT_API_KEY;
    return req;
})

function useApi() {
    const get = async (url: string) => await api.get(url)
    const post = async (url: string, data: any) => await api.post(url, data)

    return { get, post }
}

export default useApi