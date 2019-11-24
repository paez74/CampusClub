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
          {{ title }} Departamento
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div ref="printForm">
        <div class="grid-container">
          <div class="wrapper-2137966" tabindex="0">
            <v-text-field
              v-model="form.code"
              class="classic-text-field"
              :disabled="view"
              :rules="[(v) => !!v || 'Campo requerido']"
            >
              <template slot="prepend"
                >Codigo<span>*</span></template
              >
            </v-text-field>
          </div>
          <div class="wrapper-2542876" tabindex="1">
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
          <div class="wrapper-special wrapper-3614566" tabindex="2">
            <v-btn color="secondary" @click="goBack()" class="backBtn">{{
              view ? 'Regresar' : 'Cancelar'
            }}</v-btn>
          </div>
          <div class="wrapper-special wrapper-3621435" tabindex="3">
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
      grandParent: 'department',
      showImageModal: false,
      imagePreviewId: '',
      form: {}
    };
  },
  methods: {
    dataInit() {
      var self = this;
      if (this.id) {
        this.getRegistry(this.id);
      } else {
        this.$http.get('department/form').then((response) => {
          var newform = response.body.data.department;
          this.form = newform;
        });
      }
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    getRegistry(id) {
      this.requesting = true;
      this.$http.get('department/form/' + this.id).then(
        (response) => {
          this.form = response.body.data.department;

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
          this.$http.put('department/' + this.id, this.form).then(
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
          this.$http.post('department/', this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.$router.push('/departmentlist');
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

.grid-container .wrapper-2137966 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-2542876 {
  grid-column: 1 / span 12;
  grid-row: 6 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-3614566 {
  grid-column: 4 / span 2;
  grid-row: 11 / span 3;
}

.grid-container .wrapper-3621435 {
  grid-column: 7 / span 2;
  grid-row: 11 / span 3;
}
</style>
