// Configuration driven by environment variables so the API can run locally
// while still defaulting to the Render Postgres instance used in production.
module.exports = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'EMMA123',
    BDD : {
        "host" : process.env.DB_HOST || "dpg-d53a2dm3jp1c738gm0dg-a.oregon-postgres.render.com",
        "port" : process.env.DB_PORT || "5432",
        "user" : process.env.DB_USER || "pollutions_user",
        "password" : process.env.DB_PASSWORD || "9NXBmKvgkUjbdUSaDIlkQjnIFqmTyBmb",
        "bdname" : process.env.DB_NAME || "pollutions_wxfb"
    }
}

// //postgresql://pollutions_user:QH0JXIr9G2qgqtY08nw42gKxrSS8Qms5@dpg-d4jf8815pdvs739dgi3g-a.oregon-postgres.render.com/pollutions_9hwr


// module.exports =  {
//     ACCESS_TOKEN_SECRET : "EMMA123",
//     BDD : {
//     "host" :"dpg-d53a2dm3jp1c738gm0dg-a.oregon-postgres.render.com",
//     "port" : "5432",
//     "user" : "pollutions_user",
//     "password" : "9NXBmKvgkUjbdUSaDIlkQjnIFqmTyBmb",
//     "bdname" :"pollutions_wxfb"
//     }
// }