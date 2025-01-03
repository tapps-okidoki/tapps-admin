import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MasterService } from '../tapps-master/tapps-master.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from './tapps-category.service';

@Component({
    selector: 'app-category',
    standalone: true,
    templateUrl: './tapps-category.component.html',
    styleUrl: './tapps-category.component.scss',
    providers: [CategoryService],
    imports: [CommonModule, ReactiveFormsModule, ToastrModule]
})
export class CategoryComponent {
    data: any[] = [];
    keys: string[] = [];
    dataUpdate: any = {};

    isUpdateData = false;

    fields = [`name`, `description`, `image`, `spec_name`]
    keyIncludes = [`system`, `create_at`, `create_by`, `change_at`, `change_by`];

    formControls: any = {}

    constructor(
        private masterService: CategoryService,
        private toastr: ToastrService
    ) {
        this.fields.forEach(item => {
            this.formControls[item] = new FormControl('');
            this.formControls[item].valueChanges.subscribe((text: any) => {
                this.dataUpdate[item] = text;
            })
        })
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

    }

    setSign(data: any[]) {
        const fil = data.filter(f => f.section === 'signature');
        fil?.forEach(item => {
            localStorage.setItem(item?.key, item?.value)
        })
    }

    get() {
        this.masterService.getMasterData().then((res: any) => {
            if (res?.result?.length > 0) {
                this.data = res?.result;
                this.setSign(this.data);
                this.getKeys(this.data[0])
            }
        })
    }


    ngOnInit(): void {
        this.get()
    }

    delete(id: string) {
        this.masterService.delete(id).then((res: any) => {
            this.get();
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
            this.get()
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
            this.get();
            this.resetForm();
            this.resetDataUpdate();
            this.toastr.success('Add data successfully', 'Success')
        })
    }
}
