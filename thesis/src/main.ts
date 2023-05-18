import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { txPersistStorage } from "./app/services/tx/tx-state.store";
import { conditionsPersistStorage } from "./app/services/conditions/conditions.state";

const providers = [
  { provide: 'persistStorage', useValue: txPersistStorage },
  { provide: 'persistStorage', useValue: conditionsPersistStorage },
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
