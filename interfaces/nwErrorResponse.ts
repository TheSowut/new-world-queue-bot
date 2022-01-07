export interface NWErrorResponse {
    response: {
        status: number,
        statusText: string,
        headers: any
    },
    data: {
        success: boolean,
        via: string,
        message: string
    }
}