import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'user-form';
  private emails: string[];
  form! : FormGroup;
  addFrameworkStatus = false;

  objectKeys = Object.keys;
  frameworks: any = {
    angular:['1.1.1','1.2.1','1.3.3'],
    react:['2.1.2','3.2.4','4.3.1'],
    vue:['3.3.1','5.2.1','5.1.3']
  }


  
  constructor(private datePipe: DatePipe){
     /** Имитация эмейлов, зарегистрированные в системе */
    this.emails = ['test@gmail.com', 'test@test.com', 'test@test.ua'];
  }

  
  disabledValue = true
  ngOnInit() : void{
    this.form = new FormGroup({
      firstname: new FormControl('', 
      [
        Validators.required,
        this.checkMinimalLength,
        Validators.pattern(/^[a-zA-Z]+$/)
      ]),
      lastname: new FormControl('', 
      [
        Validators.required,
       this.checkMaximimLength,
       Validators.pattern(/^[a-zA-Z]+$/)

      ]),
      dateOfTheBirth:new FormControl('', [Validators.required]),

      framework: new FormControl(null, [Validators.required]),

      frameworkVersion: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required,Validators.email], this.validateEmailAsync.bind(this) as AsyncValidatorFn),
      hobby: new FormArray([this.createHobbyFormGroup()])
    })
  }

  createHobbyFormGroup(){
    return new FormGroup({
        name: new FormControl('',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]+$/)
        ]),
        duration: new FormControl('',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9]+$/)
        ])
      }) 
  }

  get hobby(){
    return this.form.get('hobby') as FormArray
  }

  get firstname(){
    return this.form.get('firstname') as FormControl
  }
  get lastname(){
    return this.form.get('lastname') as FormControl
  }

  get date(){
    return this.form.get('dateOfTheBirth') as FormControl
  }

  get framework(){
    return this.form.get('framework') as FormControl
  }

  get frameworkVersion(){
    return this.form.get('frameworkVersion') as FormControl
  }

  get email(){
    return this.form.get('email') as FormControl
  }


  addnewHobby(){
    this.hobby.push(this.createHobbyFormGroup())
  }

  removeHobby(hobbyIndex:number){
    if(this.hobby.length>1){
      this.hobby.removeAt(hobbyIndex);
    }
    return

  }


  checkMinimalLength(control: FormControl){
    if(control.value.length < 2){
      return {
        'minimumlengthError':true
      };

    }
    return null
  }

  checkMaximimLength(control: FormControl){
    if(control.value.length > 20){
      return {
        'maximumlengthError':true
      };

    }
    return null
  }


  onSubmit(){
    console.log(this.createUser())
    alert('Форма отправлена на сервер')
    
  }

  validateEmailAsync(control:FormControl): Promise<ValidationErrors | null>{
    return new Promise((resolve,reject)=>{
      setTimeout(()=>{
        const mail = this.emails.find(mail => mail === control.value);
        if(mail){
          resolve ({
            emailIsUsed: true
          })
        }else{
          resolve(null)
        }
      }, 2000)
    })
  }

createUser(){
  const user = {
    firstname:this.firstname.value,
    lastname:this.lastname.value,
    dateOfTheBirth: this.datePipe.transform(this.date.value, 'yyyy-MM-dd'),
    framework:this.framework.value,
    frameworkVersion:this.frameworkVersion.value,
    email:this.email.value,
    hobby:this.hobby.value

  }
  return user
}
  
}

  

