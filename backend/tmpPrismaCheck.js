const p = require("@prisma/client");
console.log("UserStatus", typeof p.UserStatus, p.UserStatus);
console.log("UserType", typeof p.UserType, p.UserType);
console.log("ATIVO", p.UserStatus?.ATIVO);
console.log("FARMACIA", p.UserType?.FARMACIA);
