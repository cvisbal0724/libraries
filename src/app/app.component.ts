import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-libraries';
  form: FormGroup;
  customer = '';
  customerMulti = '';
  customers = [
    {
      "id": 1,
      "first_name": "Erich",
      "last_name": "Nasey",
      "email": "enasey0@elpais.com",
      "gender": "Female"
    }, {
      "id": 2,
      "first_name": "Ora",
      "last_name": "Donaghy",
      "email": "odonaghy1@angelfire.com",
      "gender": "Male"
    }, {
      "id": 3,
      "first_name": "Crissie",
      "last_name": "Malcher",
      "email": "cmalcher2@usatoday.com",
      "gender": "Female"
    }, {
      "id": 4,
      "first_name": "Lemmy",
      "last_name": "Cunnane",
      "email": "lcunnane3@google.nl",
      "gender": "Non-binary"
    }, {
      "id": 5,
      "first_name": "Madelon",
      "last_name": "Hasnip",
      "email": "mhasnip4@elpais.com",
      "gender": "Non-binary"
    }, {
      "id": 6,
      "first_name": "Rolf",
      "last_name": "Garling",
      "email": "rgarling5@themeforest.net",
      "gender": "Male"
    }, {
      "id": 7,
      "first_name": "Dex",
      "last_name": "McCaighey",
      "email": "dmccaighey6@telegraph.co.uk",
      "gender": "Polygender"
    }, {
      "id": 8,
      "first_name": "Kalil",
      "last_name": "Fenlon",
      "email": "kfenlon7@twitpic.com",
      "gender": "Agender"
    }, {
      "id": 9,
      "first_name": "Ariel",
      "last_name": "Ogers",
      "email": "aogers8@ovh.net",
      "gender": "Bigender"
    }, {
      "id": 10,
      "first_name": "Sheppard",
      "last_name": "Kellaway",
      "email": "skellaway9@fda.gov",
      "gender": "Bigender"
    }, {
      "id": 11,
      "first_name": "Lucila",
      "last_name": "Cavil",
      "email": "lcavila@sciencedaily.com",
      "gender": "Non-binary"
    }, {
      "id": 12,
      "first_name": "Iorgos",
      "last_name": "Jeafferson",
      "email": "ijeaffersonb@etsy.com",
      "gender": "Genderqueer"
    }, {
      "id": 13,
      "first_name": "Jerrie",
      "last_name": "Woolerton",
      "email": "jwoolertonc@google.de",
      "gender": "Genderqueer"
    }, {
      "id": 14,
      "first_name": "Elizabet",
      "last_name": "Coupar",
      "email": "ecoupard@123-reg.co.uk",
      "gender": "Female"
    }, {
      "id": 15,
      "first_name": "Gloria",
      "last_name": "Hayball",
      "email": "ghayballe@geocities.com",
      "gender": "Genderqueer"
    }
  ]

  constructor(public fb: FormBuilder) {
    this.form = fb.group({
      customer: ['', [Validators.required]],
      customer_multi: ['', [Validators.required]]
    });
  }

  displayText(item) {
    return `${item.first_name} ${item.last_name}`;
  }

  filter(val) {
    console.log(val)
  }

}
