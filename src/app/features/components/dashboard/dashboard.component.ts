import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    public router: Router,
    private authService: AuthService,
      private toastr: ToastrService
  ) {}

  //  Language
  selectedLanguage: string = 'English';

  translations: any = {
    en: {
       home: 'Home',
      deviceList: 'Device List',
      empWise: 'Employee Wise Device',
      deviceWise: 'Device Wise Employee',
      empList: 'Employee List',
    },
    hi: {
      deviceList: 'डिवाइस सूची',
      empWise: 'कर्मचारी अनुसार डिवाइस',
      deviceWise: 'डिवाइस अनुसार कर्मचारी',
      empList: 'कर्मचारी सूची',
    },
  };

  currentLang: string = 'en';

  changeLanguage(lang: string) {
    this.currentLang = lang;
    this.selectedLanguage = lang === 'en' ? 'English' : 'हिंदी';
  }

  //  Dark Mode
  isDarkMode: boolean = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  enableDarkMode() {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
    this.isDarkMode = true;
  }

  enableLightMode() {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
    this.isDarkMode = false;
  }

  //  Font Size
  fontSize: number = 16;
  
  applyFontSize() {
    document.documentElement.style.fontSize = this.fontSize + 'px';
    localStorage.setItem('fontSize', this.fontSize.toString());
  }

  //  Auth
  isLoggedIn: boolean = false;
  userName: string = '';

  ngOnInit() {
    //  load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    }

    //  load font
    const savedFont = localStorage.getItem('fontSize');
    if (savedFont) {
      this.fontSize = +savedFont;
      this.applyFontSize();
    }

    //  check login
    this.isLoggedIn = this.authService.isLoggedIn();

    //  get user email
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      this.userName = user.email || 'User';
    }
  }

  //  Logout
  logout() {
    this.authService.logout();
    localStorage.removeItem('userData');

    this.isLoggedIn = false;
    this.userName = '';

    this.toastr.success('Logout Successful',);

    this.router.navigate(['/login']);
  }
}
