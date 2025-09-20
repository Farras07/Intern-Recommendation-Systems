import fs from 'fs';
import { drive, drive as driveType } from '@/lib/gapi';
// import { Readable } from "stream";

export default class DriveServices {
  _drive: typeof driveType;
  constructor(drive: typeof driveType) {
    this._drive = drive;
  }
  async pushFile(file: File) {
    try {
      console.log('Uploading:', file.name);

      // const folderId = process.env.NEXT_PUBLIC_FOLDERID;

      const fileMetadata = {
        name: file.name,
        //   parents: [folderId],
        fields: 'id',
      };

      // const arrayBuffer = await file.arrayBuffer();
      // const buffer = Buffer.from(arrayBuffer);

      const media = {
        mimeType: file.type,
        body: fs.createReadStream(
          'dampak-kecerdasan-buatan-bagi-pendidikan2.pdf',
        ),
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
      });

      console.log('✅ File uploaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Upload failed:', error);
      throw error;
    }
  }
}
