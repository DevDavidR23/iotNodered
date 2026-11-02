const bcrypt = require("bcryptjs");

const adminUser = process.env.NODE_RED_USERNAME || "admin";
const adminPassword = process.env.NODE_RED_PASSWORD;
const adminAuth = adminPassword
  ? {
      type: "credentials",
      users: [
        {
          username: adminUser,
          password: bcrypt.hashSync(adminPassword, 8),
          permissions: "*",
        },
      ],
    }
  : undefined;

module.exports = {
  uiPort: process.env.PORT || 1880,
  uiHost: process.env.NODE_RED_UI_HOST || "0.0.0.0",

  flowFile: "flows.json",
  flowFilePretty: true,
  credentialSecret: process.env.NODE_RED_CREDENTIAL_SECRET,

  adminAuth,

  httpAdminRoot: "/",
  httpNodeRoot: "/",

  logging: {
    console: {
      level: process.env.NODE_RED_LOG_LEVEL || "info",
      metrics: false,
      audit: false,
    },
  },

  editorTheme: {
    projects: {
      enabled: false,
    },
    tours: false,
  },

  telemetry: {
    enabled: false,
  },

  mqttReconnectTime: 5000,
  functionExternalModules: false,
};
