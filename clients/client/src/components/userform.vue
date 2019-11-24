<template>
  <div>
    <v-progress-linear
      :indeterminate="requesting"
      v-if="requesting"
      class="loading"
    ></v-progress-linear>
    <v-form ref="form" v-model="valid">
      <v-toolbar dense flat color="transparent" class="toolbar-form">
        <v-toolbar-title class="custom-title">
          <v-icon class="cursor-pointer back-icon" @click="goBack()"
            >keyboard_arrow_left</v-icon
          >
          {{ title }} Usuario
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div ref="printForm">
        <div class="grid-container">
          <div class="wrapper-558416" tabindex="0">
            <v-text-field
              v-model="form.username"
              class="classic-text-field"
              :disabled="view"
              :rules="[(v) => !!v || 'Campo requerido']"
            >
              <template slot="prepend"
                >Usuario<span>*</span></template
              >
            </v-text-field>
          </div>
          <div class="wrapper-4939208" tabindex="1">
            <v-text-field
              v-model="form.email"
              class="classic-text-field"
              :rules="[
                (v) => !!v || 'Campo requerido',
                (v) => /.+@.+/.test(v) || 'Campo no válido'
              ]"
              :disabled="view"
            >
              <template slot="prepend"
                >Correo<span>*</span></template
              >
            </v-text-field>
          </div>
        </div>
      </div>
    </v-form>
    <image-preview
      v-if="showImageModal"
      :imageId="imagePreviewId"
      @close="showImageModal = false"
    ></image-preview>
  </div>
</template>

<script>
import Form from '../mixins/form';
import { _ } from 'underscore';
import moment from 'moment-timezone';
import entityListTable from './entity-list-table';

export default {
  mixins: [Form],
  components: {
    entityListTable
  },
  data() {
    return {
      title: 'Agregar',
      valid: true,
      requesting: false,
      view: false,
      id: '',
      moment,
      grandParent: 'user',
      showImageModal: false,
      imagePreviewId: '',
      form: {
        roles: []
      },
      roles: [],
      showSelectRole: false,
      roleTableConfig: {
        headers: [
          { text: 'Perfil', value: 'code' },
          { text: 'Nombre', value: 'name' },
          { text: 'Activo', value: 'active' }
        ],
        enableContextMenu: true,
        hasLoading: false,
        showView: false,
        showEdit: false,
        showDelete: () => this.credentials.roleDelete && !this.view,
        pagination: {},
        classicTheme: true,
        actions: (type, item) => {
          const actionsMap = {
            delete: () => this.deleteRole(item)
          };
          actionsMap[type]();
        }
      },

      passwordRules: []
    };
  },
  methods: {
    dataInit() {
      var self = this;
      if (this.id) {
        this.getRegistry(this.id);
      } else {
        this.$http.get('user/form').then((response) => {
          var newform = response.body.data.user;
          newform.roles = [];
          this.form = newform;
          _.each(response.body.data.roles, function(item) {
            item.selected = false;
          });
          self.roles = response.body.data.roles;
        });
      }
    },
    selectRole(role) {
      var self = this;
      if (!role.selected) {
        self.form.roles = _.filter(self.form.roles, function(relation) {
          return relation.id !== role.id;
        });
      } else {
        if (!self.form.roles) {
          self.form.roles = [];
        }
        self.form.roles.push(role);
      }
    },
    deleteRole(item) {
      this.form.roles = _.reject(this.form.roles, function(i) {
        return i === item;
      });
      if (this.form.rolesToDelete) {
        this.form.rolesToDelete.push(item);
      } else {
        this.form.rolesToDelete = [item];
      }
    },
    openSelectRole() {
      if (!this.view) {
        this.showSelectRole = true;
      }
    },
    setRole(item) {
      let exist = _.find(this.form.roles, (t) => t.id == item.id);
      if (exist) {
        this.snackbar('Relación ya existente');
      } else {
        this.form.roles = this.form.roles.concat(item);
      }
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    getRegistry(id) {
      this.requesting = true;
      this.$http.get('user/form/' + this.id).then(
        (response) => {
          this.form = response.body.data.user;

          this.requesting = false;
        },
        (error) => {
          this.requesting = false;
          this.snackbar(error.message || 'Error al obtener registro');
          this.goBack();
        }
      );
    },
    save() {
      if (this.$refs.form.validate()) {
        this.requesting = true;
        this.form.updatedById = localStorage.getItem('userId');
        if (this.id) {
          this.$http.put('user/' + this.id, this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro actualizado con éxito'
              );
              this.goBack();
              this.requesting = false;
            },
            (error) => {
              this.requesting = false;
              var message =
                error.body.message || 'Error al actualizar registro';
              this.snackbar(message);
              console.error(error);
            }
          );
        } else {
          this.form.createdById = localStorage.getItem('userId');
          this.$http.post('user/', this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.$router.push('/userlist');
              this.requesting = false;
            },
            (error) => {
              this.requesting = false;
              var message = error.body.message || 'Error al crear registro';
              this.snackbar(message);
              console.error(error);
            }
          );
        }
      } else {
        this.snackbar(
          'Error en formulario, favor de revisarlo para continuar.'
        );
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    if (this.$route.name.includes('detail')) {
      this.view = true;
      this.title = 'Visualizar';
    } else if (this.$route.name.includes('edit')) {
      this.view = false;
      this.title = 'Modificar';
    } else {
      this.passwordRules = [(v) => !!v || 'Campo requerido'];
    }

    this.dataInit();
  },
  computed: {},
  watch: {}
};
</script>

<style scoped>
.loading {
  position: fixed;
  top: 48px;
  left: 0;
  right: 0;
  margin: 0;
}

.grid-container {
  grid-template-columns: repeat(12, calc((100% - 11 * 10px) / 12));
  grid-auto-rows: minmax(15px, auto);
  row-gap: 10px;
  column-gap: 10px;
}

.grid-container .wrapper-558416 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-4939208 {
  grid-column: 1 / span 12;
  grid-row: 21 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
</style>
