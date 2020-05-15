import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../home.service';

@Component({
    selector: 'app-video-admin',
    templateUrl: 'video-admin.component.html',
    styleUrls: ['./video-admin.component.scss']
})

export class VideoAdminComponent implements OnInit {

    public videoForm: FormGroup;
    @Output() public close = new EventEmitter<any>();
    public content;

    constructor(
        public fb: FormBuilder,
        public homeService: HomeService
    ) { }

    ngOnInit() {
        this.homeService.getPreviewVideo().subscribe(
            data => {
                this.content = data;
                if (this.content) {
                    this.createForm(this.content);
                }
            },
            err => console.log(err)
        );
    }

    createForm(form) {

        this.videoForm = this.fb.group({
            name: [form.name, Validators.required ],
            link: [form.link, Validators.required ],
            show: [form.show, Validators.required ]
        });
    }

    showButton(ev) {
        let isCheck = ev.target.checked;

        console.log(isCheck);
        console.log(this.videoForm.controls['show']);
        // isCheck ? this.videoForm.patchValue({show: true }) : '';
    }

    save(form) {

        this.homeService.updatePreviewVideo(form.value).subscribe(
            data => this.close.emit(data)
        );
    }
}
