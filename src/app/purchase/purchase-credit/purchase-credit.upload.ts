import { UploadItem } from 'angular2-http-file-upload';

export class PurchaseCreditUpload extends UploadItem {
   constructor(file: any, id: any) {
       super();
       this.url = '/api/admin/credit/image';
       this.headers = { token: sessionStorage.getItem('token'), id };
       this.file = file;
   }
}
