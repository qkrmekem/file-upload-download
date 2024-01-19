import { Controller, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, Res, StreamableFile, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream, readdir, promises } from 'fs';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('getHello 응답 들어옴');
    
    return "this.appService.getHello()";
  }

  /* pipe
  @UploadedFile(
  new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'jpeg',
    })
    .addMaxSizeValidator({
      maxSize: 1000
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
)
  */

  // 파일 하나만 업로드 시
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(
    // new ParseFilePipe({
    //   validators: [
    //     new MaxFileSizeValidator({maxSize: Infinity}),
    //     // new FileTypeValidator({ fileType: })
    //   ]
    // })
  ) file: Express.Multer.File){
    console.log('uploadFile 들어옴');
    this.appService.uploadFile(file);
  }

  // 여러 파일을 업로드 시
  @Post('/multi')
  @UseInterceptors(FilesInterceptor('file'))
  uploadMultiFile(@UploadedFiles() file: Array<Express.Multer.File>){
    console.log('멀티 파일 호출됨');
    
    console.log(file);
    for(const one of file){
      this.appService.uploadFile(one);
    }
    return {message: '응답은 됨'};
  }

  @Get('/files')
  async getFileList(){
    const filePath = join(`${__dirname}/../../uploads`);
    const fileLIst = [];
    const reulst = await promises.readdir(filePath)
    return reulst;
  }

  @Get('/file')
  getFile(@Res({passthrough: true}) res: Response): StreamableFile{
    const fileName = 'AI 데스크_포르쉐_프론트_추가 (2).pdf';
    const filePath = join(`${__dirname}/../../uploads`, fileName);
    const file = createReadStream(filePath);

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURI(fileName)}"`);
    return new StreamableFile(file);
  }

  
}
