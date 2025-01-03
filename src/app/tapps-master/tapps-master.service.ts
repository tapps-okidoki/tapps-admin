import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { BASE_URL } from "../../constant/url";

@Injectable()
export class MasterService {
    constructor(private httpService: HttpClient) { }
    async postRequest(request: any) {
        return await lastValueFrom(this.httpService.post(BASE_URL + '/core/request-offchain', {
            ...request,
            signature: localStorage.getItem('master_sign') || 'e4_,^-;.NwrZm>B5H@#j37',
        }))
    }

    async getMasterData() {
        const req = {
            collection: 'master',
            method: 'find',
            request: {}
        }
        const master = await this.postRequest(req);
        return master;
    }

    async delete(id: string) {
        const req = {
            collection: 'master',
            method: 'delete',
            admin : true,
            request: {
                _id: id
            }
        }
        const master = await this.postRequest(req);
        return master;
    }

    async update(id: string, data: any) {
        const req = {
            collection: 'master',
            method: 'update',
            admin : true,
            request: {
                _id: id,
                ...data
            }
        }
        const master = await this.postRequest(req);
        return master;
    }

    async add(data: any) {
        const req = {
            collection: 'master',
            method: 'create',
            admin : true,
            request: {
                ...data
            }
        }
        const master = await this.postRequest(req);
        return master;
    }
}