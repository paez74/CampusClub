<template>
  <div class="toolbar-item-group">
    <template v-for="(item, i) in items">
      <v-menu
        transition="slide-y-transition"
        class="main-menu"
        offset-y
        v-if="item.subMenus && item.subMenus.length"
        :key="i"
        v-ripple="{ center: true }"
      >
        <div slot="activator" @click="menuItem(item)" class="menu-item">
          <v-badge right v-model="item.showBadge" class="menu-item-icon-badge">
            <span slot="badge" v-if="!!item.showBadge && !!item.badge.number">{{
              displayBadge(item.badge.number)
            }}</span>
            <v-icon v-html="item.icon"></v-icon>
          </v-badge>
          {{ item.title }}
        </div>
        <v-list class="menu-list">
          <template v-for="(item, i) in getSubMenuItems(item)">
            <v-list-tile
              :key="i"
              @click="menuItem(item)"
              v-if="!item.subMenus || !item.subMenus.length"
              class="list-item"
            >
              <v-badge
                right
                v-model="item.showBadge"
                class="menu-item-icon-badge"
              >
                <span
                  slot="badge"
                  v-if="!!item.showBadge && !!item.badge.number"
                  >{{ displayBadge(item.badge.number) }}</span
                >
                <v-icon
                  v-html="item.icon"
                  v-bind:class="{
                    'list-item-selected':
                      !!selectedMenus.currentRoute &&
                      selectedMenus.currentRoute == item.route
                  }"
                ></v-icon>
              </v-badge>
              <v-list-tile-title
                v-bind:class="{
                  'list-item-selected':
                    !!selectedMenus.currentRoute &&
                    selectedMenus.currentRoute == item.route
                }"
                >{{ item.title }}</v-list-tile-title
              >
            </v-list-tile>

            <v-menu
              offset-x
              open-on-hover
              :key="i"
              v-if="!!item.subMenus && !!item.subMenus.length"
              class="list-item"
              full-width
            >
              <v-list-tile slot="activator" class="menu-submenu-item">
                <v-badge
                  right
                  v-model="item.showBadge"
                  class="menu-item-icon-badge"
                >
                  <span
                    slot="badge"
                    v-if="!!item.showBadge && !!item.badge.number"
                    >{{ displayBadge(item.badge.number) }}</span
                  >
                  <v-icon
                    v-html="item.icon"
                    v-bind:class="{
                      'list-item-selected': isAnyChildSelected(item)
                    }"
                  ></v-icon>
                </v-badge>
                <v-list-tile-title
                  v-bind:class="{
                    'list-item-selected': isAnyChildSelected(item)
                  }"
                  >{{ item.title }}</v-list-tile-title
                >
                <v-icon
                  v-bind:class="{
                    'list-item-selected': isAnyChildSelected(item)
                  }"
                  >play_arrow</v-icon
                >
              </v-list-tile>
              <v-list class="menu-list">
                <v-list-tile
                  @click="menuItem(subMenu)"
                  v-for="(subMenu, i) in item.subMenus"
                  :key="i"
                  class="list-item"
                >
                  <v-badge
                    right
                    v-model="subMenu.showBadge"
                    class="menu-item-icon-badge"
                  >
                    <span
                      slot="badge"
                      v-if="!!subMenu.showBadge && !!subMenu.badge.number"
                      >{{ displayBadge(subMenu.badge.number) }}</span
                    >
                    <v-icon
                      v-html="subMenu.icon"
                      v-bind:class="{
                        'list-item-selected':
                          !!selectedMenus.currentRoute &&
                          selectedMenus.currentRoute == subMenu.route
                      }"
                    ></v-icon>
                  </v-badge>
                  <v-list-tile-title
                    v-bind:class="{
                      'list-item-selected':
                        !!selectedMenus.currentRoute &&
                        selectedMenus.currentRoute == subMenu.route
                    }"
                    >{{ subMenu.title }}</v-list-tile-title
                  >
                </v-list-tile>
              </v-list>
            </v-menu>
          </template>
        </v-list>
      </v-menu>
    </template>
  </div>
</template>

<style scoped>
.toolbar-item-group {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
}

.navigation-item {
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.main-menu >>> div.v-menu__activator {
  height: 100%;
}

.main-menu >>> div.v-menu__activator--active {
  background-color: var(--v-primary-base);
  color: var(--v-menuSelectedText-base) !important;
  caret-color: var(--v-menuSelectedText-base) !important;
}

.menu-list {
  padding: 0px;
}

.list-item >>> .v-list__tile {
  height: 64px !important;
  display: flex;
  justify-content: center;
}

.list-item-selected {
  color: var(--v-primary-base);
}

.menu-item-icon-badge {
  margin-right: 8px;
}

.menu-item {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.menu-submenu-item {
  width: 100%;
}
</style>

<script>
export default {
  props: ['items', 'selectedMenus', 'drawers'],
  component: {},
  data() {
    return {};
  },
  methods: {
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
        this.$parent.$parent.goTo(item.route);
      }
    },
    getSubMenuItems(item) {
      if (!item || !item.subMenus) {
        return [];
      }
      return item.subMenus;
    },
    displayBadge: function(value) {
      if (value > 9) {
        return '+9';
      }
      return value;
    },
    isAnyChildSelected(item) {
      return this.getSubMenuItems(item).some(
        (x) => this.selectedMenus.currentRoute == x.route
      );
    }
  }
};
</script>
