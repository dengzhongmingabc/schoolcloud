import notification from 'ant-design-vue/es/notification'
import modal from 'ant-design-vue/es/modal'
import store from '@/store'
import storage from 'store'

export function responseHandler(response,noticeSuccess){
  const code = response.code||response.result.code||0;
  const message = response.message||response.result.message||'操作出错！';
  if (code == 200){
    if(noticeSuccess){
      notification.success({
        message: '成功提示',
        description: message||'操作成功！'
      })
    }
    return true;
  }else if(code==403){//没有权限
    notification.error({
      message: '错误提示',
      description: message||'操作失败！'
    })
    return false;
  }else if(code==405){//会话过期
    modal.info({
      title: '确认提示',
      content: "会话过期，重新登录",
      onOk() {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    })
    return false;
  }else{
    notification.error({
      message: '错误提示',
      description: message||'操作失败！'
    })
    return false;
  }
}
