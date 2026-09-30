import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonIcon, IonInput } from '@ionic/angular';
import{addOutline} from 'ionicons/icons'
import {addIcons} from 'ionicons'

//importación de angular
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonIcon, IonInput, FormsModule],
})
export class HomePage {
  public task : string = ''
  public tasks: string[] = [

  ]
  constructor() {
    addIcons({
      addOutline,
    });
  }

  addTask(){
    console.log('Variable: ', this.task); 
    this.tasks.push(this.task);
    console.log(this.tasks);
    this.task ='';
  }
}
