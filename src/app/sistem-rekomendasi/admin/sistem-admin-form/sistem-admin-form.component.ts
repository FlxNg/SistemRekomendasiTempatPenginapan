import { Component, Input, OnInit } from '@angular/core';
import { NGXToastrService } from '../../../extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from '../../../../shared/CommonConstant';
import { StoreService } from '../../../extra/firebase/StoreService.service';

@Component({
  selector: 'app-sistem-admin-form',
  templateUrl: './sistem-admin-form.component.html'
})
export class SistemAdminFormComponent implements OnInit {
  @Input() Mode: string;
  @Input() DataId: string = "";
  @Input() DataDetail: any = null;

  readonly FormAdd = CommonConstant.Add;
  readonly FormEdit = CommonConstant.Edit;
  readonly FormDelete = CommonConstant.Delete;

  ImageUploaded: boolean = false;
  // ImageData: any;
  ImageString: any;

  ListDaerah: string[] = CommonConstant.ListDaerah.slice();
  ListJenis: string[] = CommonConstant.ListJenis.slice();

  AccomForm = this.fb.group({
    Nama: ["", Validators.required],
    Alamat: ["", Validators.required],
    Tentang: ["", Validators.required],
    Website: ["", Validators.required],
    Daerah: ["", Validators.required],
    Jenis: ["", Validators.required],
    Harga: [0, [Validators.required, Validators.min(1), Validators.max(999999999999999)]],
    Kebersihan: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    Fasilitas: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    Pelayanan: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    Lokasi: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    File64: ["", Validators.required]
  });

  constructor(private toastr: NGXToastrService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private store: StoreService,
    public activeModal: NgbActiveModal
  ) {

  }

  ngOnInit(): void {
    this.AccomForm.patchValue({
      Nama: "",
      Alamat: "",
      Tentang: "",
      Website: "",
      Daerah: "",
      Jenis: "",
      Harga: 0,
      Kebersihan: 0,
      Fasilitas: 0,
      Pelayanan: 0,
      Lokasi: 0,
      File64: "",
    });

    if(this.Mode == this.FormEdit) {
      this.AccomForm.patchValue({
        Nama: this.DataDetail.Nama,
        Alamat: this.DataDetail.Alamat,
        Tentang: this.DataDetail.Tentang,
        Website: this.DataDetail.Website,
        Daerah: this.DataDetail.Daerah,
        Jenis: this.DataDetail.Jenis,
        Harga: this.DataDetail.Harga,
        Kebersihan: this.DataDetail.Kebersihan,
        Fasilitas: this.DataDetail.Fasilitas,
        Pelayanan: this.DataDetail.Pelayanan,
        Lokasi: this.DataDetail.Lokasi,
        File64: this.DataDetail.File64
      });

      this.ImageString = this.DataDetail.File64;
      this.ImageUploaded = true;
    }
  }

  NumberMinMaxHandler(formName: string) {
    if(this.AccomForm.get(formName).value < 0) {
        this.AccomForm.get(formName).setValue(0);
        return;
    }

    if(this.AccomForm.get(formName).value > 5) {
        this.AccomForm.get(formName).setValue(5);
    }
  }

  async setDocFile(event) {
    if(event.target.files.length > 0) {
      this.spinner.show();

      let selectedFile: File = event.target.files[0];
  
      let base64 = await this.imageToBase64(selectedFile);
  
      this.ImageString = base64.toString();

      this.AccomForm.get("File64").setValue(this.ImageString);
  
      // this.ImageData = await this.base64ToImage(base64.toString());
  
      // console.log(this.ImageData);
  
      this.ImageUploaded = true;
  
      this.spinner.hide();
    }
  }

  // getFileTypeFromBase64(base64String: string): string | null {
  //   const header = base64String.substring(0, 30);

  //   const imagePrefixes = {
  //     '/9j/': '.jpeg',
  //     'iVBORw0K': '.png',
  //     'R0lGOD': '.gif',
  //     'UEsDBB': '.webp',
  //     'SUkqAA': '.bmp'
  //   };

  //   for (const prefix in imagePrefixes) {
  //     if (header.includes(prefix)) {
  //       return imagePrefixes[prefix];
  //     }
  //   }

  //   return null;
  // }

  imageToBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // base64ToImage(base64String: string): Promise<HTMLImageElement> {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       resolve(img);
  //     };
  //     img.onerror = error => reject(error);
  //     img.src = base64String;
  //   });
  // }

  Check() {
    console.log(this.AccomForm);
    console.log(this.AccomForm.getRawValue());
  }

  async Save() {
    let obj = this.AccomForm.getRawValue();

    let result: any;

    if(this.Mode == this.FormAdd) {
      result = await this.store.addTempatPenginapan(obj);
    } else if(this.Mode == this.FormEdit) {
      result = await this.store.editTempatPenginapan(this.DataId, obj);
    }

    if(result["HeaderObj"].StatusCode == "200") {
      this.toastr.successMessage(result["HeaderObj"].Message);
      this.activeModal.close(result);
      return;
    } 
    
    if(result["HeaderObj"].StatusCode == "500") {
      this.toastr.errorMessage(result["HeaderObj"].Message);
      return;
    }
  }
}
