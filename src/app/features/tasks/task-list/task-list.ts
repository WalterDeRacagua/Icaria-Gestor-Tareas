import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../../core/services/task';
import { Priority, Status, Task } from '../../../core/models/task';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TaskForm } from '../task-form/task-form';
import { Summary } from '../../../shared/components/summary/summary';
import { SortEvent } from 'primeng/api';

type Severity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null;

@Component({
  selector: 'app-task-list',
  imports: [
    TableModule,
    ButtonModule,
    TagModule,
    SelectModule,
    InputTextModule,
    RouterLink,
    FormsModule,
    DatePipe,
    TaskForm,
    RouterLink,
    Summary,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private taskService = inject(TaskService);

  dialogVisible = signal(false);
  selectedTask = signal<Task | null>(null);

  readonly priorityOptions = [
    { label: 'Todas', value: null },
    { label: 'Baja', value: Priority.Low },
    { label: 'Media', value: Priority.Medium },
    { label: 'Alta', value: Priority.High },
  ];

  readonly statusOptions = [
    { label: 'Todos', value: null },
    { label: 'Pendiente', value: Status.Pending },
    { label: 'En progreso', value: Status.InProgress },
    { label: 'Completada', value: Status.Done },
  ];

  //Signals que utilizamos para los filtros: texto, prioridad y estado
  searchText = signal('');
  selectedPriority = signal<Priority | null>(null);
  selectedStatus = signal<Status | null>(null);

  filteredTasks = computed(() => {
    const text = this.searchText().toLowerCase();
    const priority = this.selectedPriority();
    const status = this.selectedStatus();

    return this.taskService.all().filter((t) => {
      const matchText = t.title.toLowerCase().includes(text);
      const matchPriority = priority ? t.priority === priority : true;
      const matchStatus = status ? t.status === status : true;

      return matchText && matchPriority && matchStatus;
    });
  });

  summary = this.taskService.summary;

  markAsDone(task: Task): void {
    this.taskService.update({ ...task, status: Status.Done });
  }

  openCreate(): void {
    this.selectedTask.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(task: Task): void {
    this.selectedTask.set(task);
    this.dialogVisible.set(true);
  }

  onSaved(task: Omit<Task, 'id'> | Task): void {
    //Si estamos en el form de edición (ya tiene id, no se tiene que crear)
    if ('id' in task) {
      this.taskService.update(task);
    } else {
      this.taskService.create(task);
    }

    this.dialogVisible.set(false);
    this.selectedTask.set(null);
  }
  onCancelled(): void {
    this.dialogVisible.set(false);
    this.selectedTask.set(null);
  }

  getPrioritySeverity(priority: Priority): Severity {
    const map: Record<Priority, Severity | null> = {
      [Priority.Low]: 'secondary',
      [Priority.Medium]: 'warn',
      [Priority.High]: 'danger',
    };
    return map[priority];
  }

  getStatusSeverity(status: Status): Severity {
    const map: Record<Status, Severity | null> = {
      [Status.Pending]: 'secondary',
      [Status.InProgress]: 'info',
      [Status.Done]: 'success',
    };
    return map[status];
  }

  private readonly priorityOrder: Record<Priority, number> = {
    [Priority.Low]: 1,
    [Priority.Medium]: 2,
    [Priority.High]: 3,
  };

  private readonly statusOrder: Record<Status, number> = {
    [Status.Pending]: 1,
    [Status.InProgress]: 2,
    [Status.Done]: 3,
  };

  customSort(event: SortEvent): void {
    event.data?.sort((a, b) => {
      const field = event.field as keyof Task;
      const order = event.order ?? 1;

      if (field === 'priority') {
        //Si el resultado es positivo: a - b = 3-1 = 2 entonces b va antes que a. Si es descendente el resultado se multiplica por -1 entonces se invierte.
        return (
          (this.priorityOrder[a.priority as Priority] -
            this.priorityOrder[b.priority as Priority]) *
          order
        );
      }

      if (field === 'status') {
        return (
          (this.statusOrder[a.status as Status] - this.statusOrder[b.status as Status]) * order
        );
      }

      const valA = a[field];
      const valB = b[field];

      if (valA instanceof Date && valB instanceof Date) {
        return (valA.getTime() - valB.getTime()) * order;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB) * order;
      }

      return 0;
    });
  }
}
