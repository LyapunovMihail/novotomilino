import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'myBitNumberPipe'
})

export class BitNumberPipe implements PipeTransform  {

   constructor(private _sanitizer: DomSanitizer) {}

   toNumber ( val ) {
       if (String(val) && String(val).length > 0) {
            return Number(String(val).replace(/[^.0-9]/gim, ''));
        } else {
            return val;
        }
   }

   transform( val: any, arg?: number ): SafeHtml {
        if (val && String(val).length > 0) {
            return String(this.toNumber(val).toFixed(arg == null ? 2 : arg)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        } else {
            return val;
        }
   }
}
