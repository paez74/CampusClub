<template>
  <div>
    <v-dialog v-model="dialog" max-width="75%" scrollable>
      <v-card>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-toolbar dense flat color="transparent" class="toolbar-form">
              <v-toolbar-title class="custom-title">
                {{ title }} Departamento
              </v-toolbar-title>
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
  components: {},
  props: ['id', 'view'],
  data() {
    return {
      formatDate,

      title: '',
      sending: false,
      valid: true,
      form: {}
    };
  },
  methods: {
    onSave(returnValue, isNew = false) {
      this.$emit('save', {
        isNew: isNew,
        values: returnValue
      });
    },
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
    getRegistry(id) {
      var self = this;
      this.$http.get('department/form/' + this.id).then(
        (response) => {
          self.form = response.body.data.department;
        },
        (error) => {
          self.snackbar(error.message || 'Error al obtener registro');
          this.goBack();
        }
      );
    },
    save() {
      var self = this;

      if (this.$refs.form.validate()) {
        this.sending = true;
        this.form.updatedById = localStorage.getItem('userId');
        if (this.id) {
          this.$http.put('department/' + self.id, self.form).then(
            (response) => {
              self.snackbar(
                response.body.message || 'Registro actualizado con éxito'
              );
              this.onSave(response.body.data);
              this.goBack();
            },
            (error) => {
              self.sending = false;
              var message = error.message || 'Error al actualizar registro';
              self.snackbar(message);
              console.error(error);
            }
          );
        } else {
          self.form.createdById = localStorage.getItem('userId');
          self.$http.post('department/', self.form).then(
            (response) => {
              self.snackbar(
                response.body.message || 'Registro creado con éxito'
              );
              this.onSave(response.body.data, true);
              this.goBack();
            },
            (error) => {
              self.sending = false;
              var message = error.message || 'Error al crear registro';
              self.snackbar(message);
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
    if (!this.id) {
      this.title = 'Agregar';
    } else if (this.view) {
      this.title = 'Detalle de';
    } else {
      this.title = 'Actualizar';
    }
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
  computed: {}
};
</script>

<style scoped>
.grid-container {
  grid-template-columns: repeat(12, calc((100% - 11 * 10px) / 12));
  grid-auto-rows: minmax(15px, auto);
  row-gap: 10px;
  column-gap: 10px;
}

.grid-container .wrapper-2137966 {
  grid-column: 1 / span 12;
  grid-row: 1 / span 5;
}
.grid-container .wrapper-2542876 {
  grid-column: 1 / span 12;
  grid-row: 6 / span 5;
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
