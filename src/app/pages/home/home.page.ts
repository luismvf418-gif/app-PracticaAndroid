import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonReorder,
  IonReorderGroup,
  ViewWillEnter,
} from '@ionic/angular';

import type { ReorderEndCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';

// <--- 1. Importamos Preferences de Capacitor
import { Preferences } from '@capacitor/preferences';

// Importación de tu servicio Alert
import { Alert } from '../../services/alert';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonList,
    IonLabel,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FormsModule,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonReorder,
    IonReorderGroup,
  ],
})
export class HomePage  { 
  private alertService = inject(Alert);
  private cdr = inject(ChangeDetectorRef);

  public task: string = '';
  public tasks: string[] = []; 

  constructor() {
    addIcons({ addOutline, trashOutline });
  }

  // <--- 2. Método correcto de Ionic (ionViewWillEnter en lugar de IonViewDidEnter)
  ionViewWillEnter(): void {
    this.loadTasks();
  }

  // <--- 3. Método ASÍNCRONO para LEER con Capacitor Preferences
  private async loadTasks() {
    // Preferences lee el almacenamiento nativo y nos devuelve un objeto con la propiedad 'value'
    const { value } = await Preferences.get({ key: 'mis_tareas' });
    
    if (value) {
      this.tasks = JSON.parse(value); 
    } else {
      this.tasks = [
        'Comprar Leche',
        'Dormir',
        'Descansar',
        'Estudiar',
        'Ver la Novela',
        'Hacer ejercicio',
        'Leer un libro',
        'Llamar a un amigo',
        'Cocinar la cena',
        'Limpiar la casa',
      ];
    }
    this.cdr.markForCheck();
  }

  // <--- 4. Método ASÍNCRONO para GUARDAR con Capacitor Preferences
  private  saveTasks() {
     Preferences.set({
      key: 'mis_tareas',
      value: JSON.stringify(this.tasks)
    });
  }

  handleReorderEnd(event: ReorderEndCustomEvent) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

    const itemToMove = this.tasks.splice(event.detail.from, 1)[0];
    this.tasks.splice(event.detail.to, 0, itemToMove);

    event.detail.complete();

    this.saveTasks(); // <--- Guardamos al mover de lugar
    this.cdr.markForCheck();
  }

  addTask(): void {
    const trimmedTask = this.task.trim();

    if (!trimmedTask) {
      this.alertService.alertMessage(
        'Atención',
        'Registro de Tareas',
        'No puedes agregar una tarea vacía'
      );
      return;
    }

    if (!this.ifExistTask(trimmedTask)) {
      this.tasks.push(trimmedTask);
      this.task = '';
      
      this.saveTasks(); // <--- Guardamos al agregar nueva tarea

      this.alertService.alertMessage(
        'Éxito',
        'Registro de Tareas',
        'La tarea se ha agregado correctamente'
      );
    } else {
      this.alertService.alertMessage(
        'Error',
        'Registro de Tareas',
        'La tarea ya existe'
      );
    }
  }

  private ifExistTask(task: string): boolean {
    return this.tasks.some(
      (item: string) => item.toLowerCase().trim() === task.toLowerCase().trim()
    );
  }

  confirmDeleteTask(task: string, slidingItem?: IonItemSliding): void {
    this.alertService.alertConfirm(
      'Confirmación',
      'Eliminar Tarea',
      `¿Está seguro de que desea eliminar la tarea "${task}"?`,
      () => {
        this.deleteTask(task);
        if (slidingItem) {
          slidingItem.close();
        }
      }
    );
  }

  private deleteTask(task: string): void {
    const index = this.tasks.findIndex(
      (item: string) => item.toLowerCase().trim() === task.toLowerCase().trim()
    );

    if (index !== -1) {
      this.tasks.splice(index, 1);
      
      this.saveTasks(); // <--- Guardamos al borrar una tarea
      
      this.cdr.markForCheck();
    }
  }
}