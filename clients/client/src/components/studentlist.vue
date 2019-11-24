<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="custom-title">
        <v-icon
          class="cursor-pointer back-icon"
          v-if="fromCatalog"
          @click="$router.go(-1)"
          >keyboard_arrow_left</v-icon
        >
        Estudiante
      </v-toolbar-title>
      <a class="filter-button" @click="showFilters = !showFilters"
        >Filtros <v-icon small>arrow_drop_down</v-icon></a
      >
      <v-spacer></v-spacer>
      <v-btn
        class="classic-button-icon"
        v-if="credentials.studentCreate"
        color="primary"
        @click="goTo('studentform')"
      >
        <v-icon dark>person_add</v-icon>Agregar
      </v-btn>
    </v-toolbar>
    <v-form v-if="showFilters">
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 sm4 md4>
            <v-text-field
              v-model="search.status"
              class="classic-text-field"
              :rules="[]"
            >
              <template slot="prepend"
                >Estatus</template
              >
            </v-text-field>
          </v-flex>

          <v-flex xs12 sm4 md4>
            <v-select
              v-model="search.major"
              :items="relationshipsOptions.major"
              class="classic-select-field"
              item-text="label"
              item.value="value"
            >
              <template slot="prepend"
                >Departamento</template
              >
            </v-select>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <br />
    <v-divider class="divider-container"></v-divider>
    <br />

    <entity-list-table :config="tableConfig" :list="list" :loading="loading">
      <template slot-scope="{ props }">
        <td class="text-xs-left">{{ props.item.status }}</td>
        <td class="text-xs-left">
          {{ props.item.major ? props.item.major.name : '' }}
        </td>
      </template>
    </entity-list-table>
  </div>
</template>

<script>
import List from '../mixins/list';
import { printList, parseDateForPicker } from '../utils/util';
import _ from 'underscore';
import moment from 'moment-timezone';
import entityListTable from './entity-list-table';
export default {
  mixins: [List],
  components: {
    entityListTable
  },
  data() {
    return {
      relationshipsOptions: {},
      search: {},
      showFilters: false,
      fromCatalog: this.$route.params.from_catalog ? true : false,
      tableConfig: {
        headers: [
          {
            text: 'Estatus',
            value: 'status',
            haveViewPermission: true
          },
          {
            text: 'Departamento',
            value: 'major.name',
            haveViewPermission: true
          }
        ],
        enableContextMenu: true,
        hasLoading: true,
        showView: () => this.credentials.studentRead,
        showEdit: () => this.credentials.studentUpdate,
        showDelete: () => this.credentials.studentDelete,
        pagination: {},
        classicTheme: true,
        actions: (type, item) => {
          const actionsMap = {
            view: () => this.goTo('studentdetail/' + item.id),
            edit: () => this.goTo('studentform/' + item.id),
            delete: () => this.deleteRegistry(item.id)
          };
          actionsMap[type]();
        }
      }
    };
  },
  methods: {
    getList: function() {
      this.$http
        .get('student')
        .then(
          (response) => {
            var list = response.body.data;
            this.list = list;
            this.source = list;
          },
          (error) => {
            this.snackbar(
              error.message || 'Hubo un problema al obtener la lista'
            );
            console.error(error);
          }
        )
        .finally(() => {
          this.loading = false;
        });
    },
    deleteRegistry(id) {
      this.showConfirm = false;
      this.$http.delete('student/' + id).then(
        (response) => {
          this.itemToDelete = '';
          this.searchByParams();
          this.snackbar(
            response.body.message || 'El registro ha sido eliminado con éxito'
          );
        },
        (error) => {
          this.itemToDelete = '';
          this.snackbar(
            error.body.message || 'Hubo un problema al eliminar el registro'
          );
          console.error(error);
        }
      );
    },
    searchOnTable: function() {
      var self = this;
      this.list = _.filter(this.source, function(item) {
        return (
          1 === 2 ||
          (item.status
            ? item.status.toLowerCase().includes(self.search.toLowerCase())
            : 1 === 2)
        );
      });
    },
    clean(field) {
      this.search[field] = null;
      this.$refs[`${field}Menu`].save(this.search[field]);
    },
    searchByParams: function(updateOptions = false) {
      this.loading = true;
      var queryString = Object.keys(this.search)
        .filter((key) => this.search[key] !== '')
        .map((key) => key + '=' + this.search[key])
        .join('&');
      this.$http.get(`student/search?${queryString}`).then(
        (response) => {
          var list = response.body.data;
          this.list = list;
          this.source = list;
          if (updateOptions) {
            this.setRelationshipsOptions();
          }
          this.loading = false;
        },
        (error) => {
          this.snackbar(
            error.message || 'Hubo un problema al obtener la lista'
          );
          console.error(error);
        }
      );
    },
    setRelationshipsOptions: function() {
      this.relationshipsOptions.major = [];
      this.list.forEach((element, index) => {
        if (!element.memberOf) element.memberOf = {};
        if (!element.major) element.major = {};
        if (element.major != null)
          this.relationshipsOptions.major.push({
            label: element.major.name,
            value: element.major.id
          });
      });
      this.relationshipsOptions.major = _.sortBy(
        this.relationshipsOptions.major,
        'label'
      );
      this.relationshipsOptions.major.unshift({ label: '', value: '' });
    }
  },
  mounted() {
    this.searchByParams(true);
  },
  watch: {
    search: {
      handler(value) {
        this.debouncedSearchFilter();
      },
      deep: true,
      immediate: false
    }
  },
  created: function() {
    this.debouncedSearchFilter = _.debounce(this.searchByParams, 500);
  }
};
</script>
