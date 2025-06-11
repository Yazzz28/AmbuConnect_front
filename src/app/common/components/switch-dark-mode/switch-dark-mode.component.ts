import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-switch-dark-mode',
  imports: [FormsModule],
  templateUrl: './switch-dark-mode.component.html',
  styleUrl: './switch-dark-mode.component.scss',
})
export class SwitchDarkModeComponent implements OnInit {
  checked: boolean = false;

  ngOnInit(): void {
    const storedTheme: string | null = localStorage.getItem('theme');

    this.checked = storedTheme === 'dark';

    this._applyTheme();
  }

  toggleTheme(value: boolean): void {
    this.checked = value;
    this._applyTheme();
    localStorage.setItem('theme', this.checked ? 'dark' : 'light');
  }

  private _applyTheme(): void {
    const html: HTMLElement = document.documentElement;
    if (this.checked) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
  }
}
