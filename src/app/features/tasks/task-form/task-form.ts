import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Priority, Status, Task } from '../../../core/models/task';
import { title } from '@primeuix/themes/aura/card';
import { DialogModule } from 'primeng/dialog';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    DatePickerModule,
    TextareaModule,
    FormsModule,
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private formBuilder = inject(FormBuilder);

  // Atributos que vamos a recibir del componente padre
  visible = input<boolean>(false);
  task = input<Task | null>(null);

  //Atributos que tenemos que notificar al componente padre.
  saved = output<Omit<Task, 'id'> | Task>();
  cancelled = output<void>();

  readonly priorityOptions = [
    { label: 'Baja', value: Priority.Low },
    { label: 'Media', value: Priority.Medium },
    { label: 'Alta', value: Priority.High },
  ];

  readonly statusOptions = [
    { label: 'Pendiente', value: Status.Pending },
    { label: 'En progreso', value: Status.InProgress },
    { label: 'Completada', value: Status.Done },
  ];

  // Formulario reactivo como nos piden. El primer valor es la inicialización y el segundo es el validador. Si ponemos required === obligatorio (como hacíamos en Express)
  form = this.formBuilder.group({
    title: ['', Validators.required],
    description: [''],
    priority: [null as Priority | null, Validators.required],
    status: [Status.Pending as Status],
    endDate: [null as Date | null, Validators.required],
  });

  constructor() {
    effect(() => {
      const task = this.task();
      if (task) {
        this.form.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          endDate: new Date(task.endDate),
        });
      } else {
        this.form.setValue({
          title: '',
          description: '',
          priority: null,
          status: Status.Pending,
          endDate: null,
        });
      }
    });
  }

  get isEditMode(): boolean {
    return this.task() != null;
  }

  get title(): string {
    return this.isEditMode ? 'Editar tarea' : 'Crear tarea';
  }

  get priorityControl() {
    return this.form.controls.priority;
  }
  get statusControl() {
    return this.form.controls.status;
  }

  onSave(): void {
    if (this.form.invalid) {
      // Mostrar errores.
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const task = this.task();

    if (task) {
      this.saved.emit({
        ...task,
        title: value.title!,
        description: value.description ?? '',
        priority: value.priority!,
        status: value.status!,
        endDate: value.endDate!,
      });
    } else {
      this.saved.emit({
        title: value.title!,
        description: value.description ?? '',
        priority: value.priority!,
        status: value.status!,
        endDate: value.endDate!,
      });
    }

    this.form.reset({
      status: Status.Pending,
    });
  }

  onCancel(): void {
    this.form.reset({
      status: Status.Pending,
    });
    this.cancelled.emit();
  }
}
