const isProd = process.env.NODE_ENV === "production";

export const securityLog = (evento, detalles = {}) => {
  const log = {
    timestamp: new Date().toISOString(),
    evento,
    ...detalles,
  };
  if (isProd) {
    console.log(JSON.stringify(log));
  } else {
    console.log(`[SECURITY] ${evento}`, detalles);
  }
};

export const logLoginAttempt = (email, exito, ip, userAgent, userId = null) => {
  securityLog("LOGIN_ATTEMPT", { email, exito, ip, userAgent, userId });
};

export const logPasswordChange = (userId, email, exito, ip) => {
  securityLog("PASSWORD_CHANGE", { userId, email, exito, ip });
};

export const logAdminAction = (userId, accion, recurso, detalles = {}) => {
  securityLog("ADMIN_ACTION", { userId, accion, recurso, ...detalles });
};

export const logFailedAuth = (email, ip, userAgent, motivo) => {
  securityLog("FAILED_AUTH", { email, ip, userAgent, motivo });
};

export const logRegistration = (email, exito, ip, porInvitacion = false) => {
  securityLog("REGISTRATION", { email, exito, ip, porInvitacion });
};

export const logLogout = (userId, email, ip) => {
  securityLog("LOGOUT", { userId, email, ip });
};