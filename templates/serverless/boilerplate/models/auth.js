'use strict';

const validator = require('validator');
const passwordValidator = require('password-validator');
const {Validate,helperBuildResponse} = require('../helpers')
var crypto = require('crypto')

class Auth {
  constructor(name, email, cpf, password, middle_name, birthdate, gender,
    zip_code, street, number, neighborhood, complement, state, city, phone_number,code,new_password) {
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.password = password;
    this.new_password = new_password;
    this.middle_name = middle_name;
    this.birthdate = birthdate;
    this.gender = gender;
    this.zip_code = zip_code;
    this.street = street;
    this.number = number;
    this.neighborhood = neighborhood;
    this.complement = complement;
    this.state = state;
    this.city = city;
    this.phone_number = phone_number;
    this.code = code;
  }

  set(params) {
    this.name = params.name;
    this.email = params.email;
    this.cpf = params.cpf;
    this.password = params.password;
    this.new_password = params.new_password;
    this.middle_name = params.middle_name;
    this.birthdate = params.birthdate;
    this.gender = params.gender;
    this.zip_code = params.zip_code;
    this.street = params.street;
    this.number = params.number;
    this.neighborhood = params.neighborhood;
    this.complement = params.complement;
    this.state = params.state;
    this.city = params.city;
    this.code = params.code;
    this.phone_number = params.phone_number ? `+55${params.phone_number}` : null;

  }

  validate(callback){
        // Create a schema
    var passwordSchema = new passwordValidator();
    passwordSchema.is().min(8).has().uppercase().has().lowercase().has().digits();
    let valid = { status: true, message:"" }
    if (this.email && !validator.isEmail(this.email)){
      valid = { status: false, message: "Email inválido", code: "010" }
    } else if(this.cpf && !Validate.cpf_validate(this.cpf)){
      valid = { status: false, message: "CPF inválido", code: "011" }
    } else if(this.phone_number && this.phone_number.length !== 14 ){
      valid = { status: false, message: "Celular inválido", code: "012" }
    }else if(this.password && !passwordSchema.validate(this.password)){
      valid = { status: false, message: "Formato senha inválida", code: "014" }
    }
    console.log('VALID',valid)
    if(valid.status){
    
      return true
    }else{
      const response = helperBuildResponse.buildResponse({
        statusCode: 422,
        body: valid
      });
      callback(null, response);
    }
  }
  requireLoginParams(callback){
    let required = { status: true, parameter: '' }
      if (typeof this.phone_number ==="undefined" || this.phone_number === ""){
        required.status = false;
        required.parameter = 'phone_number';
      }else if(typeof this.password ==="undefined"|| this.password === ""){
        required.status = false;
        required.parameter = 'password';
      }
      if(required.status){
        return true
      }else{
        const response = helperBuildResponse.buildResponse({
          statusCode: 422,
          body:{ message: "Params missing " + required.parameter }
        });
        callback(null, response);
      }
  }
  requireChangePasswordParams(callback){
    let required = { status: true, parameter: '' }
      if (typeof this.new_password ==="undefined" || this.new_password === ""){
        required.status = false;
        required.parameter = 'new_password';
      }else if(typeof this.password ==="undefined"|| this.password === ""){
        required.status = false;
        required.parameter = 'password';
      }
      if(required.status){
        return true
      }else{
        const response = helperBuildResponse.buildResponse({
          statusCode: 422,
          body:{ message: "Params missing " + required.parameter }
        });
        callback(null, response);
      }
  }
  requireConfirmForgotPasswordParams(callback) {
    let required = { status: true, parameter: '' }
    if (typeof this.code === "undefined" || this.code === "") {
      required.status = false;
      required.parameter = 'Verification code';
    } else if (typeof this.phone_number === "undefined" || this.phone_number === "") {
      required.status = false;
      required.parameter = 'Celular';
    }else if (typeof this.code === "undefined" || this.code === "") {
      required.status = false;
      required.parameter = 'Verification code';
    }
    if(required.status){
      return true
    }else{
      const response = helperBuildResponse.buildResponse({
        statusCode: 422,
        body:{ message: "Params missing " + required.parameter }
      });
      callback(null, response);
    }
  }
  requireForgotPasswordParams(callback){
    let required = { status: true, parameter: '' }
      if (typeof this.phone_number ==="undefined" || this.phone_number === ""){
        required.status = false;
        required.parameter = 'phone_number';
      }
      if(required.status){
        return true
      }else{
        const response = helperBuildResponse.buildResponse({
          statusCode: 422,
          body:{ message: "Params missing " + required.parameter }
        });
        callback(null, response);
      }
  }
  requireParams(callback) {
    let required = { status: true, parameter: '' }

    if (typeof this.cpf === "undefined" || this.cpf === "") {
      required.status = false;
      required.parameter = 'CPF';
    } else if (typeof this.password === "undefined" || this.password === "") {
      required.status = false;
      required.parameter = 'Senha';
    }else if (typeof this.phone_number === "undefined" || this.phone_number === "") {
      required.status = false;
      required.parameter = 'Celular';
    }else if (typeof this.middle_name === "undefined" || this.middle_name === "") {
      required.status = false;
      required.parameter = 'Sobrenome';
    } else if (typeof this.name === "undefined" || this.name === "") {
      required.status = false;
      required.parameter = 'Nome';
    }
    
    if(required.status){
      return true
    }else{
      const response = helperBuildResponse.buildResponse({
        statusCode: 422,
        body:{ message: "Params missing " + required.parameter }
      });
      callback(null, response);
    }
  }
  requireParamsConfirm(callback) {
    let required = { status: true, parameter: '' }
    if (typeof this.code === "undefined" || this.code === "") {
      required.status = false;
      required.parameter = 'Verification code';
    } else if (typeof this.phone_number === "undefined" || this.phone_number === "") {
      required.status = false;
      required.parameter = 'Celular';
    }
    if(required.status){
      return true
    }else{
      const response = helperBuildResponse.buildResponse({
        statusCode: 422,
        body:{ message: "Params missing " + required.parameter }
      });
      callback(null, response);
    }
  }
  getValueFromCognito(field, params) {
    for (let i = 0; i < params.length; i++) {
      if (params[i]['Name'] === field) {
        return params[i]['Value'];
      }
    }
    return '';
  };
  setCognito() {
    let attributeList = [];
    let dataName = {
      Name: 'name',
      Value: this.name
    };
    let dataMiddleName = {
      Name: 'middle_name',
      Value: this.middle_name
    };
    let dataPhoneNumber = {
      Name: 'phone_number',
      Value: this.phone_number
    }
    if(this.name) attributeList.push(dataName);
    if(this.middle_name) attributeList.push(dataMiddleName);
    if(this.phone_number) attributeList.push(dataPhoneNumber);

    return attributeList;
  }
   buildUser(data) {
    return {
      email: this.getValue("email", data.UserAttributes),
      name: this.getValue("name", data.UserAttributes),
      middle_name: this.getValue("middle_name", data.UserAttributes),
      birthdate: this.getValue("birthdate", data.UserAttributes),
      cpf: this.getValue("given_name", data.UserAttributes),
      rg: this.getValue("custom:rg", data.UserAttributes),
      gender: this.getValue("gender", data.UserAttributes),
      zip_code: this.getValue("custom:zip_code", data.UserAttributes),
      street: this.getValue("custom:street", data.UserAttributes),
      number: this.getValue("custom:number", data.UserAttributes),
      neighborhood: this.getValue("custom:neighborhood", data.UserAttributes),
      complement: this.getValue("custom:complement", data.UserAttributes),
      state: this.getValue("custom:state", data.UserAttributes),
      city: this.getValue("custom:city", data.UserAttributes),
      house_phone: this.getValue("custom:house_phone", data.UserAttributes),
      phone_number: this.getValue("custom:phone_number", data.UserAttributes),
      valide: true
    };
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
  hashSecret(clientSecret, username, clientId) {
     return crypto.createHmac('SHA256', clientSecret)
      .update(username + clientId)
      .digest('base64')
  }
  getValue(field, params) { 
    let attribute = params.find(k => k.Name === field)
    if(attribute){
      return attribute.Value
    }
    return "";
  }
  
}

 
module.exports =  Auth;