import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/services/task';
import { Priority, Status, Task } from '../../../core/models/task';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';

type Severity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null;

@Component({
  selector: 'app-task-detail',
  imports: [ButtonModule, RouterLink, TagModule, DatePipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  task = signal<Task | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/tasks']);
      return;
    }

    const task = this.taskService.getById(id);
    if (!task) {
      this.router.navigate(['/tasks']);
      return;
    }

    this.task.set(task);
  }

  getPrioritySeverity(priority: Priority): Severity {
    const map: Record<Priority, Severity> = {
      [Priority.Low]: 'secondary',
      [Priority.Medium]: 'warn',
      [Priority.High]: 'danger',
    };
    return map[priority];
  }

  getStatusSeverity(status: Status): Severity {
    const map: Record<Status, Severity> = {
      [Status.Pending]: 'secondary',
      [Status.InProgress]: 'info',
      [Status.Done]: 'success',
    };
    return map[status];
  }
}
