import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {registerLicense} from '@syncfusion/ej2-base';

registerLicense('ORg4AjUWIQA/Gnt2UFhhQlJBfVtdXGZWfFN0QXNcdV13flBEcC0sT3RfQFljSn9bdkFhXHpcdnxQRQ==');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
