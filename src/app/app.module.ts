import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { NGXToastrService } from './extra/toastr/toastr.service';
import { LocalStorageService } from './extra/localStorage/local-storage.service';
import { SistemRekomendasiComponent } from './sistem-rekomendasi/sistem-rekomendasi.component';
import { TempatPenginapanFormComponent } from './sistem-rekomendasi/tempat-penginapan-form/tempat-penginapan-form.component';
import { NgxCurrencyDirective, NgxCurrencyInputMode, provideEnvironmentNgxCurrency } from 'ngx-currency';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SistemRekomendasiComponent,
    TempatPenginapanFormComponent
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
    NgbModule
  ],
  providers: [
    NGXToastrService,
    LocalStorageService,
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