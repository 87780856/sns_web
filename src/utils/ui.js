import { Message } from 'element-ui'
/**
 * 显示错误信息
 */
export function showErrorMessage(error) {
  let message = '消息信息:' + error.message
  Message({
    showClose: true,
    message: message,
    type: 'error',
    //duration: 3 * 1000,
    //dangerouslyUseHTMLString: true,
  })
}
