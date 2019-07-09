import { UploadItem } from 'angular2-http-file-upload';

export class HomePlacesAdminUpload extends UploadItem {
   constructor( urlPath: string, file: any, type, id? ) {
        super();
        this.url = urlPath;
        this.headers = { token: sessionStorage.getItem('token'), type };
        if (id) {
            this.headers.id = id;
        }
        this.file = file;
   }
}
