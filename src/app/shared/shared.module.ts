import { NgModule } from '@angular/core';
import { BoldPipe } from './pipes/interpolation-bold.pipe';

@NgModule({
  declarations: [BoldPipe],
  exports: [BoldPipe],
})
export class SharedModule {}
