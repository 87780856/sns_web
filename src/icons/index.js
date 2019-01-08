import Vue from 'vue'
import SvgIcon from '@/components/Widgets/SvgIcon' // svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(require.context('./svg', false, /\.svg$/))
