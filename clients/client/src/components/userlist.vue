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
        Usuario
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="classic-button-icon"
        v-if="credentials.userCreate"
        color="primary"
        @click="goTo('userform')"
      >
        <v-icon dark>person_add</v-icon>Agregar
      </v-btn>
    </v-toolbar>
    <v-text-field
      v-model="search"
      class="classic-text-field"
      @input="searchOnTable"
    >
      <template slot="prepend"
        >Búsqueda:</template
      >
    </v-text-field>

    <br />
    <v-divider class="divider-container"></v-divider>
    <br />

    <entity-list-table :config="tableConfig" :list="list" :loading="loading">
      <template slot-scope="{ props }">
        <td class="text-xs-left">{{ props.item.username }}</td>
        <td class="text-xs-left">{{ props.item.firstName }}</td>
        <td class="text-xs-left">{{ props.item.lastName }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
      </template>
    </entity-list-table>
    <image-preview
      v-if="showImageModal"
      :imageId="imagePreviewId"
      @close="closeImage"
    ></image-preview>
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
      search: '',
      showImageModal: false,
      imagePreviewId: '',
      fromCatalog: this.$route.params.from_catalog ? true : false,
      tableConfig: {
        headers: [
          {
            text: 'Usuario',
            value: 'username',
            haveViewPermission: true
          },
          {
            text: 'Nombre',
            value: 'firstName',
            haveViewPermission: true
          },
          {
            text: 'Apellido',
            value: 'lastName',
            haveViewPermission: true
          },
          {
            text: 'Correo',
            value: 'email',
            haveViewPermission: true
          }
        ],
        enableContextMenu: true,
        hasLoading: true,

        pagination: {},
        classicTheme: true,
        actions: (type, item) => {
          const actionsMap = {
            view: () => this.goTo('userdetail/' + item.id),
            edit: () => this.goTo('userform/' + item.id),
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
        .get('user')
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
      this.$http.delete('user/' + id).then(
        (response) => {
          this.itemToDelete = '';
          this.getList();
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
          (item.username
            ? item.username.toLowerCase().includes(self.search.toLowerCase())
            : 1 === 2) ||
          (item.firstName
            ? item.firstName.toLowerCase().includes(self.search.toLowerCase())
            : 1 === 2) ||
          (item.lastName
            ? item.lastName.toLowerCase().includes(self.search.toLowerCase())
            : 1 === 2)
        );
      });
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    closeImage() {
      this.showImageModal = false;
    }
  },
  mounted() {
    this.getList();
  },
  watch: {}
};
</script>
