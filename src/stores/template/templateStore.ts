import { defineStore } from 'pinia';
import { setCssVar, Dark } from 'quasar';
import { axios_PREFERENCES } from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';

const user = userStore();
const templateStore = defineStore('template', {
  state: () => ({
    openSidebar: true,
    miniSidebar: false,
  }),
  actions: {
    handleOpenSidebar() {
      this.openSidebar = !this.openSidebar;
    },
    handleMiniSidebar(e: Event) {
      if (this.miniSidebar) {
        this.miniSidebar = false;
        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        e.stopPropagation();
      }
    },

    //! ESTA OPCION ESTA MOMENTANEAMENTE PARA EL IFRAME DEL SISTEMA CON EL OBJETIVO DE OCULTAR EL MENU DESDE EL IFRAME
    hiddenMenu(menu: string) {
      if (menu == 'true') {
        this.miniSidebar = true;
      }
    },
  },
});

export const colorsStore = defineStore('colorsTheme', {
  state: () => ({
    mongo_id: null,
    theme: {
      name: 'theme-default',
      color: '#003c79',
      transparency: false,
    },
    darkMode: false,
    openDialog: false,
  }),
  actions: {
    async getUserTheme() {
      try {
        const res = await axios_PREFERENCES.get(
          `/theme-users-preferences/?filter=${JSON.stringify({
            where: { user_id: user.userCRM.id },
            limit: 1,
          })}`
        );

        console.log(res);

        const configuration = res.data;

        if (configuration) {
          this.mongo_id = configuration._id;
          this.theme.name = configuration.theme.name;
          this.theme.color = configuration.theme.color;
          this.theme.transparency = configuration.theme.transparency;
          this.darkMode = configuration.darkMode;
          setCssVar('primary', configuration.theme.color);
          Dark.set(this.darkMode);
        } else {
          const data = {
            user_id: user.userCRM.id,
            theme: this.theme,
            darkMode: this.darkMode,
          };
          const theme = await axios_PREFERENCES.post(
            '/theme-users-preferences',
            data
          );
          this.mongo_id = theme.data._id;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async setUserTheme() {
      try {
        const data = {
          user_id: user.userCRM.id,
          theme: this.theme,
        };
        await axios_PREFERENCES.patch(
          `/theme-users-preferences/${this.mongo_id}`,
          data
        );
      } catch (error) {
        console.log(error);
      }
    },
    changeTheme(theme: string) {
      if (Dark.isActive) {
        this.theme.name = 'theme-default';
        this.theme.color = '#1a2035';
        setCssVar('primary', this.theme.color);
      } else {
        switch (theme) {
          case 'audi':
            this.theme.name = 'theme-audi';
            this.theme.color = '#1a2035';
            setCssVar('primary', this.theme.color);
            break;
          case 'volk':
            this.theme.name = 'theme-volk';
            this.theme.color = '#0083d7';
            setCssVar('primary', this.theme.color);
            break;
          case 'camion':
            this.theme.name = 'theme-camiones';
            break;
          case 'white':
            this.theme.name = 'theme-white';
            this.theme.color = '#424242';
            setCssVar('primary', this.theme.color);
            break;
          case 'pink':
            this.theme.name = 'theme-pink';
            this.theme.color = '#e73571';
            setCssVar('primary', this.theme.color);
            break;
          case 'yellow':
            this.theme.name = 'theme-yellow';
            this.theme.color = '#252525';
            setCssVar('primary', this.theme.color);
            break;
          case 'orange':
            this.theme.name = 'theme-orange';
            this.theme.color = '#d15b16';
            setCssVar('primary', this.theme.color);
            break;
          default:
            this.theme.name = 'theme-default';
            this.theme.color = '#003c79';
            setCssVar('primary', this.theme.color);
            break;
        }
      }
      this.setUserTheme();
    },
    async changeTransparency() {
      try {
        this.theme.transparency = !this.theme.transparency;
        const data = {
          user_id: user.userCRM.id,
          theme: this.theme,
        };
        await axios_PREFERENCES.patch(
          `/theme-users-preferences/${this.mongo_id}`,
          data
        );
      } catch (error) {
        console.log(error);
      }
    },
    async changeDarkMode() {
      try {
        this.darkMode = !this.darkMode;
        const data = {
          user_id: user.userCRM.id,
          darkMode: this.darkMode,
        };
        await axios_PREFERENCES.patch(
          `/theme-users-preferences/${this.mongo_id}`,
          data
        );
        Dark.set(this.darkMode);
      } catch (error) {
        console.log(error);
      }
    },
  },
});

export default templateStore;
