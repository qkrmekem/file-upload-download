import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FileuploadService } from './fileupload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css'
})
export class UploadFilesComponent implements OnInit {
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  fileInfos?:any;

  constructor(private uploadService: FileuploadService){}

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles().pipe(map(d => {
      console.log('응답값 ', d);
      return d;
    }));
  }

  selectFiles(event): void{
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    console.log('이벤트 = ', event.target.files);
    
  }

  uploadFiles():void{
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++){
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File){
    console.log(`file =`,file);
    
    this.progressInfos[idx] = {value: 0, fileName: file.size};

    if(file){
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          if(event.type === HttpEventType.UploadProgress){
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          }else if (event instanceof HttpResponse){
            const msg = '파일 업로드 성공 : ' + file.name;
            this.message.push(msg);
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          this.progressInfos[idx].value = 0;
          const msg = '파일 업로드 실패 ' + file.name;
          this.message.push(msg);
          this.fileInfos = this.uploadService.getFiles();
        }
      })
    }
  }

}
