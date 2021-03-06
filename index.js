'use strict';

import { defaults } from 'wreck';
let wreck

export default class BillplzV4 {

  constructor(options) {

    this._apiKey = null
    this._apiEndpoint = 'https://www.billplz.com/api/v3/'
    this._sandboxApiEndpoint = 'https://billplz-sandbox.com/api/v3/'
    this._apiEndpoint_v4 = 'https://www.billplz.com/api/v4/'
    this._sandboxApiEndpoint_v4 = 'https://www.billplz-sandbox.com/api/v4/'
    this._isSandbox = false

    if (typeof options === 'object') {
      this._apiKey = options.key || this._apiKey
      this._apiEndpoint = options.endpoint || this._apiEndpoint
      this._sandboxApiEndpoint = options.sandboxEndpoint || this._sandboxApiEndpoint
      this._isSandbox = options.sandbox || this._isSandbox
    }
    else {
      this._apiKey = options
    }

    if (this._isSandbox) {
      this._apiEndpoint = this._sandboxApiEndpoint
      this._apiEndpoint_v4 = this._sandboxApiEndpoint_v4
    }

    wreck =  defaults({
      headers: { 'Authorization': 'Basic ' + new Buffer.alloc(this._apiKey).toString('base64') }
    });
  }

  request(method, params, callback) {
    wreck.post(this._apiEndpoint + method, {
        payload: params
      }, (err, res, payload) => {
        callback(err, JSON.parse(payload.toString()))
    });
  }

  requestv4(method, params, callback) {
    wreck.post(this._apiEndpoint_v4 + method, {
        payload: params
      }, (err, res, payload) => {
        callback(err, JSON.parse(payload.toString()))
    });
  }

  /* Billplz version 3 API */

  //create collection
  create_collection(params, callback) {
    return this.request('collections', params, callback)
  }

  //create open collection
  create_collectionOpen(params, callback) {
    return this.request('open_collections', params, callback)
  }

  //create bill
  create_bill(params, callback) {
    return this.request('bills', params, callback)
  }

  //get bill
  get_bill(billId, callback) {
    wreck.get(this._apiEndpoint + 'bills/' + billId, (err, res, payload) => {
      callback(err, JSON.parse(payload.toString()))
    });
  }

  //delete bill
  delete_bill(billId, callback) {
    wreck.delete(this._apiEndpoint + 'bills/' + billId, (err, res, payload) => {
      callback(err, JSON.parse(payload.toString()))
    });
  }

  //change collection status
  change_collection_status(collectionId, status, callback) {
    wreck.post(this._apiEndpoint + 'collections/' + collectionId + '/' + status, (err, res, payload) => {
      callback(err, JSON.parse(payload.toString()))
    });
  }

  //registration check - company
  registration_check(bankAccountNumber, callback) {
    wreck.get(this._apiEndpoint + 'check/bank_account_number/' + bankAccountNumber, (err, res, payload) => {
      callback(err, JSON.parse(payload.toString()))
    });
  }

  //get bank account - individual
  get_bank_account(bankAccountNumber, callback) {
    wreck.get(this._apiEndpoint + 'bank_verification_services/' + bankAccountNumber, (err, res, payload) => {
      callback(err, JSON.parse(payload.toString()));
    });
  }

  //create bank account
  //please refer https://www.billplz-sandbox.com/api#v3-bank-account-direct-verification-create-a-bank-account-bank-code-table
  create_bank_account(params, callback) {
    return this.request('bank_verification_services', params, callback);
  }

  /* Billplz version 4 API */

  //payout method
  create_payout(params, callback) {
    return this.requestv4('mass_payment_instructions', params, callback);
  }
}
