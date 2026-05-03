import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet,RouterLink, RouterModule,CommonModule  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

selectedLanguage: string = 'English';

translations: any = { 
  en: {
    home:'Home',
    deviceList: 'Device List',
    empWise: 'Employee Wise Device',
    deviceWise: 'Device Wise Employee',
    empList: 'Employee List'
  },
  hi: {
    deviceList: 'डिवाइस सूची',
    empWise: 'कर्मचारी अनुसार डिवाइस',
    deviceWise: 'डिवाइस अनुसार कर्मचारी',
    empList: 'कर्मचारी सूची'
  }
};

currentLang: string = 'en';

changeLanguage(lang: string) {
  this.currentLang = lang;
  this.selectedLanguage = lang === 'en' ? 'English' : 'हिंदी';
  }
  




  isDarkMode: boolean = false;

ngOnInit() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    this.enableDarkMode();
  }


  const savedFont = localStorage.getItem('fontSize');
  if (savedFont) {
    this.fontSize = +savedFont;
    this.applyFontSize();
  }

  // check login state from localStorage (page reload ke baad bhi same rahe)
    const user = localStorage.getItem('user');
    this.isLoggedIn = !!user;
}

//   toggleTheme() {
//   // console.log('clicked');
//   document.body.classList
  
//   this.isDarkMode = !this.isDarkMode;

//   if (this.isDarkMode) {
//     this.enableDarkMode();
//   } else {
//     this.enableLightMode();
//   }
// }

  toggleTheme() {
  console.log('clicked');

  this.isDarkMode = !this.isDarkMode;

  if (this.isDarkMode) {
    document.body.classList.add('dark-theme');  
  } else {
    document.body.classList.remove('dark-theme');
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
  

  //  <!-- FONT SIZE CONTROLS -->
  fontSize: number = 16; // default px


applyFontSize() {
  document.documentElement.style.fontSize = this.fontSize + 'px';
  localStorage.setItem('fontSize', this.fontSize.toString());
  }
  



  isLoggedIn: boolean = false;
   login() {
    console.log('Login clicked');

    // demo ke liye fake login
    const fakeUser = {
      name: 'Admin'
    };

    localStorage.setItem('user', JSON.stringify(fakeUser));
    this.isLoggedIn = true;

    alert('Logged In Successfully');
  }

  logout() {
    console.log('Logout clicked');

    localStorage.removeItem('user');
    this.isLoggedIn = false;

    alert('Logged Out Successfully');
  }
}
