import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonConstant } from '../../../shared/CommonConstant';

@Component({
    selector: 'app-tempat-penginapan-detail',
    templateUrl: './tempat-penginapan-detail.component.html'
})
export class TempatPenginapanDetailComponent {
    @Input() TempatPenginapan: any;

    readonly MapURL = CommonConstant.MapURL;

    constructor(
        public activeModal: NgbActiveModal
    ) {

    }


}
