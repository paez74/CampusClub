<template>
  <div class="login">
    <div class="forgot-password">
      <div class="logo">
        <img src="./../assets/logo.svg" />
      </div>
      <div class="forgot-password-text">
        <div class="title">Bienvenidos</div>
        <div class="subtitle"></div>
        <div>
          ¿Olvidaste tu contraseña?
        </div>
        <div class="btn-forgot-password">
          <v-btn @click="forgotPassword">Recuperar</v-btn>
        </div>
      </div>
    </div>
    <div class="form">
      <div>
        <div class="form-title">
          Inicio de sesión
        </div>
        <v-text-field
          ref="username"
          class="classic-text-field"
          autofocus
          v-model="model.username"
        >
          <template slot="prepend"
            >Usuario</template
          >
        </v-text-field>
        <v-text-field
          type="password"
          class="classic-text-field"
          v-model="model.password"
          @keyup.enter.native="login()"
        >
          <template slot="prepend"
            >Contraseña</template
          >
        </v-text-field>
        <div class="btn-login">
          <v-btn color="primary" @click="login()">Iniciar</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login {
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

.btn-login {
  text-align: left;
  padding: 0;
}

.btn-login button {
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
        password: ''
      }
    };
  },
  methods: {
    login() {
      var self = this;
      this.$http.post('login', self.model).then(
        (response) => {
          localStorage.setItem('userId', response.body.userId);
          localStorage.setItem('token', response.body.token);
          localStorage.setItem('credentials', response.body.credentials);
          localStorage.setItem('position', JSON.stringify({ lat: 0, lng: 0 }));
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              localStorage.setItem(
                'position',
                JSON.stringify({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
                })
              );
            });
          }
          const redirectUrl = self.$route.query.redirect;
          redirectUrl ? self.$router.push(redirectUrl) : self.$router.push('/');
        },
        () => {
          this.snackbar('Usuario o Contraseña incorrectos.');
          self.model = {
            username: '',
            password: ''
          };
          self.$refs.username.focus();
        }
      );
    },
    forgotPassword() {
      this.$router.push('forgotPassword');
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
