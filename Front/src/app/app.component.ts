import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { UserModule } from './user/user.module';
import { UserServiceService } from './user-service.service';
import { Store } from '@ngxs/store';
import { FavorisState } from './favoris/favoris.state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UserModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true
})
export class AppComponent implements OnInit {
  title = 'Pollu-List';
  loggedIn = false;
  favorisCount$: Observable<number>;

  constructor(private router: Router, private userService: UserServiceService, private store: Store) {
    this.favorisCount$ = this.store.select(FavorisState.getFavorisCount);
  }
  
  ngOnInit(): void {
    this.userService.isLoggedIn().subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
