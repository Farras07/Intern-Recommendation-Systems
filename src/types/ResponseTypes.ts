type ResponseProps = {
    statusCode: number
    data?: any
    message: String
}

export function Success (props: ResponseProps) {
    const data = props.data? props.data : null 
    const { statusCode, message } = props
    const res = {
        status: "Success",
        message,
        data
    }
    return Response.json(res, { status: statusCode })
}

export function Failed (props: ResponseProps) {
    const { statusCode, message } = props
    const res = {
        status: "Failed",
        message,
    }
    return Response.json(res, { status: statusCode })
}