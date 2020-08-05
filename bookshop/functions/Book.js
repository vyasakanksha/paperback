"use strict";

// [START import]
const path = require('path');
const os = require('os');
const neatCsv = require('neat-csv');
const csvtojson = require("csvtojson")
var books = require('google-books-search');
const {google} = require('googleapis');
const fs = require('fs');
var array = require('lodash/array');

const PROVIDER_NAMES = {
    HANDYLIBRARY: 'handylib',
    BOOKBUDDY: 'bookbuddy',
  }

const extractFieldsBB = [
    'ISBN', 
    'Title',
    'Author',
    'Publisher',
    'Date Added',
    'Uploaded Image URL',
    'Category',
    'List Price'
];

const extractFieldsHL = [
    'ISBN',
    'Title',
    'Author',
    'Publisher',
    'Date added',
    'Photo_Path',
    'Bookshelf',
    'Price'
];


class Book {
    constructor(isbn, name, author, publisher, dateAdded, image_filename, category, price) {
        this.isbn = isbn
        this.name = name
        this.author = author
        this.publisher = publisher
        this.dateAdded = dateAdded
        this.filename = image_filename
        this.category = category
        this.price = price
    }

}

module.exports.Book =  Book;