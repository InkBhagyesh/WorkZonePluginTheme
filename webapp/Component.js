sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("com.sap.winslow.themeplugin.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            this._sThemeRoot = sap.ui.require.toUrl("com/sap/winslow/themeplugin/themes");

            const oUserInfoService = sap.ushell.Container.getService("UserInfo");
            const sEmail = oUserInfoService.getEmail();
            const oModel = this.getModel();

            oModel.callFunction("/getUserRoleByEmail", {
                method: "GET",
                urlParameters: { EmailId: sEmail },

                success: (oData) => {
                    this._sTargetTheme =
                        (oData.getUserRoleByEmail === "YVE") ? "YVE_Theme" : "Winslow_Theme";

                    sap.ui.getCore().setThemeRoot(this._sTargetTheme, this._sThemeRoot);

                    this._applyTheme();
                    this._attachNavigationListener();
                },

                error: function (err) {
                    console.log("Theme fetch failed", err);
                }
            });
        },

        _attachNavigationListener: function () {
            // debugger
            // Hash change (all navigation)
            window.addEventListener("hashchange", this._applyTheme.bind(this));

            // Shell theme change
            sap.ushell.Container.getRenderer().then((oRenderer) => {
                oRenderer.attachThemeChanged(this._applyTheme.bind(this));
            });
        },
        _applyTheme: function () {
            // debugger
            if (!this._sTargetTheme) return;

            sap.ui.getCore().setThemeRoot(this._sTargetTheme, this._sThemeRoot);
            sap.ui.getCore().applyTheme(this._sTargetTheme);

            const oUserInfo = sap.ushell.Container.getService("UserInfo");
            if (oUserInfo) {
                const oUser = oUserInfo.getUser();
                // if (oUser.getTheme() !== this._sTargetTheme) {
                    oUser.setTheme(this._sTargetTheme);
                // }
            }
        }
    });
});
