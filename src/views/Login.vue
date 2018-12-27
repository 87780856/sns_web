<template>
  <div class="login-container">
    <el-form autoComplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="card-box login-form">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <icon-svg icon-class="yonghuming" />
        </span>
        <el-input name="username"
          type="text"
          v-model="loginForm.username"
          autoComplete="on"
          placeholder="邮箱" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <icon-svg icon-class="mima"></icon-svg>
        </span>
        <el-input name="password"
          type="password"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autoComplete="on"
          placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          style="width:100%;"
          :loading="loading"
          @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div class='tips'>账号:admin 密码随便填</div>
      <div class='tips'>账号:editor 密码随便填</div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin12345678'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$router.push({ path: '/' })
          // this.loading = true
          // this.$store.dispatch('Login', this.loginForm).then(() => {
          //   this.loading = false
          //   this.$router.push({ path: '/' })
          // }).catch(() => {
          //   this.loading = false
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
