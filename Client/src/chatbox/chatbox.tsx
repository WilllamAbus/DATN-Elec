import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

declare global {
  interface Window {
    fpt_ai_render_chatbox: (
      configs: any,
      baseUrl: string,
      socketUrl: string
    ) => void;
  }
}

const Chatbox = () => {
  const location = useLocation();

  // Access roles from Redux store
  const roles = useSelector((state: RootState) => state.auth.login.roles);

  // Check if the user is an admin
  const isAdmin = roles.some((role: { name: string }) => role.name === "admin");
  console.log(isAdmin);

  useEffect(() => {
    if (isAdmin) {
      // Admin users - hide chatbox
      const hideChatboxStyles = document.createElement("style");
      hideChatboxStyles.id = "hide_chatbox_styles";
      hideChatboxStyles.textContent = `
        #fpt_float_button, 
        .headerBackground, 
        .floatButtonLogo, 
        .customerLogo { 
          display: none !important; 
        }
      `;
      document.head.appendChild(hideChatboxStyles);

      return () => {
        const hideStyles = document.getElementById("hide_chatbox_styles");
        if (hideStyles) {
          hideStyles.remove();
        }
      };
    }

    if (!isAdmin && !location.pathname.startsWith("/admin")) {
      // Non-admin users or non-admin routes - show chatbox
      const liveChatBaseUrl = `${document.location.protocol}//livechat.fpt.ai/v36/src`;
      const LiveChatSocketUrl = "livechat.fpt.ai:443";
      const FptAppCode = "e900b6289af79cc3d6194721ebcf3039";
      const FptAppName = "E - COM";
      const CustomStyles = {
        headerBackground: "#338ef7",
        headerTextColor: "#ffffffff",
        headerLogoEnable: false,
        headerLogoLink:
          "https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png",
        headerText: "E - COM",
        primaryColor: "#F7F8FAFF",
        secondaryColor: "#ecececff",
        primaryTextColor: "#0045FFFF",
        secondaryTextColor: "#000000DE",
        buttonColor: "#b4b4b4ff",
        buttonTextColor: "#ffffffff",
        bodyBackgroundEnable: false,
        bodyBackgroundLink: "",
        avatarBot: "https://chatbot-tools.fpt.ai/livechat-builder/img/bot.png",
        sendMessagePlaceholder: "Nhập tin nhắn của bạn ở đây",
        floatButtonLogo:
          "https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/logo%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon%20(2).png?alt=media&token=c4c73842-527b-4552-8aee-8e48edd151cd",
        floatButtonTooltip: "xin chào bạn cần gì",
        floatButtonTooltipEnable: true,
        customerLogo:
          "https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/logo%2Flogo.svg?alt=media&token=8690d839-6870-4960-9541-668b238f5674",
        customerWelcomeText: "Vui lòng nhập tên của bạn",
        customerButtonText: "Bắt đầu",
        prefixEnable: true,
        prefixType: "radio",
        prefixOptions: ["Anh", "Chị"],
        prefixPlaceholder: "Danh xưng",
        css: "",
      };

      const FptLiveChatConfigs = {
        appName: FptAppName,
        appCode: FptAppCode,
        themes: "",
        styles: CustomStyles,
      };

      const FptLiveChatScript = document.createElement("script");
      FptLiveChatScript.id = "fpt_ai_livechat_script";
      FptLiveChatScript.src = liveChatBaseUrl + "/static/fptai-livechat.js";
      document.body.appendChild(FptLiveChatScript);

      const FptLiveChatStyles = document.createElement("link");
      FptLiveChatStyles.id = "fpt_ai_livechat_script";
      FptLiveChatStyles.rel = "stylesheet";
      FptLiveChatStyles.href = liveChatBaseUrl + "/static/fptai-livechat.css";
      document.body.appendChild(FptLiveChatStyles);

      FptLiveChatScript.onload = function () {
        window.fpt_ai_render_chatbox(
          FptLiveChatConfigs,
          liveChatBaseUrl,
          LiveChatSocketUrl
        );
      };

      return () => {
        const scriptElement = document.getElementById("fpt_ai_livechat_script");
        if (scriptElement) {
          scriptElement.remove();
        }
        const styleElement = document.querySelector(
          "link[href*='fptai-livechat.css']"
        );
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
  }, [location, isAdmin]);

  return null;
};

export default Chatbox;