import { Routes } from '@angular/router';
import { LoginComponent } from './features/pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
// import { LoginComponent } from '../pages/login/login.component';

export const routes: Routes = [


    {
        path:'',redirectTo:'login',pathMatch:'full'
    },
    {
        path:'login',component:LoginComponent
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./features/components/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
        // canActivate:[authGuard]
    },
    {
    path: '**',
    redirectTo: 'login'
  }
   

];
