import type { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";

export const routes: Routes = [
	{
		path: 'login',
		loadChildren: () => import('./user/user.module').then(m => m.UserModule)
	},
	{
		path: 'pollutions',
		loadChildren: () => import('./pollutions/pollutions.module').then(m => m.PollutionsModule)
	},
	{
		path: '',
		redirectTo: 'pollutions',
		pathMatch: 'full'
	}	
];