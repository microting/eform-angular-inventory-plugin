import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GalleryComponent, GalleryItem } from '@ngx-gallery/core';
import { Lightbox } from '@ngx-gallery/lightbox';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Observable, Subscription } from 'rxjs';
import { TemplateFilesService } from 'src/app/common/services';

@AutoUnsubscribe()
@Component({
  selector: 'app-item-type-images-modal',
  templateUrl: './item-type-images-modal.component.html',
  styleUrls: ['./item-type-images-modal.component.scss'],
})
export class ItemTypeImagesModalComponent implements OnInit, OnDestroy {
  @ViewChild('frame', { static: false }) frame;
  @ViewChild(GalleryComponent) gallery: GalleryComponent;
  title = '';
  imageSub$: Subscription;
  images$: Observable<GalleryItem[]>;
  galleryImages: GalleryItem[] = [];

  constructor(
    private imageService: TemplateFilesService,
    public lightbox: Lightbox
  ) {}

  ngOnInit(): void {}

  show(model: { images: string[]; isPictogram: boolean }) {
    this.composeGallery(model.images);
    model.isPictogram
      ? (this.title = 'Pictogram images')
      : (this.title = 'Danger label images');
    this.frame.show();
  }

  composeGallery(images: string[]) {
    this.gallery.reset();
    images.forEach((value) => {
      this.imageSub$ = this.imageService.getImage(value).subscribe((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        this.gallery.addImage({ src: imageUrl, thumb: imageUrl });
      });
    });
  }

  ngOnDestroy() {}
}
