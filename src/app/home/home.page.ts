import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Ocr, TextDetections } from '@capacitor-community/image-to-text';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  imgSrc: SafeUrl | undefined = "../../assets/manioc.jpg";
  lines: string[] = [];
  message: string = '';
  busy = false;

  huakTuahList: string[] = [
    "Taro",
    "Colocasia esculenta",
    "Wasserbrotwurzel",
    "Kolokasie",
    "Taioba",
    "Eddo",
    "Eddoe",
    "Eddro",
    "Dasheen",
    "Cocoyam",
    "Macabo",
    "Mankani",
    "Koko",
    "Lambo",
    "Ede",
    "Tarro",
    "Quequisque",
    "Malanga",
    "Papa china",
    "Arbi",
    "Sato-imo",
    "Elefantenohrpflanze",
    "Alocasia macrorrhizos",
    "Tannia",
    "Cyrtosperma merkusii",
    "Kalo",
    "Poi",
    "Katchu",
    "Amadumbe",
    "Dalo",
    "Keladi",
    "Mwanza",
    "Nduma",
    "Abalongi",
    "Suran",
    "Ghandyali",
    "Tales",
    "Inhame",
    "Chembu",
    "Kochu",
    "Gabi",
    "Eddos",
    "Madumbi",
    "Ube",
    "Khoai môn",
    "Bun long",
    "Pindalai",
    "Yautia",
    "Yautia coco",
    "Uhi",
    "Kalo (Hawaii)",
    "Manioc",
    "Cassava",
    "Yuca",
    "Mandioca",
    "Manihot esculenta",
    "Ape",
    "Kape",
    "Ufi",
    "Gari",
    "Mukape",
    "Mihogo",
    "Mboboch",
    "Sanku",
    "Xivuti",
    "Ubikayu",
    "Balinghoy",
    "Kamoteng Kahoy",
    "Manioc doux",
    "Amani",
    "Kappa",
    "Rogo",
    "Akpu",
    "Bitter Cassava",
    "Sweet Cassava",
    "Mandubi",
    "Kapok",
    "Katela",
    "Farinha",
    "Fufu",
    "Lafun",
    "Kisamvu",
    "Mogo",
    "Plátano macho",
    "Saka-Saka",
    "Yuca dulce",
    "Roti",
    "Bibai",
    "Kpukpuru",
    "Tikap",
    "Nampi",
    "Mahu",
    "Huti",
    "Thar",
    "Mbegui",
    "Maphuthu",
    "Mboshi",
    "Rik",
    "Pouna",
    "Quyavi",
    "Buchu",
    "Saka",
    "Kivunde",
    "Yapo",
    "Ngai",
    "Ntoi"
  ];

  constructor(
    private sanitizer: DomSanitizer,
    private alertController: AlertController // Hinzufügen des AlertControllers
  ) { }

  async takePic() {
    try {
      this.busy = true;
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera        
      });
      const imageUrl = photo.webPath;
      if (!imageUrl) return;
      this.imgSrc = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      const path = photo.path;
      if (!path) return;
      this.lines = await this.processImage(path);

      // Überprüfen, ob eines der Wörter in huakTuahList in den erkannten Zeilen vorkommt
      await this.checkForHuakTuahWords();

    } catch (err) {
      alert(err);
    } finally {
      this.busy = false;
    }
  }

  async processImage(filename: string): Promise<string[]> {
    const data: TextDetections = await Ocr.detectText({ filename });
    console.log(data);
    const result: string[] = [];
    for (let detection of data.textDetections) {
      result.push(detection.text); 
    }
    this.message = result.length === 0 ? 'No text was detected' : '';
    return result;
  }

  async checkForHuakTuahWords() {
    for (let line of this.lines) {
      for (let word of this.huakTuahList) {
        if (line.includes(word)) {
          await this.showAlertFound(`Das Wort "${word}" wurde erkannt!`);
          return;// Alert anzeigen und beenden, wenn eines der Wörter gefunden wurde
        }
      }
    }
    await this.showAlertNotFound('Keines der gesuchten Wörter wurde erkannt.');
  }

  async showAlertFound(message: string) {
    const alert = await this.alertController.create({
      header: 'Halt Stop!',
      subHeader: 'Vergiftungsgefahr! Lebensmittel nicht essen!',

      // CSS-Stile für den Alert-Hintergrund
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showAlertNotFound(message: string) {
    const alert = await this.alertController.create({
      header: 'Keine Gefahr!',
      subHeader: 'Du kannst das Lebensmittel essen!',

      // CSS-Stile für den Alert-Hintergrund
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
