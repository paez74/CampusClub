<template>
  <div>
    <v-dialog v-model="dialog" max-width="75%" scrollable>
      <v-card>
        <v-card-text>
          <v-toolbar flat color="transparent">
            <v-toolbar-title>
              Campus Clubes
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-text-field
            v-model="search"
            label="Búsqueda:"
            @input="searchOnTable"
          >
          </v-text-field>
          <br />
          <v-data-table :headers="headers" :items="list" :loading="loading">
            <v-progress-linear
              slot="progress"
              color="primary"
              indeterminate
            ></v-progress-linear>
            <template slot="items" slot-scope="props">
              <tr @click="select(props.item)" class="cursor-pointer">
                <td class="text-xs-left">{{ props.item.name }}</td>
                <td class="text-xs-left">{{ props.item.phone }}</td>
              </tr>
            </template>
            <template slot="no-data">
              No hay registros para sus parámetros de búsqueda. Favor de
              intentar otra búsqueda o crear uno nuevo.
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { events } from '../../main';
import {
  formatDate,
  formatDateToTimeOnly,
  formatStringTime
} from '../../utils/util';
import Modal from '../../mixins/modal';
import { _ } from 'underscore';
import moment from 'moment-timezone';

export default {
  mixins: [Modal],
  props: {
    parent: {
      type: String,
      default: ''
    },
    searchParams: {
      type: Object
    }
  },
  components: {},
  data() {
    return {
      list: [],
      source: [],
      search: '',
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Telefono', value: 'phone' }
      ],
      loading: true,
      deleteDialog: false
    };
  },
  methods: {
    getList: function() {
      this.$http
        .get(this.parent + '/campusClublist', { params: this.searchParams })
        .then(
          (response) => {
            var list = response.body.data;
            this.list = list;
            this.source = list;
            this.loading = false;
          },
          (error) => {
            this.snackbar(
              error.message || 'Hubo un problema al obtener la lista'
            );
          }
        );
    },
    dataInit() {
      var self = this;
      this.getList();
    },
    searchOnTable: function() {
      var self = this;
      this.list = _.filter(this.source, function(item) {
        return (
          1 === 2 ||
          item.name.includes(self.search) ||
          item.phone.includes(self.search)
        );
      });
    },
    select(item) {
      this.$emit('save', item);
      this.$emit('close');
    }
  },
  mounted() {
    this.dataInit();
  },
  filters: {
    moment: function(date) {
      return formatDate(date);
    }
  }
};
</script>
