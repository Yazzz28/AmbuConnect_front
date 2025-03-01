import { Component, OnInit } from '@angular/core';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-switch-dark-mode',
  imports: [ToggleSwitch, FormsModule],
  templateUrl: './switch-dark-mode.component.html',
  styleUrl: './switch-dark-mode.component.scss',
})
export class SwitchDarkModeComponent implements OnInit {
  checked: boolean = true; // Défini par défaut sur `true` (mode clair)

  ngOnInit(): void {
    // Vérifie l'état du thème stocké dans localStorage
    const storedTheme = localStorage.getItem('theme');

    // Si localStorage contient 'light', on applique le mode clair, sinon, mode sombre
    this.checked = storedTheme === 'light';

    this._applyTheme(); // Applique immédiatement le thème au démarrage
  }

  // Cette méthode est appelée dès que l'état du switch change
  toggleTheme(): void {
    this._applyTheme(); // Applique immédiatement le thème
    localStorage.setItem('theme', this.checked ? 'light' : 'dark'); // Enregistre le thème dans localStorage
  }

  private _applyTheme(): void {
    const html = document.documentElement;
    if (this.checked) {
      // Si `checked` est `true`, applique le mode clair
      html.classList.remove('dark');
    } else {
      // Si `checked` est `false`, applique le mode sombre
      html.classList.add('dark');
    }
  }
}
