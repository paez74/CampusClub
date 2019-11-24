<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      :width="mWidth"
      :height="mHeight"
      scrollable
    >
      <v-card>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-toolbar dense flat color="transparent" class="toolbar-form">
              <v-toolbar-title class="custom-title">
                {{ title }} Campus Club
              </v-toolbar-title>
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
                <div class="wrapper-special wrapper-3951988" tabindex="3">
                  <v-btn color="secondary" @click="goBack()" class="backBtn">{{
                    view ? 'Regresar' : 'Cancelar'
                  }}</v-btn>
                </div>
                <div class="wrapper-special wrapper-4121414" tabindex="4">
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
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.grid-container {
  grid-auto-rows: minmax(15px, auto);
  row-gap: 10px;
  column-gap: 10px;
}

.grid-container .wrapper-1747492 {
  grid-column: span 2;
  grid-row: span 1;
}
.grid-container .wrapper-2537886 {
  grid-column: span 2;
  grid-row: span 1;
}
.grid-container .wrapper-3262231 {
  grid-column: span 2;
  grid-row: span 1;
}
.grid-container .wrapper-3951988 {
  grid-column: span 1;
  grid-row: span 1;
}

.grid-container .wrapper-4121414 {
  grid-column: span 1;
  grid-row: span 1;
}
</style>

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
  props: ['parent', 'modalWidth', 'modalHeight', 'formEdit'],
  mixins: [Modal],
  components: {},
  data() {
    return {
      formatDate,

      title: '',
      requesting: false,
      sending: false,
      valid: true,
      view: false,
      id: '',
      form: {}
    };
  },
  methods: {
    dataInit() {
      var self = this;
      if (self.formEdit != null) this.form = this.formEdit;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.form.createdById = localStorage.getItem('userId');
        this.form.updatedById = this.form.createdById;
        this.$emit('save', this.form);
      }
    }
  },
  mounted() {
    this.dataInit();
  },
  filters: {
    moment: function(date) {
      return formatDate(date);
    },
    dateToTimeOnly: function(date) {
      return formatDateToTimeOnly(date);
    }
  },
  computed: {
    mWidth: {
      get: function() {
        return this.modalWidth;
      }
    },
    mHeight: {
      get: function() {
        return this.modalHeight;
      }
    }
  },
  watch: {}
};
</script>
