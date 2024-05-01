import { Injectable } from '@angular/core';
import { Firestore, QueryConstraint, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from '@angular/fire/firestore';
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
    
            let result: any[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }));

            console.log({
                "HeaderObj": CommonConstant.SuccessAPI,
                "Data": result.slice()
            });
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

            this.spinner.hide();
            return {
                "HeaderObj": CommonConstant.SuccessAPI,
                "Data": result.slice()
            };
        } catch(e) {
            console.log(e);
            this.spinner.hide();
            return {
                "HeaderObj": CommonConstant.FailedAPI,
                "Data": []
            };
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

            this.spinner.hide();
            return {
                "HeaderObj": CommonConstant.SuccessAPI,
                "Data": result.slice()
            };
        } catch(e) {
            console.log(e);
            this.spinner.hide();
            return {
                "HeaderObj": CommonConstant.FailedAPI,
                "Data": []
            };
        }
    }

    async addTempatPenginapan(req: any) {
        this.spinner.show();
        try {
            await addDoc(collection(this.db, "accomodation"), req);

            this.spinner.hide();
            return {
                "HeaderObj": CommonConstant.SuccessAPI,
                "Data": []
            };
        } catch(e) {
            console.log(e);
            this.spinner.hide();
            return {
                "HeaderObj": CommonConstant.FailedAPI,
                "Data": []
            };
        }
    }

    async editTempatPenginapan(id: string, req: any) {
        this.spinner.show();
        try {
            let accomDetail = doc(this.db, "accomodation/" + id);

            await updateDoc(accomDetail, req);

            this.spinner.hide();
            return {
                "HeaderObj": CommonConstant.SuccessAPI,
                "Data": []
            };
        } catch(e) {
            console.log(e);
            this.spinner.hide();
            return {
                "HeaderObj": CommonConstant.FailedAPI,
                "Data": []
            };
        }
    }
}