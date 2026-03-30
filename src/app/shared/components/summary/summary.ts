import { Component, input } from '@angular/core';

interface SummaryData {
  total: number;
  pending: number;
  completed: number;
  notDone: number;
}

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary {
  //El componente padre nos tiene que pasar obligatoriamente siempre este dato.
  summary = input.required<SummaryData>();
}
