import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccordianContainer from "../CustomComponents/AccordianContainer";
import CustomConfirmationDialog from "../CustomComponents/CustomConfirmationDialog";
import CustomDropDown from "../CustomComponents/CustomDropDown";
import CustomTextField from "../CustomComponents/CustomTextField";
import { DynamicReportReducerAction } from "../Store/DynamicReport/DynamicReportReducer";
import VariablesDialog from "./VariablesDialog";

import CustomAutoComplete from "../CustomComponents/CustomAutoComplete";

const TextEditor = () => {
  let newAxiosBase = { ...axios };
  newAxiosBase.defaults.baseURL =
    process.env.REACT_APP_STLAP_LETTER_GENERATION_BACKEND;

  const dispatch = useDispatch();

  const userName = useSelector((state) => state.branch.userName);

  const reportScreen = useSelector(
    (state) => state.letterGeneration.reportScreen
  );

  const snackBarHandler = useSelector(
    (state) => state.letterGeneration.snackBarHandler
  );

  const { vertical, horizontal } = snackBarHandler.snackBarState;

  const openAlertHandler = () => {
    dispatch(DynamicReportReducerAction.updateSnackBarAlert(true));
  };

  const closeAlertHandler = () => {
    dispatch(DynamicReportReducerAction.updateSnackBarAlert(false));
  };

  const editorRef = useRef(null);
  const save = async () => {
    if (editorRef.current) {
      try {
        const htmlContent = (editorRef.current.getContent());
        let htmlContentString = htmlContent.toString();
        const replaceContent = htmlContentString.replace(/\\"/g, '"');
        let replacedString = htmlContentString.replace(/\(/g, "[");


        dispatch(DynamicReportReducerAction.updateLoading(true));
        if (!reportScreen.reportList.includes(reportScreen.templateName)) {
          var dataList = [...reportScreen.reportList];
          dataList.push(reportScreen.templateName);
          dispatch(DynamicReportReducerAction.updateReportList(dataList));
        }
        const response = await newAxiosBase.post(
          "/dynamicTemplate/saveTemplate",
          {
            productCode:reportScreen.productCode,
            templateHeaderKey: reportScreen.templateHeaderKey,
            templateName: reportScreen.templateName,
            templateKey: reportScreen.templateKey,
            content: replacedString,
            active: reportScreen.active,
            userName: userName,
            mode: reportScreen.mode,
          }
         
        );

        if (response.status === 200) {
          if (response.data.toString().startsWith("Error")) {
            dispatch(
              DynamicReportReducerAction.updateSnackBarMessage(response.data)
            );
            dispatch(
              DynamicReportReducerAction.updateSnackBarAlertType("error")
            );
            openAlertHandler();
            dispatch(DynamicReportReducerAction.updateLoading(false));
          } else {
            editorRef.current.setContent("");
            dispatch(DynamicReportReducerAction.resetReportScreen());
            dispatch(
              DynamicReportReducerAction.updateSnackBarMessage(response.data)
            );
            dispatch(
              DynamicReportReducerAction.updateSnackBarAlertType("success")
            );
            openAlertHandler();
            setTimeout(() => {
              dispatch(DynamicReportReducerAction.updateLoading(false));
              //window.location.reload();
            }, 1000);
          }
        }
      } catch(error) {
        console.error(error);
        dispatch(DynamicReportReducerAction.updateLoading(false));
        if (error.response) {
          // The request was made, but the server responded with a status code other than 200
          console.error('Response Error:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Request Error:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error:', error.message);
        }
        dispatch(
          DynamicReportReducerAction.updateSnackBarMessage("Failed to save template")
        );
        dispatch(
          DynamicReportReducerAction.updateSnackBarAlertType("error")
        );
        openAlertHandler();
       
      }
    }
  };

  const getTemplateKey = async (value, mode) => {
    dispatch(DynamicReportReducerAction.updateLoading(true));
    const response = await newAxiosBase.post(
      "/dynamicTemplate/getTemplateKey",
      {
        productCode:reportScreen.productCode,
        templateName: value,
      }
      
    );
    if (response.status === 200) {
      var key = "";
      if (mode === "NEW") {
        key = response.data.length + 1;
      }
      dispatch(
        DynamicReportReducerAction.updateTemplateKeys({
          templateKey: key,
          templateKeyList: response.data,
        })
      );
      dispatch(DynamicReportReducerAction.updateLoading(false));
    }
  };

  const getContent = async () => {
    dispatch(DynamicReportReducerAction.updateLoading(true));
    const response = await newAxiosBase.post("/dynamicTemplate/getTemplate", {
      productCode:reportScreen.productCode,
      templateName: reportScreen.templateName,
      templateKey: reportScreen.templateKey,
    });
    if (response.status === 200) {
      editorRef.current.setContent(response.data.content);
      dispatch(
        DynamicReportReducerAction.updateTemplateHeaderKeyAndActive({
          templateHeaderKey: response.data.templateHeaderKey,
          active: response.data.active,
        })
      );

      dispatch(DynamicReportReducerAction.updateLoading(false));
      dispatch(
        DynamicReportReducerAction.updateSnackBarMessage(
          "Template Content Fetched Successfully.."
        )
      );
      dispatch(DynamicReportReducerAction.updateSnackBarAlertType("success"));
      dispatch(DynamicReportReducerAction.updatedataFetched(true));
      openAlertHandler();
      setTimeout(() => {
        closeAlertHandler();
      }, 1000);
    }
  };

  const getVariablesList = async (templateName) => {
    dispatch(DynamicReportReducerAction.updateLoading(true));
    const response = await newAxiosBase.post(
      "/dynamicTemplate/getVariablesList",
      {
        templateName: templateName,
      }
    );
    if (response.status === 200) {
      dispatch(DynamicReportReducerAction.updateVariablesList(response.data));
      dispatch(DynamicReportReducerAction.updateLoading(false));
    }
  };

  const getTemplateNameList = async (productCode) => {
    let newAxiosBase = { ...axios };
    newAxiosBase.defaults.baseURL =
      process.env.REACT_APP_STLAP_LETTER_GENERATION_BACKEND;
    dispatch(DynamicReportReducerAction.updateLoading(true));
    const response = await newAxiosBase.get("/dynamicTemplate/getTemplateNameList",{
      method: "get",
      params: {
        productCode: productCode
       
      },
    });
    if (response.status === 200) {
      dispatch(DynamicReportReducerAction.updateReportList(response.data));
      dispatch(DynamicReportReducerAction.updateLoading(false));
    }
  };
  const [mode, setMode] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [productType, setProductType] = useState(null);

  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content);
    //editorRef.current = editor;
   // editorRef.current.setContent(content);
  };

  const handleEditorInit = (evt,editor) => {
    setIsEditorReady(true);
    editorRef.current = editor;
  };

  const handleEditorError = (error) => {
    // Handle initialization errors, e.g., expired API key
    console.error('Error initializing TinyMCE:', error);
    // You can notify the user or take appropriate actions
  };


  useEffect(() => {
    getProductTypeList();
    getLovMasterData();
    return () => {
      dispatch(DynamicReportReducerAction.resetReportScreen());
    };
  }, []);

  const getletterBasedOnProduct=async (productCode)=>{
    getTemplateNameList(productCode);
    getVariablesList(productCode);
  }

  

  const getProductTypeList = async () => {
    const response = await newAxiosBase.post(
      "/dynamicTemplate/getProductTypeList"
    );
    if (response.status === 200) {
      dispatch(DynamicReportReducerAction.updateProductTypeList(response.data));
    }
  };
  // Load values from the LOV Master API.
  const getLovMasterData = async () => {
    let newAxiosBaseValue = { ...axios };
    newAxiosBaseValue.defaults.baseURL = process.env.REACT_APP_STLAP_LMS_BACKEND;
    const letterGenerationLovData = await newAxiosBaseValue.post(
      "/lovMaster/getLovValues",
      {
        // moduleid to be given on special access level based on that  will update here.
        moduleId: "MD018",
      }
    );
    const lovData = letterGenerationLovData.data;
    const modes = lovData?.["Mode"].map((record) => {
      return {
        key: record.lovValues,
        value: record.lovValues,
        text: record.lovValues,
      };
    });
    setMode(modes);
  };
  if (
    reportScreen.templateName === "" ||
    reportScreen.templateKey === "" ||
    reportScreen.mode === "" ||
    reportScreen.mode === "NEW"
  ) {
    dispatch(DynamicReportReducerAction.updateFetchButtonDisable(true));
  } else {
    dispatch(DynamicReportReducerAction.updateFetchButtonDisable(false));
  }

  if (
    reportScreen.templateName === "" ||
    reportScreen.templateKey === "" ||
    reportScreen.mode === "" ||
    (!reportScreen.dataFetched && reportScreen.mode !== "NEW")
  ) {
    dispatch(DynamicReportReducerAction.updateSaveButtonDisable(true));
    dispatch(DynamicReportReducerAction.updateSendMailButtonDisable(true));
  } else {
    dispatch(DynamicReportReducerAction.updateSaveButtonDisable(false));
    if (reportScreen.mode === "NEW")
      dispatch(DynamicReportReducerAction.updateSendMailButtonDisable(true));
    else
      dispatch(DynamicReportReducerAction.updateSendMailButtonDisable(false));
  }

  const handleRenderInput = (params) => (
    <TextField
      {...params}
      placeholder="Select/Create Template Name"
      variant="standard"
      onChange={(event, value) =>
        dispatch(
          DynamicReportReducerAction.updateTemplateName(event.target.value)
        )
      }
      InputProps={{
        ...params.InputProps,
        type: "search",
      }}
    />
  );

  return (
    <>
      {reportScreen.loading && (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
      <AccordianContainer
        id="accord"
        title="Letter Template Creation"
        initialOpen={true}
        sx={{ margin: "8px !important" }}
      >
        <Box sx={{ marginTop: "-1%" }}>
          <Grid container rowSpacing={0} columnSpacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              <CustomDropDown
                label="Product Type"
                required={true}
                dropDownValue={
                  String(window.location.pathname).includes(
                    "dashboard_redirect"
                  ) ? reportScreen.productTypeList &&
                  reportScreen.productTypeList.filter(product => product.text === "HOMEFIN") :
                    String(window.location.pathname).includes(
                      "stlap"
                    ) ? reportScreen.productTypeList && 
                    reportScreen.productTypeList.filter(product => product.text === "STLAP") 
                    : reportScreen.productTypeList
                }
                variant="standard"
                defaultValue="1"
                value={reportScreen.productType}
                onChange={(event) => {
                  let value = event.target.value;
                  dispatch(DynamicReportReducerAction.updateProductType(value));
                  let productCode = reportScreen.productTypeList.filter(a=>a.value===value)[0].text;
                  dispatch(DynamicReportReducerAction.updateProductCode(productCode));
                  getletterBasedOnProduct(productCode);

                }}
              />
            </Grid>
            
            
            <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              <InputLabel
                size="small"
                sx={{
                  color: "#004A92",
                  mb: 2,
                  fontWeight: 400,
                  fontSize: "14px",
                }}
              >
                {"Select/Create Template Name"}
              </InputLabel>
              <Autocomplete
                sx={{}}
                freeSolo
                disableClearable
                id="createtempalte"
                value={reportScreen.templateName}
                disabled={false}
                onChange={(event, value) => {
                  dispatch(
                    DynamicReportReducerAction.updateTemplateName(value)
                  );
                  if (value !== "" && reportScreen.mode !== "") {
                    getTemplateKey(value, reportScreen.mode);
                  } else {
                    dispatch(DynamicReportReducerAction.updateTemplateKey(""));
                  }

                  if (value === "") {
                    editorRef.current.setContent("");
                    dispatch(DynamicReportReducerAction.resetReportScreen());
                  }
                }}
                options={reportScreen.reportList}
                renderInput={handleRenderInput}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              <CustomDropDown
                label="Mode"
                required={true}
                dropDownValue={mode}
                variant="standard"
                value={reportScreen.mode}
                onChange={(event) => {
                  editorRef.current.setContent("");
                  dispatch(
                    DynamicReportReducerAction.updateTemplateHeaderKey(0)
                  );
                  
                  dispatch(
                    DynamicReportReducerAction.updateMode(event.target.value)
                  );
                  if (
                    event.target.value !== "" &&
                    reportScreen.templateName !== ""
                  ) {
                    getTemplateKey(
                      reportScreen.templateName,
                      event.target.value
                    );
                  } else {
                    dispatch(DynamicReportReducerAction.updateTemplateKey(""));
                  }
                }}
                disabled={reportScreen.templateName === ""}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              {reportScreen.mode !== "MODIFY" && (
                <CustomTextField
                  variant="standard"
                  type="text"
                  placeholder="Template Key"
                  label="Template Key"
                  required={false}
                  disabled={true}
                  value={reportScreen.templateKey}
                />
              )}

              {reportScreen.mode === "MODIFY" && (
                <CustomDropDown
                  label="Template Key List"
                  required={true}
                  dropDownValue={reportScreen.templateKeyList}
                  variant="standard"
                  value={reportScreen.templateKey}
                  onChange={(event) => {
                    dispatch(
                      DynamicReportReducerAction.updateTemplateKey(
                        event.target.value
                      )
                    );
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2} xl={3}>
              <InputLabel
                required={false}
                size="small"
                sx={{
                  color: "#004A92",
                  mb: 2,
                  fontWeight: 400,
                  fontSize: "14px",
                }}
              >
                {"Active"}
              </InputLabel>
              <FormControl>
                {" "}
                <Checkbox
                  checked={reportScreen.active}
                  onChange={() => {
                    dispatch(
                      DynamicReportReducerAction.updateActive(
                        !reportScreen.active
                      )
                    );
                  }}
                  disabled={
                    reportScreen.templateName === "" || reportScreen.mode === ""
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
              <Button
                variant="contained"
                type="submit"
                sx={{ height: "2rem", marginRight: "2%" }}
                disabled={reportScreen.fetchButtonDisable}
                onClick={() => {
                  getContent();
                }}
              >
                FETCH
              </Button>

              <Button
                variant="contained"
                type="submit"
                sx={{ height: "2rem", marginRight: "2%" }}
                disabled={reportScreen.saveButtonDisable}
                onClick={() => {
                  save();
                }}
              >
                Save
              </Button>

              <VariablesDialog variablesList={reportScreen.variablesList} />
            </Grid>
          </Grid>
        </Box>
      </AccordianContainer>

      <AccordianContainer
        id="accord"
        title="Editor"
        initialOpen={true}
        sx={{ margin: "8px !important" }}
      >
        <Editor
          disabled={reportScreen.saveButtonDisable}
          apiKey="4qd053u9x8lto9yrxg5qibw5ra58q1x1sbmk29s1kn9xph7j"
          onInit={handleEditorInit}
          onEditorChange={handleEditorChange}
          onError={handleEditorError}
          initialValue=""
          init={{
            height: 400,
            menubar: true,
            font_family_formats:
              "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Calibri=Calibri;  Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
              plugins:
              "nonbreaking preview searchreplace autolink directionality visualblocks visualchars image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap  linkchecker emoticons autosave",
            toolbar:
              "nonbreaking undo redo spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | bullist numlist indent outdent | removeformat",
            toolbar_sticky: true,
            nonbreaking_force_tab: true,
            pagebreak_separator: '<div style="page-break-before: always;"></div>',
            removed_menuitems: "newdocument print"
          }}
        />
      </AccordianContainer>

      <Snackbar
        open={snackBarHandler.alert}
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
        onClose={closeAlertHandler}
      >
        <Alert
          onClose={closeAlertHandler}
          severity={snackBarHandler.alertType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackBarHandler.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TextEditor;
