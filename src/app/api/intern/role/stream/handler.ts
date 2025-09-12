import InternServices from "@/Services/InternServices";
import { Success, Failed } from "@/types/ResponseTypes"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternRoleStreamHandler{
    _service: InternServicesType
    constructor (InternService: InternServicesType)  {
        this._service = InternService
    }

    async GET (req: Request) {
      return this._service.streamRoleData()
    }
    
}
