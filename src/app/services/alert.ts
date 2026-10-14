import { inject, Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class Alert {
  private alertController = inject(AlertController);

  async alertMessage(
    header: string,
    subHeader: string,
    message: string
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ['Ok'],
    });

    await alert.present();
  }

  async alertConfirm(
    header: string,
    subHeader: string,
    message: string,
    functionOk: () => void,
    cancelText: string = 'Cancelar',
    confirmText: string = 'Confirmar'
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
        },
        {
          text: confirmText,
          role: 'confirm',
          handler: () => {
            functionOk();
          },
        },
      ],
    });

    await alert.present();
  }
}