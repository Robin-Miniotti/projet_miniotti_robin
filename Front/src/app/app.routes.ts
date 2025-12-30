import type { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full'
	},
	{
		path: 'login',
		loadChildren: () => import('./user/user.module').then(m => m.UserModule)
	},
	{
		path: 'pollutions',
		loadChildren: () => import('./pollutions/pollutions.module').then(m => m.PollutionsModule)
	}
];