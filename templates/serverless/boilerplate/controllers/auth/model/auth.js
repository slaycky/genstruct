'use strict';

const validator = require('validator');
const passwordValidator = require('password-validator');
const config = require('../config.json');
class Auth {
  constructor(name, email, cpf, password, middle_name, birthdate, rg, gender,
    zip_code, street, number, neighborhood, complement, state, city, house_phone, phone_number,provider,code) {
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.password = password;
    this.middle_name = middle_name;
    this.birthdate = birthdate;
    this.rg = rg;
    this.gender = gender;
    this.zip_code = zip_code;
    this.street = street;
    this.number = number;
    this.neighborhood = neighborhood;
    this.complement = complement;
    this.state = state;
    this.city = city;
    this.house_phone = house_phone;
    this.phone_number = phone_number;
    this.provider = provider;
    this.code = code;
  }

  set(params) {
    this.name = params.name;
    this.email = params.email;
    this.cpf = params.cpf;
    this.password = params.password;
    this.middle_name = params.middle_name;
    this.birthdate = params.birthdate;
    this.rg = params.rg;
    this.gender = params.gender;
    this.zip_code = params.zip_code;
    this.street = params.street;
    this.number = params.number;
    this.neighborhood = params.neighborhood;
    this.complement = params.complement;
    this.state = params.state;
    this.city = params.city;
    this.house_phone = params.house_phone;
    this.phone_number = params.phone_number;
    this.provider = params.provider;
    this.code = params.code;
  }



  validate(){
    // Create a schema
    var passwordSchema = new passwordValidator();
    passwordSchema.is().min(8).has().uppercase().has().lowercase().has().digits();
    let response = { status: true, message:"" }
    if (!validator.isEmail(this.email)){
      response = { status: false, message: "Email inválido", code: "010" }
    } else if(!cpf_validate(this.cpf)){
      response = { status: false, message: "CPF inválido", code: "011" }
    } else if(!passwordSchema.validate(this.password)){
      response = { status: false, message: "Formato senha inválida", code: "012" }
    }
    return response;  
  }
  requireloginparams(type){
    let required = { status: true, parameter: '' }
    if (type=='social') {
      if (typeof this.code ==="undefined" || this.code === ""){
        required.status = false;
        required.parameter = 'code';
      }else if(typeof this.provider ==="undefined"|| this.provider === ""){
        required.status = false;
        required.parameter = 'provider';
      }
     
    }else {
      if (typeof this.email ==="undefined" || this.email === ""){
        required.status = false;
        required.parameter = 'email';
      }else if(typeof this.password ==="undefined"|| this.password === ""){
        required.status = false;
        required.parameter = 'password';
      }
    }
    return required;
  }
  requireParams(type) {
    let required = { status: true, parameter: '' }

    if (typeof this.cpf === "undefined" || this.cpf === "") {
      required.status = false;
      required.parameter = 'CPF';
    } else if (type === 'comum' && (typeof this.password === "undefined" || this.password === "")) {
      required.status = false;
      required.parameter = 'Senha';
    } else if (typeof this.email === "undefined" || this.email === "") {
      required.status = false;
      required.parameter = 'E-mail';
    } else if (typeof this.name === "undefined" || this.name === "") {
      required.status = false;
      required.parameter = 'Nome';
    }else if (type === 'social' && typeof this.code ==="undefined"|| this.code === "") {
      required.status = false;
      required.parameter = 'code';
    }else if (type ==='social' && typeof this.provider ==="undefined"|| this.provider === "") {
      required.status = false;
      required.parameter = 'provider';
    }
    
    return required;
  }
  getValueFromCognito(field, params) {
    for (let i = 0; i < params.length; i++) {
      if (params[i]['Name'] === field) {
        return params[i]['Value'];
      }
    }
    return '';
  };
  getProvider() {
    if (this.provider == "facebook") {
      return { "graph.facebook.com": this.code }
    } else if(this.provider == "google"){
      return { "accounts.google.com": this.code }
    }else if(this.provider == "twitter"){
      return { "api.twitter.com": this.code }
    }
      else {
      return false;
    }
  }
  setCognito(type,identityId) {
    let attributeList = [];
    let dataPassword = {
      Name: 'password',
      Value: this.password
    }
    let dataEmail = {
      Name: 'email',
      Value: this.email
    };
    let dataName = {
      Name: 'name',
      Value: this.name
    };
    let dataMiddleName = {
      Name: 'middle_name',
      Value: this.middle_name
    };
    let dataBirthDate = {
      Name: 'birthdate',
      Value: this.birthdate
    };
    let dataCPF = {
      Name: 'given_name',
      Value: this.cpf
    };
    let dataRG = {
      Name: 'custom:rg',
      Value: this.rg
    }

    let dataGender = {
      Name: 'gender',
      Value: this.gender
    }

    let dataZipCode = {
      Name: 'custom:zip_code',
      Value: this.zip_code
    }

    let dataStreet = {
      Name: 'custom:street',
      Value: this.street
    }

    let dataNumber = {
      Name: 'custom:number',
      Value: this.number
    }

    let dataNeighborhood = {
      Name: 'custom:neighborhood',
      Value: this.neighborhood
    }

    let dataComplement = {
      Name: 'custom:complement',
      Value: this.complement
    }

    let dataState = {
      Name: 'custom:state',
      Value: this.state
    }

    let dataCity = {
      Name: 'custom:city',
      Value: this.city
    }
    let dataHousePhone = {
      Name: 'custom:house_phone',
      Value: this.house_phone
    }

    let dataPhoneNumber = {
      Name: 'custom:phone_number',
      Value: this.phone_number
    }

    let dataPreferredUsername = {
      Name: 'preferred_username',
      Value: identityId
    }
    attributeList.push(dataEmail);
    attributeList.push(dataName);
    attributeList.push(dataMiddleName);
    attributeList.push(dataBirthDate);
    attributeList.push(dataCPF);
    attributeList.push(dataRG);
    attributeList.push(dataGender);
    attributeList.push(dataZipCode);
    attributeList.push(dataStreet);
    attributeList.push(dataNumber);
    attributeList.push(dataNeighborhood);
    attributeList.push(dataComplement);
    attributeList.push(dataState);
    attributeList.push(dataCity);
    attributeList.push(dataHousePhone);
    attributeList.push(dataPhoneNumber);
    if(type == "social") {
      attributeList.push(dataPreferredUsername);
    }
    return attributeList;
  }
  setCognitoUpdate(type,identityId) {
    let attributeList = [];
    let dataRG = {
      Name: 'custom:rg',
      Value: this.rg
    }

    let dataGender = {
      Name: 'gender',
      Value: this.gender
    }

    let dataZipCode = {
      Name: 'custom:zip_code',
      Value: this.zip_code
    }

    let dataStreet = {
      Name: 'custom:street',
      Value: this.street
    }

    let dataNumber = {
      Name: 'custom:number',
      Value: this.number
    }

    let dataNeighborhood = {
      Name: 'custom:neighborhood',
      Value: this.neighborhood
    }

    let dataComplement = {
      Name: 'custom:complement',
      Value: this.complement
    }

    let dataState = {
      Name: 'custom:state',
      Value: this.state
    }

    let dataCity = {
      Name: 'custom:city',
      Value: this.city
    }
    let dataHousePhone = {
      Name: 'custom:house_phone',
      Value: this.house_phone
    }

    let dataPhoneNumber = {
      Name: 'custom:phone_number',
      Value: this.phone_number
    }
    attributeList.push(dataRG);
    attributeList.push(dataGender);
    attributeList.push(dataZipCode);
    attributeList.push(dataStreet);
    attributeList.push(dataNumber);
    attributeList.push(dataNeighborhood);
    attributeList.push(dataComplement);
    attributeList.push(dataState);
    attributeList.push(dataCity);
    attributeList.push(dataHousePhone);
    attributeList.push(dataPhoneNumber);
    return attributeList;
  }
}

function cpf_validate(strCPF) {
  strCPF = strCPF.replace('.', '').replace('-', '');
  let sum;
  let rest;
  sum = 0;
  if (strCPF == "00000000000") return false;

  for (let i = 1; i <= 9; i++) sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if ((rest == 10) || (rest == 11)) rest = 0;
  if (rest != parseInt(strCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if ((rest == 10) || (rest == 11)) rest = 0;
  if (rest != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}

module.exports =  Auth;