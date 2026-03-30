import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';

const IcariaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e6f4f3',
      100: '#b3deda',
      200: '#80c8c1',
      300: '#4db2a8',
      400: '#00A499',
      500: '#003087',
      600: '#002a75',
      700: '#002363',
      800: '#001c51',
      900: '#00153f',
      950: '#000e2d',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: IcariaPreset,
      },
    }),
  ],
};
