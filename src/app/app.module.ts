import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxCurrencyDirective, NgxCurrencyInputMode, provideEnvironmentNgxCurrency } from 'ngx-currency';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreService } from './extra/firebase/StoreService.service';
import { LocalStorageService } from './extra/localStorage/local-storage.service';
import { NGXToastrService } from './extra/toastr/toastr.service';
import { SistemAdminFormComponent } from './sistem-rekomendasi/admin/sistem-admin-form/sistem-admin-form.component';
import { SistemAdminComponent } from './sistem-rekomendasi/admin/sistem-admin/sistem-admin.component';
import { SistemRekomendasiComponent } from './sistem-rekomendasi/sistem-rekomendasi.component';
import { TempatPenginapanDetailComponent } from './sistem-rekomendasi/tempat-penginapan-detail/tempat-penginapan-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SistemRekomendasiComponent,
    SistemAdminComponent,
    SistemAdminFormComponent,
    TempatPenginapanDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgxCurrencyDirective,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    
    NgbModule,
    provideFirebaseApp(() => initializeApp({"projectId":"dss-tempat-penginapan","appId":"1:483851397372:web:4e8ee966806d568b88cf79","databaseURL":"https://dss-tempat-penginapan-default-rtdb.asia-southeast1.firebasedatabase.app","storageBucket":"dss-tempat-penginapan.appspot.com","apiKey":"AIzaSyBSXduqki84tokjyKrsrJHVD2yTPeEGNwE","authDomain":"dss-tempat-penginapan.firebaseapp.com","messagingSenderId":"483851397372","measurementId":"G-G7Z8Q5XC9Y"})),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions())
  ],
  providers: [
    NGXToastrService,
    LocalStorageService,
    StoreService,
    CookieService,
    provideEnvironmentNgxCurrency({
      align: "right",
      allowNegative: false,
      allowZero: true,
      decimal: ".",
      precision: 2,
      prefix: "",
      suffix: "",
      thousands: ",",
      nullable: false,
      min: 0,
      max: 999999999999999,
      inputMode: NgxCurrencyInputMode.Natural,
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }