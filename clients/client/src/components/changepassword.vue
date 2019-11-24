<template>
  <div>
    <v-form ref="form" v-model="valid">
      <v-toolbar dense flat color="transparent" class="toolbar-form">
        <v-toolbar-title>
          <v-icon class="cursor-pointer back-icon" @click="goBack()"
            >keyboard_arrow_left</v-icon
          >
          Cambiar Contraseña
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <br />
      <v-text-field
        v-model="model.password"
        :type="'password'"
        class="classic-text-field"
        :rules="[(v) => !!v || 'Campo requerido']"
      >
        <template slot="prepend"
          >Contraseña<span>*</span></template
        >
      </v-text-field>
      <br />
      <v-text-field
        v-model="model.newPassword"
        :type="'password'"
        class="classic-text-field"
        :rules="[(v) => !!v || 'Campo requerido']"
      >
        <template slot="prepend"
          >Nueva Contraseña<span>*</span></template
        >
      </v-text-field>
      <br />
      <v-text-field
        v-model="model.confirmPassword"
        :type="'password'"
        class="classic-text-field"
        :rules="[
          (v) => !!v || 'Campo requerido',
          (v) => v === model.newPassword || 'Contraseña no coincide'
        ]"
      >
        <template slot="prepend"
          >Confirmar Contraseña<span>*</span></template
        >
      </v-text-field>
      <br />
      <v-btn color="secondary" @click="goHome()" class="backBtn"
        >Cancelar</v-btn
      >
      <v-btn
        color="primary"
        :disabled="!valid || sending"
        @click="save()"
        class="saveBtn"
        >Guardar</v-btn
      >
    </v-form>
  </div>
</template>

<script>
import { events } from '../main';
export default {
  name: 'changepassword',
  data() {
    return {
      id: localStorage.getItem('userId'),
      valid: true,
      model: {},
      sending: false
    };
  },
  methods: {
    snackbar: function(message) {
      events.$emit('snackbar', message);
    },
    goHome(url) {
      this.$router.push('/');
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
    save() {
      if (this.$refs.form.validate()) {
        this.sending = true;
        this.$http.put('user/changepassword/' + this.id, this.model).then(
          (response) => {
            this.snackbar('Registro actualizado con éxito');
            this.$router.push('/');
          },
          (error) => {
            this.sending = false;
            var message = 'Error al actualizar registro';
            message += error.status === 400 ? ', Contraseña Incorrecta' : '';
            this.form = {};
            this.snackbar(message);
            console.error(error);
          }
        );
      }
    }
  },
  mounted() {}
};
</script>
