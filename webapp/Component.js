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

            // 1. Determine the path to your custom themes
            // This assumes your themes are deployed within the plugin's 'themes' folder
            const sThemeRoot = sap.ui.require.toUrl("com/sap/winslow/themeplugin/themes");

            oModel.callFunction("/getUserRoleByEmail", {
                method: "GET",
                urlParameters: { EmailId: sEmail },
                success: (oData) => {
                    const sTargetTheme = (oData.getUserRoleByEmail === "YVE") ? "YVE_Theme" : "Winslow_Theme";
                    
                    this._applyGlobalTheme(sTargetTheme, sThemeRoot);
                },
                error: (oError) => {
                    console.error("Theme fetching failed", oError);
                }
            });
        },

        _applyGlobalTheme: function (sThemeName, sRoot) {
            console.log("Applying Theme globally: " + sThemeName);

            // A. Register the theme so UI5 knows where the .css files are
            // This is the most common reason 'other parts' don't change
            sap.ui.getCore().applyTheme(sThemeName, sRoot);

            // B. Sync the Shell User Profile (Forces the Shell to broadcast the change)
            if (sap.ushell && sap.ushell.Container) {
                const oUser = sap.ushell.Container.getService("UserInfo").getUser();
                if (oUser.getTheme() !== sThemeName) {
                    oUser.setTheme(sThemeName);
                }
            }

            // C. Force a DOM attribute update (Fixes some Workzone caching)
            document.documentElement.setAttribute("data-sap-ui-theme", sThemeName);
        }
    });
});