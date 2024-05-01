import { Injectable } from '@angular/core';
import { Firestore, QueryConstraint, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGXToastrService } from '../toastr/toastr.service';
import { CommonConstant } from '../../../shared/CommonConstant';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
    db = getFirestore();

    constructor(private fs: Firestore,
        private toastr: NGXToastrService,
        private spinner: NgxSpinnerService,) {

    }

    async getAllItem() {
        try {
            let itemQuery = query(collection(this.db, "items"));
            let querySnapshot = await getDocs(itemQuery);
    
            // let itemsDetail: any[] = 
    
            console.log(querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            })));
        } catch(e) {
            console.log(e);
        }
    }

    async getItemById(id: number) {
        try {
            let item = doc(this.db, "items/" + 1);

            console.log((await getDoc(item)).data());
        } catch(e) {
            console.log(e);
        }
    }

    async addNewAdmin(username: string, password: string) {
        this.spinner.show();
        try {
            let adminDetail = await addDoc(collection(this.db, "admin"), {
                username: username,
                password: password
            });
            this.spinner.hide();
        } catch(e) {
            console.log(e);
            this.spinner.hide();
        }
    }

    async authenticateAdmin(username: string, password: string) {
        this.spinner.show();
        try {
            let adminQuery = query(collection(this.db, "admin"), where("username", "==", username), where("password", "==", password));
            let querySnapshot = await getDocs(adminQuery);

            let result: any[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }));

            let dataToReturn = CommonConstant.SuccessAPIWithData;

            dataToReturn.Data = result;

            this.spinner.hide();
            return dataToReturn;
        } catch(e) {
            console.log(e);
            this.spinner.hide();
            return CommonConstant.FailedAPI;
        }
    }

    async getAllTempatPenginapan() {
        this.spinner.show();
        try {
            let itemQuery = query(collection(this.db, "accomodation"));
            let querySnapshot = await getDocs(itemQuery);

            let result: any[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }));

            let dataToReturn = CommonConstant.SuccessAPIWithData;

            dataToReturn.Data = result;

            this.spinner.hide();
            return dataToReturn;
        } catch(e) {
            console.log(e);
            this.spinner.hide();
            return CommonConstant.FailedAPI;
        }
    }
}