<template>
  <div class="login-page">
    
    <!-- Login Form -->
    <div class="login-form">
      <!-- Header Banner -->
      <div class="q-pa-none q-gutter-sm q-mb-xl">
        <q-banner inline-actions class="bg-light-green-10 text-white text-center text-weight-medium">
          Muzima
          <template v-slot:action>
            <q-btn color="white" outline dense @click="handleReconfigure" icon="sym_o_reset_wrench" />
          </template>
        </q-banner>
      </div>

      <!-- Logo -->
      <div class="text-center q-my-xl">
        <q-avatar size="80px" font-size="52px" color="teal" text-color="white">
          <img src="/app-logo.png" alt="App Logo" />
        </q-avatar>
      </div>

      <!-- Form -->
      <div class="q-pa-md">
        <!-- Server URL -->
        <q-input
          v-if="isFirstTimeSetup"
          v-model="serverUrl"
          label="URL do Servidor"
          class="q-mb-md"
          disable
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="link" />
          </template>
        </q-input>

        <!-- Username -->
        <q-input
          v-model="username"
          label="Utilizador"
          outlined
          :disable="isLoading"
          dense
          class="q-mb-md"
          autofocus
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

        <!-- Password -->
        <q-input
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          label="Password"
          :disable="isLoading"
          outlined
          class="q-mb-md"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="key" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <!-- Login Button -->
        <q-btn
          label="ENTRAR"
          color="primary"
          class="full-width q-mb-md"
          @click="handleLogin"
          :loading="isLoading"
        />
      </div>

      <!-- App Version -->
      <div class="row q-mt-xl">
        <label class="col text-center">v{{ appVersion }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import userService from 'src/services/user/userService';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import EncryptionManager from 'src/utils/EncryptionManager';
import { version } from '../../package.json';

// Destructure dialog functions
const { alertError, alertWarning, alertWarningAction } = useSwal();

// Router instance
const router = useRouter();

// State variables
const isPwd = ref(true);
const username = ref('');
const password = ref('');
const serverUrl = ref(''); 
const isLoading = ref(false);
const isFirstTimeSetup = ref(false);
const appVersion = version;

// Check if configuration exists in local storage
onMounted(() => {
  const justLoggedOut = sessionStorage.getItem('justLoggedOut');

  if (!justLoggedOut) {
    showPrivacyWarning();
  } else {
    sessionStorage.removeItem('justLoggedOut');
  }

  // Check for initial setup
  const settingsExist = localStorage.getItem('settings');
  if (!settingsExist) {
    isFirstTimeSetup.value = true;
  }
});

// Show privacy warning
const showPrivacyWarning = () => {
  alertWarning(
    'Ao acessar este sistema, você está prestes a visualizar informações altamente confidenciais de utentes. É sua responsabilidade protegê-las adequadamente e usá-las somente para os fins autorizados.'
  );
};

// Handle login
const handleLogin = async () => {
  isLoading.value = true;

  try {
    // Encrypt and save credentials to session storage
    EncryptionManager.setEncryptedSessionItem('username', username.value);
    EncryptionManager.setEncryptedSessionItem('password', password.value);

    // Call login with username and password
    await userService.login(username.value, password.value);

    // Redirect to main page after successful login
    router.push('/home');
  } catch (error) {
    console.error('Login failed:', error);
    alertError('Erro ao realizar login. Por favor, verifique as credenciais.');
  } finally {
    isLoading.value = false;
  }
};

// Reconfigure the app
const handleReconfigure = async () => {
  const confirmed = await alertWarningAction(
    'Deseja apagar todas as configurações do aplicativo e reconfigurar?'
  );

  if (confirmed) {
    localStorage.clear();
    userService.logout();
  }
};


</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-form {
  width: 100%;
  max-width: 400px;
}
</style>
