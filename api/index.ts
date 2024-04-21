
const APIKEY = process.env.EXPO_PUBLIC_PIXABAY_API_KEY;
const APIURL = process.env.EXPO_PUBLIC_PIXABAY_API_URL;

const baseUrl = `${APIURL}/?key=${APIKEY}`;

interface FetchParams {
    params: {
        page: number;
        q?: string;
        category?: string;
    },
    append?: boolean;
}

const formatUrl = (params: any) => {

    let url = `${baseUrl}&per_page=25&safesearch=true&editors_choice=true`;
    if(!params) return url;
    let paramKeys = Object.keys(params);
    paramKeys.map((key) => {
        let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });
    return url;
}

// export const fetchWallpaperImages = async (params: { page: number | string, q?: string }, append?: boolean) => {
export const fetchWallpaperImages = async ({ params, append }: FetchParams) => {

    try {
        const response = await fetch(formatUrl(params), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(!response.ok) throw Error;
        const data = await response.json();
        return { success: true, data };
    } catch (error: any) {
        return { success: false, message: error?.message }
    }
}