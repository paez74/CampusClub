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
          {{ title }} Facultad
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div ref="printForm">
        <div class="grid-container">
          <div class="wrapper-9286408" tabindex="0">
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
          <div class="wrapper-850229" tabindex="1">
            <v-select
              v-model="form.rank"
              :items="ranks"
              class="classic-select-field"
              :disabled="view"
              :rules="[(v) => !!v || 'Campo requerido']"
            >
              <template slot="prepend"
                >Rango<span>*</span></template
              >
            </v-select>
          </div>
          <div class="wrapper-special wrapper-3377307" tabindex="2">
            <v-divider class="header divider-container"></v-divider>
            <div class="text divider-container">
              <div>
                Trabaja En
              </div>
            </div>
          </div>
          <div class="wrapper-1612754" tabindex="3">
            <div class="many-to-one-input-container">
              <v-select
                v-model="form.worksInId"
                ref="worksIn"
                :items="worksIns"
                class="classic-select-field"
                item-text="name"
                item-value="id"
                @change="onChangeWorksInSelect"
                :disabled="view"
                :rules="[]"
              >
                <template slot="prepend"
                  >Departamento</template
                >
              </v-select>
              <v-speed-dial
                v-model="worksInFab"
                :top="false"
                :bottom="false"
                :right="false"
                :left="false"
                :direction="direction"
                :open-on-hover="false"
                :transition="transition"
                class="generator"
              >
                <v-btn
                  slot="activator"
                  v-model="worksInFab"
                  color="primary"
                  dark
                  fab
                  small
                >
                  <v-icon>menu</v-icon>
                  <v-icon>close</v-icon>
                </v-btn>
                <v-btn
                  small
                  fab
                  color="accent"
                  v-if="credentials.departmentRead"
                  :disabled="!form.worksInId"
                  @click="
                    showFormWorksIn = true;
                    formWorksInId = form.worksInId;
                    viewFormWorksIn = true;
                  "
                >
                  <v-icon>visibility</v-icon>
                </v-btn>
                <v-btn
                  dark
                  small
                  fab
                  color="primary"
                  v-if="credentials.departmentCreate"
                  @click="
                    showFormWorksIn = true;
                    formWorksInId = undefined;
                    viewFormWorksIn = false;
                  "
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </v-speed-dial>
              <department-modal-form
                v-if="showFormWorksIn"
                @save="onSaveFormWorksIn"
                @close="showFormWorksIn = false"
                :id="formWorksInId"
                :view="viewFormWorksIn"
              ></department-modal-form>
            </div>
          </div>
          <div class="wrapper-special wrapper-5089067" tabindex="4">
            <v-divider class="header divider-container"></v-divider>
            <div class="text divider-container">
              <div>
                Consejero de
              </div>
            </div>
          </div>
          <div class="wrapper-special wrapper-6695979" tabindex="5">
            <v-btn color="secondary" @click="goBack()" class="backBtn">{{
              view ? 'Regresar' : 'Cancelar'
            }}</v-btn>
          </div>
          <div class="wrapper-special wrapper-8600899" tabindex="6">
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
import departmentModalForm from './modals/department-form';
import entityListTable from './entity-list-table';

export default {
  mixins: [Form],
  components: {
    departmentModalForm,
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
      grandParent: 'faculty',
      transition: 'slide-y-reverse-transition',
      direction: 'top',
      showFormWorksIn: false,
      viewFormWorksIn: false,
      formWorksInId: undefined,
      worksInFab: false,
      showImageModal: false,
      imagePreviewId: '',
      form: {
        worksIn: {}
      },
      worksIns: [],
      showSelectWorksIn: false,
      ranks: [
        { value: 'instructor', text: 'Instructor' },
        { value: 'assistant', text: 'Asistente' },
        { value: 'associate', text: 'Asociado' },
        { value: 'head', text: 'Titular' }
      ]
    };
  },
  methods: {
    dataInit() {
      var self = this;
      if (this.id) {
        this.getRegistry(this.id);
      } else {
        this.$http.get('faculty/form').then((response) => {
          var newform = response.body.data.faculty;
          newform.worksIn = {};
          this.form = newform;
          _.each(response.body.data.worksIns, function(item) {
            item.selected = false;
          });
          self.worksIns = response.body.data.worksIns;
        });
      }
    },
    openSelectWorksIn() {
      if (!this.view) {
        this.showSelectWorksIn = true;
      }
    },
    onChangeWorksInSelect(value) {
      this.form.worksIn = this.worksIns.find((worksIn) => worksIn.id === value);
    },
    setWorksIn(item) {
      this.form.worksInId = item.id;
      this.form.worksIn = item;
    },
    onSaveFormWorksIn(value) {
      if (value.isNew) {
        this.worksIns.push(value.values);
      } else {
        Object.assign(
          this.worksIns.find((x) => x.id == value.values.id),
          value.values
        );
      }
      this.setWorksIn(value.values);
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    getRegistry(id) {
      this.requesting = true;
      this.$http.get('faculty/form/' + this.id).then(
        (response) => {
          this.form = response.body.data.faculty;
          if (this.form.worksIn == null) {
            this.form.worksIn = {};
          } else {
            this.form.worksInId = this.form.worksIn.id;
          }
          _.each(response.body.data.worksIns, (item) => {
            item.selected = false;
          });
          this.worksIns = response.body.data.worksIns;

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
          this.$http.put('faculty/' + this.id, this.form).then(
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
          this.$http.post('faculty/', this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.$router.push('/facultylist');
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
    filterWorksIns: function() {
      return this.worksIns.filter((worksIn) => [true].every((x) => x));
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
  row-gap: 6px;
  column-gap: 10px;
}

.grid-container .wrapper-9286408 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 5;
  height: calc((4 * 6px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-850229 {
  grid-column: 1 / span 12;
  grid-row: 6 / span 5;
  height: calc((4 * 6px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-3377307 {
  grid-column: 1 / span 12;
  grid-row: 11 / span 1;
}

.grid-container .wrapper-1612754 {
  grid-column: 1 / span 12;
  grid-row: 12 / span 5;
}
.grid-container .wrapper-5089067 {
  grid-column: 1 / span 12;
  grid-row: 17 / span 1;
}

.grid-container .wrapper-6695979 {
  grid-column: 4 / span 2;
  grid-row: 18 / span 3;
}

.grid-container .wrapper-8600899 {
  grid-column: 7 / span 2;
  grid-row: 18 / span 3;
}
</style>
