<template>
  <div style='margin:200px auto'>
    <p style='text-align:center'>
      {{ $t('login.title') }}
      <!-- <lang-select class="set-language" /> -->
    </p>
    <SimpleForm ref=loginForm
      :formInfo='formInfo'>
    </SimpleForm>
    <div style='text-align:center'>
      <el-button :loading='loading'
        type='primary'
        style='width:235px'
        @click.native.prevent='handleLogin'>{{ $t('login.loginButton') }}</el-button>
    </div>
  </div>
</template>

<script>
import SimpleForm from '@/components/Widgets/SimpleForm'
import { dynamicRouterMap } from '@/router/index'

export default {
  name: 'Login',
  components: {
    SimpleForm,
  },
  data() {
    return {
      formInfo: {
        items: [
          {
            fieldName: 'name',
            comparison: 'exact',
            formVisible: true,
            formItemUI: {
              style: { 'text-align': 'center', },
            },
            editorUI: {
              placeHolder: this.$t('login.username'),
              prefixIcon: 'el-icon-refresh',
              autocomplete: 'on',
              style: { 'width': 'auto', },
            },
          }, {
            fieldName: 'code',
            comparison: 'exact',
            formVisible: true,
            formItemUI: {
              style: { 'text-align': 'center', },
            },
            editorUI: {
              placeHolder: this.$t('login.password'),
              prefixIcon: 'el-icon-refresh',
              autocomplete: 'on',
              // keyupEnter: 'handleLogin',
              style: { 'width': 'auto', },
            },
          },
        ],
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          var userView = {
            loginFlag: true,
            menuItems: dynamicRouterMap
          }
          this.$store.commit('SET_USER_VIEW', userView)
          this.$router.push({ path: '/' })
          this.loading = false
        } else {
          console.log('error submit!!')
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
