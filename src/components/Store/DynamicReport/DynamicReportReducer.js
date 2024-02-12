import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState = {
  reportScreen: {
    loading: false,
    templateHeaderKey: 0,
    templateName: "",
    templateKey: "",
    mode: "",
    active: false,
    templateKeyList: [],
    variablesList: [],
    fetchButtonDisable: true,
    saveButtonDisable: true,
    sendMailButtonDisable: true,
    dataFetched: false,
    applicationNumber: "",
    applicationNumberList: [],
    reportList: [],
    productTypeList:[],
    productType:"",
    productCode:"",
    templateTypeList:[],
    templateType:"",
    templateId:"",
    apiKey:"",
  },

  triggerScreen: {
    loading: false,
    templateName: "",
    templateNameList: [],
    applicationNumberList: [],
    applicationNumber: "",
    sanctionDate: "",
    notificationType: "E-Mail",
    productTypeList:[],
    productType:"",
    productCode:"", 
    templateTypeList:[],
    templateType:"",
    templateId:""
  },

  snackBarHandler: {
    message: "",
    alertType: "success",
    snackBarState: { vertical: "bottom", horizontal: "left" },
    alert: false,
  },

  touchHandler: {},

  valueIsValid: {},
};

const DynamicReportReducer = createSlice({
  name: "letterGeneration",
  initialState: initialState,
  reducers: {
    updateSnackBarAlert(state, action) {
      state.snackBarHandler.alert = action.payload;
    },
  
    updateSnackBarMessage(state, action) {
      state.snackBarHandler.message = action.payload;
    },
    updateSnackBarAlertType(state, action) {
      state.snackBarHandler.alertType = action.payload;
    },
    updateLoading(state, action) {
      state.reportScreen.loading = action.payload;
    },
    updateVariablesList(state, action) {
      state.reportScreen.variablesList = action.payload;
    },
    updateTemplateHeaderKeyAndActive(state, action) {
      state.reportScreen.templateHeaderKey = action.payload.templateHeaderKey;
      state.reportScreen.active = action.payload.active;
    },
    updateTemplateKeys(state, action) {
      state.reportScreen.templateKeyList = action.payload.templateKeyList;
      state.reportScreen.templateKey = action.payload.templateKey;
    },
    updateAPIKey(state, action) {
      state.reportScreen.apiKey = action.payload;
    },
    updateActive(state, action) {
      state.reportScreen.active = action.payload;
    },
    updateMode(state, action) {
      state.reportScreen.mode = action.payload;
    },
    updateTemplateKey(state, action) {
      state.reportScreen.templateKey = action.payload;
    },
    updateTemplateHeaderKey(state, action) {
      state.reportScreen.templateHeaderKey = action.payload;
    },
    updateTemplateName(state, action) {
      state.reportScreen.templateName = action.payload;
    },
    updateFetchButtonDisable(state, action) {
      state.reportScreen.fetchButtonDisable = action.payload;
    },
    updateSaveButtonDisable(state, action) {
      state.reportScreen.saveButtonDisable = action.payload;
    },
    updateSendMailButtonDisable(state, action) {
      state.reportScreen.sendMailButtonDisable = action.payload;
    },
    updatedataFetched(state, action) {
      state.reportScreen.dataFetched = action.payload;
    },
    updateApplicationNumber(state, action) {
      state.reportScreen.applicationNumber = action.payload;
    },
    resetReportScreen(state, action) {
      state.reportScreen.templateHeaderKey = 0;
      state.reportScreen.templateName = "";
      state.reportScreen.templateKey = "";
      state.reportScreen.mode = "";
      state.reportScreen.active = false;
      state.reportScreen.templateKeyList = [];
      state.reportScreen.dataFetched = false;
      state.reportScreen.applicationNumber = "";
    },
    updateApplicationNumberList(state, action) {
      state.reportScreen.applicationNumberList = action.payload;
    },
    updateReportList(state, action) {
      state.reportScreen.reportList = action.payload;
    },
    updateProductType(state, action) {
      state.reportScreen.productType = action.payload;
    },
    updateProductCode(state, action) {
      state.reportScreen.productCode = action.payload;
    },
    updateProductTypeList(state, action) {
      state.reportScreen.productTypeList = action.payload;
    },
    updateTemplateId(state, action) {
      state.reportScreen.templateId = action.payload;
    },
    updateTemplateType(state, action) {
      state.reportScreen.templateType = action.payload;
    },
    updateTemplateTypeList(state, action) {
      state.reportScreen.templateTypeList = action.payload;
    },
    updateProductTypeForTrigger(state, action) {
      state.triggerScreen.productType = action.payload;
    },
    updateProductCodeForTrigger(state, action) {
      state.triggerScreen.productCode = action.payload;
    },
    updateproductTypeListForTrigger(state, action) {
      state.triggerScreen.productTypeList = action.payload;
    },
    updateTemplateIdForTrigger(state, action) {
      state.triggerScreen.templateId = action.payload;
    },
    updateTemplateTypeForTrigger(state, action) {
      state.triggerScreen.templateType = action.payload;
    },
    updateTemplateTypeListForTrigger(state, action) {
      state.triggerScreen.templateTypeList = action.payload;
    },
    updateTemplateNameForTrigger(state, action) {
      state.triggerScreen.templateName = action.payload;
    },
    updateTemplateNameListForTrigger(state, action) {
      state.triggerScreen.templateNameList = action.payload;
    },
    updateApplicationNumberForTrigger(state, action) {
      state.triggerScreen.applicationNumber = action.payload;
    },
    updateApplicationNumberListForTrigger(state, action) {
      state.triggerScreen.applicationNumberList = action.payload;
    },
    updateSanctionDateForTrigger(state, action) {
      state.triggerScreen.sanctionDate = action.payload;
    },
    updateNotificationTypeForTrigger(state, action) {
      state.triggerScreen.notificationType = action.payload;
    },
    resetForTrigger(state, action) {
      state.triggerScreen.notificationType = "E-Mail";
      state.triggerScreen.sanctionDate = "";
      state.triggerScreen.templateName = "";
      state.triggerScreen.applicationNumber = "";
      state.triggerScreen.loading = false;
    },
  },
});
export const DynamicReportReducerAction = DynamicReportReducer.actions;
export default DynamicReportReducer.reducer;
