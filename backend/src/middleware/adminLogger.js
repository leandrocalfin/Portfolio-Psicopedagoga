import { logAdminAction } from "../utils/securityLogger.js";

export const logAdminActionMiddleware = (accion, recurso) => {
  return (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
      if (res.statusCode < 400 && req.usuario) {
        logAdminAction(req.usuario._id, accion, recurso, {
          ip: req.ip,
          userAgent: req.get("user-agent"),
          params: req.params,
          bodyKeys: Object.keys(req.body || {}),
        });
      }
      originalSend.call(this, body);
    };
    next();
  };
};