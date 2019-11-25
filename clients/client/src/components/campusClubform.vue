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
          {{ title }} Campus Club
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <div ref="printForm">
        <div class="grid-container">
          <div class="wrapper-1747492" tabindex="0">
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
          <div class="wrapper-2537886" tabindex="1">
            <v-layout align-center justify-space-between row fill-height>
              <v-flex xs4 column>
                <v-text-field
                  v-model="form.locationLatitude"
                  class="classic-text-field"
                  :disabled="view"
                  v-on:keyup="updateLocationPosition"
                  :rules="[(v) => !!v || 'Campo requerido']"
                >
                  <template slot="prepend"
                    >Latitud<span>*</span></template
                  >
                </v-text-field>
                <v-text-field
                  v-model="form.locationLongitude"
                  class="classic-text-field"
                  :disabled="view"
                  v-on:keyup="updateLocationPosition"
                  :rules="[(v) => !!v || 'Campo requerido']"
                >
                  <template slot="prepend"
                    >Longitud<span>*</span></template
                  >
                </v-text-field>
              </v-flex>
              <p class="text-xs-center flex xs-8">
                No se encontró integración con Google Maps
              </p>
            </v-layout>
          </div>
          <div class="wrapper-3262231" tabindex="2">
            <v-text-field
              v-model="form.phone"
              class="classic-text-field"
              :disabled="view"
              :rules="[(v) => !!v || 'Campo requerido']"
            >
              <template slot="prepend"
                >Telefono<span>*</span></template
              >
            </v-text-field>
          </div>
          <div class="wrapper-4512402" tabindex="3">
            <div class="many-to-one-input-container">
              <v-select
                v-model="form.advisorId"
                ref="advisor"
                :items="advisors"
                class="classic-select-field"
                item-text="name"
                item-value="id"
                @change="onChangeAdvisorSelect"
                :disabled="view"
                :rules="[]"
              >
                <template slot="prepend"
                  >Facultad</template
                >
              </v-select>
            </div>
          </div>
          <div class="wrapper-special wrapper-3951988" tabindex="4">
            <v-btn color="secondary" @click="goBack()" class="backBtn">{{
              view ? 'Regresar' : 'Cancelar'
            }}</v-btn>
          </div>
          <div class="wrapper-special wrapper-4121414" tabindex="5">
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
      locationPosition: JSON.parse(localStorage.getItem('position')) || {
        lat: 0,
        lng: 0
      },
      title: 'Agregar',
      valid: true,
      requesting: false,
      view: false,
      id: '',
      moment,
      grandParent: 'campusClub',
      showImageModal: false,
      imagePreviewId: '',
      form: {
        advisor: {}
      },
      advisors: [],
      showSelectAdvisor: false
    };
  },
  methods: {
    dataInit() {
      var self = this;
      if (this.id) {
        this.getRegistry(this.id);
      } else {
        this.$http.get('campusClub/form').then((response) => {
          var newform = response.body.data.campusClub;
          newform.advisor = {};
          this.form = newform;
          _.each(response.body.data.advisors, function(item) {
            item.selected = false;
          });
          self.advisors = response.body.data.advisors;
        });
      }
    },
    openSelectAdvisor() {
      if (!this.view) {
        this.showSelectAdvisor = true;
      }
    },
    onChangeAdvisorSelect(value) {
      this.form.advisor = this.advisors.find((advisor) => advisor.id === value);
    },
    setAdvisor(item) {
      this.form.advisorId = item.id;
      this.form.advisor = item;
    },
    getAdvisorRankDisplay(value) {
      switch (value) {
        case 'instructor':
          return 'Instructor';
        case 'assistant':
          return 'Asistente';
        case 'associate':
          return 'Asociado';
        case 'head':
          return 'Titular';
      }
    },
    openImage(id) {
      this.imagePreviewId = id;
      this.showImageModal = true;
    },
    getRegistry(id) {
      this.requesting = true;
      this.$http.get('campusClub/form/' + this.id).then(
        (response) => {
          this.form = response.body.data.campusClub;
          this.updateLocationPosition();
          if (this.form.advisor == null) {
            this.form.advisor = {};
          } else {
            this.form.advisorId = this.form.advisor.id;
          }
          _.each(response.body.data.advisors, (item) => {
            item.selected = false;
          });
          this.advisors = response.body.data.advisors;

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
          this.$http.put('campusClub/' + this.id, this.form).then(
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
          this.$http.post('campusClub/', this.form).then(
            (response) => {
              this.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.$router.push('/campusClublist');
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
    },
    updateLocationCoordinates(location) {
      this.form.locationLatitude = location.latLng.lat();
      this.form.locationLongitude = location.latLng.lng();
      this.$forceUpdate();
    },
    updateLocationPosition() {
      const lat = Number(this.form.locationLatitude);
      const lng = Number(this.form.locationLongitude);
      if (lat !== NaN && lng !== NaN) {
        this.locationPosition = { lat, lng };
      }
    }
  },
  computed: {
    filterAdvisors: function() {
      return this.advisors.filter((advisor) => [true].every((x) => x));
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

.grid-container .wrapper-1747492 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-2537886 {
  grid-column: 1 / span 12;
  grid-row: 6 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-3262231 {
  grid-column: 1 / span 12;
  grid-row: 11 / span 5;
  height: calc((4 * 10px) + 15px * 5);
  overflow: hidden;
}
.grid-container .wrapper-4512402 {
  grid-column: 1 / span 12;
  grid-row: 16 / span 5;
}
.grid-container .wrapper-3951988 {
  grid-column: 4 / span 2;
  grid-row: 21 / span 3;
}

.grid-container .wrapper-4121414 {
  grid-column: 8 / span 2;
  grid-row: 21 / span 3;
}
</style>
