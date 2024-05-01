import { Component, OnInit, Injectable, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXToastrService } from '../extra/toastr/toastr.service';
import { CommonConstant } from '../../shared/CommonConstant';
import { LocalStorageService } from '../extra/localStorage/local-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TempatPenginapanFormComponent } from './tempat-penginapan-form/tempat-penginapan-form.component';
import { StoreService } from '../extra/firebase/StoreService.service';
import { SistemAdminComponent } from './admin/sistem-admin/sistem-admin.component';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Component({
    selector: 'app-sistem-rekomendasi',
    templateUrl: './sistem-rekomendasi.component.html',
    styleUrl: './sistem-rekomendasi.component.css'
})
export class SistemRekomendasiComponent implements OnInit {
    @ViewChild(SistemAdminComponent) sistemAdminComponent: SistemAdminComponent;

    UseLocalstorage: boolean = true;
    Mode: string = CommonConstant.MainMenu;
    EnableLogOut: boolean = false;

    readonly ModeMainMenu = CommonConstant.MainMenu;
    readonly ModeSistemRekomendasi = CommonConstant.SistemRekomendasi;
    readonly ModeSetting = CommonConstant.Setting;
    readonly ModeResult = CommonConstant.Result;
    readonly ModeAdminLogin = CommonConstant.AdminLogin;

    readonly KeyWeight = CommonConstant.KeyWeight;
    readonly KeyHistory = CommonConstant.KeyHistory;
    readonly KeyAdmin = CommonConstant.KeyAdmin;

    readonly WeightIncrease = CommonConstant.INC;
    readonly WeightDecrease = CommonConstant.DCR;

    readonly DSSAdd = CommonConstant.Add;
    readonly DSSEdit = CommonConstant.Edit;
    readonly DSSDelete = CommonConstant.Delete;

    settingWeight: number[] = [];

    currentWeight: number[] = [];

    ListTempatPenginapan: { Nama: string, Harga: number, Kebersihan: number, Fasilitas: number, Pelayanan: number, Jarak: number }[] = [];

    ListSortedResult: { Nama: String, Score: number }[] = [];

    // Flags
    SettingIsChanged: boolean = false;

    constructor(private toastr: NGXToastrService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private modalService: NgbModal,
        private localStorage: LocalStorageService,
        private store: StoreService,
        private cookieService: CookieService
    ) {
        
    }

    ngOnInit(): void {
        // this.store.authenticateAdmin("admin", CryptoJS.SHA256("admin").toString());

        // this.localStorage.clearData();
        this.EnableLogOut = false;
        this.SettingIsChanged = false;
        
        if(window.localStorage) {
            this.UseLocalstorage = true;
        } else {
            this.UseLocalstorage = false;
        }

        if(this.UseLocalstorage == true) {
            let weight = this.localStorage.getData(this.KeyWeight);
    
            if(weight != null) {
                this.settingWeight = JSON.parse(weight)["Weight"];
                this.currentWeight = JSON.parse(weight)["Weight"];
            } else {
                this.settingWeight = [];
                this.currentWeight = [1, 1, 1, 1, 1];
            }
    
            let obj = this.localStorage.getData(this.KeyHistory);
            if(obj != null) {
                this.ListTempatPenginapan = JSON.parse(obj)["ListTempatPenginapan"];
            }
        } else {
            this.settingWeight = [];
            this.currentWeight = [1, 1, 1, 1, 1];
        }

        let loginStatus = this.cookieService.get(this.KeyAdmin);
    
        if(loginStatus == CryptoJS.SHA256("true").toString()) {
            this.EnableLogOut = true;
        }

        this.Mode = CommonConstant.MainMenu;
    }

    ChangeMenuHandler(menu: string){
        if(this.Mode == menu) {
            return;
        }

        if(menu == this.ModeAdminLogin) {
            let loginStatus = this.cookieService.get(this.KeyAdmin);
    
            if(loginStatus == CryptoJS.SHA256("true").toString()) {
                this.EnableLogOut = true;
            }
        }

        if(menu == this.ModeSistemRekomendasi && this.settingWeight.length == 0) {
            this.toastr.warningMessage("Lakukan setting bobot kriteria melalui Settings sebelum mencari rekomendasi");
            return;
        }

        if(this.SettingIsChanged == true) {
            if(confirm(CommonConstant.SETTING_CHANGED)) {
                this.currentWeight = this.settingWeight.slice();
            } else {
                return;
            }
        }

        if(menu != this.ModeResult) {
            this.ListSortedResult = [];
        }

        this.Mode = menu;

        this.SettingIsChanged = false;
    }

    AdminLoginHandler(event) {
        if(event == true) {
            this.EnableLogOut = true;
        }
    }

    AdminLogout() {
        if(confirm(CommonConstant.CONFIRM_ADMIN_LOGOUT) == true) {
            this.cookieService.delete(this.KeyAdmin);
    
            this.EnableLogOut = false;
    
            if(this.Mode.includes("Admin") == false) {
                this.Mode = this.ModeMainMenu;
            }
        }
    }

    WeightValueHandler(behavior: string, index: number) {
        let weightValue = this.currentWeight[index];

        if(behavior == this.WeightDecrease && weightValue > 1) {
            this.currentWeight[index] = weightValue - 1;
            this.SettingIsChanged = true;
            return;
        }

        if(behavior == this.WeightIncrease && weightValue < 5) {
            this.currentWeight[index] = weightValue + 1;
            this.SettingIsChanged = true;
            return;
        }
        
    }

    // ResetWeightValue() {
    //     if(confirm(CommonConstant.CONFIRM_RESET)) {
    //         this.currentWeight = this.defaultWeight["Weight"].slice();
    
    //         this.SettingIsChanged = true;
    //     }
    // }

    SaveWeightValueSetting() {
        if(confirm(CommonConstant.CONFIRM_SAVE)) {
            if(this.UseLocalstorage == true) {
                let obj = {
                    "Weight" : this.currentWeight
                }
                
                this.localStorage.saveData(this.KeyWeight, JSON.stringify(obj));
            }

            this.settingWeight = this.currentWeight.slice();

            this.SettingIsChanged = false;

            this.toastr.successMessage("Settings berhasil disimpan!");
        }
    }

    DeleteAllPlace() {
        if(this.ListTempatPenginapan.length == 0) {
            return;
        }
        if(confirm(CommonConstant.CONFIRM_RESET_TEMPAT_PENGINAPAN)) {
            this.localStorage.removeData(this.KeyHistory);
            this.ListTempatPenginapan = [];
        }
    }

    DSSHandler(Mode: string, Index: number = -1) {
        if(Mode == this.DSSDelete) {
            if(confirm(CommonConstant.CONFIRM_HAPUS_TEMPAT_PENGINAPAN + this.ListTempatPenginapan[Index].Nama + "?")) {
                this.ListTempatPenginapan.splice(Index, 1);
                this.localStorage.saveData(this.KeyHistory, JSON.stringify({
                    "ListTempatPenginapan": this.ListTempatPenginapan
                }));

                let obj = this.localStorage.getData(this.KeyHistory);
                if(obj != null) {
                  this.ListTempatPenginapan = JSON.parse(obj)["ListTempatPenginapan"];
                }
            }
            return;
        }

        const modalDSS = this.modalService.open(TempatPenginapanFormComponent, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, centered: true, size: 'lg' });
        modalDSS.componentInstance.TempatPenginapan = Mode == this.DSSEdit ? this.ListTempatPenginapan[Index] : null;
        modalDSS.componentInstance.Mode = Mode;
        modalDSS.componentInstance.Index = Index;

        modalDSS.result.then(
            (response) => {
                let obj = this.localStorage.getData(this.KeyHistory);
                if(obj != null) {
                  this.ListTempatPenginapan = JSON.parse(obj)["ListTempatPenginapan"];
                }
            }
          ).catch(
            (error) => {
              if (error != 0) {
                // console.log(error);
              }
            }
          );
    }

    //#region MCDM TOPSIS
    CalculateTOPSIS() {
        if(this.ListTempatPenginapan.length < 2) {
            this.toastr.warningMessage("Mohon input minimal 2 tempat penginapan");
            return;
        }
        
        if(confirm(CommonConstant.CONFIRM_CALCULATE_TOPSIS)) {
            this.spinner.show();
            this.matriksNormalisasi();
        }
    }

    matriksNormalisasi() {
        let x : number[] = [];

        let totalHarga = 0;
        let totalKebersihan = 0;
        let totalFasilitas = 0;
        let totalPelayanan = 0;
        let totalJarak = 0;

        for(let i = 0; i < this.ListTempatPenginapan.length; i++) {
            totalHarga += Math.pow(this.ListTempatPenginapan[i].Harga, 2);
            totalKebersihan += Math.pow(this.ListTempatPenginapan[i].Kebersihan, 2);
            totalFasilitas += Math.pow(this.ListTempatPenginapan[i].Fasilitas, 2);
            totalPelayanan += Math.pow(this.ListTempatPenginapan[i].Pelayanan, 2);
            totalJarak += Math.pow(this.ListTempatPenginapan[i].Jarak, 2);
        }

        x["Harga"] = Math.sqrt(totalHarga);
        x["Kebersihan"] = Math.sqrt(totalKebersihan);
        x["Fasilitas"] = Math.sqrt(totalFasilitas);
        x["Pelayanan"] = Math.sqrt(totalPelayanan);
        x["Jarak"] = Math.sqrt(totalJarak);

        // console.log(x);


        let R: number[][] = []; // Matriks Ternomalisasi

        for(let i = 0; i < this.ListTempatPenginapan.length; i++) {
            let rValue : number[] = [];
            
            rValue.push(this.ListTempatPenginapan[i].Harga / x["Harga"]);
            rValue.push(this.ListTempatPenginapan[i].Kebersihan / x["Kebersihan"]);
            rValue.push(this.ListTempatPenginapan[i].Fasilitas / x["Fasilitas"]);
            rValue.push(this.ListTempatPenginapan[i].Pelayanan / x["Pelayanan"]);
            rValue.push(this.ListTempatPenginapan[i].Jarak / x["Jarak"]);

            R.push(rValue);
        }

        // console.log(R);

        this.pembobotanMatrikNormalisasi(R);
    }

    pembobotanMatrikNormalisasi(R: number[][]) {
        let Y: number[][] = [];

        for(let i = 0; i < R.length; i++) {
            let VValue : number[] = [];

            VValue.push(R[i][0] * this.settingWeight[0]);
            VValue.push(R[i][1] * this.settingWeight[1]);
            VValue.push(R[i][2] * this.settingWeight[2]);
            VValue.push(R[i][3] * this.settingWeight[3]);
            VValue.push(R[i][4] * this.settingWeight[4]);

            Y.push(VValue);
        }

        // console.log(Y);

        this.kalkulasiSolusiIdeal(Y);
    }

    kalkulasiSolusiIdeal(Y: number[][]) {
        let APlus: number[] = []; // Solusi Ideal Positif (+)
        let AMin: number[] = []; // Solusi Ideal Negatif (-)

        // Kriteria Keuntungan (BENEFIT) = Kebersihan, Fasilitas, Pelayanan
        // Kriteria Kerugian (COST) = Harga, Jarak

        let vHarga: number[] = [];
        let vKebersihan: number[] = [];
        let vFasilitas: number[] = [];
        let vPelayanan: number[] = [];
        let vJarak: number[] = [];

        for(let i = 0; i < Y.length; i++) {
            vHarga.push(Y[i][0]);
            vKebersihan.push(Y[i][1]);
            vFasilitas.push(Y[i][2]);
            vPelayanan.push(Y[i][3]);
            vJarak.push(Y[i][4]);
        }

        APlus.push(Math.min(...vHarga)); // Harga => COST
        APlus.push(Math.max(...vKebersihan)); // Kebersihan => BENEFIT
        APlus.push(Math.max(...vFasilitas)); // Fasilitas => BENEFIT
        APlus.push(Math.max(...vPelayanan)); // Pelayanan => BENEFIT
        APlus.push(Math.min(...vJarak)); // Jarak => COST

        AMin.push(Math.max(...vHarga)); // Harga => COST
        AMin.push(Math.min(...vKebersihan)); // Kebersihan => BENEFIT
        AMin.push(Math.min(...vFasilitas)); // Fasilitas => BENEFIT
        AMin.push(Math.min(...vPelayanan)); // Pelayanan => BENEFIT
        AMin.push(Math.max(...vJarak)); // Jarak => COST

        // console.log(APlus);
        // console.log(AMin);

        this.kalkulasiJarakAlternatif(Y, APlus, AMin);
    }

    kalkulasiJarakAlternatif(Y: number[][], APlus: number[], AMin: number[]) {
        let DPlus: number[] = []; // Jarak setiap alternatif terhadap Solusi Ideal Positif (+)
        let DMin: number[] = []; // Jarak setiap alternatif terhadap Solusi Ideal Negatif (-)

        for(let i = 0; i < Y.length; i++) {
            DPlus.push(Math.sqrt(Math.pow(APlus[0] - Y[i][0], 2) + Math.pow(APlus[1] - Y[i][1], 2) + Math.pow(APlus[2] - Y[i][2], 2) + Math.pow(APlus[3] - Y[i][3], 2) + Math.pow(APlus[4] - Y[i][4], 2)));
            DMin.push(Math.sqrt(Math.pow(AMin[0] - Y[i][0], 2) + Math.pow(AMin[1] - Y[i][1], 2) + Math.pow(AMin[2] - Y[i][2], 2) + Math.pow(AMin[3] - Y[i][3], 2) + Math.pow(AMin[4] - Y[i][4], 2)));
        }

        // console.log(DPlus);
        // console.log(DMin);

        this.kalkulasiNilaiPreferensi(DPlus, DMin);
    }

    kalkulasiNilaiPreferensi(DPlus: number[], DMin: number[]) {
        let V: { Nama: String, Score: number }[] = [];

        for(let i = 0; i < this.ListTempatPenginapan.length; i++) {
            V.push({
                Nama : this.ListTempatPenginapan[i].Nama,
                Score : DMin[i] / (DMin[i] + DPlus[i])
            })
        }

        // console.log(V);

        this.sortNilaiPreferensi(V);
    }

    sortNilaiPreferensi(V: { Nama: String, Score: number }[]) {
        this.ListSortedResult = this.mergeSort(V);

        // console.log(this.ListSortedResult);

        this.ChangeMenuHandler(this.ModeResult);

        this.spinner.hide();
    }
    //#endregion

    //#region Merge Sort
    mergeSort(array: any[]) {
        if (array.length <= 1) {
          return array;
        }
        const middle = Math.floor(array.length / 2);
        const left = array.slice(0, middle);
        const right = array.slice(middle);
        return this.merge(this.mergeSort(left), this.mergeSort(right));
    }

    merge(left: any[], right: any[]) {
        let resultArray = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex].Score > right[rightIndex].Score) {
                resultArray.push(left[leftIndex]);
                leftIndex++;
            } else {
                resultArray.push(right[rightIndex]);
                rightIndex++;
            }
        }

        return resultArray.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }

    // MergeSort(items: { Nama: String, Score: number }[], left: number, right: number) {
    //     if(left >= right){
    //         return;
    //     }

    //     let mid = left + Math.floor((right - left) / 2);

    //     this.MergeSort(items, left, mid);
    //     this.MergeSort(items, mid + 1, right);
    //     this.Merge(items, left, mid, right);
    // }

    // Merge(items: { Nama: String, Score: number }[], left: number, mid: number, right: number) {
    //     let n1 = mid - left + 1;
    //     let n2 = right - mid;

    //     // Array Temporary
    //     let leftItems : { Nama: String, Score: number }[] = [];
    //     let rightItems : { Nama: String, Score: number }[] = [];

    //     for(let i = 0; i < n1; i++) {
    //         leftItems.push(items.slice()[left + i]);
    //     }

    //     for(let j = 0; j < n2; j++) {
    //         rightItems.push(items.slice()[mid + 1 + j]);
    //     }

    //     // Index Awal untuk subarray pertama
    //     let a = 0;

    //     // Index Awal untuk subarray kedua
    //     let b = 0;

    //     // Index Awal untuk subarray ketiga
    //     let c = left;

    //     while(a < n1 && b < n2) {
    //         if(leftItems[a].Score <= rightItems[b].Score) {
    //             items[c] = leftItems[a];
    //             a++;
    //         } else {
    //             items[c] = rightItems[b];
    //             b++;
    //         }
    //     }

    //     while(a < n1) {
    //         items[c] = leftItems[a];
    //         a++;
    //         c++;
    //     }

    //     while(b < n2) {
    //         items[c] = rightItems[b];
    //         b++;
    //         c++;
    //     }
    // }
    //#endregion
}
