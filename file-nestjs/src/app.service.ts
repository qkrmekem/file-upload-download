import { Injectable } from '@nestjs/common';
import { createWriteStream, mkdirSync, readdirSync } from 'fs';

@Injectable()
export class AppService {
  dirPath: string; // 디렉토리 경로
  constructor(){
    this.dirPath = `${__dirname}/../../uploads`;
    
    this.mkdir();
  }
  // 파일 업로드 시도 시 지정한 파일이 경로에 존재하지 않을 경우 폴더 생성
  mkdir(){
    try{
      readdirSync(this.dirPath);
    }catch(err){
      mkdirSync(this.dirPath);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  uploadFile(file: Express.Multer.File){
    // const original = file.fieldname;
    console.log('서비스에서 찍음', file);
    // 파일 이름이 한글인 경우 인코딩이 깨지는 위험이 있으므로 인코딩을 따로 설정
    const original = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const filePath = `${this.dirPath}/${original}`;

    const writeStream = createWriteStream(filePath);

    // writeStream의 경우 콜백을 이용해 파일 업로드 성공 여부를 확인할 수 있음
    writeStream.write(file.buffer, (err) => {
      if (err) {
        console.error('파일 쓰기 중 오류 발생:', err);
      } else {
        console.log('파일 저장 완료:', filePath);
      }
    });
    writeStream.end();
  }
}
