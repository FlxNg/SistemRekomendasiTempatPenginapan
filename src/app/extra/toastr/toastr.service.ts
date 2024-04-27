
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
// import { ClipboardService } from 'ngx-clipboard';

@Injectable()
export class NGXToastrService {
    constructor(public toastr: ToastrService) { }

    // Success Type
    typeSuccess() {
        this.toastr.success('You are awesome!', 'Success!');
    }

    // Success Type
    typeInfo() {
        this.toastr.info('We do have the Kapua suite available.', 'Turtle Bay Resort');
    }

    // Success Type
    typeWarning() {
        this.toastr.warning('My name is Inigo Montoya. You killed my father, prepare to die!');
    }

    // Success Type
    typeError() {
        this.toastr.error('there is an internal error', 'Failed!');
    }

    // Custom Type
    typeCustom() {
        this.toastr.success('<span style="color: red">Message in red.</span>', null, { enableHtml: true });
    }

    //Progress bar
    progressBar() {
        this.toastr.info('We do have the Kapua suite available.', 'Turtle Bay Resort', { "progressBar": true });
    }

    // Timeout
    timeout() {
        this.toastr.error('I do not think that word means what you think it means.', 'Timeout!', { "timeOut": 5000 });
    }


    //Dismiss toastr on Click
    dismissToastOnClick() {
        this.toastr.info('We do have the Kapua suite available.', 'Turtle Bay Resort', { "tapToDismiss": true });
    }
    // Remove current toasts using animation
    clearToast() {
        this.toastr.clear()
    }

    // Show close button
    showCloseButton() {
        this.toastr.info('Have fun storming the castle!', 'Miracle Max Says', { closeButton: true });
    }
    // Enable  HTML
    enableHtml() {
        this.toastr.info('<i>Have fun <b>storming</b> the castle!</i>', 'Miracle Max Says', { enableHtml: true });
    }
    // Title Class
    titleClass() {
        this.toastr.info('Have fun storming the castle!', 'Miracle Max Says', { titleClass: 'h3' });
    }
    // Message Class
    messageClass() {
        this.toastr.info('Have fun storming the castle!', 'Miracle Max Says', { messageClass: 'text-uppercase' });
    }

    errorMessage(msg) {
        this.toastr.error(msg);
    }

    warningMessage(msg) {
        this.toastr.warning(msg);
    }

    infoMessageTitle(title,msg)
    {
        this.toastr.info(msg,title);
    }

    errorMessageTitle(title,msg) {
        this.toastr.error(msg,title);
    }

    typeSave(msg) {
      this.toastr.success(msg);
    }

    typeErrorCustom(msg) {
      this.toastr.error(msg);
    }

    successMessage(msg) {
        this.toastr.success(msg, 'Success!');
    }

    successMessageTitle(title,message)
    {
        //this.toastr.info(message,title);
        this.toastr.success(message,title);
    }

    errorAPI(status, reason) {
        this.toastr.error(reason, 'Status: ' + status, { "tapToDismiss": true});   
    }

    // typeErrorCopyOnClick(msg, status){
    //     const toastr = this.toastr.error(msg, status, { "tapToDismiss": false, "timeOut": 7000, "closeButton": true, "extendedTimeOut": 5000 });
    //     toastr.onTap.subscribe(() => {
    //         this.clipboard.copyFromContent(msg);
    //     });
    // }
}
