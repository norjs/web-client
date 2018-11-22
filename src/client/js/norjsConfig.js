/**
 * ***NOTE!*** NEVER use special NORJS_BUILD_CONFIG variable anywhere else but this file.
 *
 * Webpack will inject build configuration JSON anywhere it finds `NORJS_BUILD_CONFIG`.
 *
 * *So,* two times mention and it is **two times** in the final build as a JSON string.
 *
 * However, you *CAN* import it from this file anywhere you need it.
 *
 */

const config = NORJS_BUILD_CONFIG;

export default config;
