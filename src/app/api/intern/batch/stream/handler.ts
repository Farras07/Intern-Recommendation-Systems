import InternServices from "@/Services/InternServices";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternBatchStreamHandler{
    _service: InternServicesType
    constructor (InternService: InternServicesType)  {
        this._service = InternService
    }
    async GET(req: Request) {
        return this._service.streamBatchData()
    }
}
