import { Component, Input, OnInit } from '@angular/core';
import { NGXToastrService } from '../../extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../extra/localStorage/local-storage.service';
import { CommonConstant } from '../../../shared/CommonConstant';

@Component({
    selector: 'app-tempat-penginapan-form',
    templateUrl: './tempat-penginapan-form.component.html'
})
export class TempatPenginapanFormComponent implements OnInit {
    @Input() TempatPenginapan: any;
    @Input() Mode: string;
    @Input() Index: number;

    ListTempatPenginapan: any[] = [];

    readonly KeyWeight = CommonConstant.KeyWeight;
    readonly KeyHistory = CommonConstant.KeyHistory;

    readonly DSSAdd = CommonConstant.Add;
    readonly DSSEdit = CommonConstant.Edit;
    readonly DSSDelete = CommonConstant.Delete;

    DSSForm = this.fb.group({
        Nama: ["", [Validators.required]],
        Harga: [0, [Validators.required, Validators.min(1), Validators.max(999999999999999)]],
        Kebersihan: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        Fasilitas: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        Pelayanan: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
        Jarak: [0, [Validators.required, Validators.min(0.01), Validators.max(999999999999999)]]
    });

    constructor(private toastr: NGXToastrService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        public activeModal: NgbActiveModal,
        private localStorage: LocalStorageService
    ) {

    }

    ngOnInit(): void {
        this.DSSForm.patchValue({
            Nama: "",
            Harga: 0,
            Kebersihan: 0,
            Fasilitas: 0,
            Pelayanan: 0,
            Jarak: 0
        });
        let obj = this.localStorage.getData(this.KeyHistory);
        if (obj == null) {
            this.Mode = this.DSSAdd;
            this.ListTempatPenginapan = [];
        } else {
            this.ListTempatPenginapan = JSON.parse(obj)["ListTempatPenginapan"];
        }

        if (this.Mode == this.DSSEdit) {
            this.DSSForm.patchValue({
                Nama: this.TempatPenginapan.Nama,
                Harga: this.TempatPenginapan.Harga,
                Kebersihan: this.TempatPenginapan.Kebersihan,
                Fasilitas: this.TempatPenginapan.Fasilitas,
                Pelayanan: this.TempatPenginapan.Pelayanan,
                Jarak: this.TempatPenginapan.Jarak
            });
        }
    }

    NumberMinMaxHandler(formName: string) {
        if(this.DSSForm.get(formName).value < 0) {
            this.DSSForm.get(formName).setValue(0);
            return;
        }

        if(this.DSSForm.get(formName).value > 5) {
            this.DSSForm.get(formName).setValue(5);
        }
    }

    Check() {
        console.log(this.DSSForm);
        console.log(this.DSSForm.getRawValue());
    }

    Save() {
        if(this.Mode == this.DSSAdd && this.ListTempatPenginapan.find(x => x.Nama == this.DSSForm.get("Nama").value) != undefined) {
            this.toastr.warningMessage("Tempat Penginapan dengan nama yang sama telah diinput");
            return;
        }

        if(this.Mode == this.DSSEdit && this.ListTempatPenginapan.find(x => x.Nama == this.DSSForm.get("Nama").value) != undefined) {
            if(this.ListTempatPenginapan.findIndex(x => x.Nama == this.DSSForm.get("Nama").value) != this.Index) {
                this.toastr.warningMessage("Tempat Penginapan dengan nama yang sama telah diinput");
                return;
            }
        }

        let obj = {
            Nama: this.DSSForm.get("Nama").value,
            Harga: this.DSSForm.get("Harga").value,
            Kebersihan: this.DSSForm.get("Kebersihan").value,
            Fasilitas: this.DSSForm.get("Fasilitas").value,
            Pelayanan: this.DSSForm.get("Pelayanan").value,
            Jarak: this.DSSForm.get("Jarak").value
        };

        if(this.Mode == this.DSSAdd) {
            this.ListTempatPenginapan.push(obj);
            this.localStorage.saveData(this.KeyHistory, JSON.stringify({
                "ListTempatPenginapan": this.ListTempatPenginapan
            }));
            this.activeModal.close(obj);
            return;
        }

        if(this.Mode == this.DSSEdit) {
            this.ListTempatPenginapan[this.Index] = obj;
            this.localStorage.saveData(this.KeyHistory, JSON.stringify({
                "ListTempatPenginapan": this.ListTempatPenginapan
            }));
            this.activeModal.close(obj);
            return;
        }
    }
}
