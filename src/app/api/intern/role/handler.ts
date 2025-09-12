import InternServices from "@/Services/InternServices";
import { Success, Failed } from "@/types/ResponseTypes"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternRoleHandler{
    _service: InternServicesType
    constructor (InternService: InternServicesType)  {
        this._service = InternService
    }
    
    async POST(req: Request) {
      try
      {
        const payload = await req.json();
        const newUserId = await this._service.createRole(payload);
        return Success({
          statusCode: 201,
          message: "Intern Role Successfully Created",
          data: {
            id: newUserId
          }
        })


      } 
      catch(error: any) {
        return Failed({
          statusCode: error.statusCode,
          message: error.message
        });
      }
    }

    async GET (req: Request) {
      try
      {
        const internRoles = await this._service.getAllRole();
        return Success({
          statusCode: 200,
          message: "Get Intern Role Success",
          data: {
            roles: internRoles
          }
        })


      } 
      catch(error: any) {

        return Failed({
          statusCode: error.statusCode,
          message: error.message
        });
      }
    }

    async DELETE (req: Request) {
      try
      {
        const payload = await req.json()
        const { id } = payload
        await this._service.deleteRole(id);
        return Success({
          statusCode: 200,
          message: "Delete Intern Role Success",
        })
      } 
      catch(error: any) {

        return Failed({
          statusCode: error.statusCode,
          message: error.message
        });
      }
    }
    async PUT (req: Request) {
      try {
        const payload = await req.json()
        console.log(payload)
        await this._service.updateRole(payload);
      } catch(error: any) {
        return Failed({
          statusCode: error.statusCode,
          message: error.message
        });
      }
    }
    
    
}
