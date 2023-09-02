const _ALERT_TITLE_VALIDATION_ERROR = "VALIDATION ERROR";
const _ALERT_MSG_VALIDATION = "Please make sure all fields filled correctly";
const _ALERT_TITLE_ERROR = "ERROR";
const _ALERT_MSG_ERROR_DEFAULT = "Error on system. Please contact administrator!";
const _ALERT_TITLE_SUCCESS = "SUCCESS";
const _ALERT_TITLE_INFO = "INFORMATION";
const _ALERT_TITLE_WARNING = "WARNING";

const _ALERT_TITLE_SUCCESS_LOGOUT = "SUCCESS SIGN OUT";
const _ALERT_MSG_SUCCESS_LOGOUT = "You have successfully signed out";
const _ALERT_MSG_ERROR_LOGOUT = "Error on system. Please try sign in again.";
const _ALERT_MSG_ERROR_CAPTCHA = "Please check the captcha!";
const _ALERT_TITLE_ERROR_TIMEOUT = "SESSION TIMEOUT";
const _ALERT_MSG_ERROR_TIMEOUT = "Session expired. Please try sign in again.";

const _ALERT_TITLE_ERROR_LOGIN = "SIGN IN ERROR";
const _ALERT_TITLE_SUCCESS_REGISTER = "REGISTRATION SUCCESS";
const _ALERT_MSG_SUCCESS_REGISTER = "You have successfully registered. Please activate via link sent to your email.";
const _ALERT_TITLE_ERROR_ACTIVATE = "ACTIVATION ERROR";
const _ALERT_TITLE_SUCCESS_ACTIVATE = "ACTIVATION SUCCESS";
const _ALERT_MSG_SUCCESS_ACTIVATE = "Your account has successfully activated. Please login with email as user ID and your registered password.";
const _ALERT_MSG_SUCCESS_UPDATE_USER = "Your information successfully updated";

const _DATATABLE_LANGUAGE =  {
    info: "Papar muka _START_ hingga _END_ dari _TOTAL_ rekod",
    emptyTable: "Tiada data diperolehi",
    infoEmpty: "Tiada data diperolehi",
    zeroRecords: "Tiada data dijumpai - maaf",
    lengthMenu: "Papar _MENU_ rekod per mukasurat",
    infoFiltered: "(ditapis dari _MAX_ jumlah rekod)",
    paginate: {
        previous: "Sebelumnya",
        next: "Seterusnya"
    },
    search: "Carian : ",
    buttons: {
        colvis: 'Kolum'
    }
};

let versionLocal_;
const mzUrlDownload = '//localhost/api/';
//const mzUrlDownload = '//localhost:8081/spdp_new/api/';
let mzCnt;
const mzExportOpt = {
    columns: ':visible',
    format: {
        body: function ( data, row, column ) {
            if (row === 0 && column === 0) {
                mzCnt = 1;
            }
            if (column === 0 && typeof data === 'object') {
                return mzCnt++;
            } else if (data.length > 3 && data.substring(0, 3) === '<a>') {
                return '';
            } else if (data.toString().indexOf('red-text') > 0) {
                return data.replace('<span class="red-text">', '').replace('</span>', '');
            } else if (data.toString().indexOf('blue-text') > 0) {
                return data.replace('<span class="blue-text">', '').replace('</span>', '');
            } else if (data.toString().indexOf('orange-text') > 0) {
                return data.replace('<span class="orange-text">', '').replace('</span>', '');
            } else if (data.toString().indexOf('green-text') > 0) {
                return data.replace('<span class="green-text">', '').replace('</span>', '');
            } else if (data.toString().indexOf('fa-folder-open') > 0) {
                return data.replace(' <i class="fa-regular fa-folder-open"></i>', '');
            } else if (data.toString().indexOf('fa-folder-tree') > 0) {
                return data.replace('<i class="fa-solid fa-folder-tree"></i> ', '');
            } else if (data.toString().indexOf('progress md-progress') > 0) {
                const start = data.toString().indexOf('aria-valuemax="100">') + 20;
                const end = data.toString().indexOf('</div></div>');
                return data.substring(start, end);
            } else if (data.toString().indexOf('badge badge-pill') > 0) {
                const start = data.toString().indexOf('z-depth-1-half">') + 16;
                const end = data.toString().indexOf('</a>');
                return data.substring(start, end);
            } else if (data.toString().indexOf('badge') > 0) {
                const start = data.toString().indexOf('z-depth-2">') + 11;
                const end = data.toString().indexOf('</a>');
                return data.substring(start, end);
            } else if (data.toString().indexOf('chip chip-sm') > 0) {
                const start = data.toString().indexOf('png">') + 5;
                const end = data.toString().indexOf('</div>');
                return data.substring(start, end);
            } else if (data.toString().indexOf('ul style') > 0) {
                return data.replace('<ul style="padding-left: 20px; margin-bottom: 0 !important;"><li>', '').replaceAll('</li><li>', ', ').replace('</li></ul>', '');
            }
            return data;
        }
    }
};
const mzExportExcelOpt = {
    format: {
        body: function ( data, row, column ) {
            if (row === 0 && column === 0) {
                mzCnt = 1;
            }
            if (column === 0 && typeof data === 'object') {
                return mzCnt++;
            } else if (data.length > 3 && data.substring(0, 3) === '<a>') {
                return '';
            } else if (data.toString().indexOf('red-text') > 0) {
                return data.replace('<span class="red-text">', '').replace('</span>', '');
            } else if (data.toString().indexOf('green-text') > 0) {
                return data.replace('<span class="green-text">', '').replace('</span>', '');
            } else if (data.toString().indexOf('mr-3') > 0) {
                return data.replace('<span class="mr-3">', '').replace('</span>', '');
            } else if (data.toString().indexOf('ul style') > 0) {
                return data.replace('<ul style="padding-left: 20px; margin-bottom: 0 !important;"><li>', '').replaceAll('</li><li>', ', ').replace('</li></ul>', '');
            }
            return data;
        }
    }
};

let modalClass = $('.modal');
modalClass.on('show.bs.modal', function () {
    const idx = $('.modal:visible').length;
    $(this).css('z-index', 1040 + (10 * idx));
});
modalClass.on('shown.bs.modal', function () {
    const idx = ($('.modal:visible').length) - 1; // raise backdrop after animation.
    let modalBackdrop = $('.modal-backdrop');
    modalBackdrop.not('.stacked').css('z-index', 1039 + (10 * idx));
    modalBackdrop.not('.stacked').addClass('stacked');
});

function ShowLoader() {
    let overlay = jQuery('<div id="loading-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.6); z-index: 10000;"><div style="text-align: center; width: 100%; position: absolute; top: 40%; margin-top: -50px;"> <div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> <div class="spinner-layer spinner-red"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> <div class="spinner-layer spinner-yellow"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> <div class="spinner-layer spinner-green"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div> </div> </div>');
    overlay.appendTo(document.body);
}

function HideLoader() {
    $('#loading-overlay').remove();
}

function mzFormatNumber(num, fix) {
    if (isNaN(num)) return '-';
    if (num === '') return '-';
    if (num == null) 	num = 0;
    num = parseFloat(num);
    let p = num.toFixed(fix).split(".");
    let result = p[0].split("").reduceRight(function(acc, num, i, orig) {
        const pos = orig.length - i - 1;
        return  num + (pos && !(pos % 3) ? "," : "") + acc;
    }, "") + (p[1] ? "." + p[1] : "");
    if (result.substring(0, 2) === '-,') {
        result = '-' + result.substring(2);
    }
    return result;
}

function mzValidMail(mail) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
}

function mzValidDigit(digit) {
    return /^\d+$/.test(digit);
}

function mzValidNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function mzValidPassword(n) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(n);
}

function MzValidate(isEnglish) {
    let obj = {};
    obj.fields = [];
    isEnglish = typeof isEnglish === 'undefined' ? true : isEnglish;

    const checkField = function (field_id, type, val) {
        try {
            const fieldSelector = type === 'notEmptyCheck' || type === 'notEmptyRadio' || type === 'notEmptyCheckSingle' || type === 'notSimilarRadio' ? $("input[name='"+field_id+"']:checked") : $('#' + field_id);
            const fieldVal = type !== 'notEmptyCheck' && type !== 'notEmptyRadio' && type !== 'notEmptyCheckSingle' ? fieldSelector.val() : '';
            const idVal = typeof val.id !== 'undefined' ? $('#' + val.id).val() : '';
            switch (type) {
                case 'notEmpty':
                    if (val === true && (fieldVal === '' || fieldVal === null))
                        return false;
                    break;
                case 'eqLength':
                    if (fieldVal.length !== val && fieldVal !== '')
                        return false;
                    break;
                case 'maxLength':
                    if (fieldVal.length > val && fieldVal !== '')
                        return false;
                    break;
                case 'minLength':
                    if (fieldVal.length < val && fieldVal !== '')
                        return false;
                    break;
                case 'numeric':
                    if (val === true && !mzValidNumeric(fieldVal) && fieldVal !== '')
                        return false;
                    break;
                case 'email':
                    if (val === true && !mzValidMail(fieldVal) && fieldVal !== '')
                        return false;
                    break;
                case 'digit':
                    if (val === true && !mzValidDigit(fieldVal) && fieldVal !== '')
                        return false;
                    break;
                case 'password':
                    if (val === true && !mzValidPassword(fieldVal) && fieldVal !== '')
                        return false;
                    break;
                case 'similar':
                    if (val !== '' && fieldVal !== idVal && fieldVal !== '')
                        return false;
                    break;
                case 'notSimilar':
                case 'notSimilarRadio':
                    if (val !== '' && fieldVal === val)
                        return false;
                    break;
                case 'max':
                    if (fieldVal > val && fieldVal !== '')
                        return false;
                    break;
                case 'min':
                    if (fieldVal < val && fieldVal !== '')
                        return false;
                    break;
                case 'notEmptyArr':
                    if (val === true && fieldVal.length === 0)
                        return false;
                    break;
                case 'notEmptyFile':
                    if (val === true && fieldSelector.prop('files').length === 0) {
                        return false;
                    }
                    break;
                case 'notEmptyCheckSingle':
                case 'notEmptyCheck':
                case 'notEmptyRadio':
                    if (val === true && fieldSelector.length === 0)
                        return false;
                    break;
                case 'notEmptySummernote':
                    if (val === true && fieldSelector.summernote('isEmpty'))
                        return false;
                    break;
                case 'pdfType':
                    if (val === true && fieldSelector.prop('files').length > 0 && fieldSelector.prop('files')[0].type !== 'application/pdf') {
                        return false;
                    }
                    break;
                case 'imageType':
                    if (val === true && fieldSelector.prop('files').length > 0 && fieldSelector.prop('files')[0].type !== 'image/jpg' && fieldSelector.prop('files')[0].type !== 'image/jpeg' && fieldSelector.prop('files')[0].type !== 'image/png') {
                        return false;
                    }
                    break;
                case 'imagePdfType':
                    if (val === true && fieldSelector.prop('files').length > 0 && fieldSelector.prop('files')[0].type !== 'image/jpg' && fieldSelector.prop('files')[0].type !== 'image/jpeg' && fieldSelector.prop('files')[0].type !== 'image/png' && fieldSelector.prop('files')[0].type !== 'application/pdf') {
                        return false;
                    }
                    break;
                case 'fileSize':
                    if (fieldSelector.prop('files').length > 0 && fieldSelector.prop('files')[0].size > val*1024*1024) {
                        return false;
                    }
                    break;
                case 'lower':
                    if (val !== '' && fieldVal !== '' && idVal !== '' && fieldVal > idVal)
                        return false;
                    break;
                case 'higher':
                    if (val !== '' && fieldVal !== '' && idVal !== '' && fieldVal < idVal)
                        return false;
                    break;
                case 'inList':
                    if (val !== '' && fieldVal !== '' && Array.isArray(val)) {
                        let isValid = false;
                        for (let i=0; i<val.length; i++) {
                            if (val[i] === fieldVal) {
                                isValid = true;
                                break;
                            }
                        }
                        if (!isValid)
                            return false;
                    }
                    break;
            }
            return true;
        } catch (e) { console.log(e.message); }
    };

    const validateFields = function (field_id, validator, name, type) {
        let msg = '';
        let fieldSelector;
        let fieldErrSelector;
        if (type === 'check') {
            fieldSelector = $("input[name='"+field_id+"']:checkbox");
            fieldErrSelector = $('#' + field_id.substring(0, field_id.length-2) + 'Err');
        }
        else if (type === 'radio') {
            fieldSelector = $("input[name='"+field_id+"']:radio");
            fieldErrSelector = $('#' +field_id + 'Err');
        }
        else {
            fieldSelector = $('#' + field_id);
            fieldErrSelector = $('#' +field_id + 'Err');
        }
        if (type === 'select') {
            $('#' + field_id + '_ .select-wrapper.md-form.md-outline input.select-dropdown').removeClass('invalid');
        } else {
            fieldSelector.removeClass('invalid');
        }
        fieldErrSelector.html('');

        /*const keys = Object.keys(validator);
        for(let i = 0; i < keys.length; i++){
            const value = validator[keys[i]];
        }*/

        $.each(validator, function (n2, u2) {
            try {
                if (!checkField(field_id, n2, u2)) {
                    switch (n2) {
                        case 'notEmpty':
                            if (type === 'select') {
                                msg += isEnglish ? '<br>Please choose ' + name : '<br>Sila pilih ' + name;
                            } else {
                                msg += isEnglish ? '<br>Please fill in ' + name : '<br>Sila isi ' + name;
                            }
                            return false;
                        case 'eqLength':
                            msg += '<br>Panjang perkataan mesti bersamaan ' + u2 + ' huruf';
                            break;
                        case 'maxLength':
                            msg += isEnglish ? '<br>Maximum length must not exceed ' + u2 + ' letters' : '<br>Panjang maksimum mesti ' + u2 + ' huruf';
                            break;
                        case 'minLength':
                            msg += isEnglish ? '<br>Minimum length must not less than ' + u2 + ' letters' : '<br>Panjang minimum mesti ' + u2 + ' huruf';
                            break;
                        case 'numeric':
                            msg += isEnglish ? '<br>' + name + ' must in valid numeric format' : '<br>' + name + ' mesti dalam format numerik';
                            break;
                        case 'email':
                            msg += isEnglish ? '<br>' + name + ' must in valid email format' : '<br>' + name + ' mesti dalam format emel';
                            break;
                        case 'digit':
                            msg += isEnglish ? '<br>' + name + ' must in valid digit format' : '<br>' + name + ' mesti dalam format digit';
                            break;
                        case 'password':
                            msg += '<br>' + name + ' mesti dimulakan dengan huruf besar dan mengandungi 1 huruf kecil, 1 huruf besar, 1 special character dan 1 nombor';
                            break;
                        case 'similar':
                            msg += isEnglish ? '<br>' + name + ' must equal to ' + u2.label : '<br>' + name + ' mesti sama dengan ' + u2.label;
                            break;
                        case 'notSimilar':
                        case 'notSimilarRadio':
                            msg += isEnglish ? '<br>' + name + ' must not equal to the original value' : '<br>' + name + ' mesti berlainan dengan nilai asal';
                            break;
                        case 'max':
                            msg += isEnglish ? '<br>' + name + ' must at most ' + u2 : '<br>' + name + ' mesti tidak melebihi ' + u2;
                            break;
                        case 'min':
                            msg += isEnglish ? '<br>' + name + ' must at least ' + u2 : '<br>' + name + ' mesti tidak kurang dari ' + u2;
                            break;
                        case 'notEmptyArr':
                            msg += isEnglish ? '<br>Please choose ' + name : '<br>Sila pilih ' + name;
                            return false;
                        case 'notEmptyFile':
                            msg += isEnglish ? '<br>Please upload ' + name : '<br>Sila muatnaik file ' + name;
                            return false;
                        case 'notEmptyCheck':
                            msg += isEnglish ? '<br>Please choose at least 1 ' + name : '<br>Sila pilih sekurang-kurangnya 1 ' + name;
                            return false;
                        case 'notEmptyRadio':
                            msg += isEnglish ? '<br>Please choose 1 ' + name : '<br>Sila pilih 1 ' + name;
                            return false;
                        case 'notEmptyCheckSingle':
                            msg += isEnglish ? '<br>Please make sure ' + name + ' ticked' : '<br>Sila pastikan ' + name + ' dipilih';
                            return false;
                        case 'notEmptySummernote':
                            msg += isEnglish ? '<br>Please fill in '+name : '<br>Sila isi '+name;
                            return false;
                        case 'pdfType':
                            msg += isEnglish ? '<br>Please make sure the uploaded file is in PDF type' : '<br>Sila pastikan format dokumen muatnaik adalah PDF';
                            return false;
                        case 'imageType':
                            msg += isEnglish ? '<br>Please make sure the uploaded file is in JPG, JPEG, PNG type' : '<br>Sila pastikan format dokumen muatnaik adalah JPG, JPEG, PNG';
                            return false;
                        case 'imagePdfType':
                            msg += isEnglish ? '<br>Please make sure the uploaded file is in PDF, JPG, JPEG, PNG type' : '<br>Sila pastikan format dokumen muatnaik adalah PDF, JPG, JPEG, PNG';
                            return false;
                        case 'lower':
                            msg += isEnglish ?  '<br>' + name + ' must lower than ' + u2.label : '<br>' + name + ' mestilah melebihi ' + u2.label;
                            break;
                        case 'higher':
                            msg += isEnglish ?  '<br>' + name + ' must higher than ' + u2.label : '<br>' + name + ' mestilah kurang dari ' + u2.label;
                            break;
                        case 'inList':
                            msg += isEnglish ?  '<br>' + name + ' is not in list' : '<br>' + name + ' tiada dalam senarai';
                            break;
                    }
                } else {
                    if (n2 === 'lower' || n2 === 'higher') {
                        $('#' +u2.id).removeClass('invalid');
                        $('#' +u2.id + 'Err').html('');
                    }
                }
            } catch (e) { toastr['error'](e.message, _ALERT_TITLE_ERROR); }
        });
        if (msg !== '') {
            if (type === 'select') {
                $('#' + field_id + '_ .select-wrapper.md-form.md-outline input.select-dropdown').addClass('invalid');
            } else {
                fieldSelector.addClass('invalid');
            }
            fieldErrSelector.html(msg.substring(4));
            return false;
        }
        return true;
    };

    const validateFieldsNoError = function (field_id, validator) {
        let noError = true;
        $.each(validator, function (n2, u2) {
            if (!checkField(field_id, n2, u2)) {
                noError = false;
                return false;
            }
        });
        return noError;
    };

    this.registerFields = function (data) {
        this.fields = [];
        let arrFields = [];
        $.each(data, function (n, u) {
            let fieldSelector;
            let fieldErrSelector;
            if (u.type === 'check') {
                fieldSelector = $("input[name='" + u.field_id + "']:checkbox");
                fieldErrSelector = $('#' + (u.field_id).substring(0, (u.field_id).length - 2) + 'Err');
            }
            else if (u.type === 'radio') {
                fieldSelector = $("input[name='"+u.field_id+"']:radio");
                fieldErrSelector = $('#' + u.field_id + 'Err');
            }
            else {
                fieldSelector = $('#' + u.field_id);
                fieldErrSelector = $('#' + u.field_id + 'Err');
            }
            if (u.type === 'select') {
                $('#' + u.field_id + '_ .select-wrapper.md-form.md-outline input.select-dropdown').removeClass('invalid');
            } else {
                fieldSelector.removeClass('invalid');
            }
            fieldErrSelector.html('');
            if (u.focus){
                fieldSelector.on('keyup blur', function () {
                    if (u.enabled) {
                        validateFields(u.field_id, u.validator, u.name, u.type);
                    }
                });
            } else {
                fieldSelector.on('keyup change', function () {
                    if (u.enabled) {
                        validateFields(u.field_id, u.validator, u.name, u.type);
                    }
                });
            }
            u.enabled = true;
            arrFields.push(u);
        });
        this.fields = arrFields;
    };

    this.validateForm = function () {
        let result = true;
        $.each(this.fields, function (n, u) {
            if (u.enabled && !validateFieldsNoError(u.field_id, u.validator)) {
                result = false;
            }
        });
        return result;
    };

    this.validateNow = function () {
        let result = true;
        $.each(this.fields, function (n, u) {
            if (u.enabled && !validateFields(u.field_id, u.validator, u.name, u.type)) {
                result = false;
            }
        });
        return result;
    };

    this.validateSummernote = function () {
        let result = true;
        $.each(this.fields, function (n, u) {
            if (u.enabled && u.type === 'summernote' && !validateFields(u.field_id, u.validator, u.name, u.type)) {
                result = false;
            }
        });
        return result;
    };

    this.clearValidation = function () {
        $.each(this.fields, function (n, u) {
            let fieldSelector;
            let fieldErrSelector;
            let fieldLblSelector = '';
            const fieldId = u.field_id;
            if (u.type === 'check') {
                fieldSelector = $("input[name='"+fieldId+"']:checkbox");
                fieldErrSelector = $('#' + fieldId.substring(0, fieldId.length-2) + 'Err');
            }
            else if (u.type === 'radio') {
                fieldSelector = $("input[name='"+fieldId+"']:radio");
                fieldErrSelector = $('#' + u.field_id + 'Err');
            }
            else {
                fieldSelector = $('#' + fieldId);
                fieldErrSelector = $('#' + fieldId + 'Err');
                fieldLblSelector = $('#lbl' + fieldId.substring(3));
            }

            if (u.type === 'text' || u.type === 'textarea') {
                fieldSelector.val('');
                fieldLblSelector.removeClass('active');
            }
            else if (u.type === 'select') {
                fieldSelector.materialSelect('destroy');
                fieldSelector.val(null);
                fieldLblSelector.removeClass('active');
                fieldSelector.materialSelect();
                //$('.mdb-select').materialSelect('destroy');
                //$('#' + fieldId).val(null).trigger( 'click');
                //$('.mdb-select').materialSelect();
                //$('#' + fieldId).prevAll('.select-dropdown').children('li:contains(\'\')').trigger('click');
            }
            else if (u.type === 'selectMultiple') {
                //$('#' + fieldId).prevAll('.select-dropdown').children('li:contains(\'\')').trigger('click');
                fieldSelector.val(null).change();
                //fieldLblSelector.html('').removeClass('active');
            }
            else if (u.type === 'checkSingle') {
                fieldSelector.prop('checked',false);
            }
            else if (u.type === 'check' || u.type === 'radio') {
                fieldSelector.prop('checked',false);
            }
            else if (u.type === 'file') {
                fieldSelector.val('');
                $('#txt' + fieldId.substring(3)).val('');
                fieldLblSelector.removeClass('active');
            }
            else if (u.type === 'summernote') {
                fieldSelector.summernote('code', '');
            }
            else if (u.type === 'date') {
                const input = fieldSelector.pickadate();
                let calendar = input.data('pickadate');
                calendar.clear();
            }
            fieldSelector.removeClass('invalid');
            fieldErrSelector.html('');
        });
    };

    this.enableField = function (fieldId) {
        let arrFields = this.fields;
        $.each(arrFields, function (n, u) {
            if (u.field_id === fieldId) {
                u.enabled = true;
                return false;
            }
        });
        this.fields = arrFields;
    };

    this.disableField = function (fieldId) {
        let arrFields = this.fields;
        $.each(arrFields, function (n, u) {
            if (u.field_id === fieldId) {
                u.enabled = false;
                let fieldSelector;
                let fieldErrSelector;
                if (u.type === 'check') {
                    fieldSelector = $("input[name='"+fieldId+"']:checkbox");
                    fieldErrSelector = $('#' + fieldId.substring(0, fieldId.length-2) + 'Err');
                }
                else if (u.type === 'radio') {
                    fieldSelector = $("input[name='"+fieldId+"']:radio");
                    fieldErrSelector = $('#' + u.field_id + 'Err');
                }
                else {
                    fieldSelector = $('#' + fieldId);
                    fieldErrSelector = $('#' + fieldId + 'Err');
                }
                if (u.type === 'select') {
                    fieldSelector.materialSelect();
                }
                fieldSelector.removeClass('invalid');
                fieldErrSelector.html('');
                return false;
            }
        });
        this.fields = arrFields;
    };

    this.validateField = function (fieldId) {
        let result = true;
        let arrFields = this.fields;
        $.each(arrFields, function (n, u) {
            if (u.field_id === fieldId) {
                if (u.enabled && !validateFieldsNoError(u.field_id, u.validator)) {
                    result = false;
                }
            }
        });
        return result;
    }
}

function mzAjax (url, type, data, functionStr) {
    let returnVal = '';
    if (typeof url === 'undefined' || typeof type === 'undefined' || url === '' || type === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (type !== 'GET' && type !== 'POST' && type !== 'PUT' && type !== 'DELETE') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    data = typeof data === 'undefined' ? {} : data; // JSON.stringify(data)
    const async = (typeof functionStr !== 'undefined' && functionStr !== '');

    let header = {};
    if (sessionStorage.getItem('token') !== null) {
        header = {'Authorization': 'Bearer ' + sessionStorage.getItem('token')};
    }
    if (type === 'GET' && data !== '') {
        jQuery.extend(header, data);
        data = '';
    }

    let errMsg = '';
    $.ajax({
        url: url,
        type: type,
        contentType: 'application/json; charset=utf-8',
        headers: header,
        data: JSON.stringify(data),
        dataType: 'json',
        async: async,
        success: function (resp) {
            if (resp.success) {
                returnVal = resp.result;
                if (typeof functionStr !== 'undefined') {
                    if (functionStr.slice(-2) === '()') {
                        eval(functionStr.slice(0, -1) + '\'' + JSON.stringify(returnVal) + '\');');
                    } else {
                        eval(functionStr.slice(0, -1) + ',\'' + JSON.stringify(returnVal) + '\');');
                    }
                }
                if (resp['errmsg'] !== '') {
                    toastr['success'](resp['errmsg'], _ALERT_TITLE_SUCCESS);
                }
            } else if (resp['errmsg'] === 'Expired token') {
                window.location.href = 'login.html?f=2';
            } else {
                errMsg = resp['errmsg'] !== '' ? resp['errmsg'] : _ALERT_MSG_ERROR_DEFAULT;
            }
        },
        error: function () {
            errMsg = _ALERT_MSG_ERROR_DEFAULT;
        }
    });

    if (errMsg !== '') {
        throw new Error(errMsg);
    }
    return returnVal;
}

function mzGetUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

function mzSleep(delay) {
    let start = new Date().getTime();
    while (new Date().getTime() < start + delay) {
    }
}

function mzLogout() {
	//mzAjaxRequest('user/log_out', 'POST');
    sessionStorage.clear();
    window.location.href = 'p_login';
}

function mzLogoutError(errorType) {
    mzAjax('user/log_out/'+errorType, 'POST');
    sessionStorage.clear();
    sessionStorage.setItem('errorLogout', errorType);
    window.location.href = 'p_login';
}

function mzGoToMenu(url, navId, navSecondId) {
    sessionStorage.setItem('navId', navId);
    sessionStorage.setItem('navSecondId', navSecondId);
    window.location.href = url;
}

function initiatePages() {
    const token = sessionStorage.getItem('token');
    const navId = parseInt(sessionStorage.getItem('navId'));
    const navSecondId = parseInt(sessionStorage.getItem('navSecondId'));
    let userInfo = sessionStorage.getItem('userInfo');

    if (token === null) {
        window.location.href = 'p_login';
    } else if (userInfo === null || navId === null || navSecondId === null) {
        sessionStorage.removeItem('token');
        window.location.href = 'p_login';
    }

    //new ModalProfile();
    //new ModalChangePassword();

    const objEncrypted = CryptoJS.AES.decrypt(userInfo, 'TaskManagement').toString(CryptoJS.enc.Utf8);
    userInfo = JSON.parse(objEncrypted);
    if (typeof userInfo.menu === 'undefined') {
        sessionStorage.removeItem('token');
        window.location.href = 'p_login';
    }

    setupPages(false);

    const menuSet = userInfo.menu;
    let titleHtml = '<i class="fas fa-angle-double-right mx-2 white-text" aria-hidden="true"></i>';
    $.each(menuSet, function (n, nav) {
        let menuHtml = '<li>';
        const strActive = navId === nav['navId'] ? 'active' : '';
        const strBold = navId === nav['navId'] ? 'font-weight-bold' : '';
        const navSeconds = nav['navSecond'];
        if (navSeconds.length > 0) {
            menuHtml += '<a class="collapsible-header waves-effect arrow-r ' + strActive + '"><i class="' + nav['navIcon'] + '"></i> ' + nav['navName'] + '<i class="fa fa-angle-down rotate-icon"></i></a>';
            menuHtml += '<div class="collapsible-body">';
            menuHtml += '<ul>';
            if (navId === nav['navId']) {
                titleHtml += '<span class="font-weight-bold">' + nav['navName'] + '</span>';
            }
            $.each(navSeconds, function (n2, nav2nd) {
                const strHighlight = navSecondId === nav2nd['navSecondId'] ? 'font-weight-bold' : '';
                menuHtml += '<li><a href="' + nav2nd['navSecondPage'] + '" class="waves-effect ' + strHighlight + '" onclick="mzGoToMenu(\'' + nav['navPage'] + '\', \'' + nav['navId'] + '\', \'' + nav2nd['navSecondId'] + '\');">' + nav2nd['navSecondName'] + '</a></li>';
                if (navSecondId === nav2nd['navSecondId']) {
                    titleHtml += '<span class="font-small"> / ' + nav2nd['navSecondName'] + '</span>';
                }
            });
            menuHtml += '</ul>';
            menuHtml += '</div>';
        } else {
            menuHtml += '<a class="collapsible-header waves-effect ' + strBold + '" href="#" onclick="mzGoToMenu(\'' + nav['navPage'] + '\', \'' + nav['navId'] + '\', \'0\');"><i class="fas fa-' + nav['navIcon'] + '"></i> ' + nav['navName'] + '</a>';
            if (navId === nav['navId']) {
                titleHtml += nav['navName'];
            }
        }
        menuHtml += '</li>';
        $('#ulNavLeft').append(menuHtml);
    });
    $('#pBasePageTitle').append(titleHtml);
    $('.collapsible').collapsible();

    /*(function() {
        const idleDurationSecs = 30300;    // X number of seconds
        const redirectUrl = '/logout';  // Redirect idle users to this URL
        let idleTimeout; // variable to hold the timeout, do not modify

        const resetIdleTimeout = function() {
            // Clears the existing timeout
            if(idleTimeout) clearTimeout(idleTimeout);
            // Set a new idle timeout to load the redirectUrl after idleDurationSecs
            idleTimeout = setTimeout(() => mzLogoutError('1'), idleDurationSecs * 1000);
        };

        // Init on page load
        resetIdleTimeout();
        // Reset the idle timeout on any of the events listed below
        ['click', 'touchstart', 'mousemove'].forEach(evt =>
            document.addEventListener(evt, resetIdleTimeout, false)
        );
    })();

    setInterval(function(){
        const returnVal = mzAjaxRequest('user/update_last_idle', 'PUT');
        if (returnVal === 'INVALID_IP') {
			mzAjaxRequest('user/log_out/2', 'POST');
            //mzLogoutError('2');
        }
    }, 120000);*/
}

function setupPages(isExternal) {
    versionLocal_ = mzGetDataVersion(isExternal);
    $(".button-collapse").sideNav();

    //let container = document.querySelector('.custom-scrollbar');
    /*Ps.initialize(container, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20
    });*/

    // Material Select Initialization
    $(document).ready(function () {
        $('.mdb-select').materialSelect();
        $('.select-wrapper.md-form.md-outline input.select-dropdown').bind('focus blur', function () {
            $(this).closest('.select-outline').find('label').toggleClass('active');
            $(this).closest('.select-outline').find('.caret').toggleClass('active');
        });
        $(".mdb-lightbox-ui").load("mdb-addons/mdb-lightbox-ui.html");
    });

    // Tooltips Initialization
    $('[data-toggle="tooltip"]').tooltip();

    // Dismissible Popover
    $('[data-toggle="popover"]').popover();
    $('.popover-dismiss').popover({
        trigger: 'focus'
    });

    // Data Picker Initialization
    $('.datepicker').pickadate(
        /*{monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
            'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt',
            'Nov', 'Dis'],
        weekdaysShort: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
        weekdaysFull: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
        today: 'Hari ini',
        clear: 'Padam',
        close: 'Batal'}*/
    );
    $('.timepicker').pickatime({
        autoclose: true
    });

    // Toast Initialization
    toastr.options = {
        "closeButton": true, // true/false
        "debug": false, // true/false
        "newestOnTop": false, // true/false
        "progressBar": true, // true/false
        "positionClass": "md-toast-top-right", // md-toast-top-right / md-toast-top-left / md-toast-bottom-right / md-toast-bottom-left
        "preventDuplicates": false,// true/false
        "onclick": null,
        "showDuration": "500", // in milliseconds
        "hideDuration": "1000", // in milliseconds
        "timeOut": "5000", // in milliseconds
        "extendedTimeOut": "1000", // in milliseconds
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}

function mzGetUserId() {
    let userInfo = sessionStorage.getItem('userInfo');
    const objEncrypted = CryptoJS.AES.decrypt(userInfo, 'TaskManagement').toString(CryptoJS.enc.Utf8);
    userInfo = JSON.parse(objEncrypted);
    return userInfo['userId'];
}

function mzDateFromTo(startId, endId) {
    // Get the elements
    let from_input = $('#'+startId).pickadate(),
        from_picker = from_input.pickadate('picker');
    let to_input = $('#'+endId).pickadate(),
        to_picker = to_input.pickadate('picker');

    // Check if there’s a “from” or “to” date to start with and if so, set their appropriate properties.
    if (from_picker.get('value')) {
        to_picker.set('min', from_picker.get('select'));
    }
    if (to_picker.get('value')) {
        from_picker.set('max', to_picker.get('select'));
    }

    // Apply event listeners in case of setting new “from” / “to” limits to have them update on the other end. If ‘clear’ button is pressed, reset the value.
    from_picker.on('set', function (event) {
        if (event.select) {
            to_picker.set('min', from_picker.get('select'));
        } else if ('clear' in event) {
            to_picker.set('min', false);
        }
    });
    to_picker.on('set', function (event) {
        if (event.select) {
            from_picker.set('max', to_picker.get('select'));
        } else if ('clear' in event) {
            from_picker.set('max', false);
        }
    });
}

function mzDateFromToReset(startId, endId) {
    // Get the elements
    const from_input = $('#'+startId).pickadate();
    let from_picker = from_input.pickadate('picker');
    const to_input = $('#'+endId).pickadate();
    let to_picker = to_input.pickadate('picker');

    to_picker.set('min', false);
    from_picker.set('max', false);
}

function mzSetMinDate(id, dateInput) {
    const picker_input = $('#'+id).pickadate();
    let picker_value = picker_input.pickadate('picker');
    if (dateInput === true) {
        picker_value.set('min', true);
    } else if (dateInput === false) {
        picker_value.set('min', false);
    } else {
        const dateSplit = dateInput.split('-');
        if (dateSplit.length === 3) {
            let day = parseInt(dateSplit[2]);
            let month = parseInt(dateSplit[1]);
            let year = parseInt(dateSplit[0]);
            picker_value.set('min', [year, month-1, day]);
        }
    }
}

function mzSetMaxDate(id, dateInput) {
    const picker_input = $('#'+id).pickadate();
    let picker_value = picker_input.pickadate('picker');
    if (dateInput === true) {
        picker_value.set('max', true);
    } else if (dateInput === false) {
        picker_value.set('max', false);
    } else {
        const dateSplit = dateInput.split('-');
        if (dateSplit.length === 3) {
            let day = parseInt(dateSplit[2]);
            let month = parseInt(dateSplit[1]);
            let year = parseInt(dateSplit[0]);
            picker_value.set('max', [year, month-1, day]);
        }
    }
}

function mzDateDisable(dateId, dateStr) {
    const dateArr = dateStr.split('/');
    const date_input = $('#'+dateId).pickadate();
    let date_picker = date_input.pickadate('picker');
    date_picker.set('disable', [[parseInt(dateArr[0]), parseInt(dateArr[1])-1, parseInt(dateArr[2])]]);
}

function mzDateEnable(dateId, dateStr) {
    const dateArr = dateStr.split('/');
    const date_input = $('#'+dateId).pickadate();
    let date_picker = date_input.pickadate('picker');
    date_picker.set('enable', [[parseInt(dateArr[0]), parseInt(dateArr[1])-1, parseInt(dateArr[2])]]);
}

function mzConvertDate(dateInput) {
    if (typeof dateInput === 'undefined' || dateInput === '') {
        return null;
    }
    let dateNew = null;
    const dateSplit = dateInput.split(" ");
    if (dateSplit.length === 3) {
        let day = dateSplit[0];
        let month = dateSplit[1];
        let year = dateSplit[2];
        if (day.length === 1) {
            day = '0' + day;
        }
        dateNew = year + '-' + mzConvertMonth(month.slice(0, -1)) + '-' + day;
    }
    return dateNew;
}

function mzDateDisplay(dateInput) {
    if (dateInput === null || dateInput === '') {
        return '';
    }
    let dateNew = '';
    const dateSplit = dateInput.split('-');
    if (dateSplit.length === 3) {
        let day = dateSplit[2];
        let month = dateSplit[1];
        let year = dateSplit[0];
        const monthArray = mzGetMonthArray();
        dateNew = monthArray[parseInt(month)-1]['monthShort'] + ' ' + parseInt(day) + ', ' + year;
    }
    return dateNew;
}

function mzConvertDateDisplay (dateInput) {
    if (typeof dateInput === 'undefined') {
        return '';
    }
    let fullDateStr = '';
    let timeNew = '';
    const monthsFull = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
        'November', 'December'];

    const datePart = dateInput.substring(0, 10);
    let dateSplit = datePart.split("/");
    if (dateSplit.length !== 3) {
        dateSplit = datePart.split("-");
        if (dateSplit.length !== 3) {
            return '';
        }
    }
    const day = dateSplit[2];
    const month = dateSplit[1];
    const year = dateSplit[0];
    let dateNew = parseInt(day) + ' ' + monthsFull[parseInt(month)] + ', ' + year;
    if (dateInput.length === 19) {
        timeNew = dateInput.substring(11);
        fullDateStr = dateNew + ', ' + timeNew;
    } else {
        fullDateStr = dateNew;
    }
    return fullDateStr;
}

function mzConvertTimeDisplay (timeInput) {
    if (typeof timeInput === 'undefined' || (timeInput.length !== 8)) {
        return '';
    }
    const timeSplit = timeInput.split(':');
    if (timeSplit.length !== 3) {
        return '';
    }
    const secs = timeSplit[2];
    const minutes = timeSplit[1];
    const hours = parseInt(timeSplit[0]);
    const ampm = hours < 12 ? 'am' : 'pm';
    const newHour = hours < 12 ? hours : hours-12;
    return newHour.toString() + ':' + minutes + ':' + secs + ampm;
}

function mzConvertMonth(monthInput) {
    switch (monthInput) {
        case 'January':
            return '01';
        case 'February':
            return '02';
        case 'March':
            return '03';
        case 'April':
            return '04';
        case 'May':
            return '05';
        case 'June':
            return '06';
        case 'July':
            return '07';
        case 'August':
            return '08';
        case 'September':
            return '09';
        case 'October':
            return '10';
        case 'November':
            return '11';
        case 'December':
            return '12';
        default:
            return '';
    }
}

function mzSetDate (id, dateInput) {
    const dateSplit = dateInput.split('-');
    if (dateSplit.length === 3) {
        let day = parseInt(dateSplit[2]);
        let month = parseInt(dateSplit[1]);
        let year = parseInt(dateSplit[0]);
        const picker_input = $('#'+id).pickadate();
        let picker_value = picker_input.pickadate('picker');
        picker_value.set('select', [year, month-1, day]);
    }
}

function mzEmailShort (emailInput, shortLength) {
    let emailNew = '';
    shortLength = typeof shortLength === 'undefined' ? 20 : shortLength;
    if (emailInput !== null && emailInput.length > shortLength) {
        for (let u = shortLength; u < emailInput.length; u++) {
            if (emailInput.substring(u, u+1) === '@' || emailInput.substring(u, u+1) === '.') {
                emailNew = emailInput.substring(0, u) + '<br>' + emailInput.substring(u);
                break;
            }
        }
    }
    if (emailNew === '') {
        emailNew = emailInput;
    }
    return emailNew;
}

function mzGetDataVersion (isExternal) {
    return mzAjax(isExternal === true ? 'version/external' : 'version', 'GET');
}

function mzGetRef (name, version, api) {
    if (typeof name === 'undefined' || typeof version === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (typeof version[name] === 'undefined' || version[name] === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    let getNew = false;
    let objData;
    let rawData;
    const localData = localStorage.getItem(name);
    if (localData === null) {
        getNew = true;
    } else {
        const objEncrypted = CryptoJS.AES.decrypt(localData, 'TaskManagement').toString(CryptoJS.enc.Utf8);
        objData = JSON.parse(objEncrypted);
        if (typeof objData.version === 'undefined' || typeof objData.data === 'undefined' || objData.version !== version[name]) {
            getNew = true;
        } else {
            rawData = objData.data;
        }
    }
    if (getNew) {
        rawData = mzAjax(api, 'GET');
        const rawEncrypted = CryptoJS.AES.encrypt(JSON.stringify({version:version[name], data:rawData}), 'TaskManagement');
        localStorage.setItem(name, rawEncrypted);
    }
    return rawData;
}

function mzCmp(a, b) {
    return a[1].localeCompare(b[1]);
}

function mzOptionStopClear(name, required) {
    let selectorName = $('#'+name);
    //let selectorLabel = $('#lbl' + name.substring(3));
    selectorName.materialSelect('destroy');
    if (name === '' || typeof name === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    removeOptions(document.getElementById(name));
    document.getElementById(name).options[0] = new Option('Choose option', "", true, true);
    if (typeof required !== 'undefined' && required === true) {
        document.getElementById(name).options[0].disabled = true;
    }
    selectorName.val(null);
    selectorName.materialSelect();
    selectorName.removeClass('invalid');
    $('#'+name+'Err').html('');
}

function mzOptionStop(name, data, valIndex, filters, required, defaultText, isSort, sortIndex) {
    let selectorName = $('#'+name);
    selectorName.materialSelect({'destroy': true});
    mzOption(name, data, valIndex, filters, required, defaultText, isSort, sortIndex);
    selectorName.materialSelect();
    selectorName.removeClass('invalid');
    $('#'+name+'Err').html('');
}

function mzOption(name, data, valIndex, filters, required, defaultText, isSort, sortIndex) {
    if (typeof name === 'undefined' || typeof data === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (name === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (typeof defaultText === 'undefined') {
        defaultText = 'Choose option';
    }
    if (typeof isSort === 'undefined') {
        isSort = true;
    }

    const dataFilterArr = typeof filters === 'undefined' ? [] : filters;
    let optionIndex = 0;
    removeOptions(document.getElementById(name));
    document.getElementById(name).options[optionIndex++] = new Option(defaultText, "", true, true);

    if (typeof required !== 'undefined' && required === true) {
        document.getElementById(name).options[0].disabled = true;
    }

    let dataSort = [];
    $.each(data, function (n, u) {
        if (typeof u !== 'undefined' && typeof u[valIndex] !== 'undefined') {
            u['id'] = n;
            dataSort.push(u);
        }
    });

    if (isSort) {
        if (typeof sortIndex !== 'undefined' && sortIndex !== '') {
            dataSort.sort(function(a, b){
                return a[sortIndex].localeCompare(b[sortIndex], 'en', {numeric: true});
            });
        } else {
            dataSort.sort(function(a, b){
                return a[valIndex].localeCompare(b[valIndex]);
            });
        }
    }

    $.each(dataSort, function (n, u) {
        if (typeof u !== 'undefined' && typeof u[valIndex] !== 'undefined') {
            if (dataFilterArr !== '') {
                const keysFilter = Object.keys(dataFilterArr);
                let filterCnt = 0;
                for (let i=0; i<keysFilter.length; i++) {
                    const filterKey = keysFilter[i];
                    const filterVal = dataFilterArr[filterKey];
                    if (typeof u[filterKey] !== 'undefined') {
                        const dataValue = u[filterKey];
                        if (dataValue === filterVal) {
                            filterCnt++;
                        } else if (filterVal !== null && typeof filterVal === 'string' && filterVal.substring(0,1) === '#') {
                            const filterSplit = dataValue.split(',');
                            for (let j=0; j<filterSplit.length; j++) {
                                if (filterSplit[j] === filterVal.substring(1)) {
                                    filterCnt++;
                                    break;
                                }
                            }
                        } else if (filterVal !== null && typeof filterVal === 'string' && filterVal.substring(0,1) === '(') {
                            let filterVal2 = filterVal.substring(1,filterVal.length-1);
                            const filterSplit2 = filterVal2.split(',');
                            for (let j=0; j<filterSplit2.length; j++) {
                                if (filterSplit2[j] == dataValue) {
                                    filterCnt++;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (filterCnt === keysFilter.length) {
                    document.getElementById(name).options[optionIndex++] = new Option(u[valIndex], u['id']);
                }
            } else {
                document.getElementById(name).options[optionIndex++] = new Option(u[valIndex], u['id']);
            }
        }
    });

    $('#' + name).val(null);
    //$('#lbl' + name.substring(3)).removeClass('active');
    //$('#lbl' + name.substring(3)).addClass('active');
}

function removeOptions(selectBox) {
    let i;
    for(i = selectBox.options.length - 1 ; i >= 0 ; i--)
    {
        selectBox.remove(i);
    }
}

function mzChartOption() {
    Highcharts.setOptions({
        colors: Highcharts.map(['#ff4444', '#00C851', '#ffbb33', '#33b5e5', '#dce775', '#00897b', '#a1887f', '#ffff8d', '#ff8a65', '#7e57c2', '#9c27b0', '#ec407a', '#7283a7', '#bdbdbd'], function (color) {
            return {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.3,
                    r: 0.7
                },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        })
    });
}

function mzSetValue(name, value, type, label) {
    let selector = $('#'+name);
    let selectorName = $('#'+name);
    let selectorLabel = $('#lbl' + name.substring(3));
    if (type === 'text') {
        selector.val('');
        selectorLabel.removeClass('active');
    }
    else if (type === 'textarea') {
        selector.val('');
        selectorLabel.removeClass('active');
    }
    else if (type === 'select') {
        selector.materialSelect('destroy');
        selector.val('');
        selector.materialSelect();
    }
    else if (type === 'summernote') {
        selector.summernote('code', '');
    }

    if (value !== null && value !== '' && value.length !== 0) {
        if (type === 'text') {
            selector.val(value);
            selectorLabel.addClass('active');
        }
        else if (type === 'select') {
            selector.materialSelect('destroy');
            selector.val(value);
            //$('#opt' + name).prevAll('.select-dropdown').children('li:contains('+value+')').trigger('click');
            //$('#lbl'+name).html(label).addClass('active');
            selector.materialSelect();
        }
        else if (type === 'textarea') {
            selector.val(value);
            selectorLabel.addClass('active');
        }
        else if (type === 'checkSingle') {
            selector.prop('checked', value === label);
        }
        else if (type === 'check') {
            for (let i = 0; i < value.length; i++) {
                $('#'+name+value[i]).prop('checked', true);
            }
        }
        else if (type === 'radio') {
            selector.prop('checked', true);
        }
        else if (type === 'radio2') {
            $('input[name="'+name+'"][value="'+value+'"]').prop('checked', true);
        }
        else if (type === 'date') {
            const dateSplit = value.split("-");
            if (dateSplit.length !== 3) {
                return '';
            }
            const day = parseInt(dateSplit[2]);
            const month = parseInt(dateSplit[1])-1;
            const year = parseInt(dateSplit[0]);
            selector.pickadate('set').set('select', new Date(year, month, day));
        }
        else if (type === 'summernote') {
            selector.summernote('code', value);
        }
    }
}

function mzHandleFileSelect(evt) {
    let id = evt.target.id;
    let f = evt.target.files[0];
    if (typeof f !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (function() {
            return function(e) {
                const binaryData = e.target.result;
                const base64String = window.btoa(binaryData);
                $('#'+id+'Blob').val(base64String);
            };
        })(f);
        reader.readAsBinaryString(f);
    } else {
        $('#'+id+'Blob').val('');
    }
}

function mzSetObjectToArray(objects, id) {
    if (typeof id === 'undefined' || id === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }

    let returnVal = [];
    $.each(objects, function (n, u) {
        if (typeof u[id] === 'undefined') {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
        const rawIndex = parseInt(u[id]);
        if (isNaN(rawIndex)) {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
        returnVal[rawIndex] = u;
    });
    return returnVal;
}

function mzIsRoleExist(roleIds) {
    if (typeof roleIds === 'undefined' || roleIds === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const roleSplit = roleIds.split(',');
    if (roleSplit.length === 0) {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }

    let result = false;
    let userInfo = sessionStorage.getItem('userInfo');
    const objEncrypted = CryptoJS.AES.decrypt(userInfo, 'TaskManagement').toString(CryptoJS.enc.Utf8);
    userInfo = JSON.parse(objEncrypted);
    const roles = userInfo['roles'];
    for (let i=0; i<roles.length; i++) {
        for (let j=0; j<roleSplit.length; j++) {
            if (roles[i]['roleId'] === roleSplit[j]) {
                result = true;
                break;
            }
        }
        if (result) {
            break;
        }
    }
    return result;
}

function mzGetUserInfoByParam(parameter) {
    if (typeof parameter === 'undefined' || parameter === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    let userInfo = sessionStorage.getItem('userInfo');
    const objEncrypted = CryptoJS.AES.decrypt(userInfo, 'TaskManagement').toString(CryptoJS.enc.Utf8);
    userInfo = JSON.parse(objEncrypted);
    return userInfo[parameter];
}

function mzDisableSelect(fieldId, disable) {
    let selector = $('#'+fieldId);
    selector.removeClass('grey lighten-5');
    if (disable) {
        selector.addClass('grey lighten-5');
    }
    selector.materialSelect('destroy');
    selector.prop('disabled', disable);
    selector.materialSelect();
}

function mzEmptyParams (arrParam) {
    for (let i=0; i<arrParam.length; i++) {
        if (typeof arrParam[i] === 'undefined' || arrParam[i] === '') {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
    }
}

function mzDateSetMin(fieldId, dateStr) {
    const dateInput = $('#'+fieldId).pickadate();
    const datePicker = dateInput.pickadate('picker');

    const dateSplit = dateStr.split("/");
    if (dateSplit.length !== 3) {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const day = parseInt(dateSplit[2]);
    const month = parseInt(dateSplit[1]);
    const year = parseInt(dateSplit[0]);
    datePicker.set('min', new Date(year,month-1, day));
}

function mzDateSetMax(fieldId, dateStr) {
    const dateInput = $('#'+fieldId).pickadate();
    const datePicker = dateInput.pickadate('picker');

    const dateSplit = dateStr.split("/");
    if (dateSplit.length !== 3) {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const day = parseInt(dateSplit[2]);
    const month = parseInt(dateSplit[1]);
    const year = parseInt(dateSplit[0]);
    datePicker.set('max', new Date(year,month-1, day));
}

function mzGetMonthArray() {
    return [
        {monthId:1, monthName:'January', monthShort:'Jan'},
        {monthId:2, monthName:'February', monthShort:'Feb'},
        {monthId:3, monthName:'March', monthShort:'Mar'},
        {monthId:4, monthName:'April', monthShort:'Apr'},
        {monthId:5, monthName:'May', monthShort:'May'},
        {monthId:6, monthName:'June', monthShort:'Jun'},
        {monthId:7, monthName:'July', monthShort:'Jul'},
        {monthId:8, monthName:'August', monthShort:'Aug'},
        {monthId:9, monthName:'September', monthShort:'Sept'},
        {monthId:10, monthName:'October', monthShort:'Oct'},
        {monthId:11, monthName:'November', monthShort:'Nov'},
        {monthId:12, monthName:'December', monthShort:'Dec'}
    ];
}

function mzGetDayName(inputDate) {
    const thisDate = moment(inputDate);
    switch (thisDate.weekday()) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
        default:
            return '';
    }
}

function mzGetYearArray() {
    const yearArr = [];
    let dateEarliest = new Date();
    dateEarliest.setFullYear(2012, 8, 1);
    const earliestYear = dateEarliest.getFullYear();
    let dateCurrent = new Date();
    const currentYear = dateCurrent.getFullYear();
    for (let i = earliestYear; i <= currentYear; i++) {
        yearArr.push({yearId:i, yearName:i})
    }
    return yearArr;
}

function mzIsValidDate(s) {  // 31/9/2011
    const bits = s.split('/');
    const d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
    return !!(d && (d.getMonth() + 1) === parseInt(bits[1]) && d.getDate() === Number(bits[0]));
}

function mzIsObject ( obj ) {
    return obj && (typeof obj  === "object");
}

function mzIsArray ( obj ) {
    return mzIsObject(obj) && (obj instanceof Array);
}

function mzOpenPdf (pdfId, pdfTitle, isExternal) {
    ShowLoader();
    setTimeout(function () {
        try {
            const external = typeof isExternal !== 'undefined' && isExternal === true ? 'external/' : '';
            const pdfSrc = mzAjax('pdf/'+external+'url/'+pdfId, 'GET');
            $('#mpdf_title').html('<i class="far fa-file-pdf text-white"></i> &nbsp;'+pdfTitle);
            $('#mpdf_iframe').attr('src', pdfSrc);
            $('#modal_pdf').modal('show');
        } catch (e) {
            toastr['error'](e.message, _ALERT_TITLE_ERROR);
        }
        HideLoader();
    }, 200);
}

function mzOpenUpload (uploadId) {
    ShowLoader();
    setTimeout(function () {
        try {
            const pdfSrc = mzAjax('pdf/upload/'+uploadId, 'GET');
            $('#mpdf_title').html('<i class="far fa-file-pdf text-white"></i> &nbsp;'+pdfSrc['title']);
            $('#mpdf_iframe').attr('src', pdfSrc['src']);
            $('#modal_pdf').modal('show');
        } catch (e) {
            toastr['error'](e.message, _ALERT_TITLE_ERROR);
        }
        HideLoader();
    }, 200);
}

function mzOpenPdfUpload (uploadFolder, uploadFilename, pdfTitle) {
    ShowLoader();
    setTimeout(function () {
        try {
            $('#mpdf_title').html('<i class="far fa-file-pdf text-white"></i> &nbsp;'+pdfTitle);
            //$('#mpdf_iframe').attr('src', '//daftar.pdp.gov.my/api/'+uploadFolder+'/'+uploadFilename+'.pdf');
            $('#mpdf_iframe').attr('src', mzUrlDownload+uploadFolder+'/'+uploadFilename+'.pdf');
            $('#modal_pdf').modal('show');
        } catch (e) {
            toastr['error'](e.message, _ALERT_TITLE_ERROR);
        }
        HideLoader();
    }, 200);
}

function mzDisplayImageFileInput(input, targetId) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            $('#'+targetId).attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
}

function mzChkVal (fieldName) {
    let returnVal = '';
    $("input[name='"+fieldName+"[]']:checked").map(function(){
        returnVal += ','+$(this).val();
    });
    returnVal = returnVal.substring(1);
    return returnVal;
}

function mzNullInt (data) {
    const returnVal = parseInt(data);
    if (isNaN(returnVal)) {
        return null;
    }
    return returnVal;
}

function mzNullString (data) {
    if (data === '') {
        return null;
    }
    return data;
}

function mzSpaceString (data) {
    if (data === '' || data === null) {
        return '&nbsp;';
    }
    return data;
}

function mzGetLinkRow (selector, dtTable) {
    if (typeof selector === 'undefined' ||typeof dtTable === 'undefined' ) {
        return false;
    }
    const linkId = selector.attr('id');
    const linkIndex = linkId.indexOf('_');
    if (linkIndex > 0) {
        const rowId = linkId.substring(linkIndex + 1);
        return dtTable.row(parseInt(rowId)).data();
    } else {
        toastr['error'](_ALERT_MSG_ERROR_DEFAULT, _ALERT_TITLE_ERROR);
    }
    return false;
}