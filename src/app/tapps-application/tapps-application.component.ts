import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApplicationService } from './tapps-application.service';

@Component({
    selector: 'app-application',
    standalone: true,
    templateUrl: './tapps-application.component.html',
    styleUrl: './tapps-application.component.scss',
    providers: [ApplicationService],
    imports: [CommonModule, ReactiveFormsModule, ToastrModule]
})
export class ApplicationComponent {
    data: any[] = [];
    keys: string[] = [];
    dataUpdate: any = {};
    listCategory: any[] = [];
    currentCate = '';


    isUpdateData = false;

    fields = [`app_position`, `app_name`, `app_type`, `app_link`, `app_short_des`, `app_long_des`, `is_telegram_mini_app`, `app_languages`, `offcial_links`, `app_platform`, `category_id`, `image_url`]
    keyIncludes = [`system`, `create_at`, `create_by`, `change_at`, `change_by`, `__v`, `_id`];

    formControls: any = {}

    constructor(
        private masterService: ApplicationService,
        private toastr: ToastrService
    ) {
        this.fields.forEach(item => {
            this.formControls[item] = new FormControl('');
            this.formControls[item].valueChanges.subscribe((text: any) => {
                this.dataUpdate[item] = text;
            })
        })
    }

    showDataRow(data: any, k: any) {
        if (k === 'app_long_des') {
            return data[k]?.slice(0, 30) + '...';
        }
        return data[k];
    }

    changeCurrentCate(c: string) {
        this.currentCate = c;
        this.get(this.currentCate);
    }

    submit(e: any) {
        e.preventDefault();
        if (this.isUpdateData) {
            this.update(this.dataUpdate?._id);
        }
        else {
            this.add()
        }
    }

    resetDataUpdate = () => {
        this.dataUpdate = {};
    }

    resetForm() {
        this.fields.forEach(item => {
            this.formControls[item].reset();
        })
    }

    getKeys(data: any) {
        this.keys = Object.keys(data).filter(f => !this.keyIncludes.includes(f));
        this.keys.push('image_url')
        // this.fields = this.keys;
    }

    setSign(data: any[]) {
        const fil = data.filter(f => f.section === 'signature');
        fil?.forEach(item => {
            localStorage.setItem(item?.key, item?.value)
        })
    }

    get(category: string) {
        this.masterService.getAppList(category).then((res: any) => {
            if (res?.result?.length > 0) {
                this.data = res?.result[0].apps;
                this.setSign(this.data);
                this.getKeys(this.data[0])
            }
        })
    }


    ngOnInit(): void {
        this.masterService.getCategory().then((res: any) => {
            console.log(res)
            if (res?.result?.length > 0) {
                this.listCategory = res?.result;
                this.currentCate = res?.result[0]?.spec_name;
                this.get(this.currentCate)
            }
        })
    }

    delete(id: string) {
        this.masterService.delete(id).then((res: any) => {
            this.get(this.currentCate);
            this.toastr.success('Delete data successfully', 'Success')
        })
    }

    update(id: string) {
        let errors = '';
        console.log(this.dataUpdate)
        // check
        this.fields.forEach(item => {
            if (!this.dataUpdate[item]) {
                errors += `${item} is missing \n\n | `
            }
        })

        if (errors) {
            this.toastr.error(errors, 'Error');
            return;
        }
        this.masterService.update(id, this.dataUpdate).then((res: any) => {
            this.get(this.currentCate)
            this.isUpdateData = false;
            this.resetForm();
            this.resetDataUpdate();
            this.toastr.success('Update data successfully', 'Success')
        })
    }

    showData(id: string) {
        this.isUpdateData = true;
        this.dataUpdate[`_id`] = id;
        const f = this.data.find(f => f?._id === id);
        if (f) {
            this.fields.forEach(item => {
                this.formControls[item].setValue(f[item]);
            })
        }
        else {
            this.toastr.error(`Not found`, 'Error');
        }

    }

    add() {
        let errors = '';
        console.log(this.dataUpdate)
        // check
        this.fields.forEach(item => {
            if (!this.dataUpdate[item]) {
                errors += `${item} is missing \n\n | `
            }
        })

        if (errors) {
            this.toastr.error(errors, 'Error');
            return;
        }


        this.masterService.add(this.dataUpdate).then((res: any) => {
            this.get(this.currentCate);
            this.resetForm();
            this.resetDataUpdate();
            this.toastr.success('Add data successfully', 'Success')
        })
    }
}
