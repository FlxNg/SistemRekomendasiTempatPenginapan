import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-sistem-admin',
  templateUrl: './sistem-admin.component.html'
})
export class SistemAdminComponent implements OnInit {
  Mode: string = CommonConstant.AdminLogin;

  AdminLoggedIn: boolean = false;
  IncorrectAuthentication: boolean = false;

  ListTempatPenginapanOriginal: any[] = [];

  ListTempatPenginapanForView: any[] = [];
  
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
      this.Mode = this.ModeAdminMain;
      this.getListTempatPenginapan();
    }
  }

  ChangeMenuHandler(menu: string) {
    if(this.Mode == menu) {
      return;
   }

    this.Mode = menu;

    if(this.Mode == this.ModeAdminMain) {
      this.getListTempatPenginapan();
    }
  }

  async getListTempatPenginapan() {
    let result = await this.store.getAllTempatPenginapan();

    if(result.StatusCode == "500") {
      this.toastr.errorMessage(result.Message);
      return;
    }
    
    this.ListTempatPenginapanOriginal = result["Data"];
    this.ListTempatPenginapanForView = result["Data"];
  }

  async LoginAdmin() {
    let username = this.FormLogin.get("username").value;
    let password = CryptoJS.SHA256(this.FormLogin.get("password").value).toString();

    let result = await this.store.authenticateAdmin(username, password);

    if(result.StatusCode == "500") {
      this.toastr.errorMessage(result.Message);
      return;
    }

    if(result["Data"].length > 0) {
      this.cookieService.set(this.KeyAdmin, CryptoJS.SHA256("true").toString());
      this.ChangeMenuHandler(this.ModeAdminMain);
    } else {
      this.IncorrectAuthentication = true;
    }
  }


  TempatPenginapanHandler(mode: string, index: number = 0) {

  }

  BackToUser() {
    this.router.navigate([""]);
  }
}
