<template>
  <div class="app-container">
    <v-navigation-drawer
      :mini-variant="miniVariant || drawers.second"
      :clipped="clipped"
      v-model="drawers.root"
      fixed
      app
      stateless
      class="root-menu menus media-height"
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          @click="menuItem(item)"
          v-bind:class="{
            'menu-selected':
              selectedMenus.root == item ||
              (!!selectedMenus.currentRoute &&
                selectedMenus.currentRoute == item.route)
          }"
        >
          <v-list-tile-action>
            <v-badge right v-model="item.showBadge">
              <span
                slot="badge"
                v-if="!!item.showBadge && !!item.badge.number"
                >{{ displayBadge(item.badge.number) }}</span
              >
              <v-icon v-html="item.icon"></v-icon>
            </v-badge>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      :mini-variant="false"
      :clipped="clipped"
      v-model="drawers.second"
      fixed
      app
      stateless
      class="second-menu menus media-height"
      v-bind:class="{ active: drawers.second }"
    >
      <v-list>
        <template v-for="(item, i) in getSubMenuItems(selectedMenus.root)">
          <!-- Simple Tile -->
          <v-list-tile
            value="true"
            @click="menuItem(item)"
            v-if="!item.subMenus || !item.subMenus.length"
            :key="i"
            v-bind:class="{
              'menu-selected':
                selectedMenus.second == item ||
                (!!selectedMenus.currentRoute &&
                  selectedMenus.currentRoute == item.route)
            }"
          >
            <v-list-tile-action>
              <v-badge right color="info" v-model="item.showBadge">
                <span
                  slot="badge"
                  v-if="!!item.showBadge && !!item.badge.number"
                  >{{ displayBadge(item.badge.number) }}</span
                >
                <v-icon v-html="item.icon"></v-icon>
              </v-badge>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <!-- Group Tile -->
          <v-list-group
            v-if="!!item.subMenus && !!item.subMenus.length"
            :key="i"
            @click="menuItem(item)"
            :value="item.open"
          >
            <v-list-tile slot="activator">
              <v-list-tile-action>
                <v-badge right color="info" v-model="item.showBadge">
                  <span
                    slot="badge"
                    v-if="!!item.showBadge && !!item.badge.number"
                    >{{ displayBadge(item.badge.number) }}</span
                  >
                  <v-icon v-html="item.icon"></v-icon>
                </v-badge>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-for="(subMenu, i) in item.subMenus"
              :key="i"
              @click="menuItem(subMenu)"
              v-bind:class="{
                'menu-selected':
                  selectedMenus.third == subMenu ||
                  (!!selectedMenus.currentRoute &&
                    selectedMenus.currentRoute == item.route)
              }"
            >
              <v-list-tile-action>
                <v-badge right color="info" v-model="subMenu.showBadge">
                  <span
                    slot="badge"
                    v-if="!!subMenu.showBadge && !!subMenu.badge.number"
                    >{{ displayBadge(subMenu.badge.number) }}</span
                  >
                  <v-icon v-html="subMenu.icon"></v-icon>
                </v-badge>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="subMenu.title"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      color="#0b5394"
      dark
      :clipped-left="clipped"
      class="toolbar"
      height="48px"
      prominent
      extension-height="64px"
    >
      <v-toolbar-side-icon @click.stop="openCloseMenu"></v-toolbar-side-icon>
      <v-toolbar-title
        class="cursor-pointer"
        @click="goTo('')"
        v-text="title"
      ></v-toolbar-title>
      <v-spacer></v-spacer>
      <img src="@/assets/logo_light.svg" height="34" />
      <v-spacer></v-spacer>
      <v-menu class="user-menu">
        <v-btn slot="activator">
          {{ user.username }}
          <user-image v-model="user.imageId"></user-image>
        </v-btn>
        <v-list light>
          <v-list-tile @click="goTo('changepassword')">
            <v-list-tile-title>Cambiar Contraseña</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="closeSesion()">
            <v-list-tile-title>Cerrar Sesión</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content
      v-bind:class="{
        'root-drawer-active': drawers.root,
        'second-drawer-active': drawers.second
      }"
    >
      <router-view :key="$route.fullPath" />
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer class="footer" :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </div>
</template>

<style scoped>
main {
  padding-top: 30px !important;
  padding-left: 30px !important;
}

.v-badge > span {
  width: 18px;
  height: 18px;
  top: -8px;
  right: -10px;
  background-color: var(--v-menuSelectedItem-base) !important;
  border-color: var(--v-menuSelectedText-base) !important;
  border: 1px solid;
}

.app-container {
  padding: 16px 50px 50px 50px;
}

.user-image {
  width: 35px;
  height: 35px;
  margin-left: 10px;
  border-radius: 25px;
}

.user-menu .v-btn {
  font-weight: normal;
}

.user-menu button {
  width: unset !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

.user-menu button i {
  margin-left: 10px;
}

.toolbar {
  z-index: 4;
}

.toolbar >>> .v-toolbar__content {
  padding: 0 14px !important;
}

.toolbar img {
  vertical-align: middle;
}

.footer {
  z-index: 4;
}

.menus {
  margin-top: 48px !important;
  background-color: var(--v-menuBackground-base);
  color: var(--v-menuText-base);
}

.menus .theme--light.v-list {
  background-color: var(--v-menuBackground-base);
  color: var(--v-menuText-base);
}

.menus .theme--light.v-icon {
  color: inherit;
}

.menus >>> .v-list__tile {
  color: var(--v-menuText-base) !important;
  caret-color: var(--v-menuText-base) !important;
  padding: 0 12px !important;
}

.menus >>> .v-list__tile__action {
  min-width: 35px;
  justify-content: flex-start !important;
}

.menus >>> .v-list__tile__title {
  font-weight: normal;
  font-size: 12px;
}

.menus .menu-selected >>> .v-list__tile {
  background-color: var(--v-menuSelectedItem-base);
  color: var(--v-menuSelectedText-base) !important;
  caret-color: var(--v-menuSelectedText-base) !important;
}

.menus >>> .v-list__tile:hover {
  background-color: var(--v-menuSelectedItem-base) !important;
  color: var(--v-menuSelectedText-base) !important;
  caret-color: var(--v-menuSelectedText-base) !important;
}

.menus >>> .v-list__tile:hover .v-list__tile__title {
  font-weight: bold !important;
}

.menus >>> .v-list__group__items {
  background-color: var(--v-menuBackground-darken1);
}

.menus >>> .v-list__group__header__append-icon i {
  color: var(--v-menuText-base);
}

.root-menu:not(.v-navigation-drawer--temporary) {
  max-width: 260px !important;
  z-index: 4;
}

.root-menu.v-navigation-drawer--close {
  transform: translateX(0px) !important;
  width: 50px !important;
}

.root-menu.v-navigation-drawer--open.v-navigation-drawer--mini-variant {
  width: 50px !important;
}

.second-menu {
  background-color: var(--v-menuBackground-darken1);
  width: 220px !important;
  z-index: 3;
}

.second-menu > .v-list {
  background-color: var(--v-menuBackground-darken1) !important;
}

.second-menu .v-list__group {
  cursor: pointer;
}

.second-menu.active {
  transform: translateX(50px) !important;
}

.root-drawer-active {
  /* Variable */
  padding-left: 230px !important;
}

.second-drawer-active {
  padding-left: 250px !important;
}
</style>

<script>
import { events } from '../main';
import UserImage from './user-image';
import moment from 'moment-timezone';

export default {
  name: 'core',
  components: { UserImage },
  data() {
    return {
      user: {},
      clipped: true,
      drawers: {
        root: true,
        second: false
      },

      fixed: true,
      temporary: false,
      items: this.filterPaths([
        {
          icon: 'compare_arrows',
          title: 'Roles/Usuarios',
          level: 1,
          subMenus: this.filterPaths([
            {
              icon: 'person',
              title: 'Usuario',
              route: 'userlist',
              entityName: 'user',
              level: 2
            },
            {
              icon: 'group_work',
              title: 'Perfil',
              route: 'rolelist',
              entityName: 'role',
              level: 2
            }
          ])
        },
        {
          icon: 'home',
          title: 'Campus Clubs',
          route: 'campusClublist',
          entityName: 'campusClub',
          level: 1
        },
        {
          icon: 'book',
          title: 'Departamento',
          route: 'departmentlist',
          entityName: 'department',
          level: 1
        },
        {
          icon: 'person',
          title: 'Persona',
          route: 'personlist',
          entityName: 'person',
          level: 1
        },
        {
          icon: 'child_care',
          title: 'Estudiante',
          route: 'studentlist',
          entityName: 'student',
          level: 1
        },
        {
          icon: 'local_library',
          title: 'Facultad',
          route: 'facultylist',
          entityName: 'faculty',
          level: 1
        }
      ]),
      miniVariant: false,
      right: false,
      rightDrawer: false,
      title: 'Campus Club',
      badgeIntervals: [],
      selectedMenus: {
        root: undefined,
        second: undefined,
        third: undefined,
        currentRoute: undefined
      },
      menusStoreStates: {
        root: false,
        second: false
      }
    };
  },
  methods: {
    snackbar: function(message) {
      events.$emit('snackbar', message);
    },
    checkMenusSelected() {
      this.selectedMenus.currentRoute = this.$route.name;
      this.items.forEach((rootMenuElement) => {
        if (rootMenuElement.subMenus) {
          rootMenuElement.subMenus.forEach((secondMenuElement) => {
            if (secondMenuElement.subMenus) {
              secondMenuElement.open = false;
              secondMenuElement.subMenus.forEach((thirdMenuElement) => {
                if (thirdMenuElement.route == this.selectedMenus.currentRoute) {
                  //Force Open TODO
                  this.selectedMenus.third = thirdMenuElement;
                  this.selectedMenus.second = secondMenuElement;
                  this.selectedMenus.root = rootMenuElement;
                  secondMenuElement.open = true;
                  this.drawers.second = true;
                  this.drawers.root = true;
                }
              });
            } else {
              if (secondMenuElement.route == this.selectedMenus.currentRoute) {
                this.selectedMenus.second = secondMenuElement;
                this.selectedMenus.root = rootMenuElement;
                this.drawers.second = true;
              }
            }
          });
        } else {
          if (rootMenuElement.route == this.selectedMenus.currentRoute) {
            this.selectedMenus.root = rootMenuElement;
            this.drawers.root = true;
          }
        }
      });
    },
    openCloseMenu() {
      if (this.drawers.root) {
        this.menusStoreStates.root = this.drawers.root;
        this.menusStoreStates.second = this.drawers.second;
        this.drawers.root = false;
        this.drawers.second = false;
      } else {
        this.drawers.second = this.menusStoreStates.second;
        this.drawers.root = true;
      }
    },
    menuItem(item) {
      //Set Selected Item
      let lastRootSelected = this.selectedMenus.root;
      if (item.level == 1) {
        this.selectedMenus.root = item;
        this.selectedMenus.second = undefined;
      } else if (item.level == 2) {
        this.selectedMenus.second = item;
        if (item.route) {
          this.selectedMenus.third = undefined;
        }
      } else if (item.level == 3) {
        this.selectedMenus.third = item;
      }

      if (item.subMenus && item.subMenus.length) {
        if (item.level == 1) {
          this.drawers.second =
            this.selectedMenus.root == lastRootSelected
              ? !this.drawers.second
              : true;
        }
      } else {
        if (item.level == 1) {
          this.drawers.second = false;
        }
        this.goTo(item.route);
      }
    },
    getSubMenuItems(item) {
      if (!item || !item.subMenus) {
        return [];
      }
      return item.subMenus;
    },

    goTo(route) {
      this.selectedMenus.currentRoute = route;
      this.$router.replace('/' + route);
      this.checkMenusSelected();
    },
    closeSesion: function(fullPath) {
      events.$emit('closeSession');
    },
    filterPaths: function(paths) {
      const permissions = JSON.parse(localStorage.getItem('credentials'));
      const clearedPaths = paths.filter((x) => {
        if (x.reportName) {
          return permissions[`${x.reportName}Report`];
        }
        if (x.catalogName) {
          return permissions[`${x.catalogName}Catalog`];
        }
        if (!!x.permissionsLike) {
          return !!Object.keys(permissions).find((permission) =>
            permission.includes(x.permissionsLike)
          );
        }
        if (!!x.permission) {
          return permissions[x.permission];
        }
        if (!x.entityName) {
          return true;
        }
        return (
          permissions[`${x.entityName}Read`] ||
          permissions[`${x.entityName}Update`] ||
          permissions[`${x.entityName}Create`] ||
          permissions[`${x.entityName}Delete`]
        );
      });
      return clearedPaths;
    },
    displayBadge: function(value) {
      if (value > 9) {
        return '+9';
      }
      return value;
    }
  },
  mounted() {
    var token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('login');
      return;
    }

    this.$http.get('app/getMyUser').then(
      (response) => {
        this.user = response.body.user;
      },
      () => {
        this.snackbar('Error al obtener el usuario de la sesión');
      }
    );

    this.checkMenusSelected();

    this.items
      .filter((x) => !!x.showBadge)
      .forEach((item) => {
        if (!!item.badge.refreshFunction) {
          item.badge.refreshFunction(item.badge);
          if (!!item.badge.refreshTime) {
            this.badgeIntervals.push(
              setInterval(
                item.badge.refreshFunction.bind(this, item.badge),
                item.badge.refreshTime
              )
            );
          }
        }
      });

    events.$on('closeSession', () => {
      this.badgeIntervals.forEach((intreval) => {
        clearInterval(intreval);
      });
    });
  },
  computed: {
    imageSrc() {
      if (this.user && this.user.imageMIME && this.user.imageData) {
        return `data:${this.user.imageMIME};base64,${this.user.imageData}`;
      } else {
        return undefined;
      }
    }
  }
};
</script>
