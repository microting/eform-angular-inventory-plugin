import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FileUploader} from 'ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from 'src/app/common/services';
import {LoaderService} from 'src/app/common/services/loeader.service';

@Component({
  selector: 'app-item-type-images',
  templateUrl: './item-type-images.component.html',
  styleUrls: ['./item-type-images.component.scss']
})
export class ItemTypeImagesComponent implements OnInit {
  @Input() uploadedImageNames: string[];
  @Input() processedImages: any[];
  @Input() apiURL = '';
  @ViewChild('imagesFileUploader', { static: false }) xlsxPlannings: ElementRef;
  @Output() fileUploader: EventEmitter<FileUploader> = new EventEmitter<FileUploader>();
  imagesFileUploader: FileUploader = new FileUploader({
    url: this.apiURL,
    authToken: this.authService.bearerToken,
  });

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.imagesFileUploader.onSuccessItem = (item, response) => {
      this.loaderService.isLoading.next(false);
    };
    this.imagesFileUploader.onErrorItem = () => {
      this.imagesFileUploader.clearQueue();
      this.toastrService.error(
        this.translateService.instant('Error while uploading pictures')
      );
    };
  }

  // uploadExcelPlanningsFile() {
  //   this.imagesFileUploader.queue[0].upload();
  //   this.loaderService.isLoading.next(true);
  // }

  excelPlanningsModal() {
    this.imagesFileUploader.clearQueue();
  }
}
