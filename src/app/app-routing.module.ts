import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigGeneratorComponent } from './containers/config-generator/config-generator.component';
import { ConfigPlaygroundComponent } from './containers/config-playground/config-playgroud.component';

const routes: Routes = [
  { path: 'playground', component: ConfigPlaygroundComponent },
  { path: 'generator', component: ConfigGeneratorComponent },
  { path: '**', redirectTo: 'playground'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
