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
          {{ title }} Perfil
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div ref="printForm">
        <div class="grid-container">
          <div class="wrapper-2092597" tabindex="0">
            <v-text-field
              v-model="form.code"
              class="classic-text-field"
              :disabled="view"
              :rules="[(v) => !!v || 'Campo requerido']"
            >
              <template slot="prepend"
                >Perfil<span>*</span></template
              >
            </v-text-field>
          </div>
          <div class="wrapper-3629551" tabindex="1">
            <v-text-field
              v-model="form.name"
              class="classic-text-field"
              :disabled="view"
              :rules="[(v) => !!v || 'Campo requerido']"
            >
              <template slot="prepend"
                >Nombre<span>*</span></template
              >
            </v-text-field>
          </div>
          <div class="wrapper-special wrapper-7522218" tabindex="2">
            <v-btn color="secondary" @click="goBack()" class="backBtn">{{
              view ? 'Regresar' : 'Cancelar'
            }}</v-btn>
          </div>
          <div class="wrapper-special wrapper-7525367" tabindex="3">
            <v-btn
              color="primary"
              :disabled="requesting || view"
              @click="save()"
              class="saveBtn"
              >Guardar</v-btn
            >
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
      grandParent: 'role',
      showImageModal: false,
      imagePreviewId: '',
      form: {},

      headers: [
        { text: 'Entidad' },
        { text: 'Crear' },
        { text: 'Ver' },
        { text: 'Actualizar' },
        { text: 'Borrar' }
      ],
      otherPermissionsHeaders: [{ text: 'Nombre' }, { text: 'Permiso' }],
      pagination: {
        rowsPerPage: 25
      },
      roles: [
        {
          name: 'faculty',
          display: 'Facultad',
          haveCrudPermissions: true,
          otherPermissions: []
        },
        {
          name: 'student',
          display: 'Estudiante',
          haveCrudPermissions: true,
          otherPermissions: []
        },
        {
          name: 'person',
          display: 'Persona',
          haveCrudPermissions: true,
          otherPermissions: []
        },
        {
          name: 'role',
          display: 'Perfil',
          haveCrudPermissions: true,
          otherPermissions: []
        },
        {
          name: 'user',
          display: 'Usuario',
          haveCrudPermissions: true,
          otherPermissions: []
        },
        {
          name: 'campusClub',
          display: 'Campus Club',
          haveCrudPermissions: true,
          otherPermissions: []
        },
        {
          name: 'department',
          display: 'Departamento',
          haveCrudPermissions: true,
          otherPermissions: []
        }
      ]
    };
  },
  methods: {
    dataInit() {
      if (this.id) {
        this.getRegistry(this.id);
      } else {
        var newform = {};
        newform.facultyCreate = false;
        newform.facultyRead = false;
        newform.facultyUpdate = false;
        newform.facultyDelete = false;
        newform.studentCreate = false;
        newform.studentRead = false;
        newform.studentUpdate = false;
        newform.studentDelete = false;
        newform.personCreate = false;
        newform.personRead = false;
        newform.personUpdate = false;
        newform.personDelete = false;
        newform.roleCreate = false;
        newform.roleRead = false;
        newform.roleUpdate = false;
        newform.roleDelete = false;
        newform.userCreate = false;
        newform.userRead = false;
        newform.userUpdate = false;
        newform.userDelete = false;
        newform.campusClubCreate = false;
        newform.campusClubRead = false;
        newform.campusClubUpdate = false;
        newform.campusClubDelete = false;
        newform.departmentCreate = false;
        newform.departmentRead = false;
        newform.departmentUpdate = false;
        newform.departmentDelete = false;
        this.form = newform;
      }
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    getRegistry(id) {
      this.requesting = true;
      this.$http.get('role/form/' + this.id).then(
        (response) => {
          this.form = response.body.data.role;

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
          this.$http.put('role/' + this.id, this.form).then(
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
          this.$http.post('role/', this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.$router.push('/rolelist');
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
  computed: {
    selectAllCreate: {
      get: function() {
        var keys = Object.keys(this.form).filter((x) => x.includes('Create'));
        var result = true;
        keys.forEach((key) => {
          result = result && this.form[key];
        });
        return result;
      },
      set: function(newvalue) {
        var keys = Object.keys(this.form).filter((x) => x.includes('Create'));
        var result = true;
        keys.forEach((key) => {
          this.form[key] = newvalue;
        });
      }
    },
    selectAllRead: {
      get: function() {
        var keys = Object.keys(this.form).filter((x) => x.includes('Read'));
        var result = true;
        keys.forEach((key) => {
          result = result && this.form[key];
        });
        return result;
      },
      set: function(newvalue) {
        var keys = Object.keys(this.form).filter((x) => x.includes('Read'));
        var result = true;
        keys.forEach((key) => {
          this.form[key] = newvalue;
        });
      }
    },
    selectAllUpdate: {
      get: function() {
        var keys = Object.keys(this.form).filter((x) => x.includes('Update'));
        var result = true;
        keys.forEach((key) => {
          result = result && this.form[key];
        });
        return result;
      },
      set: function(newvalue) {
        var keys = Object.keys(this.form).filter((x) => x.includes('Update'));
        var result = true;
        keys.forEach((key) => {
          this.form[key] = newvalue;
        });
      }
    },
    selectAllDelete: {
      get: function() {
        var keys = Object.keys(this.form).filter((x) => x.includes('Delete'));
        var result = true;
        keys.forEach((key) => {
          result = result && this.form[key];
        });
        return result;
      },
      set: function(newvalue) {
        var keys = Object.keys(this.form).filter((x) => x.includes('Delete'));
        var result = true;
        keys.forEach((key) => {
          this.form[key] = newvalue;
        });
      }
    }
  },
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

.grid-container .wrapper-2092597 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-3629551 {
  grid-column: 1 / span 12;
  grid-row: 6 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-7522218 {
  grid-column: 4 / span 2;
  grid-row: 11 / span 3;
}

.grid-container .wrapper-7525367 {
  grid-column: 7 / span 2;
  grid-row: 11 / span 3;
}

.v-datatable >>> .v-input--selection-controls .v-input__append-outer,
.v-datatable >>> .v-input--selection-controls .v-input__prepend-outer {
  margin-top: auto;
  margin-bottom: auto;
}

.checkbox-select-all {
  align-items: center;
  justify-content: flex-end;
}

.checkbox-select-all >>> .v-input__slot {
  margin: 0;
}

.checkbox-select-all >>> .v-messages {
  display: none;
}

.switch-input {
  justify-content: flex-end;
  align-items: center;
  margin: unset;
}

.container.grid-list-sm .layout .flex {
  padding: 8px;
}

.role-name-column {
  display: flex;
  align-items: center;
}

.role-name-column > span {
  width: 25px;
  display: inline-flex;
}

.special-permission-table {
  border-bottom: 1px solid #bbbbbb;
}

.special-permission-table th {
  text-indent: 40px;
}

.special-permission-table td:first-child {
  text-indent: 60px;
}
</style>
