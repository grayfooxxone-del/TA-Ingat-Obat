import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return `
      <html>
        <head>
          <title>TA Ingat Obat API</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .btn { display: inline-block; padding: 15px 30px; font-size: 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px; }
            .btn:hover { background-color: #0056b3; }
          </style>
        </head>
        <body>
          <h1>API TA Ingat Obat Berhasil Berjalan!</h1>
          <p>Server Backend telah aktif dan terhubung ke Database & Firebase.</p>
          <br/>
          <a href="/public/update.apk" class="btn">Unduh Aplikasi (APK)</a>
        </body>
      </html>
    `;
  }
}
