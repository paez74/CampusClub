<template>
  <v-app>
    <router-view :key="$route.fullPath" />
    <v-snackbar v-model="showSnackbar">
      {{ snackbarMessage }}
      <v-btn dark @click="showSnackbar = false" flat>OK</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { events } from './main';
export default {
  name: 'App',
  data() {
    return {
      snackbarMessage: '',
      showSnackbar: false
    };
  },
  methods: {
    snackbar(message) {
      this.snackbarMessage = message;
      this.showSnackbar = true;
    }
  },
  mounted() {
    events.$on('snackbar', (message) => {
      this.snackbar(message);
    });
  }
};
</script>

<style>
* {
  font-family: Arial, Helvetica, sans-serif;
}

div[tabindex] {
  outline: none;
}

.cursor-pointer {
  cursor: pointer;
}

.v-list__tile {
  font-size: 12px;
}

.custom-title {
  color: #0b5394;
  font-size: 25px;
  font-weight: bold !important;
}

.action-table-btns {
  display: flex;
  justify-content: center;
}

.delete-dialog .headline {
  justify-content: center;
  font-weight: 700;
}

.delete-dialog .text {
  padding: 20px 0 25px;
}

.delete-dialog .text .v-card__text {
  padding: 0;
}

.delete-dialog .v-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.delete-dialog .v-card .v-card__actions {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

table > tbody > tr > td {
  white-space: nowrap;
}

table > tbody > tr > td > i.v-icon.v-icon--link {
  margin: 0px 10px;
}

.tab-text {
  color: #a4c2f4 !important;
  font-weight: bold;
}

.many-to-one-grid {
  z-index: 1;
}

.many-to-one-input-container {
  display: flex;
  align-items: center;
}

.dialog-input input {
  cursor: pointer;
}

.toolbar-form > div {
  align-items: flex-end;
}

.toolbar-form > div > div,
.toolbar-form > div > button {
  margin-bottom: 13px;
}

.filter-button {
  margin: 20px;
  text-decoration: underline;
  color: dodgerblue;
}

.filter-button i {
  font-size: 12px !important;
  color: inherit !important;
  display: inline-block;
}

.text.divider-container {
  display: flex;
  background-color: var(--v-secondary-lighten5);
  color: var(--v-secondary-lighten1);
  max-width: max-content;
  padding: 0px 15px;
  font-size: 12px;
  align-self: baseline;
}

.text.divider-container > div {
  margin: auto;
}

hr.divider-container {
  border-color: var(--v-secondary-lighten5) !important;
}

.grid-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-container {
  padding: 50px !important;
}

tr.itemToDelete {
  background-color: var(--v-warning-lighten3);
}

/* Grid layout styles */
.grid-container {
  display: grid;
  grid-auto-flow: row;
  justify-items: stretch;
  align-items: stretch;
  padding: 10px 0;
}

.grid-container .wrapper-special {
  text-align: center;
}
.grid-container .wrapper-special:empty {
  display: none;
}

.creation-info-wrapper {
  color: #a2a2a2;
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.creation-info-wrapper > span {
  text-align: center;
  color: #a2a2a2;
}

.currency-input-wrapper,
.percentage-input-wrapper,
.decimal-input-wrapper {
  display: flex;
  flex-direction: row-reverse;
}

.currency-input-wrapper input,
.percentage-input-wrapper input,
.decimal-input-wrapper input {
  text-align: right;
}

.currency-input-wrapper > div.label-prepend,
.percentage-input-wrapper > div.label-prepend,
.decimal-input-wrapper > div.label-prepend {
  font-size: 12px;
  min-width: 125px;
  max-width: 125px;
  text-align: right;
  display: inline-block;
  margin-bottom: auto;
  margin-top: auto;
  -webkit-transition: all 0.2s ease 0s;
  transition: all 0.2s ease 0s;
  margin-right: 9px;
}

.currency-input-wrapper > .error--text + div.label-prepend,
.percentage-input-wrapper > .error--text + div.label-prepend,
.decimal-input-wrapper > .error--text + div.label-prepend {
  color: var(--v-error-base) !important;
  caret-color: var(--v-error-base) !important;
}

.children-title,
.relationship-title {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
}

.children-title > div,
.relationship-title > div {
  display: flex;
  align-items: center;
  width: 100%;
}

.v-input__control > .v-input__slot > .v-label {
  font-size: 12px !important;
}

@media all and (max-width: 1170px) {
  .grid-container {
    grid-template-columns: 100% !important;
  }
  .grid-container * {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }
}

button:not(.v-btn--icon):not(.v-btn--flat):not(.v-btn--floating).v-btn.saveBtn {
  border-radius: 5px;
  width: 80px;
  height: 35px;
}

button:not(.v-btn--icon):not(.v-btn--flat):not(.v-btn--floating).v-btn.backBtn {
  border-radius: 5px;
  width: 80px;
  height: 35px;
}

.v-content .v-toolbar__content {
  padding: 0;
}

.v-list__tile {
  height: 38px !important;
}

.theme--light.v-datatable tr:not(.v-datatable__progress) th {
  background-color: #cccccc;
  color: #0b5394 !important;
  font-weight: bold;
}

.theme--light.v-datatable thead th.column.sortable .v-icon {
  color: #0b5394 !important;
}

.theme--light.v-datatable thead th.column.sortable:hover .v-icon {
  opacity: 0.6;
}

.theme--light.v-datatable thead th.column.sortable.active .v-icon {
  opacity: 0.87;
}

/* Classics styles */
.back-icon {
  font-weight: 800;
  color: var(--v-secondary-darken4);
  color: #0b5394 !important;
}

.v-toolbar__title {
  font-weight: 800;
}

.form-actions-container {
  text-align: center;
}

.form-actions-container button {
  width: 180px !important;
  margin: 15px;
}

.v-input--switch:focus {
  outline-color: transparent;
}

.v-picker .v-picker__body .v-date-picker-table--month button {
  max-width: 160px !important;
  min-width: 40px !important;
  width: 100% !important;
  height: 40px !important;
}

button.v-btn {
  text-transform: none;
}

button:not(.v-btn--floating) {
  border-radius: 3px;
}

.classic-button-icon i {
  margin-right: 10px;
}

.classic-text-field.v-text-field > .v-input__control,
.classic-select-field.v-text-field > .v-input__control,
.classic-dialog-input.v-text-field > .v-input__control,
.classic-date-input .v-text-field > .v-input__control {
  margin-top: auto;
  margin-bottom: auto;
  height: inherit;
}

.classic-text-field.v-text-field > .v-input__control > .v-input__slot,
.classic-select-field.v-text-field > .v-input__control > .v-input__slot,
.classic-dialog-input.v-text-field > .v-input__control > .v-input__slot,
.classic-date-input .v-text-field > .v-input__control > .v-input__slot {
  margin-bottom: 0px;
}

.classic-text-field.v-text-field > .v-input__control > .v-input__slot:before,
.classic-text-field.v-text-field > .v-input__control > .v-input__slot:after,
.classic-select-field.v-text-field > .v-input__control > .v-input__slot:before,
.classic-select-field.v-text-field > .v-input__control > .v-input__slot:after,
.classic-dialog-input.v-text-field > .v-input__control > .v-input__slot:before,
.classic-dialog-input.v-text-field > .v-input__control > .v-input__slot:after,
.classic-date-input .v-text-field > .v-input__control > .v-input__slot:before,
.classic-date-input .v-text-field > .v-input__control > .v-input__slot:after {
  content: none;
}

.classic-text-field.v-input,
.classic-select-field.v-text-field,
.classic-dialog-input.v-text-field,
.classic-date-input .v-text-field {
  align-items: baseline;
  margin-top: unset;
  padding-top: unset;
  height: min-content;
}

.classic-text-field.v-text-field .v-text-field__slot,
.classic-text-field .v-text-field__slot {
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  border-color: #dedede;
  background-color: #ffffff;
  padding: 8px 10px 8px !important;
  max-height: none !important;
}

.classic-text-field.v-textarea .v-text-field__slot {
  height: inherit;
}

.classic-text-field textarea {
  height: inherit;
}

.classic-text-field:not(.v-textarea) .v-text-field__slot {
  height: 40px;
}

.classic-text-field .v-text-field__slot:focus-within,
.classic-text-field .v-text-field__slot:focus-within {
  background-color: #fff8cc;
  border-color: #ffcc00;
}

.classic-text-field .v-text-field__slot:has(input[disabled='disabled']),
.classic-text-field .v-text-field__slot:has(textarea[disabled='disabled']) {
  background-color: #f2f4f7;
  border-color: #dedede;
}

.classic-dialog-input.v-input--is-disabled,
.classic-dialog-input.v-input--is-disabled input,
.classic-date-input .v-input--is-disabled,
.classic-date-input .v-input--is-disabled input {
  cursor: default;
}

.classic-dialog-input.v-input--is-disabled .v-input__slot,
.classic-date-input .v-input--is-disabled .v-input__slot {
  background-color: #f2f4f7;
  border-color: #dedede;
}

.classic-date-input .prepend-label {
  min-width: 125px;
  max-width: 125px;
  color: black !important;
}

.classic-text-field .v-input__prepend-outer,
.classic-select-field .v-input__prepend-outer,
.classic-dialog-input .v-input__prepend-outer {
  color: black !important;
}

.classic-text-field .v-input__prepend-outer > span,
.classic-select-field .v-input__prepend-outer > span,
.classic-dialog-input .v-input__prepend-outer > span,
.classic-date-input .prepend-label > span {
  color: var(--v-error-base);
}

.classic-text-field.error--text .v-input__prepend-outer,
.classic-select-field.error--text .v-input__prepend-outer,
.classic-dialog-input.error--text .v-input__prepend-outer {
  color: var(--v-error-base) !important;
}

.classic-text-field .v-text-field__details,
.classic-select-field .v-text-field__details,
.classic-dialog-input .v-text-field__details,
.classic-date-input .v-text-field__details {
  display: none;
}

.classic-date-input .prepend-label {
  font-size: 12px;
}

.v-input__prepend-outer {
  font-size: 12px;
  min-width: 125px;
  max-width: 125px;
  text-align: right;
  display: inline-block;
  margin-bottom: auto;
  margin-top: auto;
  -webkit-transition: all 0.2s ease 0s;
  -moz-transition: all 0.2s ease 0s;
  -o-transition: all 0.2s ease 0s;
  transition: all 0.2s ease 0s;
}

.classic-select-field.v-select .v-select__slot,
.classic-dialog-input .v-input__slot,
.classic-date-input .v-input__slot {
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  border-color: #dedede;
  height: 40px;
  padding-left: 10px;
  background-color: #ffffff;
}

.classic-select-field.v-select .v-select__slot:focus-within,
.classic-dialog-input .v-input__slot:focus-within,
.classic-date-input .v-input__slot:focus-within {
  border-color: #6c0d2b;
}

.classic-select-field.v-select.v-input--is-disabled .v-select__slot,
.classic-dialog-input.v-select.v-input--is-disabled .v-select__slot,
.classic-date-input .v-select.v-input--is-disabled .v-select__slot {
  background-color: #f2f4f7;
  border-color: #dedede;
}

.classic-select-field .v-input__control,
.classic-dialog-input .v-input__control,
.classic-date-input .v-input__control {
  width: calc(100% - 125px);
}

.classic-select-field .v-select__selections,
.classic-dialog-input .v-select__selections,
.classic-date-input .v-select__selections {
  width: calc(100% - 35px);
}

.classic-select-field .v-select__selection,
.classic-dialog-input .v-select__selection,
.classic-date-input .v-select__selection {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.classic-select-field.v-text-field .v-input__append-inner,
.classic-dialog-input.v-text-field .v-input__append-inner,
.classic-date-input .v-text-field .v-input__append-inner {
  align-self: center;
}

.classic-date-input .v-text-field .v-input__append-inner {
  padding-right: 4px;
  margin-top: 0;
}

.classic-select-field.v-text-field .v-input__append-inner i,
.classic-dialog-input.v-text-field .v-input__append-inner i,
.classic-date-input .v-text-field .v-input__append-inner i {
  color: #3a4151 !important;
}

.classic-table table {
  background-color: #ffffff;
  border-style: solid;
  border-width: 1px;
  border-color: #e0e0e0;
}

.classic-table table.v-table tbody td,
.classic-table table.v-table th,
.classic-table table.v-table thead tr {
  height: 30px;
  font-size: 12px;
}

.classic-table .v-expansion-panel__header {
  min-height: 30px;
  height: 30px;
}

.v-input--checkbox,
.v-input--switch {
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  margin-top: unset;
  padding-top: unset;
}

.v-input--checkbox:focus,
.v-input--switch:focus {
  outline: none;
}
</style>
