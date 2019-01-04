<template>
  <div style='margin:200px auto'>
    <p style='text-align:center'>
      系统登录
      <!-- <lang-select class="set-language" /> -->
    </p>
    <SimpleForm ref=loginForm
      :formInfo='formInfo'>
    </SimpleForm>
    <div style='text-align:center'>
      <el-button :loading='loading'
        type='primary'
        style='width:235px'
        @click.native.prevent='handleLogin'>登录</el-button>
    </div>
  </div>
</template>

<script>
import SimpleForm from '@/components/Widgets/SimpleForm'
import { constantRouterMap } from '@/router/index'

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
              placeHolder: '账号',
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
              placeHolder: '密码',
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
            menuItems: constantRouterMap
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
