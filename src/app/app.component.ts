import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryComponent } from './tapps-category/tapps-category.component';
import { ApplicationComponent } from './tapps-application/tapps-application.component';
import { MasterComponent } from './tapps-master/tapps-master.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterOutlet,
    CommonModule,
    CategoryComponent,
    ApplicationComponent,
    MasterComponent,
    // ToastrModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'admin';
  tabs = [
    {
      name: 'master',
      active: true,
    },
    {
      name: 'category',
      active: false,
    },
    {
      name: 'application',
      active: false,
    }
  ]

  get tabNameActive() {
    const t = this.tabs.find(f => f.active);
    return t?.name;
  }

  handleClickTab(name: string) {
    this.tabs = this.tabs.map(m => {
      return {
        ...m,
        active: m.name === name
      }
    });

  }
}
