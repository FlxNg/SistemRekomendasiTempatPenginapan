import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonConstant } from '../../shared/CommonConstant';
import { StoreService } from '../extra/firebase/StoreService.service';
import { LocalStorageService } from '../extra/localStorage/local-storage.service';
import { NGXToastrService } from '../extra/toastr/toastr.service';
import { SistemAdminComponent } from './admin/sistem-admin/sistem-admin.component';
import { TempatPenginapanDetailComponent } from './tempat-penginapan-detail/tempat-penginapan-detail.component';

@Component({
    selector: 'app-sistem-rekomendasi',
    templateUrl: './sistem-rekomendasi.component.html',
    styleUrl: './sistem-rekomendasi.component.css'
})
export class SistemRekomendasiComponent implements OnInit {
    @ViewChild(SistemAdminComponent) sistemAdminComponent: SistemAdminComponent;
    Mode: string = CommonConstant.MainMenu;

    UseLocalstorage: boolean = true;
    EnableLogOut: boolean = false;

    readonly ModeMainMenu = CommonConstant.MainMenu;
    readonly ModeSistemRekomendasi = CommonConstant.SistemRekomendasi;
    readonly ModeSetting = CommonConstant.Setting;
    readonly ModeAdminLogin = CommonConstant.AdminLogin;

    readonly KeyWeight = CommonConstant.KeyWeight;
    readonly KeyHistory = CommonConstant.KeyHistory;
    readonly KeyAdmin = CommonConstant.KeyAdmin;

    readonly WeightIncrease = CommonConstant.INC;
    readonly WeightDecrease = CommonConstant.DCR;

    readonly DSSAdd = CommonConstant.Add;
    readonly DSSEdit = CommonConstant.Edit;
    readonly DSSDelete = CommonConstant.Delete;

    ListDaerah: string[] = CommonConstant.ListDaerah.slice();
    ListJenis: string[] = CommonConstant.ListJenis.slice();

    settingWeight: number[] = [];

    currentWeight: number[] = [];

    ListTempatPenginapan: any[] = [];

    ListSortedResult: { Id: string, Nama: String, data: any, Score: number }[] = [];

    // Flags
    SettingIsChanged: boolean = false;

    UserForm = this.fb.group({
        HargaDari: [0, [Validators.required, Validators.min(0), Validators.max(999999999999999)]],
        HargaHingga: [999999999999999, [Validators.required, Validators.min(0), Validators.max(999999999999999)]],
        Daerah: ["", [Validators.required]],
        Jenis: [""]
    });

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

            let history = this.localStorage.getData(this.KeyHistory);

            if(history != null) {
                this.UserForm.patchValue({
                    HargaDari: JSON.parse(history)["HargaDari"],
                    HargaHingga: JSON.parse(history)["HargaHingga"],
                    Daerah: JSON.parse(history)["Daerah"],
                    Jenis: JSON.parse(history)["Jenis"]
                })
            } else {
                this.ResetSearch();
            }
        } else {
            this.ResetSearch();
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
                this.currentWeight = this.settingWeight.length == 5 ? this.settingWeight.slice() : [1, 1, 1, 1, 1];
            } else {
                return;
            }
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
    
            if(this.Mode.includes("Admin") == true) {
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

    ResetSearch() {
        this.UserForm.reset();
        this.UserForm.patchValue({
            HargaDari: 0,
            HargaHingga: 999999999999999,
            Daerah: "",
            Jenis: ""
        })
    }

    async UserSearch() {
        if(this.UserForm.get("HargaDari").value >= this.UserForm.get("HargaHingga").value) {
            this.toastr.warningMessage("Jarak harga yang dimasukkan tidak valid");
            return;
        }
        
        let result = await this.store.getListTempatPenginapanFilteredForUser(this.UserForm.get("HargaDari").value, this.UserForm.get("HargaHingga").value, this.UserForm.get("Daerah").value, this.UserForm.get("Jenis").value);

        if(result["HeaderObj"].StatusCode == "500") {
            this.toastr.errorMessage(result["HeaderObj"].Message);
            return;
        }

        this.ListTempatPenginapan = result["Data"].slice();

        this.ListSortedResult = [];

        // console.log(this.ListTempatPenginapan);

        if(this.UseLocalstorage == true) {
            let obj = {
                HargaDari: this.UserForm.get("HargaDari").value,
                HargaHingga: this.UserForm.get("HargaHingga").value,
                Daerah: this.UserForm.get("Daerah").value,
                Jenis: this.UserForm.get("Jenis").value
            }

            this.localStorage.saveData(this.KeyHistory, JSON.stringify(obj));
        }

        if(this.ListTempatPenginapan.length > 0) {
            this.CalculateTOPSIS();
        } else {
            this.toastr.warningMessage("Hasil pencarian tidak ditemukan");
            return;
        }
    }

    OpenDetail(i: number) {
        // console.log(this.ListSortedResult[i]);

        const modalDetail = this.modalService.open(TempatPenginapanDetailComponent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg' });
        modalDetail.componentInstance.TempatPenginapan = this.ListSortedResult[i].data;
    }

    //#region MCDM TOPSIS
    CalculateTOPSIS() {
        this.spinner.show();
        this.matriksNormalisasi();
    }

    matriksNormalisasi() {
        let x : number[] = [];

        let totalHarga = 0;
        let totalKebersihan = 0;
        let totalFasilitas = 0;
        let totalPelayanan = 0;
        let totalLokasi = 0;

        for(let i = 0; i < this.ListTempatPenginapan.length; i++) {
            totalHarga += Math.pow(this.ListTempatPenginapan[i].data.Harga, 2);
            totalKebersihan += Math.pow(this.ListTempatPenginapan[i].data.Kebersihan, 2);
            totalFasilitas += Math.pow(this.ListTempatPenginapan[i].data.Fasilitas, 2);
            totalPelayanan += Math.pow(this.ListTempatPenginapan[i].data.Pelayanan, 2);
            totalLokasi += Math.pow(this.ListTempatPenginapan[i].data.Lokasi, 2);
        }

        x["Harga"] = Math.sqrt(totalHarga);
        x["Kebersihan"] = Math.sqrt(totalKebersihan);
        x["Fasilitas"] = Math.sqrt(totalFasilitas);
        x["Pelayanan"] = Math.sqrt(totalPelayanan);
        x["Lokasi"] = Math.sqrt(totalLokasi);

        // console.log(x);


        let R: number[][] = []; // Matriks Ternomalisasi

        for(let i = 0; i < this.ListTempatPenginapan.length; i++) {
            let rValue : number[] = [];
            
            rValue.push(this.ListTempatPenginapan[i].data.Harga / x["Harga"]);
            rValue.push(this.ListTempatPenginapan[i].data.Kebersihan / x["Kebersihan"]);
            rValue.push(this.ListTempatPenginapan[i].data.Fasilitas / x["Fasilitas"]);
            rValue.push(this.ListTempatPenginapan[i].data.Pelayanan / x["Pelayanan"]);
            rValue.push(this.ListTempatPenginapan[i].data.Lokasi / x["Lokasi"]);

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

        // Kriteria Keuntungan (BENEFIT) = Kebersihan, Fasilitas, Pelayanan, Lokasi
        // Kriteria Kerugian (COST) = Harga

        let vHarga: number[] = [];
        let vKebersihan: number[] = [];
        let vFasilitas: number[] = [];
        let vPelayanan: number[] = [];
        let vLokasi: number[] = [];

        for(let i = 0; i < Y.length; i++) {
            vHarga.push(Y[i][0]);
            vKebersihan.push(Y[i][1]);
            vFasilitas.push(Y[i][2]);
            vPelayanan.push(Y[i][3]);
            vLokasi.push(Y[i][4]);
        }

        APlus.push(Math.min(...vHarga)); // Harga => COST
        APlus.push(Math.max(...vKebersihan)); // Kebersihan => BENEFIT
        APlus.push(Math.max(...vFasilitas)); // Fasilitas => BENEFIT
        APlus.push(Math.max(...vPelayanan)); // Pelayanan => BENEFIT
        APlus.push(Math.max(...vLokasi)); // Lokasi => BENEFIT

        AMin.push(Math.max(...vHarga)); // Harga => COST
        AMin.push(Math.min(...vKebersihan)); // Kebersihan => BENEFIT
        AMin.push(Math.min(...vFasilitas)); // Fasilitas => BENEFIT
        AMin.push(Math.min(...vPelayanan)); // Pelayanan => BENEFIT
        AMin.push(Math.min(...vLokasi)); // Lokasi => BENEFIT

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
        let V: { Id: string, Nama: String, data: any, Score: number }[] = [];

        for(let i = 0; i < this.ListTempatPenginapan.length; i++) {
            V.push({
                Id: this.ListTempatPenginapan[i].id,
                Nama : this.ListTempatPenginapan[i].data.Nama,
                data: this.ListTempatPenginapan[i].data,
                Score : DMin[i] / (DMin[i] + DPlus[i])
            })
        }

        // console.log(V);

        this.sortNilaiPreferensi(V);
    }

    sortNilaiPreferensi(V: { Id: string, Nama: String, data: any, Score: number }[]) {
        this.ListSortedResult = this.mergeSort(V);

        // console.log(this.ListSortedResult);

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
    //#endregion
}
