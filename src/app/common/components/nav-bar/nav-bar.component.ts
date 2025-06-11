import { Component, DestroyRef, ElementRef, HostListener, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SwitchDarkModeComponent } from '../switch-dark-mode/switch-dark-mode.component';
import { AuthService } from '../../pages/login/service/auth.service';
import { MenuItemsService } from './service/menu-item.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActionDeleteItem } from '../../../general/type/custom-type';

type CustomMenuItem = {
  label: string;
  icon?: string;
  routerLink?: string;
  styleClass?: string;
  items?: CustomMenuItem[];
  command?: () => void;
  expanded?: boolean;
};

const BURGER_MENU_SIZE = 1160;
const WINDOW_SCROLL = 20;

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgClass, RouterLink, SwitchDarkModeComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @ViewChildren('dropdownContainer') dropdownContainers!: QueryList<ElementRef>;

  items: CustomMenuItem[] = [];
  logo: string = 'assets/logo.svg';
  isScrolled: boolean = false;
  isMobileMenuOpen: boolean = false;
  isMobileView: boolean = false;

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private _authService: AuthService = inject(AuthService);
  private _menuItemsService: MenuItemsService = inject(MenuItemsService);

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > WINDOW_SCROLL;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkMobileView();
    if (window.innerWidth > BURGER_MENU_SIZE && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMobileView) {
      const clickedInsideDropdown: boolean = this.dropdownContainers.some(container => container.nativeElement.contains(event.target));

      if (!clickedInsideDropdown) {
        this.closeAllDropdowns();
      }
    }
  }

  ngOnInit(): void {
    this.updateMenuItems();
    this.checkMobileView();

    this._authService.isAuthenticated$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this.updateMenuItems();
    });
  }

  checkMobileView(): void {
    this.isMobileView = window.innerWidth <= BURGER_MENU_SIZE;
  }

  updateMenuItems(): void {
    const primeItems = this._menuItemsService.getMenuItems(this.logo, () => this.logout());
    this.items = primeItems.map(item => this.convertMenuItem(item));
  }

  convertMenuItem(item: ActionDeleteItem): CustomMenuItem {
    const customItem: CustomMenuItem = {
      label: item.label,
      icon: item.icon,
      routerLink: item.routerLink,
      styleClass: item.styleClass,
      command: item.command,
      expanded: false,
    };

    if (item.items) {
      customItem.items = item.items.map((subItem: ActionDeleteItem) => this.convertMenuItem(subItem));
    }

    return customItem;
  }

  logout(): void {
    this._authService.logout();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  toggleDropdown(container: HTMLElement): void {
    this.closeAllDropdowns();

    const dropdown = container.querySelector('.dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('hidden');
    }
  }

  closeAllDropdowns(): void {
    this.dropdownContainers.forEach(container => {
      const dropdown = container.nativeElement.querySelector('.dropdown-menu');
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
    });
  }
}
