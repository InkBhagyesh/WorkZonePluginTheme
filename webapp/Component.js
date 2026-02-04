sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/Theming",
    "sap/m/MessageToast"
], function (UIComponent, Theming, MessageToast) {
    "use strict";

    return UIComponent.extend("com.sap.winslow.themeplugin.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            const oModel = this.getModel();
            const oUserInfoService = sap.ushell.Container.getService("UserInfo");
            const sEmail = oUserInfoService.getEmail();

            // Path to custom themes folder
            const sThemeRoot = sap.ui.require.toUrl("com/sap/winslow/themeplugin/themes");

            oModel.callFunction("/getUserRoleByEmail", {
                method: "GET",
                urlParameters: { EmailId: sEmail },

                success: (oData) => {
                    const sTargetTheme =
                        (oData.getUserRoleByEmail === "YVE") ? "YVE_Theme" : "Winslow_Theme";

                    this._applyGlobalTheme(sTargetTheme, sThemeRoot);
                },

                error: (oError) => {
                    console.error("Theme fetching failed", oError);
                }
            });
        },

        _applyGlobalTheme: function (sThemeName, sRoot) {

            if (!sThemeName || !sRoot) {
                console.error("Theme name or theme root missing");
                return;
            }

            // Register custom theme path
            sap.ui.getCore().setThemeRoot(sThemeName, sRoot);

            // Apply theme
            sap.ui.getCore().applyTheme(sThemeName);

            // Update FLP user theme
            if (sap.ushell && sap.ushell.Container) {
                const oUserInfo = sap.ushell.Container.getService("UserInfo");
                if (oUserInfo) {
                    const oUser = oUserInfo.getUser();
                    if (oUser.getTheme() !== sThemeName) {
                        oUser.setTheme(sThemeName);
                    }
                }
            }

            // Workzone fix (force DOM update)
            document.documentElement.setAttribute("data-sap-ui-theme", sThemeName);
        }
    });
});
