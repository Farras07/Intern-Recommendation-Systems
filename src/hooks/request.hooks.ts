import BaseError from "@/exceptions/BaseError";

const _Fetch = async (path: string, method: string, body?: any) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASEURL}${path}`;
        const options: RequestInit = {
            method,
            headers: { "Content-Type": "application/json" },
        };

        if (method !== "GET" && body) {
            options.body = JSON.stringify(body);
        }

        const res = await fetch(url, options);
        console.log(res.status)

        if (!res.ok) {
            throw new BaseError(`HTTP ${res.status}: ${res.statusText}`, res.status);
        }

        const json = await res.json();
        return json.data ?? json
    } catch (error) {
        throw error;
    }
};

export default _Fetch;
