import { ActionDeleteItem } from '../../../../general/type/custom-type';

export type IroColor = {
  hexString: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  rgbString: string;
  hslString: string;
};

export type IroColorPickerOptions = {
  width?: number;
  height?: number;
  color?: string;

  layout?: {
    component: ActionDeleteItem;
    options?: ActionDeleteItem;
  }[];

  borderWidth?: number;
  borderColor?: string;
  padding?: number;
  handleRadius?: number;
  handleSvg?: string;
  handleProps?: Record<string, ActionDeleteItem>;

  wheelLightness?: boolean;
  wheelAngle?: number;
  wheelDirection?: 'clockwise' | 'anticlockwise';

  sliderSize?: number;
  sliderMargin?: number;
};

export type IroColorPicker = {
  el: HTMLElement;

  on(eventType: string, callback: (color: IroColor) => void): void;
  off(eventType: string, callback?: (color: IroColor) => void): void;
  setOptions(options: Partial<IroColorPickerOptions>): void;
  setColors(colors: string[]): void;
  setActiveColor(index: number): void;
  setColor(color: string | IroColor): void;
  getColor(): IroColor;
  addColor(color: string): void;
  removeColor(index: number): void;
  forceUpdate(): void;
};
