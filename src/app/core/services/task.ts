import { computed, Injectable, signal } from '@angular/core';
import { Priority, Status, Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<Task[]>([
    {
      id: crypto.randomUUID(),
      title: 'Configurar entorno de desarrollo',
      description: 'Instalar dependencias y configurar el proyecto base',
      priority: Priority.High,
      status: Status.Done,
      endDate: new Date('2025-03-01'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Diseñar modelo de datos',
      description: 'Definir las interfaces y tipos necesarios para la aplicación',
      priority: Priority.Medium,
      status: Status.InProgress,
      endDate: new Date('2026-04-15'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Implementar autenticación',
      description: 'Añadir login y gestión de sesión',
      priority: Priority.High,
      status: Status.Pending,
      endDate: new Date('2026-05-01'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Escribir tests unitarios',
      description: 'Cubrir los servicios principales con tests',
      priority: Priority.Low,
      status: Status.Pending,
      endDate: new Date('2026-03-20'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Revisión de código',
      description: 'Code review del sprint anterior',
      priority: Priority.Medium,
      status: Status.Pending,
      endDate: new Date('2026-02-10'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Migrar base de datos',
      description: 'Aplicar migraciones pendientes al entorno de producción',
      priority: Priority.High,
      status: Status.Pending,
      endDate: new Date('2026-02-15'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Actualizar documentación API',
      description: 'Revisar y actualizar los endpoints documentados en Swagger',
      priority: Priority.Low,
      status: Status.Done,
      endDate: new Date('2025-12-20'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Optimizar consultas SQL',
      description: 'Revisar las queries más lentas e implementar índices',
      priority: Priority.Medium,
      status: Status.InProgress,
      endDate: new Date('2026-04-01'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Implementar notificaciones push',
      description: 'Integrar servicio de notificaciones para alertas en tiempo real',
      priority: Priority.Medium,
      status: Status.Pending,
      endDate: new Date('2026-05-20'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Corregir bug en módulo de pagos',
      description: 'Los pagos con tarjeta AMEX fallan en determinados casos',
      priority: Priority.High,
      status: Status.InProgress,
      endDate: new Date('2026-03-28'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Diseñar nuevas pantallas en Figma',
      description: 'Crear los mockups del módulo de informes',
      priority: Priority.Low,
      status: Status.Pending,
      endDate: new Date('2026-04-10'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Configurar pipeline CI/CD',
      description: 'Automatizar despliegues con GitHub Actions',
      priority: Priority.High,
      status: Status.Done,
      endDate: new Date('2025-11-30'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Análisis de rendimiento',
      description: 'Ejecutar pruebas de carga y analizar resultados',
      priority: Priority.Medium,
      status: Status.Pending,
      endDate: new Date('2026-02-05'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Integración con Salesforce',
      description: 'Conectar el CRM con la plataforma interna mediante API REST',
      priority: Priority.High,
      status: Status.Pending,
      endDate: new Date('2026-06-01'),
    },
    {
      id: crypto.randomUUID(),
      title: 'Formación en Angular 21',
      description: 'Preparar material y sesión de formación para el equipo',
      priority: Priority.Low,
      status: Status.InProgress,
      endDate: new Date('2026-04-30'),
    },
  ]);

  // No quiero poder modificar externamente las tareas (no se puede usar set ni update) --> pero las quiero utilizar desde fuera
  readonly all = this.tasks.asReadonly();

  readonly summary = computed(() => {
    const tasks = this.tasks();
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === Status.Pending || t.status === Status.InProgress)
        .length,
      completed: tasks.filter((t) => t.status === Status.Done).length,
      notDone: tasks.filter((t) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(t.endDate);
        endDate.setHours(0, 0, 0, 0);
        return t.status !== Status.Done && endDate < today;
      }).length,
    };
  });

  create(task: Omit<Task, 'id'>): void {
    const newTask: Task = { ...task, id: crypto.randomUUID() };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  update(updated: Task): void {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t)));
  }

  getById(id: string): Task | undefined {
    return this.tasks().find((t) => t.id === id);
  }
}
