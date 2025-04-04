import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Toast from 'primevue/toast'

import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import './assets/styles/main.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)

app.component('Toast', Toast)

app.mount('#app')
