import moment from 'moment-timezone';

import { i18n } from './locales/default';

const datePattern = 'dddd DD MMMM YYYY';

export const formatDate = function(date) {
  if (date == undefined) return null;
  return moment(date)
    .locale(i18n.locale)
    .format(datePattern);
};

export const isDateValid = function(date) {
  moment.locale('es');
  const dateToValidate = moment(date, datePattern, true);
  return dateToValidate.isValid();
};

export const parseDateForPicker = function(date) {
  if (date == undefined) return null;
  return moment(date, datePattern, i18n.locale).format('YYYY-MM-DD');
};

export const formatDateToTimeOnly = function(date) {
  if (date == undefined) return null;
  return moment(date)
    .locale(i18n.locale)
    .format('hh:mm:ss');
};

export const formatStringTime = function(time) {
  if (time == undefined) return null;
  return moment
    .utc(moment.duration(time).asMilliseconds())
    .locale(i18n.locale)
    .format('hh:mm:ss');
};

export const formatCurrency = function(value) {
  if (value == undefined) return null;
  value = Number(value);
  return '$ ' + value.toFixed(2);
};

export const formatPercentageToPercentageNumber = function(value) {
  if (value == undefined) return null;
  value = Number(value) * 100;
  return value.toFixed(2) + '%';
};

export const parsePercentageToNumber = function(value) {
  if (value == undefined) return null;
  value = Number(value);
  return value * 100;
};

export const parseNumberToPercentage = function(value) {
  if (value == undefined) return null;
  value = Number(value);
  return value / 100.0;
};

export const currency_config = {
  precision: true,
  decimal: '.',
  thousands: ',',
  prefix: '$ ',
  precision: 2,
  masked: false,
  allowBlank: false
};

export const percentage_config = {
  precision: true,
  decimal: '.',
  thousands: ',',
  suffix: '%',
  precision: 2,
  masked: false,
  allowBlank: false
};

export const decimal_config = {
  precision: true,
  decimal: '.',
  thousands: ',',
  precision: 2,
  masked: false,
  allowBlank: false
};

export const printList = function(headers, list, entity, window) {
  let popupWin;
  let sheets = entity.styleSheets;
  var stylesNodes = [];
  for (var c = 0; c < sheets.length; c++) {
    stylesNodes.push(sheets.item(c).ownerNode);
  }
  popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
  var htmlNode = popupWin.document.childNodes.item(0);
  var headNode = htmlNode.childNodes.item(0);
  var bodyNode = htmlNode.childNodes.item(1);
  stylesNodes.forEach((styleNode) => {
    headNode.appendChild(styleNode.cloneNode(true));
  });
  //Table
  var displayTable = document
    .querySelector('.list-table')
    .querySelector('table');
  var tableNode = popupWin.document.createElement('table');
  tableNode.setAttribute('class', displayTable.className);
  bodyNode.appendChild(tableNode);
  //Thead
  var displayTh = displayTable.querySelector('th');
  var theadNode = popupWin.document.createElement('thead');
  tableNode.appendChild(theadNode);
  var headerNode = popupWin.document.createElement('tr');
  theadNode.appendChild(headerNode);
  headers.forEach((header) => {
    var thNode = popupWin.document.createElement('th');
    thNode.setAttribute('class', displayTh.className);
    thNode.textContent = header.display;
    headerNode.appendChild(thNode);
  });
  //Tbody
  var displayTd = displayTable.querySelector('td');
  var tbodyNode = popupWin.document.createElement('tbody');
  tableNode.appendChild(tbodyNode);
  list.forEach((row) => {
    var trNode = popupWin.document.createElement('tr');
    tbodyNode.appendChild(trNode);
    headers.forEach((header) => {
      var tdNode = popupWin.document.createElement('td');
      tdNode.setAttribute('class', displayTd.className);
      switch (header.type) {
        case 'date':
          tdNode.textContent = moment(row[header])
            .locale('es')
            .format('LL');
          break;
        case 'boolean':
          tdNode.textContent = row[header] ? 'Sí' : 'No';
          break;
        case 'icon':
          var iNode = popupWin.document.createElement('i');
          iNode.setAttribute(
            'class',
            'v-icon material-icons theme--light secondary--text'
          );
          iNode.textContent = row[header.name];
          tdNode.appendChild(iNode);
          break;
        case 'object':
          var property;
          header.name.split('.').forEach((key) => {
            if (property) {
              property = property[key];
            } else {
              property = row[key];
            }
          });
          tdNode.textContent = property;
          break;
        case 'array':
          var text = '';
          var keys = header.name.split('.');
          row[keys[0]].forEach((x) => {
            text += x[keys[1]] + ' ';
          });
          tdNode.textContent = text;
          break;
        default:
          tdNode.textContent = row[header.name];
      }
      trNode.appendChild(tdNode);
    });
  });
  setTimeout(function() {
    popupWin.print();
    popupWin.close();
  }, 0);
};
