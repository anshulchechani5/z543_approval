sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/m/SearchField',
    "sap/m/Token",
    "sap/m/MessageToast",
    "z543approvel/js/combine",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, JSONModel, MessageBox, SearchField, Token, MessageToast) {
        "use strict";

        return Controller.extend("z543approvel.controller.FirstScreen", {
            onInit: function () {
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel('oTableDataModel').setProperty("/aTableData", []);
                this.CallTableBackEndData();
            },
            CallTableBackEndData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Loading"
                });
                oBusyDialog.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z543_APPROVEL");
                var oTableModel = this.getView().getModel('oTableDataModel');
                var aTableData = oTableModel.getProperty("/aTableData");
                oModel.read("/Z543_APPROVEL_CDS", {
                    success: function (orres) {
                        orres.results.map(function (items) {
                            var obj = {
                                "KeyEditable": false,
                                "BackendDataAvl": true,
                                "Batch": items.Batch,
                                "Weft": items.Weft,
                            }
                            aTableData.push(obj);
                        })
                        this.getView().getModel('oTableDataModel').setProperty("/aTableData", aTableData);
                        oBusyDialog.close();
                    }.bind(this),
                })

            },

            AddSingleEmptyRow: function () {
                var oTableModel = this.getView().getModel("oTableDataModel")
                var aTableArr = oTableModel.getProperty("/aTableData")
                var obj = {
                    "Weft": "",
                    "KeyEditable": true,
                    "BackendDataAvl": false,
                    "Batch": ""
                }
                aTableArr.push(obj)
                oTableModel.setProperty("/aTableData", aTableArr)

            },
            //Create And Update work Properly
            SaveTableData_old: function () {
                // var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z543_APPROVEL");
                var oModel = this.getView().getModel();
                var aNewArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                if (aNewArr.length > 0) {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Saving Record",
                        text: "Please wait"
                    });
                    oBusyDialog.open();
                    aNewArr.map(function (items, index, arr) {
                        var oFilter1 = new sap.ui.model.Filter("Batch", "EQ", items.Batch)
                        var oFilter2 = new sap.ui.model.Filter("Weft", "EQ", items.Weft)
                        oModel.read("/Z543_APPROVEL_CDS", {
                            filters: [oFilter1, oFilter2],
                            success: function (oresponse) {
                                if (oresponse.results.length > 0) {
                                    var oTableData2 = {
                                        Batch: items.Batch,
                                        Weft: items.Weft,
                                    }
                                    oModel.update("/Z543_APPROVEL_CDS(Batch='" + encodeURIComponent(items.Batch) + "',Weft='" + encodeURIComponent(items.Weft) + "')", oTableData2, {
                                        success: function (response) {
                                            if (index == arr.length - 1) {
                                                MessageBox.success("Data updated")
                                                oBusyDialog.close()
                                            }
                                        }.bind(this),
                                        error: function () {
                                            if (index == arr.length - 1) {
                                                MessageBox.success("Data updated")
                                                oBusyDialog.close()
                                            }
                                        }.bind(this)
                                    })
                                } else {
                                    oModel.create("/Z543_APPROVEL_CDS", items, {
                                        method: "POST",
                                        success: function (ores) {
                                            if (index == arr.length - 1) {
                                                MessageBox.success("Data updated")
                                                oBusyDialog.close()
                                            }
                                        }.bind(this),
                                        error: function () {
                                            if (index == arr.length - 1) {
                                                MessageBox.success("Data updated")
                                                oBusyDialog.close()
                                            }
                                        }.bind(this)
                                    })
                                }
                            }
                        })
                    }.bind(this))
                }
                else {
                    MessageBox.error("Table is Empty")

                }
            },
            //Only create function
            SaveTableData: function () {
                // var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z543_APPROVEL");
                var oModel = this.getView().getModel();
                var aNewArr = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                if (aNewArr.length > 0) {
                    var oBusyDialog = new sap.m.BusyDialog({
                        title: "Saving Record",
                        text: "Please wait"
                    });
                    oBusyDialog.open();
                    aNewArr.map(function (items, index, arr) {
                        var oFilter1 = new sap.ui.model.Filter("Batch", "EQ", items.Batch)
                        var oFilter2 = new sap.ui.model.Filter("Weft", "EQ", items.Weft)
                        oModel.read("/Z543_APPROVEL_CDS", {
                            filters: [oFilter1, oFilter2],
                            success: function (oresponse) {
                                if (oresponse.results.length == 0) {
                                    var oTableData2 = {
                                        Batch: items.Batch,
                                        Weft: items.Weft,
                                    }
                                    oModel.create("/Z543_APPROVEL_CDS", oTableData2, {
                                        method: "POST",
                                        success: function (ores) {
                                            if (index == arr.length - 1) {
                                                MessageBox.success("Data Saved")
                                                oBusyDialog.close()
                                            }
                                        }.bind(this),
                                        error: function () {
                                            if (index == arr.length - 1) {
                                                MessageBox.success("Data Not Save")
                                                oBusyDialog.close()
                                            }
                                        }.bind(this)
                                    })
                                }
                            }
                        })
                    }.bind(this))
                }
                else {
                    MessageBox.error("Table is Empty")

                }
            },
            DeleteTables_SelectedRow: function (oEvent) {
                var oBusy = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusy.open();
                var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/Z543_APPROVEL");
                var oTable = this.getView().byId("FirstTable");
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableDataModel = this.getView().getModel("oTableDataModel");
                var aTableArr = oTableDataModel.getProperty("/aTableData");
                MessageBox.warning("Are you Sure You Went to Delete", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (sAction) {
                        if (sAction === "YES") {
                            aSelectedIndex.map(function (item, index, arr) {
                                if (aTableArr[item].BackendDataAvl === true) {
                                    oModel.remove("/Z543_APPROVEL_CDS(Batch='" + aTableArr[item].Batch + "',Weft='" + aTableArr[item].Weft + "')", {
                                        success: function (oresponse) {
                                            if (index === arr.length - 1) {
                                                oBusy.close();
                                                let newArray = aTableArr.filter((element, index) => !aSelectedIndex.includes(index));
                                                oTableDataModel.setProperty("/aTableData", newArray)
                                                MessageToast.show("Data Deleted");
                                            }
                                        },
                                        error: function () {
                                            oBusy.close();
                                            MessageToast.show("Data not Deleted")
                                        }
                                    })
                                } else if (aTableArr[item].BackendDataAvl === false) {
                                    if (index === arr.length - 1) {
                                        oBusy.close();
                                        let newArray = aTableArr.filter((element, index) => !aSelectedIndex.includes(index));
                                        oTableDataModel.setProperty("/aTableData", newArray)
                                        MessageToast.show("Data Deleted");
                                    }
                                }
                            })

                        } else {
                            oBusy.close();
                        }
                    }
                });
            },
            callData: async function () {
                // Access data from external.js variable
                var data = externalData;
                console.log(data);
                var entitySet = "/Company_Details";
                var ServiceModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZINVOICE_DETAILS_SER");

                var externalDataFunction = await oBackendServiceData(entitySet, ServiceModel);
            },
            backendDataReadFunction1: function (entitySet, ServiceModel) {
                return new Promise(function (resolve, reject) {
                    ServiceModel.read(entitySet, {
                        success: function (data) {
                            resolve(data.results);
                        },
                        error: function (error) {
                            oBusy.close();
                            console.error("Error fetching data from " + entitySet + ":", error);
                            reject(error); // Reject the Promise with the encountered error
                        }
                    });
                });
            },
        });
    });
