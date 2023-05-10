import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { persistState } from '@datorama/akita';
import { AppModule } from './app/app.module';

const storage = persistState();

const providers = [{ provide: 'persistStorage', useValue: storage }];

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
