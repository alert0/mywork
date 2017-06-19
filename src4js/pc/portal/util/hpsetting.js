//门户刷新函数
var customPortalSetting = function(hpid,subCompanyId,hpname){
    window.store_e9_element.dispatch(window.action_e9_element.HpSettingAction.handleCustomHpSetting(hpid,subCompanyId,hpname));
}
window.customPortalSetting = customPortalSetting;