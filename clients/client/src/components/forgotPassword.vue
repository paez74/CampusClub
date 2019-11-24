<template>
  <div class="recover">
    <div class="forgot-password">
      <div class="logo">
        <img src="./../assets/logo.svg" />
      </div>
      <div class="forgot-password-text">
        <div class="title">Bienvenidos</div>
        <div class="subtitle"></div>
        <div>
          Si olvidaste tu contraseña haz click en enviar y te llegará un correo
          para reestablecerla.
        </div>
        <div class="btn-forgot-password">
          <v-btn @click="login">Inicio de Sesion</v-btn>
        </div>
      </div>
    </div>
    <div class="form">
      <div>
        <div class="form-title">
          Recuperar Contraseña
        </div>
        <v-text-field
          ref="username"
          label="E-mail"
          autofocus
          v-model="model.email"
        >
        </v-text-field>
        <div class="btn-recover">
          <v-btn color="primary" @click="recover()">Recuperar</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recover {
  height: 100%;
}

.forgot-password {
  text-align: left;
  height: 100%;
  background: #151a22;
  color: #4b5156;
  width: 66%;
}

.logo {
  padding: 2%;
  text-align: left;
}

.logo img {
  height: 80px;
  width: auto;
}

.forgot-password-text {
  padding: 5%;
}

.title {
  color: white;
  font-size: 45px;
  margin-top: 50px;
  margin-bottom: 30px;
}

.subtitle {
  font-size: 30px;
  margin-bottom: 60px;
}

.forgot-password .forgot-password-text .btn-forgot-password button {
  background-color: #4b5156;
  color: white;
  margin-left: 0;
  margin-top: 30px;
}

.form {
  position: absolute;
  padding: 7%;
  top: 0;
  right: 0;
  height: 100%;
  background: white;
  color: black;
  width: 34%;
}

.form .form-title {
  text-align: left;
  font-size: 30px;
  margin-top: 100px;
  margin-bottom: 30px;
}

.btn-recover {
  text-align: left;
  padding: 0;
}

.btn-recover button {
  margin-left: 0;
}
</style>

<script>
import { events } from '../main';
export default {
  name: 'login',
  data() {
    return {
      model: {
        username: '',
        password: '',
        email: ''
      }
    };
  },
  methods: {
    recover() {
      var self = this;
      this.$http
        .put('login/generatepassword', self.model)
        .then((res) => {
          this.snackbar('Contraseña actualizada correctamente.');
          this.$router.push('login');
        })
        .catch((err) => {
          self.snackbar(err.body);
        });
    },
    login() {
      this.$router.push('login');
    },
    back() {
      this.$router.push('login');
    },
    snackbar(message) {
      events.$emit('snackbar', message);
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  }
};
</script>
