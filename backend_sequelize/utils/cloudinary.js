const cloudinary = require("cloudinary").v2;
const fetch = require("node-fetch");

// path lib to form file paths
// using the linux version of this lib for the forward slash
// https://blog.logrocket.com/mastering-node-js-path-module/
const path = require("path").posix;

const { cloudinary: c } = require("../config/config");

cloudinary.config({
    cloud_name: c.cloudName,
    api_key: c.apiKey,
    api_secret: c.apiSecret
});

// ============================================================

// UPLOADS

/**
 * **I no longer prefer using upload presets, as they can be difficult to manage**  
 *   
 * Most likely used with file.createFileRecord, you can do the following
 * ```js
 * const tableRow = await cloudinary.uploadFileWithPreset(tempFilePath, preset)
 *     .then(res => createFileRecord(fileName, res, employee_id));
 * ```
 * The `await` also awaits for the `then` chain  
 * `try`/`catch` *should* also catch any error
 * @param {string} pathToFile The file path to the temp file stored on disk
 * @param {string} uploadPreset Cloudinary upload preset
 */
module.exports.uploadFileWithPreset = (pathToFile, uploadPreset) => cloudinary.uploader.upload(pathToFile, {
    resource_type: "raw",
    upload_preset: uploadPreset
});

// ============================================================

/**
 * Uploads a file to defined destination folder  
 *   
 * Most likely used with file.createFileRecord, you can do the following
 * ```js
 * const fullFolderPath = formDocumentsFolderPath(1, "m06_02");
 * const tableRow = await cloudinary.uploadFile(tempFilePath, fullFolderPath)
 *     .then(res => createFileRecord(fileName, res, employee_id));
 * ```
 * @param {string} pathToFile 
 * @param {string} folderPath 
 */
module.exports.uploadFile = (pathToFile, folderPath) => cloudinary.uploader.upload(pathToFile, {
    resource_type: "raw",
    folder: folderPath
});

// ============================================================

// DOWNLOAD

/**
 * File download stream from Cloudinary
 * ```js
 * await downloadFile(cloudinaryUri, res, originalFileName);
 * ```
 * **Do not `res.send()` or similar after calling this**
 * @param {string} uri Cloudinary URL
 * @param {string} originalFileName The original file name
 * @param {*} res Express endpoint respond
 * @param {boolean} [inline] Whether the file is downloaded and saved to disk (default) or an inline element (such as profile pictures)
 * @returns {Promise} Promise (of error if applicable)
 */
module.exports.downloadFile = (uri, originalFileName, res, inline = false) => fetch(uri).then(fRes => new Promise((resolve, reject) => {
    // the body is a readable stream that is being piped into the endpoint respond
    // the endpoint respond is a writable stream
    fRes.body.pipe(res);

    // http header content-disposition
    // this line sets a http header such that i can rename the download file name
    // and also say that this file is a download to be saved
    res.set("Content-Disposition", `${inline ? "inline" : "attachment"}; filename="${originalFileName}"`);
    // http header content-type
    // express will automatically determine the mime type as best as it can
    res.type(originalFileName);
    // response status
    res.status(200);

    res.on("close", () => resolve("OK"));
    res.on("error", e => reject(e));
}));

// ============================================================

// UPLOAD PRESET

/**
 * **I no longer prefer using upload presets, as they can be difficult to manage**  
 *   
 * Creates an upload preset to a folder  
 * Likely used with `createFolder()`
 * ```js
 * await createFolder(formDocumentsFolderPath(1, "m05_03"))
 *     .then(({ path }) => createUploadPreset(path, "charts"));
 * ```
 * @param {*} fullFolderPath The name of the folder and can be a path with `/`
 * @param {*} presetName The name of the preset
 * @returns {Promise<object>} Response
 */
module.exports.createUploadPreset = (fullFolderPath, presetName) => cloudinary.api.create_upload_preset({
    name: presetName,
    folder: fullFolderPath
});

// ============================================================

// DELETE

module.exports.deleteFile = (publicFileId) => cloudinary.uploader.destroy(publicFileId, {
    resource_type: "raw"
});

// ============================================================

// FOLDERS

/**
 * Creates a folder  
 * ```js
 * await createFolder(formDocumentsFolderPath(1, "m06_02"));
 * ```
 * @param {*} fullFolderPath The name of the folder and can be a path with `/`
 * @returns {Promise<object>} Response example `{"success": true, "path": "product/test", "name": "test"}`
 */
module.exports.createFolder = (fullFolderPath) => cloudinary.api.create_folder(fullFolderPath);

// ============================================================

module.exports.formDocumentsFolderPath = (companyId, moduleCode, file = null) => {
    if (!/^m[0-9]{2}_[0-9]{2}$/.test(moduleCode)) throw new Error("Invalid format for module codes");
    let result;
    if (file !== null) result = path.join(c.baseFolderPath, `org_${companyId}`, "documents", moduleCode, file);
    else result = path.join(c.baseFolderPath, `org_${companyId}`, "documents", moduleCode);
    return result;
}

// ============================================================

module.exports.formAvatarsFolderPath = (file = null) => {
    let result;
    if (file !== null) result = path.join(c.baseFolderPath, "avatars", file);
    else result = path.join(c.baseFolderPath, `org_${companyId}`, "avatars");
    return result;
}
