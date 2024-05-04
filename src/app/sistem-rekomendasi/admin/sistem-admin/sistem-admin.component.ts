import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NGXToastrService } from '../../../extra/toastr/toastr.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from '../../../extra/localStorage/local-storage.service';
import { StoreService } from '../../../extra/firebase/StoreService.service';
import { CommonConstant } from '../../../../shared/CommonConstant';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
import { SistemAdminFormComponent } from '../sistem-admin-form/sistem-admin-form.component';

@Component({
  selector: 'app-sistem-admin',
  templateUrl: './sistem-admin.component.html'
})
export class SistemAdminComponent implements OnInit {
  @Input() Mode: string = CommonConstant.AdminLogin;
  @Output() LoginStat: EventEmitter<any> = new EventEmitter();
 
  AdminLoggedIn: boolean = false;
  IncorrectAuthentication: boolean = false;

  ListTempatPenginapanOriginal: any[] = [];
  ListTempatPenginapanView: any[] = [];

  ListDaerah: string[] = CommonConstant.ListDaerah.slice();
  ListJenis: string[] = CommonConstant.ListJenis.slice();

  SearchName: string = "";
  FilterDaerah: string = "";
  FilterJenis: string = "";
  
  readonly ModeAdminLogin = CommonConstant.AdminLogin;
  readonly ModeAdminMain = CommonConstant.AdminMain;

  readonly KeyAdmin = CommonConstant.KeyAdmin;

  readonly FormAdd = CommonConstant.Add;
  readonly FormEdit = CommonConstant.Edit;
  readonly FormDelete = CommonConstant.Delete;

  FormLogin = this.fb.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]]
  });

  constructor(private toastr: NGXToastrService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private localStorage: LocalStorageService,
    private store: StoreService,
    private router: Router,
    private cookieService: CookieService
  ) {
      
  }

  ngOnInit(): void {
    this.FormLogin.patchValue({
      username: "",
      password: ""
    });
    this.IncorrectAuthentication = false;
    let loginStatus = this.cookieService.get(this.KeyAdmin);
    
    if(loginStatus == CryptoJS.SHA256("true").toString()) {
      this.ChangeMenuHandler(this.ModeAdminMain);
    }
  }

  ChangeMenuHandler(menu: string) {
    if(this.Mode == menu) {
      return;
   }

    this.Mode = menu;

    if(this.Mode == this.ModeAdminMain) {
      this.FilterTempatPenginapan();
    }
  }

  async getListTempatPenginapan() {
    let result = await this.store.getAllTempatPenginapan();

    if(result["HeaderObj"].StatusCode == "500") {
      this.toastr.errorMessage(result["HeaderObj"].Message);
      return;
    }
    
    this.ListTempatPenginapanOriginal = result["Data"].slice();
    this.ListTempatPenginapanView = result["Data"].slice();
  }

  async FilterTempatPenginapan() {
    this.SearchName = "";
    if(this.FilterDaerah == "" && this.FilterJenis == "") {
      await this.getListTempatPenginapan();

      return;
    }

    let result = await this.store.getTempatPenginapanFilteredForAdmin(this.FilterDaerah, this.FilterJenis);

    if(result["HeaderObj"].StatusCode == "500") {
      this.toastr.errorMessage(result["HeaderObj"].Message);
      return;
    }

    this.ListTempatPenginapanOriginal = result["Data"].slice();
    this.ListTempatPenginapanView = result["Data"].slice();
  }

  SearchNamaPenginapan() {
    if(this.SearchName.trim() == "") {
      this.ListTempatPenginapanView = this.ListTempatPenginapanOriginal.slice();
      return;
    }

    this.ListTempatPenginapanView = this.ListTempatPenginapanOriginal.filter(x => x.data.Nama.toLowerCase().includes(this.SearchName.trim().toLowerCase())).slice();
  }

  async LoginAdmin() {
    let username = this.FormLogin.get("username").value;
    let password = CryptoJS.SHA256(this.FormLogin.get("password").value).toString();

    let result = await this.store.authenticateAdmin(username, password);

    if(result["HeaderObj"].StatusCode == "500") {
      this.toastr.errorMessage(result["HeaderObj"].Message);
      return;
    }

    if(result["Data"].length > 0) {
      this.cookieService.set(this.KeyAdmin, CryptoJS.SHA256("true").toString());
      this.ChangeMenuHandler(this.ModeAdminMain);
      this.LoginStat.emit(true);
    } else {
      this.IncorrectAuthentication = true;
    }
  }

  TempatPenginapanHandler(Mode: string, index: string = "", data: any = null) {
    
    const modalDSS = this.modalService.open(SistemAdminFormComponent, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, centered: true, size: 'lg' });
    modalDSS.componentInstance.Mode = Mode;
    modalDSS.componentInstance.DataId = Mode == this.FormEdit ? index : "";
    modalDSS.componentInstance.DataDetail = Mode == this.FormEdit ? data : null;

    modalDSS.result.then(
      (response) => {
        this.FilterTempatPenginapan();
      }
    ).catch(
      (error) => {
        if (error != 0) {
          console.log(error);
        }
      }
    );
  }

  async DeleteTempatPenginapan(index: string = "") {
    if(confirm(CommonConstant.CONFIRM_ADMIN_DELETE) == true) {
      if(confirm(CommonConstant.RECONFIRM_ADMIN_DELETE) == true) {
        await this.store.deleteTempatPenginapan(index);
        this.FilterTempatPenginapan();
      }
    }
  }

  BackToUser() {
    this.router.navigate([""]);
  }
}
