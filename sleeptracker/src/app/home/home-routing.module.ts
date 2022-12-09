import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
/*     path: '',
    component: HomePage, */
    path: 'home',
    component: HomePage,
    children: [
      {
        path:'logging',
        loadChildren: () => import('../logging/logging.module').then(m=>m.LoggingPageModule)
      },
      {
        path:'sleepiness',
        loadChildren: () => import('../sleepiness/sleepiness.module').then(m=>m.SleepinessPageModule)
      },
      {
        path:'history',
        loadChildren: () => import('../history/history.module').then(m=>m.HistoryPageModule)
      },
      {
        path:'analytics',
        loadChildren: () => import('../analytics/analytics.module').then(m=>m.AnalyticsPageModule)
      },
      {
        path: '',
        redirectTo: '/home/logging',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'home/logging',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
